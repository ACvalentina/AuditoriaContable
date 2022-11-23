import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from '../services/firebase-error.service';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.scss']
})
export class IngresarComponent implements OnInit {

  
  login: FormGroup;
  email:any;
  password1:any;
  
  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError: FirebaseErrorService) {
    this.login = this.fb.group({
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
    })
    }
  ngOnInit(): void {
  }

  logueo():void{
    const email = this.login.value.email;
    const password1 = this.login.value.password1;

    this.afAuth.signInWithEmailAndPassword(email,password1).then(()=>{
      this.router.navigate(['/inicio2']);
    }).catch((error)=>
      alert(this.firebaseError.firebaseError(error.code))
    )
  }

}
  
  
  
  
