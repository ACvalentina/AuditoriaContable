import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio2',
  templateUrl: './inicio2.component.html',
  styleUrls: ['./inicio2.component.scss']
})
export class Inicio2Component implements OnInit {

  dataUser:any;
  constructor(private afAuth: AngularFireAuth, private router:Router) { }

  ngOnInit(): void {
    this.afAuth.currentUser.then(user =>{
      if(user && user.emailVerified){
        this.dataUser = user;
      }
      else{
        this.router.navigate(['']);
      }
    })
  }

}
