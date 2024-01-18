import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DocumentData } from 'model/documentData';
import { DocumentDataService } from 'src/services/documentData.service';
import { AllocateDoctorDialogComponent } from '../dialogs/allocate-doctor-dialog/allocate-doctor-dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { AuthService } from 'src/services/auth.service';
import jsPDF from 'jspdf';

export interface DoctorNamePair{
  id?: string,
  name?: string
}

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.scss']
})
export class DocumentsTableComponent {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<DocumentData> = new MatTableDataSource();
  documents: DocumentData[] = []; 
  totalRecords: number = 0;
  public loadedData = false;
  paginatorInitialized: boolean = false;
 public doctorNamePairs: DoctorNamePair[] = []


  searchControl = new FormControl();
  dateControl = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private documentData: DocumentDataService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

  
    this.displayedColumns = ['id','type', 'title', 'issued', 'text', 'doctor', 'actions'];
 

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
      this.dataSource.data = this.documents;
    } else {
      const filteredAppointments = this.documents.filter(document => {
        const documentDate = new Date(document.issued!);
        return documentDate.toDateString() === selectedDate.toDateString();
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

  getDoctorName(id: string){
    let name: string= '';
    this.doctorNamePairs.forEach(
      (pair) =>
      {
        if(pair.id == id)
          name = pair.name!
      }
    )

    return name;
  }


  loadData(): void {


    this.documentData.documentDataGet().subscribe(
      (documents) => {
        // this.documents = documents.filter((document) => {return document.patientId == localStorage.getItem('userId')})
        this.documents = documents
        console.log(this.documents)
        this.documents.forEach((document) => {
          var doctorNamePair: DoctorNamePair = {id: document.doctorId!};

          this.authService.authUserCnpGet(document.doctorId!).subscribe(
            (doctor) => {
              doctorNamePair.name = doctor.fname.replace(/\s/g, "") + " " + doctor.lname.replace(/\s/g, "")
              this.doctorNamePairs.push(doctorNamePair);
            }
     
          )
          this.totalRecords = this.documents.length;
          this.loadedData = true;
          this.initializePaginator();
        }
        )
      }
    )
  }
  
  

  initializePaginator() {
    if (this.loadedData && this.paginatorInitialized) {
      this.dataSource = new MatTableDataSource(this.documents);
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
    this.dataSource.data = this.documents.slice(startIndex, endIndex);
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

async generatePdf(data: DocumentData) {
  this.loadedData = false;
  const doc = new jsPDF();

  // Set up the PDF
  doc.addImage('/assets/logo/logo-no-background.png', 'PNG', 10, 10, 48, 15);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");

  const documentTypeYPosition = 30;
  if (data.documentType == 'note')
    doc.text('Consultation Note', 160, 20);
  else
    doc.text('Prescription', 150, 20);

  doc.setFontSize(12);
  doc.text('Title: ' + data.title, 10, documentTypeYPosition + 20); // Adjusted Y position
  doc.text('Doctor: ' + this.getDoctorName(data.doctorId!), 10, documentTypeYPosition + 30);


  this.authService.authUserCnpGet(data.patientId!).subscribe(
    (user) => {
      const patientName = user.fname.trim() + ' ' + user.lname.trim();
      doc.text('Patient: ' + patientName, 10, documentTypeYPosition + 40);

      doc.text('Issued Date: ' + this.extractDateAndTime(data.issued!).date, 10, documentTypeYPosition + 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(data.text!, 10, documentTypeYPosition + 70);


      doc.save(data.title + '_' + data.issued + '.pdf');

      this.loadedData = true;
    },
    (error) => {
      console.error('Error fetching patient data:', error);
      this.loadedData = true;
    }
  );
}

getPatientName(patientId: any){

  this.authService.authUserCnpGet(patientId).subscribe(
    (user) => {
      this.loadedData = true;
      console.log( user.fname + ' '+ user.lname)
      return user.fname + ' '+ user.lname

    }
  )
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
