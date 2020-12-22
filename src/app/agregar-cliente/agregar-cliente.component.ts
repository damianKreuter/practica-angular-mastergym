import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { MensajesService } from '../service/mensajes-servicio.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  porcentajeSubida: number | undefined = 0;
  urlImagen: string = ''
  esEditable: boolean = false;
  id: string = "";
  imagenSubida: boolean = false;
  estadoSubido : boolean = false
  constructor(
    private fb: FormBuilder, 
    private storage: AngularFireStorage, 
    private db : AngularFirestore,
    private activeRoute: ActivatedRoute,
    private msj: MensajesService
    ) 
    { 
      this.id = ""
      this.formularioCliente = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        correo: ['', Validators.compose([
          Validators.required, Validators.email
        ])],
        cedula: [''],
        fechaNacimiento: ['', Validators.required],
        telefono: [''],
        imgUrl: ['', Validators.required]
      })
    }

    get correo() { return this.formularioCliente.get("correo")}
    get nombre() { return this.formularioCliente.get("nombre")}
    get apellido() { return this.formularioCliente.get("apellido")}
    get fechaNacimiento() { return this.formularioCliente.get("fechaNacimiento")}
    get imgUrl() { return this.formularioCliente.get("imgUrl")}



  ngOnInit() {

    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      cedula: [''],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      imgUrl: ['', Validators.required]
    })




    this.id = this.activeRoute.snapshot.params.clienteID;
    console.log("Tipo ID: "+this.id)
    if(this.id !=undefined)
    {
      this.esEditable = true;
      this.db.doc<any>('clientes' +'/' + this.id ).valueChanges().subscribe((cliente)=>{
          this.formularioCliente.setValue({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            correo: cliente.correo,
            fechaNacimiento: new Date(cliente.fechaNacimiento.seconds * 1000).toISOString().substr(0,10) ,
            telefono: cliente.telefono,
            cedula: cliente.cedula,
            imgUrl: ''
          })
        this.urlImagen = cliente.imgUrl;
      });
    }
  }


  agregar()
  {
    this.formularioCliente.value.imgURL = this.urlImagen
    console.log("URL Imagen subida: "+this.urlImagen)
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento )
    console.log(this.formularioCliente.value)
    this.db.collection('clientes').add(this.formularioCliente.value).then((termino)=>{
      
      this.msj.mensajeCorrecto('Agregar', 'Se agrego correctamente');
    }).catch(()=>{
      this.msj.mensajeCorrecto('Error', 'Ocurrio algun error');
    })
  }


  editar()
  {
    this.formularioCliente.value.imgURL = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento );
    

    this.db.doc('clientes/' + this.id).update(this.formularioCliente.value).then(()=>{
      this.msj.mensajeCorrecto('Edito', 'Se edito correctamente');
    }).catch(()=>{
     this.msj.mensajeError('Error', 'Ocurrio algun error')
    })
  }


  subirImagen(evento:any)
  {
    if(evento.target.files.length > 0)
    {
      let nombre = new Date().getTime().toString()
      let archivo = evento.target.files[0]
      let extension =  archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'))
      let ruta = 'clientes/' + nombre  + extension ;
      const referencia = this.storage.ref(ruta)
      const tarea = referencia.put(archivo)
      tarea.then((objeto)=>{      
        referencia.getDownloadURL().subscribe((url)=>{
          this.urlImagen = url;
          console.log("URL Imagen subida: "+this.urlImagen)
        })
      })
      tarea.percentageChanges().subscribe((porcentaje)=>{
        console.log(porcentaje)
        this.porcentajeSubida = parseInt(porcentaje?.toString());
        if( porcentaje < 100){
          this.imagenSubida=false;
        } else this.imagenSubida=true
      })
    }
    

    
  }

}
