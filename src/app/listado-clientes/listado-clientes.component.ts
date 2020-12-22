import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../model/cliente'

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {
  clientes: any[] = new Array<any>();
  constructor(private db: AngularFirestore) { }

  ngOnInit() {
     this.db.collection('clientes').valueChanges().subscribe((resultado)=>{
    //   this.clientes = resultado;
       console.log(resultado)
     });

    
    this.clientes.length = 0;
    this.db.collection('clientes').get().subscribe((resultado)=>{
      resultado.docs.forEach((item)=>{
        let cliente:any = item.data();
     //   let cliente:Cliente = new Cliente()
     //   cliente.apellido=item.data().apellido
        cliente.id = item.id;
        cliente.ref = item.ref;
        this.clientes.push(cliente)
      })

    })

    
  }

  
}