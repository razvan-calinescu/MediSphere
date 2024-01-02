import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authService: AuthService
    ) {}

    ngOnInit(){

    }

  onCancelClick(): void {
    this.dialogRef.close({ deleteConfirmed: false });
  }

  confirmDelete(): void {
    this.authService.authDeleteUserCnpDelete(this.data.cnp).subscribe(
      () => console.log("finished deleting"),
      (err) => console.log("error")
    );
    this.dialogRef.close({ deleteConfirmed: true });
  }
}
