import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; 
import { CuentasService } from '../cuentas.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms'

@Component({
  selector: 'app-contabilidad-ventas',
  templateUrl: './contabilidad-ventas.component.html',
  styleUrls: ['./contabilidad-ventas.component.scss']
})
export class ContabilidadVentasComponent implements OnInit {

  excelData: Array<any>=[] as any;
  activosFijos: Array<any>=[] as any;
  objetos: Array<any>=[] as any;
  public show = false;
  cuentas$: Observable<any[]>;
  startAt: BehaviorSubject<string> = new BehaviorSubject('');
  nombreCuenta: string[] = []
  datosMes
  datosAnio
  opcionMes = '0'
  opcionAnio = '0'
  addMes = ''
  addAnio = ''
  public showDetails = false
  public arrayDetails: any[] = []
  inputsDetails: Array<any>=[] as any


  constructor(private afAuth: AngularFireAuth,private firestore:Firestore, private cuentasSvc: CuentasService, private fb:FormBuilder, private cd: ChangeDetectorRef) {
    this.datosMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    this.datosAnio = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]
  }

  ngOnInit(): void {
    // this.cuentas$ = this.cuentasSvc.getCuentas(this.startAt)
  }

  autocomplete(){
    this.cuentas$ = this.cuentasSvc.getCuentas(this.startAt)
  }

  getMes(){
    this.addMes = this.opcionMes
  }
  getAnio(){
    this.addAnio = this.opcionAnio
  }
  
  readExcel(event:any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e)=>{
      var workbook = XLSX.read(fileReader.result,{type:'binary', cellDates:true});
      var sheetNames = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {header: 1, raw:false, dateNF:'yyyy-mm-dd HH:mm:ss'});
      this.show = true
    }
  }
  
  cuentasToString(){
    for(let i = 0; i< this.nombreCuenta.length; i++){
      if(this.nombreCuenta[i]===undefined){
        this.nombreCuenta[i]=''
      }
    }
    //if(nombreCuenta === isEmpty){ nombreCuenta = '' }
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

  obtenerDocs(){
    let Docs:any = [];
    for(let i = 1 ; i < this.excelData.length ; i++){
      Docs.push(this.excelData[i][1]);
    }
    return Docs;
  }

  comprobarCodigosDoc():boolean{ //repetir para ventas, pero cambiar codigos
    let codigosExcel = this.obtenerDocs();
    console.log(codigosExcel)
    const codigosPermitidos = ["29","30","32","33","34","35","38","39","40","41","43","45","46","48","55","56","60","61","101","102","103","104","105","106","108","109","110","111","112","901","902","903","904","905","905","907","919","920","922","924"]
    for(let i = 0; i < codigosExcel.length; i++){
      if(codigosPermitidos.indexOf(codigosExcel[i])===-1){
        return false
      }
    }
    return true
  }

  search(searchText){
    this.startAt.next(searchText)
  }

  async guardar(){
    if(this.addMes === '' || this.addMes === '0' || this.addAnio === '' || this.addAnio === '0'){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Debes seleccionar mes y año',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }else{
      if(this.revisarCuentas()===true){
          
        Swal.fire({
          title: '¡Cuidado!',
          text: 'Te faltan completar algunas cuentas',
          icon: 'warning',
          allowOutsideClick: false,
        })
      }else{ 
      if(this.comprobarCodigosDoc() === false){
        this.cuentasToString()
        
        
          const id = await this.getUid();//arreglar los guardados         
          for(let i = 1; i<this.excelData.length; i++){
            for(let j = 0; j<29 ; j++){
              if(this.excelData[i][j]===undefined){
                this.excelData[i][j] = ''
              }
              if(this.nombreCuenta[i]===undefined){
                this.nombreCuenta[i] = ''
              }
            }
            //cambiar atributos
            let obj = Object.assign({
              "uid":id,
              "anio": this.addAnio,
              "mes": this.addMes,
              "cuenta": this.nombreCuenta[i],
              "nro":this.excelData[i][0],
              "tipoDoc":this.excelData[i][1],
              "tipoVenta":this.excelData[i][2],
              "rutCliente":this.excelData[i][3],
              "razonSocial":this.excelData[i][4],
              "folio":this.excelData[i][5],
              "fechaDocto":this.excelData[i][6],  //arreglar formato fechas
              "fechaRecepcion":this.excelData[i][7], //arreglas formato fechas
              "fechaAcuse":this.excelData[i][8],
              "fechaReclamo":this.excelData[i][9],
              "montoExento":this.excelData[i][10],
              "montoNeto":this.excelData[i][11],
              "montoIVA":this.excelData[i][12],
              "montoTotal":this.excelData[i][13],
              "IVARetenidoTotal":this.excelData[i][14],
              "IVARetenidoParcial":this.excelData[i][15],
              "IVANoRetenido":this.excelData[i][16],
              "IVAPropio":this.excelData[i][17],
              "IVATerceros":this.excelData[i][18],
              "RUTEmisorLF":this.excelData[i][19],
              "netoComisionLF":this.excelData[i][20],
              "exentoComisionLF":this.excelData[i][21],
              "IVAComisionLF":this.excelData[i][22],
              "IVAFueraDePlazo":this.excelData[i][23],
              "tipoDoctoReferencia":this.excelData[i][24],
              "folioDoctoReferencia":this.excelData[i][25],
              "numIdRecExtranjero":this.excelData[i][26],
              "nacionalidadExtranjero":this.excelData[i][27],
              "creditoEmpresaConstructora":this.excelData[i][28],
              "imptoZonaFranca":this.excelData[i][29],
              "garantiaDepEnvases":this.excelData[i][30],
              "indicadorVentaSinCosto":this.excelData[i][31],
              "indicadorServicioPeriodico":this.excelData[i][32],
              "montoNoFacturable":this.excelData[i][33],
              "totalMontoPeriodo":this.excelData[i][34],
              "ventaPasajeNacional":this.excelData[i][35],
              "ventaPasajeInternacional":this.excelData[i][36],
              "numeroInterno":this.excelData[i][37],
              "codigoSucursal":this.excelData[i][38],
              "NCE_NDE":this.excelData[i][39],
              "codigoOtroImp":this.excelData[i][40],
              "valorOtroImp":this.excelData[i][41],
              "tasaOtroImp":this.excelData[i][42],
              })

            if(!this.comprobarActivoFijo(this.nombreCuenta[i])){
              this.objetos.push(obj)
            }
            else{
              
                //this.showDetails = true
              
              
              

              const arreglo = this.inputsDetails
              let obj = Object.assign({
                "uid":id,
                "anio": this.addAnio,
                "mes": this.addMes,
                "cuenta": this.nombreCuenta[i],
                "nro":this.excelData[i][0],
                "tipoDoc":this.excelData[i][1],
                "tipoVenta":this.excelData[i][2],
                "rutCliente":this.excelData[i][3],
                "razonSocial":this.excelData[i][4],
                "folio":this.excelData[i][5],
                "fechaDocto":this.excelData[i][6],  //arreglar formato fechas
                "fechaRecepcion":this.excelData[i][7], //arreglas formato fechas
                "fechaAcuse":this.excelData[i][8],
                "fechaReclamo":this.excelData[i][9],
                "montoExento":this.excelData[i][10],
                "montoNeto":this.excelData[i][11],
                "montoIVA":this.excelData[i][12],
                "montoTotal":this.excelData[i][13],
                "IVARetenidoTotal":this.excelData[i][14],
                "IVARetenidoParcial":this.excelData[i][15],
                "IVANoRetenido":this.excelData[i][16],
                "IVAPropio":this.excelData[i][17],
                "IVATerceros":this.excelData[i][18],
                "RUTEmisorLF":this.excelData[i][19],
                "netoComisionLF":this.excelData[i][20],
                "exentoComisionLF":this.excelData[i][21],
                "IVAComisionLF":this.excelData[i][22],
                "IVAFueraDePlazo":this.excelData[i][23],
                "tipoDoctoReferencia":this.excelData[i][24],
                "folioDoctoReferencia":this.excelData[i][25],
                "numIdRecExtranjero":this.excelData[i][26],
                "nacionalidadExtranjero":this.excelData[i][27],
                "creditoEmpresaConstructora":this.excelData[i][28],
                "imptoZonaFranca":this.excelData[i][29],
                "garantiaDepEnvases":this.excelData[i][30],
                "indicadorVentaSinCosto":this.excelData[i][31],
                "indicadorServicioPeriodico":this.excelData[i][32],
                "montoNoFacturable":this.excelData[i][33],
                "totalMontoPeriodo":this.excelData[i][34],
                "ventaPasajeNacional":this.excelData[i][35],
                "ventaPasajeInternacional":this.excelData[i][36],
                "numeroInterno":this.excelData[i][37],
                "codigoSucursal":this.excelData[i][38],
                "NCE_NDE":this.excelData[i][39],
                "codigoOtroImp":this.excelData[i][40],
                "valorOtroImp":this.excelData[i][41],
                "tasaOtroImp":this.excelData[i][42],
                "detalleActivoFijo": arreglo
              })
              //console.log(obj)
              this.objetos.push(obj)
            }
                  
          }
      }else{
        Swal.fire({
          title: '¡Cuidado!',
          text: 'Tienes un código erroneo',
          icon: 'warning',
          allowOutsideClick: false,
        })
      }
    }
    } //corroborar si ya esta en la bd?
    //segun tipo documento, realizar una funcion 
    
     
  }

  revisarCuentas(){///seguro tabla
    for(let i = 1; i<this.excelData.length; i++){
      if (this.nombreCuenta[i] === ''){
        return true
      }
    }
    return false
  }
  //FUNCIÓN ACTIVO FIJO
  comprobarActivoFijo(cuenta:string){
    let tipoCuenta = cuenta.substring(0,2)
    if(tipoCuenta==="12"){
       
      return true
    }
    return false
    
  }

  saveDetails(){
    const ref = collection(this.firestore,'Probando');
    for(let i=0; i<this.objetos.length;i++){
      addDoc(ref,this.objetos[i])
    }   
    //this.showDetails = false
    Swal.fire({
      title: '¡Guardado!',
      text: 'Se ha guardado la nueva compra',
      icon: 'success',
      allowOutsideClick: false,
    })
  }

  hideModalDetails(){
    this.showDetails = false
  }
  showModalDetails(){
    
      this.showDetails = true
    
    
  }

  addDetails(){
    this.arrayDetails.push({
      "detalleActivoFijo":""
    })
    this.cd.detectChanges()
  }

  Guardar(){
    //actualizar activos fijos con sus detalles
    // const ref = collection(this.firestore,'Contabilidad-Compras')
    const ref = collection(this.firestore,'Contabilidad-Ventas');
    for(let i=0; i<this.objetos.length;i++){
      addDoc(ref,this.objetos[i])
    }
    Swal.fire({
      title: '¡Guardado!',
      text: 'Se ha guardado una nueva compra',
      icon: 'success',
      allowOutsideClick: false,
    })
  }

  datosDisponibles(){
    if(this.objetos.length===0){
      return false
    }
    return true
  }

      

}
