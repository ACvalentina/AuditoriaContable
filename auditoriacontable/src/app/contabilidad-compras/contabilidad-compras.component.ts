import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; 
import { CuentasService } from '../cuentas.service'
import { BehaviorSubject, Observable } from 'rxjs'

@Component({
  selector: 'app-contabilidad-compras',
  templateUrl: './contabilidad-compras.component.html',
  styleUrls: ['./contabilidad-compras.component.scss'],
  providers: [CuentasService]
})

export class ContabilidadComprasComponent implements OnInit {
  excelData: Array<any>=[] as any;
  public show = false;
  cuentas$: Observable<any[]>;
  startAt: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private afAuth: AngularFireAuth,private firestore:Firestore, private cuentasSvc: CuentasService) { }

  ngOnInit(): void {
    this.cuentas$ = this.cuentasSvc.getCuentas(this.startAt)
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
  async Guardar(){
    if(this.comprobarCodigosDoc()===true){
      Swal.fire({
        title: '¡Guardado!',
        text: 'Se ha guardado una nueva compra',
        icon: 'success',
        allowOutsideClick: false,
      })
      const ref = collection(this.firestore,'Contabilidad-Compras');
      const id = await this.getUid();//arreglar los guardados
      for(let i = 1; i<this.excelData.length ; i++){
        
        for(let j = 0; j<29 ; j++){
          if(this.excelData[i][j]===undefined){
            this.excelData[i][j] = ''
          }
        }
        let obj = Object.assign({
        "UID":id,
        "Nro":this.excelData[i][0],
        "Tipo Doc":this.excelData[i][1],
        "Tipo Compra":this.excelData[i][2],
        "Rut Proveedor":this.excelData[i][3],
        "Razon Social":this.excelData[i][4],
        "Folio":this.excelData[i][5],
        "Fecha Docto":this.excelData[i][6],  //arreglar formato fechas
        "Fecha Recepcion":this.excelData[i][7], //arreglas formato fechas
        "Fecha Acuse":this.excelData[i][8],
        "Monto Exento":this.excelData[i][9],
        "Monto Neto":this.excelData[i][10],
        "Monto IVA Recuperable":this.excelData[i][11],
        "Monto Iva No Recuperable":this.excelData[i][12],
        "Codigo IVA No Rec.":this.excelData[i][13],
        "Monto Total":this.excelData[i][14],
        "Monto Neto Activo Fijo":this.excelData[i][15],
        "IVA Activo Fijo":this.excelData[i][16],
        "IVA uso Comun":this.excelData[i][17],
        "Impto. Sin Derecho a Credito":this.excelData[i][18],
        "IVA No Retenido":this.excelData[i][19],
        "Tabacos Puros":this.excelData[i][20],
        "Tabacos Cigarrillos":this.excelData[i][21],
        "Tabacos Elaborados":this.excelData[i][22],
        "NCE o NDE sobre Fact. de Compra":this.excelData[i][23],
        "Codigo Otro Impuesto":this.excelData[i][24],
        "Valor Otro Impuesto":this.excelData[i][25],
        "Tasa Otro Impuesto":this.excelData[i][26]
        })
        console.log(obj)
        addDoc(ref,obj)
        //segun tipo documento, realizar una funcion
      }
    }
    else{
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Tienes un codigo erroneo',
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
}
