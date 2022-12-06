import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, BehaviorSubject, map, distinctUntilChanged, of, switchMap } from 'rxjs';
import { debounceTime } from 'rxjs/operators'
import 'rxjs/operators'
import { query, orderBy, limit, collection, getDocs } from 'firebase/firestore'



@Injectable()
export class CuentasService {

  private currentComprobante = new BehaviorSubject<any>(null)
  private comprobantes$: AngularFirestoreCollection<any>
  private currentDocumento = new BehaviorSubject<any>(null)
  private documentos$: AngularFirestoreCollection<any>
  private newComproCollect: AngularFirestoreCollection<any>


  constructor(private db: AngularFirestore) {
    this.newComproCollect = db.collection<any>('NuevoComprobante')
   }

  // LISTA DE PLAN DE CUENTAS CON AUTOCOMPLETADO
  getCuentas(start: BehaviorSubject<string>): Observable<any[]> {
   return start.pipe(switchMap(startText => {
    const endText = startText + '\uf8ff';
    return this.db.collection('Cuentas', ref => ref.orderBy('nombre').limit(10).startAt(startText).endAt(endText))
    .snapshotChanges().pipe(debounceTime(200)).pipe(distinctUntilChanged()).pipe(map(changes => {
      return changes.map(c => {
        const data = c.payload.doc.data();
        const id = c.payload.doc.id;
        return {id, data};
      });
    }));
   }));
  }

  // SELECT DE TIPO DE COMPROBANTES
  get comprobantes(){
    this.comprobantes$ = this.db.collection('TipoComprobante');
    return this.comprobantes$.valueChanges();
  }
  get selectedComprobante(){
    return this.currentComprobante.asObservable();
  }
  set selectedComprobante(value){
    this.currentComprobante.next(value);
  }

  //SELECT DE TIPO DE DOCUMENTO
  get documentos(){
    this.documentos$ = this.db.collection('TipoDocumento')
    return this.documentos$.valueChanges()
  }
  get selectedDocumento(){
    return this.currentDocumento.asObservable()
  }
  set selectedDocumento(value){
    this.currentDocumento.next(value)
  }

  //FUNCION PARA GUARDAR UN COMPROBANTE
  guardarComprobante(newComprobante): void{
    this.newComproCollect.add(newComprobante)
  }


  


}