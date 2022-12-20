import { Component, OnInit,ChangeDetectorRef, AfterViewInit } from '@angular/core';
import 'firebase/firestore'
import { Observable, BehaviorSubject } from 'rxjs'
import { CuentasService } from '../cuentas.service'
import { FormArray, FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { getDocs, query, where } from 'firebase/firestore';
import { Compras } from '../compras';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [CuentasService]
})
export class ModalComponent implements OnInit, AfterViewInit {

  public show = false;
  public formComprobante;
  public showDate = false;

  centralizacion$ : Observable<any[]>;
  cuentas$: Observable<any[]>;
  startAt: BehaviorSubject<string> = new BehaviorSubject('');
  comprobantes: Observable<any[]>;
  selectedComprobante: Observable<any>
  documentos: Observable<any[]>
  selectedDocumento: Observable<any>
  totalresta
  valordebe
  valorhaber
  datosMes
  datosAnio
  opcionMes = '0'
  opcionAnio = '0'
  addMes = ''
  addAnio = ''

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore:Firestore,
    private cuentasSvc: CuentasService, 
    private formBuilder: FormBuilder, 
    private cd: ChangeDetectorRef) {
    
    this.formComprobante = this.formBuilder.group({
      numComprobante: [''],
      tipoComprobante: [''],
      fecha: [''],
      tipoDocumento: [''],
      glosaIndex: [''],
      datosCuenta: this.formBuilder.array([])
    })

    this.datosMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    this.datosAnio = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]
    
  }

  ngOnInit() {
    this.cuentas$ = this.cuentasSvc.getCuentas(this.startAt)
    this.comprobantes = this.cuentasSvc.comprobantes
    this.documentos = this.cuentasSvc.documentos
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges()
  }

  //MOSTRAR Y OCULTAR MODAL
  showModal(){
    this.show = true;
  }
  hideModal(){
    this.show = false;
  }

  hideModalDate(){
    this.showDate = false
  }

  //ABREVIACIÓN PARA LOS CONTROLES DEL FORMULARIO COMPROBANTE
  get ctrlfm(){
    return this.formComprobante.controls
  }
  get ctrltb(){
    return this.formComprobante.controls.datosCuenta.controls
  }
  get datosCuenta(): FormArray{
    return this.formComprobante.get('datosCuenta') as FormArray
  }

  //FUNCION PARA AGREGAR Y QUITAR FILAS EN LA TABLA
  addDatosCuenta(){
    const tabla = this.formBuilder.group({
      cuentaInput: (''),
      glosaInput: [this.formComprobante.value.glosaIndex],
      centroInput: (''),
      sucursalInput: (''),
      debeInput: [''],
      haberInput: ['']
    })
    this.datosCuenta.push(tabla)
    this.cd.detectChanges()
  }
  removeDatosCuenta(indice: number){
    this.datosCuenta.removeAt(indice)
  }

  //FUNCION DE BUSQUEDA DEL AUTOCOMPLETADO
  search(searchText){
    this.startAt.next(searchText)
  }

  //FUNCIONES DE LOS SELECT
  onChangeCom(comprobante){
    this.cuentasSvc.selectedComprobante = comprobante;
  }
  onChangeDoc(documento){
    this.cuentasSvc.selectedDocumento = documento
  }

  //FUNCION SOLO NÚMEROS EN DEBE Y HABER
  onlyNum(event){
    let key;
    if (event.type === 'paste'){
      key = event.clipboardData.getData('text/plain')
    }else{
      key = event.keyCode
      key = String.fromCharCode(key)
    }
    const num = /[0-9]|\./
    if (!num.test(key)){
      event.returnValue = false
      if (event.preventDefault){
        event.preventDefault()
      }
    }

  }
  
  //FUNCIONES DEBE Y HABER
  getValDebe(){
    this.valordebe = this.formComprobante.value.datosCuenta.reduce((acc, debe) => acc + (debe.debeInput || 0), 0)
  }

  getValHaber(){
    this.valorhaber = this.formComprobante.value.datosCuenta.reduce((acc, haber) => acc + (haber.haberInput || 0), 0)
  }

  getResta(){
    this.totalresta = this.valordebe - this.valorhaber
  }
  
  //FUNCIÓN PARA VENTANA DE CONFIRMAR CIERRE
  showCierre(){
    Swal.fire({
      title: '¿Está seguro de que desea salir?',
      text: "Si presiona Aceptar se perderá el comprobante",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#049c84',
      cancelButtonColor: '#3d4054',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.show = false
        Swal.fire(
          '¡Confirmado!',
          'No se ha guardado ningún comprobante',
          'info'
        )
        //this.formComprobante.reset()
        
      }
    })
  }

  //FUNCIÓN PARA VENTANA GUARDADO
  async Guardar(){

    if(this.totalresta==0){
      Swal.fire({
            title: '¡Guardado!',
            text: 'Se ha guardado un nuevo comprobante',
            icon: 'success',
            allowOutsideClick: false,
      })
      const id = await this.getUid();
      const info =  this.formComprobante.value;
      const obj = Object.assign({
        "UID":id,
        "Info":info
      })
      const ref = collection(this.firestore,'Comprobantes');
      addDoc(ref,obj)
      this.show = false
    }
    else{
      Swal.fire({
        title: '¡Cuidado!',
        text: 'El debe y haber tienen ser iguales',
        icon: 'warning',
        allowOutsideClick: false,
    })
    }
    
    
  }

  onSubmit(){
    console.log(this.formComprobante.value) //no olvidar conectar a la base de datos
  }
  
  async getUid(){
    const user = await this.afAuth.currentUser;
    if(user === null){
      return null;
    }
    else{
      return user?.uid;
    }
  }

  getMes(){
    this.addMes = this.opcionMes
  }
  getAnio(){
    this.addAnio = this.opcionAnio
  }

  async selectDate() {
    this.showDate = true
    const month = await this.addMes
    const year = await this.addAnio
    if(month === '' || month === '0' || year === '' || year === '0'){
      Swal.fire({
        text: 'Debes seleccionar mes y año',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      Swal.fire({
        title: 'Confirmado',
        text: 'Se seleccionó mes y año',
        icon: 'success',
        allowOutsideClick: false,
      })
      
      this.showDate = false 
    }
    this.centralizar()
  }

  async centralizar(){
    const id = await this.getUid()
    const q = query(collection(this.firestore, "Contabilidad-Compras"), where("uid","==",id), where("anio","==",this.addAnio), where("mes","==",this.addMes), where("cuenta","!=",""));
    const querySnapshot = await getDocs(q);

    let cuentasUsadas:any = []
    let comprasData:any = []
    querySnapshot.forEach((c) => {
    // doc.data() is never undefined for query doc snapshots
    const datos= c.data() as Compras
    cuentasUsadas.push(datos.cuenta)
    });
    console.log(cuentasUsadas)
  }
}
