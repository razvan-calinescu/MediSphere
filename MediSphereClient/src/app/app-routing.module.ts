import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './informative/home-page/home-page.component';
import { AboutComponent } from './informative/about/about.component';
import { ServicesComponent } from './informative/services/services.component';
import { TeamComponent } from './informative/team/team.component';
import { DepartmentsComponent } from './informative/departments/departments.component';
import { ContactComponent } from './informative/contact/contact.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DoctorDashboardComponent } from './platform/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './platform/patient-dashboard/patient-dashboard.component';
import { AdminDashboardComponent } from './platform/admin-dashboard/admin-dashboard.component';
import { FrontDeskDashboardComponent } from './platform/front-desk-dashboard/front-desk-dashboard.component';
import { UnauthorisedComponent } from './shared/unauthorised/unauthorised.component';
import { ListAccountsComponent } from './platform/platform_shared/list-accounts/list-accounts.component';
import { CreateAccountComponent } from './platform/platform_shared/create-account/create-account.component';
import { NewAppointmentComponent } from './informative/new-appointment/new-appointment.component';
import { AppointmentsTableComponent } from './platform/platform_shared/appointments-table/appointments-table.component';
import { AddDocumentComponent } from './platform/platform_shared/add-document/add-document.component';
import { DocumentsTableComponent } from './platform/platform_shared/documents-table/documents-table.component';
import { TestResultsFormComponent } from './platform/platform_shared/test-results-form/test-results-form.component';
import { ResultsTableComponent } from './platform/platform_shared/results-table/results-table.component';
import { BloodResultsTableComponent } from './platform/platform_shared/blood-results-table/blood-results-table.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'departments',
    component: DepartmentsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'doctorDashboard',
    component: DoctorDashboardComponent
  },
  {
    path: 'patientDashboard',
    component: PatientDashboardComponent
  },
  {
    path: 'adminDashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'frontDeskDashboard',
    component: FrontDeskDashboardComponent
  },
  {
    path: 'unauthorised',
    component: UnauthorisedComponent
  },
  {
    path: 'listAccounts',
    component: ListAccountsComponent
  },
  {
    path: 'newAccount/create',
    component: CreateAccountComponent
  },
  {
    path: 'newAccount/edit/:cnp',
    component: CreateAccountComponent
  },
  {
    path: 'newAppointment',
    component: NewAppointmentComponent
  },
  {
    path: 'listAppointments',
    component: AppointmentsTableComponent
  },
  {
    path: 'createDocument/:docType',
    component: AddDocumentComponent
  },
  {
    path: 'listDocuments',
    component: DocumentsTableComponent
  },
  {
    path: 'addTestResults',
    component: TestResultsFormComponent
  },
  {
    path: 'listResults',
    component: ResultsTableComponent
  },
  {
    path: 'listResultsBlood',
    component: BloodResultsTableComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];





@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
