import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DoctorSpecialtyService } from 'src/services/doctorSpecialty.service';
import { mergeMap, catchError, throwError, combineLatest } from 'rxjs';
import { Appointment } from 'src/app/models/appointment.model';
import { UserDetailsTableModel } from 'src/app/models/userDetailsTable.model';
import { AuthService } from 'src/services/auth.service';
import { AppointmentService } from 'src/services/appointment.service';


export interface doctorSpecialtyForm{
  text?: string,
  doctorCnp?: string,
  doctorSpecialty?: string
}

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent {

  public formChoice: string = '';
  public appointment: Appointment = {};
  loginForm!: FormGroup;
  public isLoading: boolean = false;
  public specialities: string[] = [];
  public doctorSpecialtyPairs: doctorSpecialtyForm[] = [];
  public timeOptions: string[] = [];
  public ok: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public snackBarService: MatSnackBar,
    public router: Router,
    public datePipe: DatePipe,
    public doctorSpecialtyService: DoctorSpecialtyService,
    public authService: AuthService,
    public appointmentService: AppointmentService
  ) {}

  ngOnInit() {

    this.loadData()
    
    this.loginForm = this.formBuilder.group({
      fName: [this.appointment.fName, Validators.required],
      lName: [this.appointment.lName, Validators.required],
      email: [this.appointment.email, [Validators.required, Validators.email]],
      phone: [this.appointment.phone, Validators.required],
      doctorId: [this.appointment.doctorId, Validators.required],
      date: [this.appointment.date, Validators.required],
      time: [this.appointment.time, Validators.required],
    });

    this.subscribeToFormChanges();
  }

  subscribeToFormChanges() {
  
    combineLatest([
      this.loginForm.get('doctorId')!.valueChanges,
      this.loginForm.get('date')!.valueChanges
    ]).subscribe(([doctorId, date]) => {
      if (doctorId && date) {

        console.log(doctorId)
        this.loadTimes(doctorId, date)
      }
    });
  }

  loadTimes(doctorId: any, date: any){
    date= this.formatDate(date)
    this.appointmentService.appointmentAvailableSlotsDoctorIdDateGet(doctorId, date).subscribe(
      (times) => {
        this.timeOptions = times
        this.ok = true;

      }
    )
  }

 async loadData(){
    this.isLoading = true;
    await this.doctorSpecialtyService.doctorSpecialtyGet().subscribe(
      (specialties) => {
        specialties.forEach((specialty) => {
          if(!this.specialities.includes(specialty.specialty))
          this.specialities.push(specialty.specialty)
          let cnp = specialty.cnp.replace(/\s/g, "")
          this.authService.authUserCnpGet(cnp).subscribe(
            (user) => {
              if(user.role.replace(/\s/g, "") == 'doctor'){
              let pairToAdd: doctorSpecialtyForm = {}
              pairToAdd.doctorCnp = user.cnp.replace(/\s/g, "")
              pairToAdd.doctorSpecialty = specialty.specialty
              pairToAdd.text = specialty.specialty + ': ' + user.fname+ ' ' + user.lname

              this.doctorSpecialtyPairs.push(pairToAdd)
              }
              this.isLoading = false;
            }
          )
        })
      }
    )

    await this.appointmentService.appointmentAvailableSlotsDoctorIdDateGet("0000", "2024-01-02").subscribe(
      (times) => this.timeOptions = times
    )


  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.appointment.status='confirmed'
      console.log(this.appointment)

    }
    
    else {
      this.snackBarService.open("Please check the data introduced", 'close', {duration: 3000});
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
  
    return [year, month, day].join('-');
  }

  changeOption(mode: string){
    this.formChoice = mode
  }
  
  
  
}
