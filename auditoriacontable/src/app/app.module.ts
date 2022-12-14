import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
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
import { FirestoreModule} from '@angular/fire/firestore'
import 'firebase/firestore';
import { ModalComponent } from './modal/modal.component';
import { CuentasService } from './cuentas.service'
import { FIREBASE_OPTIONS } from '@angular/fire/compat'
import { AngularMaterialModule } from './angular-material.module'
import { IngresarComponent } from './ingresar/ingresar.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { RecuperarComponent } from './recuperar/recuperar.component';
import { VerificadoComponent } from './verificado/verificado.component';
import { ContrasenaRecuperadaComponent } from './contrasena-recuperada/contrasena-recuperada.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import { SidebarModule } from 'ng-sidebar';
import { ContabilidadComprasComponent } from './contabilidad-compras/contabilidad-compras.component';
import { CommonModule } from '@angular/common';
import { ContabilidadVentasComponent } from './contabilidad-ventas/contabilidad-ventas.component';



const appRoutes : Routes = [
  {path:'',component:IngresarComponent},
  {path:'comprobantes',component:ComprobantesComponent},
  {path:'inicio',component:InicioComponent, ...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'inicio2',component:Inicio2Component, ...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'registrar',component:RegistrarComponent},
  {path:'recuperar',component:RecuperarComponent},
  {path:'verificado',component:VerificadoComponent},
  {path:'contrasena-recuperada',component:ContrasenaRecuperadaComponent},
  {path:'contabilidad-compras',component:ContabilidadComprasComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'contabilidad-ventas',component:ContabilidadVentasComponent,...canActivate(()=>redirectUnauthorizedTo(['']))}
]

registerAllModules()


@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    InicioComponent,
    ComprobantesComponent,
    Inicio2Component,
    IngresarComponent,
    RegistrarComponent,
    ModalComponent,
    RecuperarComponent,
    ContabilidadComprasComponent,
    ContabilidadVentasComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    FirestoreModule,
    FormsModule,
    provideFirestore(() => getFirestore()),
    SweetAlert2Module,
    HotTableModule.forRoot(),
    SidebarModule
  ],
  providers: [
    CuentasService,
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase},
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'CLP'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }