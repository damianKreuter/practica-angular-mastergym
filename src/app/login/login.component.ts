import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
//import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  datosCorrectos: boolean = true;
  textoError: string = '';
  formularioLogin: FormGroup
  constructor(private afAuth: AngularFireAuth,
    private spinner: NgxSpinnerService
    ) { 
      this.formularioLogin = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ])
    });
  }

  get password() { return this.formularioLogin.get("password")}

  ngOnInit() {
    
  }

  ingresar()
  {
    this.spinner.show();
 
    if(this.formularioLogin.valid)
    {
      this.datosCorrectos = true;
      this.afAuth.signInWithEmailAndPassword(this.formularioLogin.value.email, this.formularioLogin.value.password)
      .then((usuario)=>{
        console.log(usuario)
        this.ocultarSpinner()
      }).catch((error)=>{
        this.datosCorrectos = false;
        this.textoError = error.message;
        this.ocultarSpinner()
      })
    }
    else
    {
      this.datosCorrectos = false;
      this.textoError = 'Por favor revisa que los datos esten correctos'
     }
    
  }
  ocultarSpinner() {
    setTimeout(()=>{
      this.afAuth.user.subscribe((user)=>{
        this.spinner.hide();
        console.log(user)
      })
    },2000)
  }

}
