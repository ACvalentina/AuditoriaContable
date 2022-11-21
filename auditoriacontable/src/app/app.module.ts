import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { InicioComponent } from './inicio/inicio.component';
import { RouterModule, Routes } from '@angular/router';
import { ComprobantesComponent } from './comprobantes/comprobantes.component';
import { Inicio2Component } from './inicio2/inicio2.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { IngresarComponent } from './ingresar/ingresar.component';
import { RegistrarComponent } from './registrar/registrar.component';

const appRoutes : Routes = [
  {path:'',component:IngresarComponent},
  {path:'comprobantes',component:ComprobantesComponent},
  {path:'inicio',component:InicioComponent},
  {path:'inicio2',component:Inicio2Component},
  {path:'registrar',component:RegistrarComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    InicioComponent,
    ComprobantesComponent,
    Inicio2Component,
    IngresarComponent,
    RegistrarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }