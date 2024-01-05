import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-desk-dashboard',
  templateUrl: './front-desk-dashboard.component.html',
  styleUrls: ['./front-desk-dashboard.component.scss']
})
export class FrontDeskDashboardComponent implements OnInit{

  constructor(
    private router: Router
  ){
    
  }

  ngOnInit(){
    this.checkLogIn()
  }

  checkLogIn(): void {
    if(!localStorage.getItem('authToken') || !localStorage.getItem('userRole') || localStorage.getItem('userRole')!='frontDesk')
      this.router.navigateByUrl('unauthorised')

  }

  toAccountList(): void {
    this.router.navigateByUrl('listAccounts')
 
 }

 toAppointmentsList(): void {
    this.router.navigateByUrl('listAppointments')
 }

 toCreateAccount(): void {
  this.router.navigateByUrl('newAccount/create')
}
}
