import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'model/appointment';
import { DocumentData } from 'model/documentData';
import { User } from 'src/app/models/user.model';
import { AppointmentService } from 'src/services/appointment.service';
import { AuthService } from 'src/services/auth.service';
import { DocumentDataService } from 'src/services/documentData.service';

export interface PatientEmailNamePair{
  id?: any,
  email?: string,
  name?: string
}


@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})


export class AddDocumentComponent implements OnInit {

  public mode: string = '';
  loginForm!: FormGroup;
  public isLoading: boolean = true;
  public document: DocumentData = {};
  public patientNameEmailsPair: PatientEmailNamePair[] = [];
  public patientEmails: string[] =[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    public snackBarService: MatSnackBar,
    public appointmentService: AppointmentService,
    public authService: AuthService,
    public documentService: DocumentDataService
  ) {}

  ngOnInit(){

    this.initData();
    
    this.activatedRoute.paramMap.subscribe(params => {
      const url = this.router.url;
      this.mode = url.includes('/prescription') ? 'prescription' : 'note';
    })

    this.loginForm = this.formBuilder.group({
      patientId: [this.document.patientId, Validators.required],
      title: [this.document.title, Validators.required],
      text: [this.document.text, Validators.required],
    });

  }

  initData(){
    this.isLoading = true;
      this.appointmentService.appointmentGet().subscribe((data) => {
        data.forEach((appointment: Appointment) => {
          console.log(appointment.doctorId)
          if(appointment.doctorId == localStorage.getItem('userId') && this.patientEmails.indexOf(appointment.email!.replace(/\s/g, ""))==-1){
          var patientTemp: PatientEmailNamePair = {email: appointment.email!.replace(/\s/g, "")}  
          this.patientEmails.push(appointment.email!.replace(/\s/g, ""));
          this.patientNameEmailsPair.push(patientTemp)
          }
        })
        console.log(this.patientNameEmailsPair)
        this.replaceEmails();
        this.isLoading = false;
      })
  }

  replaceEmails(){
    this.authService.authAllUsersGet().subscribe( (users) => {
      users.forEach( (user: any) => {
        this.patientNameEmailsPair.forEach((pair) => {
          if(pair.email!.replace(/\s/g, "") == user.email.replace(/\s/g, ""))
             {
              pair.id = user.cnp.replace(/\s/g, ""),
              pair.name = user.fname + ' ' + user.lname
             }
        })
      })
    })
  }

  onSubmit(){
    this.document.doctorId = localStorage.getItem('userId')!.replace(/\s/g, "");
    this.document.documentType = this.mode;
    const now = new Date();
    this.document.issued = now.toISOString();
    this.documentService.documentDataPost(this.document).subscribe(
      (success: any) => this.snackBarService.open("Document data successfully inserted", 'close', {duration: 3000})
    );
  }
}
