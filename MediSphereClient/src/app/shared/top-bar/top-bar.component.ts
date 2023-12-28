import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginMonitorService } from 'src/services/loginMonitor.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit{

  isNavbarCollapsed: boolean = true;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private loginMonitor: LoginMonitorService
  ){

  }

  ngOnInit() {
    this.loginMonitor.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  logOut() {
    localStorage.clear();
    this.loginMonitor.updateLoginStatus(); 
    this.router.navigateByUrl('');
  }
    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

  


}
