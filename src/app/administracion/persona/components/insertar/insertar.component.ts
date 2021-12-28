import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';

@Component({
  selector: 'app-insertar',
  templateUrl: './insertar.component.html',
  styleUrls: ['./insertar.component.scss']
})
export class InsertarComponent implements OnInit {
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Crear Persona';
  // Variable de validación
  public ready: boolean = false;
  public guardadoTodo: boolean = false;
  public listas: any;
  public listaUsuarios: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private entityPersona: EntityTabPersonaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    let NUMBERS_PATTERN = /^[0-9]*$/;
    this.formEntity = this.formBuilder.group({
      idTipoRegimen: ['', Validators.required],
      idTipoCategoriaPersona: ['', Validators.required],
      identificacion: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(NUMBERS_PATTERN)], this.validarIdentificacion.bind(this)],
      idUsuario: ['', Validators.maxLength(20)],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)]],
      email: ['', [Validators.email, Validators.required, Validators.maxLength(300)]],
      idTipoEstadoPersona: ['',Validators.required],
      idTipoArea: ['',],
      idTipoCargo: ['',],
      idTipoRol: [''],
    }, { updateOn: 'blur'});
   }

  ngOnInit(): void {
    this.listasService.consultarListas([14,67,13,3,2271,82]).then((listas) => {this.listas = listas; this.ready = true;});
    this.entityPersona.listUsuarios('').then((listaUsuarios) => { this.listaUsuarios = listaUsuarios; this.ready = true;});
  }

  validarIdentificacion(control: AbstractControl): any | null{
    // Verifica si se requiere validar campo identificacion
    const condicion = "identificacion='" + control.value + "'";
    // console.log('Condicion: ', condicion);
    return this.entityPersona.list(condicion).then(resp =>{
      return resp.msgError===null ? { identificacionExists: true} : null
    })
  }

  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log(value);
        this.entityPersona.insertar(value);
        dialogRef.close();
        this.operationSuccess();
        this.formEntity.reset();
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
    }else {
      this.formEntity.markAllAsTouched();
    }
  }
  cancel(event: Event) {
    event.preventDefault();
    console.log('click');
  }

  returnlist(): void{
    this.router.navigate(['dashboard/administracion-personas/listar']);
  }

  operationSuccess(){

    this.snackBar.open('Cambios realizados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  handleError(error?:any){
    let txtError = ''
    if(error.msjError){
      txtError = error.msjError;
    }else if (error.error){
      txtError = error.error.msjError;
    }else{
      txtError = error.status;
    }
    const dialogRef = this.dialog.open(SimpleDialogComponent,{
      data:{
        contenido: 'Hubo un error en la operación: ' + txtError,
        aceptar: true
      }
    });
  }

  mostrarVentanaEnEspera(titulo: string, footer?: string){
    const data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }
  // Campo a validar Identificacion
  get identificacionField(): any{
    return this.formEntity.get('identificacion');
  }
  //
  get tipoCategoriaField(): any{
    return this.formEntity.get('idTipoCategoriaPersona');
  }
  //
  get nombreField(): any{
    return this.formEntity.get('nombre');
  }
   //
   get tipoRegimenField(): any{
    return this.formEntity.get('idTipoRegimen');
  }
  //
  get emailField(): any{
    return this.formEntity.get('email');
  }
  //
  get tipoAreaField(): any{
    return this.formEntity.get('idTipoArea');
  }
  //
  get telefonoField(): any{
    return this.formEntity.get('telefono');
  }
  //
  get usuarioField(): any{
    return this.formEntity.get('idusuario');
  }
  //
  get estadoField(): any{
    return this.formEntity.get('idTipoEstadoPersona');
  }
  //
  get tipoCargoField(): any{
    return this.formEntity.get('idTipoCargo');
  }
}
