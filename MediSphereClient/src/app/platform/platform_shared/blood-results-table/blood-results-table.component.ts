import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { CovidTestResult } from 'model/covidTestResult';
import { AuthService } from 'src/services/auth.service';
import { BloodTestResultService } from 'src/services/bloodTestResults.service';
import { CovidTestResultService } from 'src/services/covidTestResult.service';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { DoctorNamePair } from '../documents-table/documents-table.component';
import { BloodTestResult } from 'model/bloodTestResult';

@Component({
  selector: 'app-blood-results-table',
  templateUrl: './blood-results-table.component.html',
  styleUrls: ['./blood-results-table.component.scss']
})
export class BloodResultsTableComponent {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<BloodTestResult> = new MatTableDataSource();
  results: BloodTestResult[] = []; 
  totalRecords: number = 0;
  public loadedData = false;
  paginatorInitialized: boolean = false;
 public doctorNamePairs: DoctorNamePair[] = []


  searchControl = new FormControl();
  dateControl = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bloodResService: BloodTestResultService,
    private covidResService: CovidTestResultService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

  
    this.displayedColumns = ['id', 'HGB', 'RBC', 'WBC', 'PLT', 'MCV', 'issued', 'actions'];
 

    this.loadData();

    this.searchControl.valueChanges.subscribe((searchValue: string) => {
      this.applyFilter(searchValue);
    });

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

    this.bloodResService.bloodTestResultGet().subscribe(
      (results) =>{
        this.results = results
        this.results.forEach((result) => {
          var doctorNamePair: DoctorNamePair = {id: result.doctorId!.replace(/\s/g, "")};

          this.authService.authUserCnpGet(result.doctorId!.replace(/\s/g, "")).subscribe(
            (doctor) => {
              doctorNamePair.name = doctor.fname.replace(/\s/g, "") + " " + doctor.lname.replace(/\s/g, "")
              this.doctorNamePairs.push(doctorNamePair);
            }

     
          )
          this.loadedData = true;
        })
        this.totalRecords = this.results.length;
      
        this.initializePaginator();
        this.loadedData = true;
      }
    )


    this.bloodResService.bloodTestResultGet().subscribe(
      (results) => {
        this.results = results

        this.results.forEach((result) => {
          var doctorNamePair: DoctorNamePair = {id: result.doctorId!.replace(/\s/g, "")};

          this.authService.authUserCnpGet(result.doctorId!.replace(/\s/g, "")).subscribe(
            (doctor) => {
              doctorNamePair.name = doctor.fname.replace(/\s/g, "") + " " + doctor.lname.replace(/\s/g, "")
              this.doctorNamePairs.push(doctorNamePair);
            }
     
          )
          this.totalRecords = this.results.length;
      
          this.initializePaginator();
        }
        )
        this.loadedData = true;
      }
    )
  }
  
  

  initializePaginator() {
    if (this.loadedData && this.paginatorInitialized) {
      this.dataSource = new MatTableDataSource(this.results);
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
    this.dataSource.data = this.results.slice(startIndex, endIndex);
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



async generatePdf(data: CovidTestResult) {
  this.loadedData = false;
  const doc = new jsPDF();

  doc.addImage('/assets/logo/logo-no-background.png', 'PNG', 10, 10, 48, 15);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text('Sars-CoV-2 Test Results', 100, 20);

  this.authService.authUserCnpGet(data.patientId!).subscribe(
    (user) => {
      const patientName = user.fname.trim() + ' ' + user.lname.trim();
      doc.text('Patient: ' + patientName, 10, 60);
      doc.text('Issued Date: ' + this.extractDateAndTime(data.dateTime!).date, 10, 70);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const writeResult = (testType:any, testValue:any, yPos:any) => {
        let resultText;
        let color;
        if (testValue === 0) {
          resultText = 'Not Tested';
          color = [0, 0, 0]; // Black
        } else if (testValue === 1) {
          resultText = 'Negative';
          color = [0, 128, 0]; // Green
        } else {
          resultText = 'Positive';
          color = [255, 0, 0]; // Red
        }
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(testType + ' Result: ' + resultText, 10, yPos);
      };

      writeResult('PCR', data.pcr, 80);
      writeResult('Antigen', data.antigen, 90);

      doc.save(data.patientId + '_' + data.dateTime + '.pdf');

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
