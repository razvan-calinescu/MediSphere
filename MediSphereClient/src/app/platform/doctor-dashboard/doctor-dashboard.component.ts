import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit{

  constructor(
    private router: Router
  ){
    
  }

  ngOnInit(){
    this.checkLogIn()
  }

  checkLogIn(): void {
    if(!localStorage.getItem('authToken') || !localStorage.getItem('userRole') || localStorage.getItem('userRole')!='doctor')
      this.router.navigateByUrl('unauthorised')

  }

  toAppointmentsList(): void {
    this.router.navigateByUrl('listAppointments')
 }

  toAccountList(): void {
    this.router.navigateByUrl('listAccounts')
 }

 toPrescription(): void{
    this.router.navigateByUrl('createDocument/prescription')
 }

 toNote(): void{
  this.router.navigateByUrl('createDocument/note')
}

toTestResults(): void{
  this.router.navigateByUrl('addTestResults')
}
}
