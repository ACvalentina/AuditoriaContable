import { Component, OnInit } from '@angular/core';

import { Firestore, FirestoreModule } from '@angular/fire/firestore'
import { collection } from '@angular/fire/firestore'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { offset } from '@popperjs/core';
import { Observable, Subject, switchMap, filter } from 'rxjs'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  
  public show = false;

  constructor() { }

  showModal(){
    this.show = true;
  }

  hideModal(){
    this.show = false;
  }

  ngOnInit() {
    
  }
 

}
