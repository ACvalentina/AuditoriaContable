import { Component, OnInit, Input, KeyValueDiffers, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import 'firebase/firestore'
import { Observable, BehaviorSubject, of  } from 'rxjs'
import { CuentasService } from '../cuentas.service'
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup,  } from '@angular/forms';
import Swal from 'sweetalert2';
import { arrayRemove, Index } from 'firebase/firestore';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [CuentasService]
})
export class ModalComponent implements OnInit, AfterViewInit {

  public show = false;
  public formComprobante;

  cuentas$: Observable<any[]>;
  startAt: BehaviorSubject<string> = new BehaviorSubject('');
  comprobantes: Observable<any[]>;
  selectedComprobante: Observable<any>
  documentos: Observable<any[]>
  selectedDocumento: Observable<any>

  textoGlosa = ""
  formulario = new FormControl('')
  totalresta
  valordebe
  valorhaber

  
  

  constructor(private cuentasSvc: CuentasService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    
    this.formComprobante = this.formBuilder.group({
      numComprobante: [''],
      tipoComprobante: [''],
      fecha: [''],
      tipoDocumento: [''],
      glosaIndex: [''],
      datosCuenta: this.formBuilder.array([])
    })
    
  }

  ngOnInit() {
    this.cuentas$ = this.cuentasSvc.getCuentas(this.startAt)
    this.comprobantes = this.cuentasSvc.comprobantes
    this.documentos = this.cuentasSvc.documentos
    //this.addDatosCuenta()    
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
      glosaInput: (''),
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

  //FUNCION DEL INPUT GLOSA
  sendText(){
    this.formComprobante.get('glosaIndex').setValue(this.formComprobante.get('glosaInput').value) 
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
      }
    })
    
  }

  //FUNCIÓN PARA VENTANA GUARDADO
  showGuardar(){
    Swal.fire({
      title: '¡Guardado!',
      text: 'Se ha guardado un nuevo comprobante',
      icon: 'success',
      allowOutsideClick: false,
      
    })
    this.show = false
  }
  onSubmit(){
    console.log(this.formComprobante.value) //no olvidar conectar a la base de datos
  }
  

}
