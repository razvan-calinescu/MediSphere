import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopBarComponent } from './shared/top-bar/top-bar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomePageComponent } from './informative/home-page/home-page.component';
import { AboutComponent } from './informative/about/about.component';
import { ServicesComponent } from './informative/services/services.component';
import { TeamComponent } from './informative/team/team.component';
import { DepartmentsComponent } from './informative/departments/departments.component';
import { ContactComponent } from './informative/contact/contact.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

import { ReactiveFormsModule } from '@angular/forms';

import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card'
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

import { PatientDashboardComponent } from './platform/patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './platform/doctor-dashboard/doctor-dashboard.component';
import { FrontDeskDashboardComponent } from './platform/front-desk-dashboard/front-desk-dashboard.component';
import { AdminDashboardComponent } from './platform/admin-dashboard/admin-dashboard.component';
import { WelcomeTextComponent } from './platform/platform_shared/welcome-text/welcome-text.component';
import { UnauthorisedComponent } from './shared/unauthorised/unauthorised.component';
import { ListAccountsComponent } from './platform/platform_shared/list-accounts/list-accounts.component';
import { NewAccountComponent } from './platform/platform_shared/new-account/new-account.component';


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    FooterComponent,
    HomePageComponent,
    AboutComponent,
    ServicesComponent,
    TeamComponent,
    DepartmentsComponent,
    ContactComponent,
    LoginComponent,
    PageNotFoundComponent,
    PatientDashboardComponent,
    DoctorDashboardComponent,
    FrontDeskDashboardComponent,
    AdminDashboardComponent,
    WelcomeTextComponent,
    UnauthorisedComponent,
    ListAccountsComponent,
    NewAccountComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatGridListModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
