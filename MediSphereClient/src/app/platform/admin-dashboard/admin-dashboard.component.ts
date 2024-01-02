import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  constructor(
    private router: Router
  ){
    
  }

  ngOnInit(){
    this.checkLogIn()
  }

  checkLogIn(): void {
    if(!localStorage.getItem('authToken') || !localStorage.getItem('userRole') || localStorage.getItem('userRole')!='admin')
      this.router.navigateByUrl('unauthorised')

   }

   toAccountList(): void {
      this.router.navigateByUrl('listAccounts')
   }

   toCreateAccount(): void {
    this.router.navigateByUrl('newAccount/create')
  }
}
