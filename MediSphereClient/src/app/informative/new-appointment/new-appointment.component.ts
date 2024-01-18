import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
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
  public timeOptionsDoctors: string[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public snackBarService: MatSnackBar,
    public router: Router,
    public datePipe: DatePipe,
    public doctorSpecialtyService: DoctorSpecialtyService,
    public authService: AuthService,
    public appointmentService: AppointmentService,
    public snackbar: MatSnackBar,
  ) {}

  ngOnInit() {

    this.appointment.doctorId = 'null'
    this.loadData()
    
    this.loginForm = this.formBuilder.group({
      fName: [this.appointment.fName, Validators.required],
      lName: [this.appointment.lName, Validators.required],
      email: [this.appointment.email, [Validators.required, Validators.email]],
      phone: [this.appointment.phone, Validators.required],
      doctorId: [this.appointment.doctorId],
      specialty: [this.appointment.specialty],
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


        this.loadTimes(doctorId, date)
      }
    });

    
  }

  loadTimes(doctorId: any, date: any){
    date= this.formatDate(date)
    this.appointmentService.appointmentAvailableSlotsDoctorIdDateGet(doctorId, date).subscribe(
      (times) => {
        this.timeOptionsDoctors = times
        this.ok = true;

      }
    )
  }

  combineDateAndTime(dateString: any, timeString: any) {
    // Parse the date
    const date = new Date(dateString);

    // Extract hours and minutes from the time string
    const [hours, minutes] = timeString.split(':').map(Number);

    // Set hours and minutes for the date
    date.setHours(hours, minutes, 0, 0);

    // Format the date manually to avoid UTC conversion
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
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

      let currentSystemDate = new Date();

      let appointmentDate = new Date(this.appointment.date);
  
      currentSystemDate.setDate(currentSystemDate.getDate() + 2);
  
      if(appointmentDate <= currentSystemDate) {
        this.snackBarService.open("Online appointment must be scheduled at least 2 days in advance", 'close', {duration: 3000})
        this.isLoading = false;
      }
      else{
      if(this.appointment.doctorId == 'null')
        this.appointment.status = 'requested'
      else{
        this.appointment.status='confirmed'
        const pair = this.doctorSpecialtyPairs.filter( (doctor) => doctor.doctorCnp == this.appointment.doctorId)
        this.appointment.specialty = pair[0].doctorSpecialty
      }

      this.appointment.dateTime = this.combineDateAndTime(this.appointment.date, this.appointment.time)
      console.log(this.appointment.dateTime)
      this.appointment.date = this.appointment.dateTime

      this.appointmentService.appointmentPost(this.appointment).subscribe(
        (success) => {
          this.isLoading = false;
          this.snackBarService.open("Appointment created!", 'close', {duration: 3000})
          this.router.navigateByUrl('')
        }

      )
      }
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
    if(this.formChoice == 'specialty')
      this.appointment.doctorId = 'null';
  }
  
  
  
}
