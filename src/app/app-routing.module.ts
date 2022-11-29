import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviadorComponent } from './pages/enviador/enviador.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/enviador',
    pathMatch: 'full'
  },
  {
    path: 'enviador', component: EnviadorComponent,
    //canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
