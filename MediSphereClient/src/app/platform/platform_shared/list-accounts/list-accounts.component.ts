import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, mergeMap, of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserDetails } from 'src/app/models/userDetails.model';
import { UserDetailsTableModel } from 'src/app/models/userDetailsTable.model';
import { AuthService } from 'src/services/auth.service';
import { UserDetailsService } from 'src/services/userDetails.service';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-accounts',
  templateUrl: './list-accounts.component.html',
  styleUrls: ['./list-accounts.component.scss']
})
export class ListAccountsComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<UserDetailsTableModel> = new MatTableDataSource();
  totalRecords: number = 0;
  public loadedData = false;

  searchControl = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private userDetailsService: UserDetailsService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router
  ){

  }

  ngOnInit(): void {
      
    const role = localStorage.getItem('userRole');

    if(role=='admin')
      this.displayedColumns = ['role', 'cnp', 'name', 'email', 'phone', 'actions'];
    else if (role == 'frontDesk')
      this.displayedColumns = ['role','cnp', 'name', 'email', 'phone', 'address', 'birthDate' ];
    else if(role=='doctor'){
      this.displayedColumns = ['role','cnp', 'name', 'email', 'phone', 'address', 'gender','birthDate', 'bloodType' ];
    }
  

    this.loadData();

    this.searchControl.valueChanges.subscribe((searchValue: string) => {
      this.applyFilter(searchValue);
    });


  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.authService.authAllUsersGet().pipe(
      mergeMap(users => {
        if (users && users.length > 0) {
          return forkJoin(users.map((user: User) => 
            this.userDetailsService.userDetailsUserDetailsCnpGet(user.cnp).pipe(
              mergeMap((details: UserDetails) => details ? of({ ...user, ...details }) : of(user))
            )
          ));
        } else {
          return of([]);
        }
      })
    ).subscribe(
      (combinedUsers: any) => {
        const role = localStorage.getItem('userRole')
        if (role == 'doctor' || role == 'frontDesk') {
          combinedUsers = combinedUsers.filter((user: any) => user.role.replace(/\s/g, "") == 'patient');
        }
  
        this.dataSource.data = combinedUsers;
        this.totalRecords = combinedUsers.length;
        this.dataSource.paginator = this.paginator;
        this.loadedData = true;
      },
      error => {
        console.error(error);
      }
    );
  }
  
  formatDate(date: string | number | Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);  // Months are zero-based in JavaScript
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
  
    return [day, month, year].join('.');
  }
  
  edit(element: any){
    const routeCNP = element.cnp.replace(/\s/g, "");
    const url = `newAccount/edit/${routeCNP}`;
    this.router.navigateByUrl(url);
  }

  delete(element: any){
    this.openDialog(element);
  }

  openDialog(data: any) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: data 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result.deleteConfirmed == true)
        {
          this.snackbar.open("User deleted successfully", 'close', {duration: 4000})
          this.loadData();
        }
    });
  }

}
