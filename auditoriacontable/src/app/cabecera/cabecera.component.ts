import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Empresa } from '../empresa'
import Swal from 'sweetalert2';
import { documentId } from 'firebase/firestore';


@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})

export class CabeceraComponent implements OnInit {

  public misEmpresas$: Observable<any[]>;
  startAt: BehaviorSubject<string> = new BehaviorSubject('');
  companies:any=[]
  empre!:string
  selectedValue!:string
  public isSupervisor = true

  constructor(private userSv: UserService,private auth:Auth,private router:Router, private db:AngularFirestore, private firestore:Firestore) { }


  async ngOnInit() {
    //this.empresas = this.userSv.empresas
    const id = await this.getUid();

    this.obtenerEmpresas(id).subscribe(e=>{
      console.log(e)
      this.companies = e;
    })

    // sessionStorage.setItem("Empresa", this.companies)
    //this.selectedValue = localStorage.getItem('empre') || 'default-token'
    const roles = query(collection(this.firestore, "Usuarios"),where("UID", "==", id) ,where("Tipo usuario", "==", "Supervisor"))
    if(roles){
      /* Swal.fire({
        title: '¡Acceso denegado!',
        text: 'No tiene permisos suficientes para acceder',
        icon: 'warning',
        allowOutsideClick: false,
      }) */
      this.isSupervisor = false
    }
    
  }

  async getUid(){
    const user = await this.auth.currentUser;
    if(user === null){
      return null;
    }
    else{
      return user?.uid;
    }
  }

  logOut(){
    this.router.navigate(['']);
    return signOut(this.auth);
  }

  obtenerEmpresas(id:any):Observable<Empresa[]>{
    const q = query(collection(this.firestore, "Empresas"), where("UID","==",id));
    return collectionData(q) as Observable<Empresa[]>
  }

  // SELECT EMPRESAS
  onChange(event: Event) {
    //this.companies = (event.target as HTMLInputElement).value
    this.empre = (event.target as HTMLInputElement).value
    localStorage.setItem('empre', this.empre)
    this.selectedValue = localStorage.getItem('empre') || 'default-token'
   
  }
  removeItemStorage(){
    localStorage.clear()
  }
  getRolUser(){
    //const rolUser = query(collection(this.firestore, "Usuarios"), where("Tipo usuario", "==", "Supervisor"))
    if(collection(this.firestore, "Usuarios"), where("UID", "==", this.getUid()) ,where("rolUsuario", "==", "Supervisor")){
      /* Swal.fire({
        title: '¡Acceso denegado!',
        text: 'No tiene permisos suficientes para acceder',
        icon: 'warning',
        allowOutsideClick: false,
      }) */
      this.isSupervisor = false
    }
   
  }

}
