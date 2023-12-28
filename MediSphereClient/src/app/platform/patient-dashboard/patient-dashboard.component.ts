import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit{

  constructor(
    private router: Router
  ){
    
  }

  ngOnInit(){
    this.checkLogIn()
  }

  checkLogIn(): void {
    if(!localStorage.getItem('authToken') || !localStorage.getItem('userRole') || localStorage.getItem('userRole')!='patient')
      this.router.navigateByUrl('unauthorised')

  }
}
