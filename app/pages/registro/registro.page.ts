import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RegistroserviceService, Usuario } from '../../service/registroservice.service';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Router }from '@angular/router';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioRegistro: FormGroup;
  newUsuario: Usuario = <Usuario>{};
  valueFromUser:any;
  registerArray:any={};
  regArry:any={};



  constructor(private router:Router,private alertController: AlertController,
    private registroService: RegistroserviceService,
    private toast: ToastController,
    private fb: FormBuilder) 
    {
    this.formularioRegistro = this.fb.group({
      'nombre': new FormControl("",[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
      'apellido': new FormControl("", [Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
      'correo': new FormControl("", Validators.required),
      'tipo': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'confirmaPass': new FormControl("", Validators.required),

    })
  }

  errors=[
    {type:'required',message:'No puede estar vacio'},
    {type:'maxlength',message:'No puede tener mas de 8 caracteres'},
    {type:'minlength',message:'No puede tener menos de 4 caracteres'}  
  ]

  passwordPtn ='^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$'

  ngOnInit() {
  }

  async CrearUsuario() {
    var form = this.formularioRegistro.value;
    if (this.formularioRegistro.invalid) {
      this.alertError();
    }
    else {
      this.newUsuario.nomUsuario = form.nombre;
      this.newUsuario.apeUsuario = form.apellido;
      this.newUsuario.correoUsuario = form.correo;  
      this.newUsuario.tipoUsuario = form.tipo;
      this.newUsuario.passUsuario = form.password;
      this.newUsuario.repassUsuario = form.confirmaPass;
      this.registroService.addUsuario(this.newUsuario).then(dato => {
      if(form.correo===this.registroService.getUsuarios()){
        this.alertYaRegistrada();
      }else{
        this.newUsuario = <Usuario>{};
        this.showToast('Cuenta Registada!');
      }     
      });
 
      this.formularioRegistro.reset();
    }
  }

  async alertError() {
    const alert = await this.alertController.create({
      header: 'Error..',
      message: 'Debe completar todos los datos',
      buttons: ['Aceptar']
    })
    await alert.present();
  }

  async alertYaRegistrada() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Usuario ya existe',
      buttons: ['Aceptar']
    })
    await alert.present();
  }


  async showToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 1000,
      
    })
    await toast.present();
    setTimeout(()=>{
      this.router.navigateByUrl('login');
    },1000);
  }


  tipoUsuario = undefined;

  handleChange(ev) {
    this.tipoUsuario = ev.target.value;
    console.log(this.tipoUsuario)
  }

 
}

