import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Appointment } from 'model/appointment';
import { BloodTestResult } from 'model/bloodTestResult';
import { CovidTestResult } from 'model/covidTestResult';
import { mergeMap, catchError, throwError } from 'rxjs';
import { UserDetailsTableModel } from 'src/app/models/userDetailsTable.model';
import { AppointmentService } from 'src/services/appointment.service';
import { AuthService } from 'src/services/auth.service';
import { BloodTestResultService } from 'src/services/bloodTestResults.service';
import { CovidTestResultService } from 'src/services/covidTestResult.service';

export interface PatientEmailNamePair{
  id?: any,
  email?: string,
  name?: string
}


@Component({
  selector: 'app-test-results-form',
  templateUrl: './test-results-form.component.html',
  styleUrls: ['./test-results-form.component.scss']
})
export class TestResultsFormComponent {

  test: string = '';
  loginForm!: FormGroup;
  patientId: any;
  public isLoading: boolean = false;
  public patientNameEmailsPair: PatientEmailNamePair[] = [];
  public patientEmails: string[] =[];

  public bloodTestResult: BloodTestResult = {}
  public covidTestResult: CovidTestResult = {}

  constructor(
    public formBuilder: FormBuilder,
    public snackBarService: MatSnackBar,
    public authService: AuthService,
    public appointmentService: AppointmentService,
    public router: Router,
    public bloodTestResults: BloodTestResultService,
    public covidTestResults: CovidTestResultService
  ) {}

  ngOnInit() {

    this.initData();

    this.loginForm = this.formBuilder.group({
      patientId: [this.patientId],
      pcr: [this.covidTestResult.pcr],
      antigen: [this.covidTestResult.antigen],
      hgb: [this.bloodTestResult.hgb],
      rbc: [this.bloodTestResult.rbc],
      wbc: [this.bloodTestResult.wbc],
      plt: [this.bloodTestResult.plt],
      mcv: [this.bloodTestResult.mcv],
    }); }



  changeOption(mode: string){
    this.test = mode
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

  onSubmit() {
   
    console.log(this.loginForm)
    
      if(this.test == 'covid'){
        this.covidTestResult.doctorId = localStorage.getItem('userId');
        console.log(this.patientId)
        this.covidTestResult.patientId = this.patientId;

        this.covidTestResults.covidTestResultPost(this.covidTestResult).subscribe(
          () => this.snackBarService.open("Result uploaded successfully!", 'close', {duration: 3000})
        );
      }
      else if(this.test == 'blood'){
        this.bloodTestResult.doctorId = localStorage.getItem('userId');
        this.bloodTestResult.patientId = this.patientId;

        this.bloodTestResults.bloodTestResultPost(this.bloodTestResult).subscribe(
          () => this.snackBarService.open("Result uploaded successfully!", 'close', {duration: 3000})
        )
      }
    
    
  }

  formatDate(date: string | number | Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);  // Months are zero-based in JavaScript
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
    // Prepend '0' if month or day is a single digit
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [day, month, year].join('.');
  }

  
}
