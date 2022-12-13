import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-contabilidad-compras',
  templateUrl: './contabilidad-compras.component.html',
  styleUrls: ['./contabilidad-compras.component.scss']
})
export class ContabilidadComprasComponent implements OnInit {
  excelData: [][];

  constructor() { }

  ngOnInit(): void {
  }
  readExcel(event:any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e)=>{
      var workbook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {header: 1});
      console.log(this.excelData)
    }
  }
}
