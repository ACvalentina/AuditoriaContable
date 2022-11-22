import { Component, OnInit } from '@angular/core';

import { Firestore, FirestoreModule } from '@angular/fire/firestore'
import { collection } from '@angular/fire/firestore'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { offset } from '@popperjs/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { Observable, BehaviorSubject  } from 'rxjs'
import { CuentasService } from '../cuentas.service'



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [CuentasService]
})
export class ModalComponent implements OnInit {

  public show = false;
  cuentas$: Observable<any[]>;
  startAt: BehaviorSubject<string> = new BehaviorSubject('');
  comprobantes: Observable<any[]>;
  selectedComprobante: Observable<any>
  documentos: Observable<any[]>
  selectedDocumento: Observable<any>

  constructor(private cuentasSvc: CuentasService) { }

  showModal(){
    this.show = true;
  }

  hideModal(){
    this.show = false;
  }

  ngOnInit() {
    this.cuentas$ = this.cuentasSvc.getCuentas(this.startAt)
    this.comprobantes = this.cuentasSvc.comprobantes
    this.documentos = this.cuentasSvc.documentos
  }

  search(searchText){
    
    this.startAt.next(searchText)
  }

  onChangeCom(comprobante){
    this.cuentasSvc.selectedComprobante = comprobante;
  }

  onChangeDoc(documento){
    this.cuentasSvc.selectedDocumento = documento
  }

 

}
