import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './main/login/login.component';
import { RegisterComponent } from './main/register/register.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { GroupDetailComponent } from './main/group/group-details/group-detail.component';
import { NewGroupComponent } from './main/group/new-group/new-group.component';
import { NewEventComponent } from './main/event/new-event/new-event.component';
import { AuthGuardService } from './auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'group',
    canActivate: [AuthGuardService],
    children: [
      { path: 'new', component: NewGroupComponent },
      { path: ':id', component: GroupDetailComponent },
      { path: ':id/new-event', component: NewEventComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
