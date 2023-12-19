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
  // Uncomment and add a component for the 'portal' path if needed
  // {
  //   path: 'portal',
  //   component: PortalComponent
  // },
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
