import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginMonitorService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  loggedIn$ = this.loggedIn.asObservable(); 

  constructor() {
    this.updateLoginStatus(); 
  }

  updateLoginStatus() {
    const isLoggedIn = !!localStorage.getItem('authToken');
    this.loggedIn.next(isLoggedIn);
  }

}
