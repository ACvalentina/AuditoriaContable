import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; 
import { CuentasService } from '../cuentas.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms'

@Component({
  selector: 'app-honorario-mensual',
  templateUrl: './honorario-mensual.component.html',
  styleUrls: ['./honorario-mensual.component.scss']
})
export class HonorarioMensualComponent implements OnInit {

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

        this.cuentasToString()
        const id = await this.getUid();//arreglar los guardados         
        for(let i = 3; i<this.excelData.length-1; i++){
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
            "nroBoleta":this.excelData[i][0],
            "fechaBoleta":this.excelData[i][1],
            "estadoBoleta":this.excelData[i][2],
            "fechaAnulacionBoleta":this.excelData[i][3],
            "rutEmisor":this.excelData[i][4],
            "nombreEmisor":this.excelData[i][5],
            "socProfEmisor":this.excelData[i][6],
            "brutosHonorarios":this.excelData[i][7],
            "retenidoHonorarios":this.excelData[i][8],
            "pagadoHonorarios":this.excelData[i][9],

            })

          this.objetos.push(obj)   
        }
        this.saveDetails()
        }
    } //corroborar si ya esta en la bd?
    //segun tipo documento, realizar una funcion 
    
     
  }

  revisarCuentas(){///seguro tabla
    for(let i = 2; i<this.excelData.length-1; i++){
      if (this.nombreCuenta[i] === ''){
        return true
      }
    }
    return false
  }
  saveDetails(){
    console.log(this.objetos)
    const ref = collection(this.firestore,'Honorarios-Mensual');
    for(let i=0; i<this.objetos.length;i++){
      addDoc(ref,this.objetos[i])
    }   
    //this.showDetails = false
    Swal.fire({
      title: '¡Guardado!',
      text: 'Se ha guardado el honorario',
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
    console.log(this.objetos)
    //actualizar activos fijos con sus detalles
    // const ref = collection(this.firestore,'Contabilidad-Compras')
    const ref = collection(this.firestore,'Honorarios-Anual');
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
