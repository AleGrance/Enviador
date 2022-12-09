import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviadorAltagamaComponent } from './pages/enviador-altagama/enviador-altagama.component';
import { EnviadorAtcComponent } from './pages/enviador-atc/enviador-atc.component';
import { EnviadorComercialComponent } from './pages/enviador-comercial/enviador-comercial.component';
import { EnviadorVentasComponent } from './pages/enviador-ventas/enviador-ventas.component';
import { EnviadorComponent } from './pages/enviador/enviador.component';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/enviador',
    pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'enviador', component: EnviadorComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'enviadorAtc', component: EnviadorAtcComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'enviadorComercial', component: EnviadorComercialComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'enviadorVentas', component: EnviadorVentasComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'enviadorAltagama', component: EnviadorAltagamaComponent,
    //canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
