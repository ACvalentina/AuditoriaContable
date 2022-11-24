import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  
  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError : FirebaseErrorService) {
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
        [Validators.required, Validators.email],
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
    })
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

      this.afAuth.createUserWithEmailAndPassword(email,password1).then(()=> {
        this.router.navigate(['/verificado']);
        this.verificarCorreo();
      }).catch((error)=>{
        alert(this.firebaseError.firebaseError(error.code))
      });
    }
    
    verificarCorreo(){
      this.afAuth.currentUser.then(user=> user?.sendEmailVerification())
    }
    
  }
