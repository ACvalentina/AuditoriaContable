import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseErrorService {

  constructor() { }

  firebaseError(code:string){
    switch(code){
      case 'auth/email-already-in-use':
        return 'El usuario ya existe'
      case 'auth/wrong-password':
        return 'Contraseña incorrecta'
      case 'auth/user-not-found':
        return 'Usuario no encontrado'
      default:
        return 'Error desconocido'
    }
  }
}
