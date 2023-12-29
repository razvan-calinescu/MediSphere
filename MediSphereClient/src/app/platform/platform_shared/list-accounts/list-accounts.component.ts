import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, mergeMap, of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserDetails } from 'src/app/models/userDetails.model';
import { UserDetailsTableModel } from 'src/app/models/userDetailsTable.model';
import { AuthService } from 'src/services/auth.service';
import { UserDetailsService } from 'src/services/userDetails.service';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private userDetailsService: UserDetailsService
  ){

  }

  ngOnInit(): void {
      
    const role = localStorage.getItem('userRole');

    if(role=='admin')
      this.displayedColumns = ['role', 'cnp', 'name', 'email', 'phone'];
    else if (role == 'frontDesk')
      this.displayedColumns = ['role','cnp', 'name', 'email', 'phone', 'address', 'birthDate' ];
    else if(role=='doctor'){
      this.displayedColumns = ['role','cnp', 'name', 'email', 'phone', 'address', 'gender','birthDate', 'bloodType' ];
    }

    this.loadData();

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

        if (localStorage.getItem('userRole') == 'doctor' || localStorage.getItem('userRole') == 'frontDesk') {
          combinedUsers = combinedUsers.filter((user: any) => user.role === 'patient');
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
  

 

}
