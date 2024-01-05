import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { mergeMap, forkJoin, of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserDetails } from 'src/app/models/userDetails.model';
import { UserDetailsTableModel } from 'src/app/models/userDetailsTable.model';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { AuthService } from 'src/services/auth.service';
import { UserDetailsService } from 'src/services/userDetails.service';
import { AppointmentService } from 'src/services/appointment.service';
import { Appointment } from 'src/app/models/appointment.model';
import { AllocateDoctorDialogComponent } from '../dialogs/allocate-doctor-dialog/allocate-doctor-dialog.component';

@Component({
  selector: 'app-appointments-table',
  templateUrl: './appointments-table.component.html',
  styleUrls: ['./appointments-table.component.scss']
})
export class AppointmentsTableComponent {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Appointment> = new MatTableDataSource();
  appointments: Appointment[] = []; 
  totalRecords: number = 0;
  public loadedData = false;
  paginatorInitialized: boolean = false;


  searchControl = new FormControl();
  dateControl = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    const role = localStorage.getItem('userRole');

    if (role == 'doctor')
      this.displayedColumns = ['id', 'date', 'time', 'name', 'email', 'phone', 'email', 'status'];
    else if (role == 'frontDesk')
      this.displayedColumns = ['id', 'date', 'time', 'doctor', 'name', 'email', 'phone', 'email', 'status', 'actions'];

    this.loadData();

    this.searchControl.valueChanges.subscribe((searchValue: string) => {
      this.applyFilter(searchValue);
    });

    this.dateControl.valueChanges.subscribe((selectedDate: Date) => {
      this.filterByDate(selectedDate);
    });
  }

  filterByDate(selectedDate: Date) {
    if (!selectedDate) {
      this.dataSource.data = this.appointments;
    } else {
      const filteredAppointments = this.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.toDateString() === selectedDate.toDateString();
      });
      this.dataSource.data = filteredAppointments;
    }

    // Reset the paginator
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.paginatorInitialized = true;
    this.initializePaginator();
  }

  loadData(): void {
    const currentDateISO = new Date().toISOString();
    let currentDate: { date: any, time: any } = this.extractDateAndTime(currentDateISO);
    console.log(currentDate);
    this.appointmentService.appointmentGet().subscribe(
      (appointments) => {
        
        this.appointments = appointments.filter((appointment: any) => {
          let { date, time } = this.extractDateAndTime(appointment.date);
          return new Date(currentDate.date) <= new Date(date); 
        });
  
        this.appointments.forEach((appointment) => {
          let { date, time } = this.extractDateAndTime(appointment.date);
          appointment.date = date;
          appointment.time = time;
  
          if (appointment.doctorId) {
            this.authService.authUserCnpGet(appointment.doctorId).subscribe(
              (doctor) => appointment.doctorName = doctor.fname + ' ' + doctor.lname
            );
          }
        });
  
        this.totalRecords = this.appointments.length;
        this.loadedData = true;
        this.initializePaginator();
      }
    );
  }
  
  

  initializePaginator() {
    if (this.loadedData && this.paginatorInitialized) {
      this.dataSource = new MatTableDataSource(this.appointments);
      this.dataSource.paginator = this.paginator;
      // Load initial data for the first page
      this.onPageChange({ pageIndex: 0, pageSize: 5, length: this.totalRecords });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.appointments.slice(startIndex, endIndex);
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

  openDialog(data: any) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: data 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result.deleteConfirmed == true)
        {
          this.appointmentService.appointmentIdDelete(data.id).subscribe(
            () => {
              this.snackbar.open("Appointment deleted successfully", 'close', {duration: 4000})
              console.log("Here")
              this.loadData();
              this.ngAfterViewInit();
            }
          )
          
        }
    });

  
  }

  extractDateAndTime(dateString: string): { date: string, time: string } {
    const dateObject = new Date(dateString);

    const date = dateObject.toLocaleDateString(); 
    const time = dateObject.getHours().toLocaleString()+ ':' + dateObject.getMinutes().toLocaleString(); 

    return { date, time };
}

delete(element: any){
  this.openDialog(element)

}

allocateDoctor(data: any){
  
  const dialogRef = this.dialog.open(AllocateDoctorDialogComponent, {
    width: '450px',
    data: data 
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(result)
    if(result.updateConfirmed == true && result.doctorId)
      {
        data.doctorId = result.doctorId
        data.date= this.combineDateAndTime(data.date, data.time)
        data.status = 'confirmed'
        this.appointmentService.appointmentIdPut(data.id, data).subscribe(
          () => {
            this.snackbar.open("Doctor allocated successfully", 'close', {duration: 4000})
            this.loadData();
            this.ngAfterViewInit();
          }
        )
        
      }
  });
}

combineDateAndTime(dateString: any, timeString: any) {
  // Parse the date
  const date = new Date(dateString);

  // Extract hours and minutes from the time string
  const [hours, minutes] = timeString.split(':').map(Number);

  // Set hours and minutes for the date
  date.setHours(hours, minutes, 0, 0);

  // Format the date manually to avoid UTC conversion
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

}
