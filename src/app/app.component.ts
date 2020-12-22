import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mastergym';
  usuario: any
  cargando = true
  constructor(public afAuth: AngularFireAuth) {
    setTimeout(()=>{
      this.afAuth.user.subscribe((user)=>{
        this.cargando=false
        this.usuario = user
        console.log(user)
      })
    },2500)
    
  }

 /* login() {
    this.afAuth.signInWithEmailAndPassword("user@ejemplo.com","123456")
  }*/
  logout() {
    this.afAuth.signOut();
  }
}
