import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-contabilidad-ventas',
  templateUrl: './contabilidad-ventas.component.html',
  styleUrls: ['./contabilidad-ventas.component.scss']
})
export class ContabilidadVentasComponent implements OnInit {

  excelData: any

  constructor() { }

  ngOnInit(): void {
  }

  readExcel(event){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e)=>{
      var workbook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[1]]);
      console.log(this.excelData)
    }
  }

}
