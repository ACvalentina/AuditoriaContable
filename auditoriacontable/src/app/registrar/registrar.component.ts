import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from '../services/firebase-error.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {

  
  registrarUsuario: FormGroup;
  username:any;
  email:any;
  rut:any;
  password1: any;
  password2: any;
  rolUser: any;
  datosRol
  opcionRol = '0'
  addRol = ''
  
  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError : FirebaseErrorService, private firestore:Firestore) {
    this.registrarUsuario = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
        ],
      ],
      rut: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}[-][0-9kK]{1}$'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      password1: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ],
      ],
      password2: [''],
    }),
    this.datosRol = ['Administrador', 'Supervisor', 'Digitador', 'Cliente']
  }
  
    ngOnInit(): void {
    }
  
    equalPass(): boolean {
      if (this.password1 == this.password2) {
        return true;
      } else {
        return false;
      }
    }

    registrar(){
      const email = this.registrarUsuario.value.email;
      const password1 = this.registrarUsuario.value.password1;
      const username = this.registrarUsuario.value.username;
      const rut = this.registrarUsuario.value.rut;
      const rolUser = this.addRol;

      this.afAuth.createUserWithEmailAndPassword(email,password1).then(()=> {
        this.router.navigate(['/verificado']);
        this.verificarCorreo();
        this.guardarUsuario(username,rut,email,rolUser);
        
      }).catch((error)=>{
        alert(this.firebaseError.firebaseError(error.code))
      });
    }
    
    verificarCorreo(){
      this.afAuth.currentUser.then(user=> user?.sendEmailVerification())
    }
    
    async guardarUsuario(username:any,rut:any,email:any,rolUser:any){
      const id = await this.getUid();
      const obj = Object.assign({
        "UID":id,
        "Username":username,
        "RUT":rut,
        "Correo electrónico":email,
        "rolUsuario":rolUser
      })
      const ref = collection(this.firestore,'Usuarios');
      return addDoc(ref,obj);
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
      const rut = this.registrarUsuario.value.rut;
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

    getRol(){
      this.addRol = this.opcionRol
    }
    
}
