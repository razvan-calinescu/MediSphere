import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorSpecialtyService } from 'src/services/doctorSpecialty.service';
import { AuthService } from 'src/services/auth.service';

export interface doctorSpecialtyForm{
  text?: string,
  doctorCnp?: string,
  doctorSpecialty?: string
}

@Component({
  selector: 'app-allocate-doctor-dialog',
  templateUrl: './allocate-doctor-dialog.component.html',
  styleUrls: ['./allocate-doctor-dialog.component.scss']
})
export class AllocateDoctorDialogComponent implements OnInit{
  
  public doctorForm!: FormGroup;
  public doctorId: any;
  public specialty: any;
  public doctorSpecialtyPairs: doctorSpecialtyForm[] = [];
  public isLoading: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public doctorSpecialtyService: DoctorSpecialtyService,
    public formBuilder: FormBuilder,
    public authService: AuthService
    ) {}

    

    ngOnInit(){

      this.specialty = this.data.specialty

      this.loadDoctorPairsForSpecialty()

      this.doctorForm = this.formBuilder.group({
        doctorId: [this.doctorId, Validators.required],
       
      });
    }

  loadDoctorPairsForSpecialty(){
    this.isLoading = true;

      this.doctorSpecialtyService.doctorSpecialtyGet().subscribe(
        (pairs) => {
          pairs.forEach(pair => {
            if(pair.specialty == this.data.specialty)
            {
            let doctorSpecialtyPair: doctorSpecialtyForm = {}
            doctorSpecialtyPair.doctorCnp = pair.cnp.replace(/\s/g, "")
            let doctorName = ''
            this.authService.authUserCnpGet(doctorSpecialtyPair.doctorCnp!.replace(/\s/g, "")).subscribe(
              (doctor) => {
         
                doctorName = doctor.fname.replace(/\s/g, "")+ ' ' +doctor.lname.replace(/\s/g, "")
                doctorSpecialtyPair.text = this.data.specialty + ': ' + doctorName

                this.doctorSpecialtyPairs.push(doctorSpecialtyPair)
                this.isLoading = false;
              }
            )

            }
          })

        }
      )
  }

  onCancelClick(): void {
    this.dialogRef.close({ updateConfirmed: false });
  }

  confirmDoctor(): void {
    if (this.doctorForm.valid) {
      const selectedDoctorId = this.doctorForm.get('doctorId')?.value;
      this.dialogRef.close({ updateConfirmed: true, doctorId: selectedDoctorId });
    } else {
      console.log("Form is invalid");
    }
  }
}
