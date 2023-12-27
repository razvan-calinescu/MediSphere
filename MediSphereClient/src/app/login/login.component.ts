import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'api/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordHide: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public snackBarService: MatSnackBar,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value)
    if (this.loginForm.valid) {

      const email = this.loginForm.value.email
      const password = this.loginForm.value.password
      this.authService.authLoginPost(email, password).subscribe(
        (token) => {
          localStorage.setItem("authToken", token.token);
          //ROLE
          this.router.navigateByUrl('/admin')
         
        } 
      )
    } else {
      if(this.loginForm.value.email == '')
      this.snackBarService.open("Please fill in the Email");
    else if(this.loginForm.value.password == '')
    this.snackBarService.open("Please fill in the Password");
    }
  }
}
