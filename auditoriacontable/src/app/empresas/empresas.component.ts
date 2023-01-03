import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { getDocs, query, where } from 'firebase/firestore';
import { Empresa } from '../empresa';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
  empresas:any=[];
  formulario:FormGroup;
  
  constructor(private readonly fb: FormBuilder,private afAuth: AngularFireAuth, private firestore:Firestore) { 
    this.formulario = this.fb.group({
      nombreCliente: [
        '',
        [Validators.required],
      ],
      razonSocial: [
        '',
        [Validators.required],
      ],
      nombreCorto: [
        '',
        [Validators.required],
      ],
      rutEmpresa: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}[-][0-9kK]{1}$'),
        ],
      ],
      consorcio: [
        '',
        [],
      ],
      giroComercial: [
        '',
        [
          Validators.required,
        ],
      ],
      nombreRL: [
        '',
        [Validators.required],
      ],
      rutRL: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}[-][0-9kK]{1}$'),
        ],
      ],
      descripcion: [
        '',
        [],
      ],
      
      imagen: [
        '',
        [],
      ],
    })
  }

  async ngOnInit() {
    const id = await this.getUid();
    
    this.obtenerEmpresas(id).subscribe(e=>{
      console.log(e)
      this.empresas = e;
    })
  }
  async agregarEmpresa(){
    const id = await this.getUid();
    const obj = Object.assign({
      "UID":id,
      "nombreCliente":this.formulario.value.nombreCliente,
      "razonSocial":this.formulario.value.razonSocial,
      "nombreCorto":this.formulario.value.nombreCorto,
      "rutEmpresa":this.formulario.value.rutEmpresa,
      "consorcio":this.formulario.value.consorcio,
      "giroComercial":this.formulario.value.giroComercial,
      "nombreRL":this.formulario.value.nombreRL,
      "rutRL":this.formulario.value.rutRL,
      "descripcion":this.formulario.value.descripcion,
      "imagen":this.formulario.value.imagen
    })
    const ref = collection(this.firestore,'Empresas');
    return addDoc(ref,obj);
  }

  obtenerEmpresas(id:any):Observable<Empresa[]>{
    const q = query(collection(this.firestore, "Empresas"), where("UID","==",id),where("nombreCliente","!=",""));
    return collectionData(q) as Observable<Empresa[]>
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

  verificarRut(){ 
    const rut = this.formulario.value.rutEmpresa;
    const dv = rut[rut.length-1]
    const rut_sin_dv = rut.slice(0,rut.length-2)
    const rut_sin_puntos = (rut_sin_dv.replace('.','').replace('.',''))
    let dv_final;
    let sum = 0;
    let mul = 2;
    let i = rut.length-4
    while (i--) {
        sum = sum + Number(rut_sin_puntos.charAt(i)) * mul;
        if (mul % 7 === 0) {
          mul = 2;
        } else {
          mul++;
        }
    }

    const res = sum % 11;

    if (res === 0) {
      dv_final = '0';
    } else if (res === 1) {
      dv_final = 'k';
    }
    else{
        dv_final = `${11 - res}`;
    }
    return (dv===dv_final)
  }
}
