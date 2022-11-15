import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { InicioComponent } from './inicio/inicio.component';
import { RouterModule, Routes } from '@angular/router';
import { ComprobantesComponent } from './comprobantes/comprobantes.component';
import { Inicio2Component } from './inicio2/inicio2.component';

const appRoutes : Routes = [
  {path:'',component:InicioComponent},
  {path:'comprobantes',component:ComprobantesComponent},
  {path:'inicio2',component:Inicio2Component}
]


@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    InicioComponent,
    ComprobantesComponent,
    Inicio2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
