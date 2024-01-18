import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DocumentData } from 'model/documentData';
import { AuthService } from 'src/services/auth.service';
import { BloodTestResultService } from 'src/services/bloodTestResults.service';
import { CovidTestResultService } from 'src/services/covidTestResult.service';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { DoctorNamePair } from '../documents-table/documents-table.component';
import { CovidTestResult } from 'model/covidTestResult';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BloodTestResult } from 'model/bloodTestResult';


interface TestRanges {
  [key: string]: { min: number; max: number };
}



@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})

export class ResultsTableComponent implements OnInit{
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<CovidTestResult> = new MatTableDataSource();
  results: CovidTestResult[] = []; 
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

  
    this.displayedColumns = ['id', 'antigen', 'pcr', 'issued', 'actions'];
 

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

    this.covidResService.covidTestResultGet().subscribe(
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
        })
        this.totalRecords = this.results.length;
      
        this.initializePaginator();
        this.loadedData = true;
      }
    )


    this.covidResService.covidTestResultGet().subscribe(
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



async generatePdf(data: BloodTestResult) {
  this.loadedData = false;
  const doc = new jsPDF();

  doc.addImage('/assets/logo/logo-no-background.png', 'PNG', 10, 10, 48, 15);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text('Patient Test Results', 100, 20);

  this.authService.authUserCnpGet(data.patientId!).subscribe(
    (user) => {
      const patientName = user.fname.trim() + ' ' + user.lname.trim();
      doc.text('Patient: ' + patientName, 10, 60);
      doc.text('Issued Date: ' + this.extractDateAndTime(data.dateTime!).date, 10, 70);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const writeResult = (testType:any, testValue:any, yPos:any) => {
        let resultText = testValue.toString();
        let color = [0, 128, 0]; 

        const ranges: TestRanges = {
          'HGB': { min: 12.1, max: 17.2 },
          'RBC': { min: 4.2, max: 6.1 },
          'WBC': { min: 4500, max: 11000 },
          'PLT': { min: 150000, max: 450000 },
          'MCV': { min: 80, max: 96 },
        };

        if (testType in ranges) {
          let range: any = ranges[testType];

            if (testValue < range.min || testValue > range.max) {
              color = [255, 0, 0];
            }
          
        }
        
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(testType + ' Result: ' + resultText, 10, yPos);
      };

      // Write results
      writeResult('HGB', data.hgb, 100);
      writeResult('RBC', data.rbc, 110);
      writeResult('WBC', data.wbc, 120);
      writeResult('PLT', data.plt, 130);
      writeResult('MCV', data.mcv, 140);


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
