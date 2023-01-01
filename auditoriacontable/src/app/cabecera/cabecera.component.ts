import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { UserService } from '../user.service';


@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})

export class CabeceraComponent implements OnInit {

  public misEmpresas$: Observable<any[]>;
  startAt: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private userSv: UserService,private auth:Auth,private router:Router, private db:AngularFirestore, private firestore:Firestore) { }


  ngOnInit(): void {
    this.misEmpresas$ = this.getMisEmpresas(this.startAt);
  }

  getMisEmpresas(start: BehaviorSubject<string>): Observable<any[]> {
    return start.pipe(switchMap(startText => {
     const endText = startText + '\uf8ff';
     return this.db.collection('Empresas', ref => ref.orderBy('razonSocial').limit(10).startAt(startText).endAt(endText))
     .snapshotChanges().pipe(debounceTime(50)).pipe(distinctUntilChanged()).pipe(map(changes => {
       return changes.map(c => {
         const data = c.payload.doc.data();
         const id = c.payload.doc.id;
         return {id, data};
       });
     }));
    }));
   }

  search(searchText){
    this.startAt.next(searchText)
  }

  logOut(){
    this.router.navigate(['']);
    return signOut(this.auth);
  }
}
