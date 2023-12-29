import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { LoginMonitorService } from 'src/services/loginMonitor.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordHide: boolean = true;
  public isLoading: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public snackBarService: MatSnackBar,
    public authService: AuthService,
    public router: Router,
    private loginMonitor: LoginMonitorService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {

    if (this.loginForm.valid) {
      this.isLoading = true;
      const email = this.loginForm.value.email
      const password = this.loginForm.value.password
      this.authService.authLoginPost(email, password).pipe(
        mergeMap(token => {
          localStorage.setItem("authToken", token.token);
          return this.authService.authUserEmailGet(email);
        })
      ).subscribe(
        user => {
          const role = user.role.replace(/\s/g, ""); ///removing witespaces from role
          localStorage.setItem("userRole", role);
          this.loginMonitor.updateLoginStatus(); // Update the login state for service & topbar
          this.isLoading = false;
          
          if(role == 'admin')
           this.router.navigateByUrl('adminDashboard')
          else if(role == 'doctor')
            this.router.navigateByUrl('doctorDashboard')
            else if(role == 'patient')
            this.router.navigateByUrl('patientDashboard')
            else if(role == 'frontDesk')
            this.router.navigateByUrl('frontDeskDashboard')



        },
        error => {
          this.snackBarService.open("Login failed. Check credentials")
          this.isLoading = false;
        }
      );
    } else {
      if(this.loginForm.value.email == '')
      this.snackBarService.open("Please fill in the Email");
    else if(this.loginForm.value.password == '')
    this.snackBarService.open("Please fill in the Password");
    }
  }
}
