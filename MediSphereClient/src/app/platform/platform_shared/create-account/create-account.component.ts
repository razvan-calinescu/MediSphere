import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorSpecialities } from 'model/doctorSpecialities';
import { catchError, mergeMap, tap, throwError } from 'rxjs';
import { UserDetailsTableModel } from 'src/app/models/userDetailsTable.model';
import { AuthService } from 'src/services/auth.service';
import { DoctorSpecialtyService } from 'src/services/doctorSpecialty.service';
import { UserDetailsService } from 'src/services/userDetails.service';



@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  
  public role = localStorage.getItem('userRole');
  public user: UserDetailsTableModel = {};
  public cnp: any = {};
  public mode: any = '';
  public userFName: any;
  public userLName: any;
  public userRole: any;
  public fieldDisable: boolean = false;
  public doctorSpecialty = '';
  private specialtyPost: DoctorSpecialities = {};

  loginForm!: FormGroup;
  passwordHide: boolean = true;
  public isLoading: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public snackBarService: MatSnackBar,
    public authService: AuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public userDetailsService: UserDetailsService,
    public datePipe: DatePipe,
    public doctorSpecialtyService: DoctorSpecialtyService
  ) {}

  ngOnInit() {

    this.user.bloodType='-'
    

    this.activatedRoute.paramMap.subscribe(params => {
      const url = this.router.url;
      this.mode = url.includes('/edit/') ? 'edit' : 'create';
  

      if (this.mode == 'edit') {
        this.cnp = params.get('cnp');
        this.isLoading = true;  
        this.fieldDisable = true;

        this.authService.authUserCnpGet(this.cnp)
          .pipe(
            mergeMap(userEndpoint => {
              this.user = userEndpoint;
              this.userFName = userEndpoint.fname;
              this.userLName = userEndpoint.lname;
              this.userRole = userEndpoint.role;
              return this.userDetailsService.userDetailsUserDetailsCnpGet(this.user.cnp!.replace(/\s/g, ""));
            }),
            catchError(err => {
              console.error(err);
              this.isLoading = false;
              return throwError(err);
            })
          )
          .subscribe(
            (userDetails) => {
              this.user = userDetails;
              this.user.fName = this.userFName;
              this.user.lName = this.userLName;
              this.user.role = this.userRole;
              this.user.birthDate = userDetails.birthdate
  
                
            for (const key in this.user) {
              if (this.user.hasOwnProperty(key)) {
                const value = this.user[key as keyof UserDetailsTableModel];
                if (typeof value === 'string') {
                  this.user[key as keyof UserDetailsTableModel] = value.trim();
                }
              }
            }
              if(this.user.role == 'doctor')
                this.doctorSpecialtyService.doctorSpecialtyCnpGet(this.user.cnp!).subscribe(
                  (dSpecialty) => this.doctorSpecialty = dSpecialty.specialty,
                  (err) => console.log(err)
                  )
              this.isLoading = false;
            },
            err => {
              // Handle any errors that occurred during getUserDetails call
              console.error(err);
              this.isLoading = false;
            }
          );
      }
      
    });
    

    

    this.loginForm = this.formBuilder.group({
      cnp: [this.user.cnp, Validators.required],
      emailAddress: [this.user.email, [Validators.required, Validators.email]],
      role: [this.user.role, Validators.required],
      firstName: [this.user.fName, Validators.required],
      lastName: [this.user.lName, Validators.required],
      phone: [this.user.phone, Validators.required],
      address: [this.user.address, Validators.required],
      gender: [this.user.gender, Validators.required],
      bloodType: [this.user.bloodType],
      specialty: [this.doctorSpecialty],
      birthDate: [this.user.birthDate, Validators.required]
    });

    if(this.mode == 'edit')
      {
        this.loginForm.get('cnp')?.disable();
        this.loginForm.get('emailAddress')?.disable();
      }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
    
      if (this.mode == 'create') {
        const pwd = this.user.cnp + this.user.fName!.substring(0,1) + this.user.lName!.substring(0,1);
    
        this.authService.authRegisterPost(this.user.cnp, this.user.email, pwd, this.user.fName, this.user.lName, this.user.role).subscribe(
          () => {
            this.snackBarService.open("Account created successfully!", 'close', {duration: 3000});
          },
          regError => {
     //       this.snackBarService.open("User registration failed. Try again", 'close', {duration: 3000});
            this.isLoading = false; // Stop loading if registration fails
          }
        );

        if(this.user.role == 'doctor')
        {
          this.specialtyPost.cnp = this.user.cnp;
          this.specialtyPost.specialty = this.doctorSpecialty
          this.doctorSpecialtyService.doctorSpecialtyPost(this.specialtyPost).subscribe()
        }
    
        const formattedBirthDate = this.formatDate(this.user.birthDate!);

        this.userDetailsService.userDetailsAddUserDetailsPost(this.user.cnp, this.user.email, this.user.gender, this.user.phone, formattedBirthDate!, this.user.bloodType, this.user.address).subscribe(
          () => {
            this.snackBarService.open("Details updated successfully!", 'close', {duration: 3000});
            if (this.role == 'admin') {
              this.router.navigateByUrl('adminDashboard');
            } else if (this.role == 'frontDesk') {
              this.router.navigateByUrl('frontDeskDashboard');
            }
            this.isLoading = false; // Stop loading after details update
          },
          detailsError => {
            this.isLoading = false; // Stop loading if details update fails
          }
        );


      } else {
        const pwd = this.user.cnp + this.user.fName!.substring(0,1) + this.user.lName!.substring(0,1);
    
        this.authService.authEditUserPut(this.user.cnp, this.user.email, pwd, this.user.fName, this.user.lName, this.user.role).subscribe(
          () => {
          },
          regError => {
     //       this.snackBarService.open("User registration failed. Try again", 'close', {duration: 3000});
            this.isLoading = false; // Stop loading if registration fails
          }
        );
    
        const formattedBirthDate = this.formatDate(this.user.birthDate!);

        if(this.user.role == 'doctor')
        {
          this.specialtyPost.cnp = this.user.cnp;
          this.specialtyPost.specialty = this.doctorSpecialty
          this.doctorSpecialtyService.doctorSpecialtyPost(this.specialtyPost).subscribe()
        }

        this.userDetailsService.userDetailsEditUserDetailsPut(this.user.cnp, this.user.email, this.user.gender, this.user.phone, formattedBirthDate!, this.user.bloodType, this.user.address).subscribe(
          () => {
            this.snackBarService.open("Details updated successfully!", 'close', {duration: 3000});
            if (this.role == 'admin') {
              this.router.navigateByUrl('adminDashboard');
            } else if (this.role == 'frontDesk') {
              this.router.navigateByUrl('frontDeskDashboard');
            }
            this.isLoading = false; // Stop loading after details update
          },
          detailsError => {
            this.isLoading = false; // Stop loading if details update fails
          }
        );

        if (this.role == 'admin') {
          this.router.navigateByUrl('adminDashboard');
        } else if (this.role == 'frontDesk') {
          this.router.navigateByUrl('frontDeskDashboard');
        }

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
  
    return [day, month, year].join('.');
  }

  
  
  
}
