import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from '../services/firebase-error.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent implements OnInit {
  recuperar:FormGroup;
  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError: FirebaseErrorService) {
    this.recuperar = this.fb.group({
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
  
  recuperacion(){
    const email = this.recuperar.value.email;

    this.afAuth.sendPasswordResetEmail(email).then(()=>{
      this.router.navigate(['/contrasena-recuperada']);
    }).catch((error)=>{
      this.firebaseError.firebaseError(error.code);
    })
  }

}
