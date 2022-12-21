import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; 
import { CuentasService } from '../cuentas.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms'

@Component({
  selector: 'app-contabilidad-compras',
  templateUrl: './contabilidad-compras.component.html',
  styleUrls: ['./contabilidad-compras.component.scss'],
  providers: [CuentasService]
})

export class ContabilidadComprasComponent implements OnInit {
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
      var workbook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {header: 1});
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

  async agregarDetalles(){
    if(this.comprobarCodigosDoc()===true){
      this.cuentasToString()
      if(this.revisarCuentas()){
        const id = await this.getUid();//arreglar los guardados
        
        for(let i = 1; i<this.excelData.length ; i++){
          
          for(let j = 0; j<29 ; j++){
            if(this.excelData[i][j]===undefined){
              this.excelData[i][j] = ''
            }
            if(this.nombreCuenta[i]===undefined){
              this.nombreCuenta[i] = ''
            }
          }
          let obj = Object.assign({
          "uid":id,
          "anio": this.addAnio,
          "mes": this.addMes,
          "cuenta": this.nombreCuenta[i],
          "nro":this.excelData[i][0],
          "tipoDoc":this.excelData[i][1],
          "tipoCompra":this.excelData[i][2],
          "rutProveedor":this.excelData[i][3],
          "razonSocial":this.excelData[i][4],
          "folio":this.excelData[i][5],
          "fechaDocto":this.excelData[i][6],  //arreglar formato fechas
          "fechaRecepcion":this.excelData[i][7], //arreglas formato fechas
          "fechaAcuse":this.excelData[i][8],
          "montoExento":this.excelData[i][9],
          "montoNeto":this.excelData[i][10],
          "montoIVA_Recuperable":this.excelData[i][11],
          "montoIVA_NoRecuperable":this.excelData[i][12],
          "codIVA_NR":this.excelData[i][13],
          "montoTotal":this.excelData[i][14],
          "montoNetoActivoFijo":this.excelData[i][15],
          "IVA_ActivoFijo":this.excelData[i][16],
          "IVA_UsoComun":this.excelData[i][17],
          "impSinDerechoCred":this.excelData[i][18],
          "IVA_NoRetenido":this.excelData[i][19],
          "tabacosPuros":this.excelData[i][20],
          "tabacosCigarrillos":this.excelData[i][21],
          "tabacosElaborados":this.excelData[i][22],
          "NCE_NDE":this.excelData[i][23],
          "codOtroImp":this.excelData[i][24],
          "valorOtroImpuesto":this.excelData[i][25],
          "tasaOtroImpuesto":this.excelData[i][26]
          })
          /* if(this.addMes === '' || this.addMes === '0' || this.addAnio === '' || this.addAnio === '0'){
            Swal.fire({
              title: '¡Cuidado!',
              text: 'Debes seleccionar mes y año',
              icon: 'warning',
              allowOutsideClick: false,
            })
          } */
          //console.log(obj)
           //corroborar si ya esta en la bd?
          //segun tipo documento, realizar una funci
          if(!this.comprobarActivoFijo(this.nombreCuenta[i])){
            this.objetos.push(obj)
          }
          else{
            
            this.activosFijos.push(obj)
          }
        }

          
      }
      else{
        Swal.fire({
          title: '¡Cuidado!',
          text: 'Te falta completar algunas cuentas',
          icon: 'warning',
          allowOutsideClick: false,
        })
      }
    }
    else{
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Tienes un código erroneo',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
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
    const codigosPermitidos = [29,30,32,33,34,40,43,45,46,55,56,60,61,108,901,914,911,904,909,910,911]
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
      if(this.comprobarCodigosDoc() === true){
        this.cuentasToString()
        if(this.revisarCuentas()===true){
          
          Swal.fire({
            title: '¡Cuidado!',
            text: 'Te faltan completar algunas cuentas',
            icon: 'warning',
            allowOutsideClick: false,
          })
        }else{ 
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
            let obj = Object.assign({
              "uid":id,
              "anio": this.addAnio,
              "mes": this.addMes,
              "cuenta": this.nombreCuenta[i],
              "nro":this.excelData[i][0],
              "tipoDoc":this.excelData[i][1],
              "tipoCompra":this.excelData[i][2],
              "rutProveedor":this.excelData[i][3],
              "razonSocial":this.excelData[i][4],
              "folio":this.excelData[i][5],
              "fechaDocto":this.excelData[i][6],  //arreglar formato fechas
              "fechaRecepcion":this.excelData[i][7], //arreglas formato fechas
              "fechaAcuse":this.excelData[i][8],
              "montoExento":this.excelData[i][9],
              "montoNeto":this.excelData[i][10],
              "montoIVA_Recuperable":this.excelData[i][11],
              "montoIVA_NoRecuperable":this.excelData[i][12],
              "codIVA_NR":this.excelData[i][13],
              "montoTotal":this.excelData[i][14],
              "montoNetoActivoFijo":this.excelData[i][15],
              "IVA_ActivoFijo":this.excelData[i][16],
              "IVA_UsoComun":this.excelData[i][17],
              "impSinDerechoCred":this.excelData[i][18],
              "IVA_NoRetenido":this.excelData[i][19],
              "tabacosPuros":this.excelData[i][20],
              "tabacosCigarrillos":this.excelData[i][21],
              "tabacosElaborados":this.excelData[i][22],
              "NCE_NDE":this.excelData[i][23],
              "codOtroImp":this.excelData[i][24],
              "valorOtroImpuesto":this.excelData[i][25],
              "tasaOtroImpuesto":this.excelData[i][26]
              })

            if(!this.comprobarActivoFijo(this.nombreCuenta[i])){
              this.objetos.push(obj)
            }
            else{
              this.showDetails = true
              const arreglo = this.inputsDetails
              let obj = Object.assign({
                "uid":id,
              "anio": this.addAnio,
              "mes": this.addMes,
              "cuenta": this.nombreCuenta[i],
              "nro":this.excelData[i][0],
              "tipoDoc":this.excelData[i][1],
              "tipoCompra":this.excelData[i][2],
              "rutProveedor":this.excelData[i][3],
              "razonSocial":this.excelData[i][4],
              "folio":this.excelData[i][5],
              "fechaDocto":this.excelData[i][6],  //arreglar formato fechas
              "fechaRecepcion":this.excelData[i][7], //arreglas formato fechas
              "fechaAcuse":this.excelData[i][8],
              "montoExento":this.excelData[i][9],
              "montoNeto":this.excelData[i][10],
              "montoIVA_Recuperable":this.excelData[i][11],
              "montoIVA_NoRecuperable":this.excelData[i][12],
              "codIVA_NR":this.excelData[i][13],
              "montoTotal":this.excelData[i][14],
              "montoNetoActivoFijo":this.excelData[i][15],
              "IVA_ActivoFijo":this.excelData[i][16],
              "IVA_UsoComun":this.excelData[i][17],
              "impSinDerechoCred":this.excelData[i][18],
              "IVA_NoRetenido":this.excelData[i][19],
              "tabacosPuros":this.excelData[i][20],
              "tabacosCigarrillos":this.excelData[i][21],
              "tabacosElaborados":this.excelData[i][22],
              "NCE_NDE":this.excelData[i][23],
              "codOtroImp":this.excelData[i][24],
              "valorOtroImpuesto":this.excelData[i][25],
              "tasaOtroImpuesto":this.excelData[i][26],
              "detalleActivoFijo": arreglo
              })
              //console.log(obj)
              this.objetos.push(obj)
            }
                  
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
      this.showDetails = true
      return true
    }
    return false
    
  }

  saveDetails(){
    const ref = collection(this.firestore,'Contabilidad-Compras');
      for(let i=0; i<this.objetos.length;i++){
        addDoc(ref,this.objetos[i])
      }   
    this.showDetails = false
    Swal.fire({
      title: '¡Guardado!',
      text: 'Se ha guardado la nueva compra junto con los detalles',
      icon: 'success',
      allowOutsideClick: false,
    }) 
  }

  hideModalDetails(){
    this.showDetails = false
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
    const ref = collection(this.firestore,'Contabilidad-Compras');
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

  


