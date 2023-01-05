import { Component, OnInit } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore'
import { query, collection, where, addDoc} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Cuenta } from '../cuenta';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss']
})
export class CrearCuentaComponent implements OnInit {
  cuentas:any=[]
  cuentasActivos:any=[]
  cuentasPasivos:any=[]
  cuentasGanancias:any=[]
  cuentasPerdidas:any=[]
  cuentasOrden:any=[]
  contGlobal:number = 0
  arrGlobal:any=[]
  constructor(private firestore:Firestore, private userSv:UserService) { }

  async ngOnInit(): Promise<void> {
    this.obtenerCuentas().subscribe(c=>{
    this.cuentas = c
    for(let i = 0; i< this.cuentas.length; i++){
      
      if(this.cuentas[i].id[0]==="1"){
        this.cuentasActivos.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="2"){
        this.cuentasPasivos.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="3"){
        this.cuentasPerdidas.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="4"){
        this.cuentasGanancias.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="5"){
        this.cuentasOrden.push(this.cuentas[i])
      }
    }
    this.cuentasActivos=this.cuentasActivos.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    this.cuentasPasivos=this.cuentasPasivos.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    })
    this.cuentasPerdidas=this.cuentasPerdidas.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    this.cuentasGanancias=this.cuentasGanancias.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    this.cuentasOrden=this.cuentasOrden.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    ;(await this.obtenerMisCuentas()).subscribe(c=>{
      this.cuentas = c
    for(let i = 0; i< this.cuentas.length; i++){
      
      if(this.cuentas[i].id[0]==="1"){
        this.cuentasActivos.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="2"){
        this.cuentasPasivos.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="3"){
        this.cuentasPerdidas.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="4"){
        this.cuentasGanancias.push(this.cuentas[i])
      }
      if(this.cuentas[i].id[0]==="5"){
        this.cuentasOrden.push(this.cuentas[i])
      }
    }
    this.cuentasActivos=this.cuentasActivos.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    this.cuentasPasivos=this.cuentasPasivos.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    })
    this.cuentasPerdidas=this.cuentasPerdidas.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    this.cuentasGanancias=this.cuentasGanancias.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    })
    this.cuentasOrden=this.cuentasOrden.sort(function(a,b){
      if(a.id>b.id){
        return 1
      }
      else{
        return -1
      }
    
    })
  }

  async obtenerMisCuentas():Promise<Observable<Cuenta>>{
    const ua = await this.userSv.getUid()
    console.log(ua)
    const q = query(collection(this.firestore,"PlanesDeCuentaUsuarios"),where("usuarioAsociado","==",ua));
    return collectionData(q) as unknown as Observable<Cuenta>
  }

  obtenerCuentas():Observable<Cuenta>{
    
    const q = query(collection(this.firestore,"Cuentas"))
    return collectionData(q) as unknown as Observable<Cuenta>
  }
  
  async crearCuenta(idPadre:string,nombrePadre:string){
    const refPC = collection(this.firestore,'PlanesDeCuentaUsuarios')
    const ua = await this.userSv.getUid()
    const q = query(collection(this.firestore,"PlanesDeCuentaUsuarios"),where("usuarioAsociado","==",ua),where("idPadre","==",idPadre))
    const cuentasUser = collectionData(q) as unknown as Observable<Cuenta>
    let arr:any = []
    let cont = 1
    cuentasUser.subscribe(e=>{
      console.log(e)
      arr = e
      cont = arr.length
      this.contGlobal = cont+1
    })
    console.log(this.contGlobal)
    let numHijo = this.contGlobal.toString();
    let idGenerado;
    if(numHijo.length===1){
      idGenerado = idPadre+"0"+numHijo+"-"
      let obj = Object.assign({
        "id":idGenerado,
        "usuarioAsociado":ua,
        "nombre":nombrePadre,
        "idPadre":idPadre
      })
      addDoc(refPC,obj)
    }
    else if(numHijo.length===2){
      idGenerado = idPadre+numHijo+"-"
      idGenerado = idPadre+"0"+numHijo+"-"
      let obj = Object.assign({
        "id":idGenerado,
        "usuarioAsociado":ua,
        "nombre":nombrePadre,
        "idPadre":idPadre
      })
      addDoc(refPC,obj)
    }
    else{
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Has llegado al máximo para esta cuenta',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
  }
}

