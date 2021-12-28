import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss']
})
export class ActualizarComponent implements OnInit {
  entity: any = null;
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Actualizar Persona';
  public listas: any;
  public listaUsuarios: any;
  public ready: boolean = false;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private entityPersona: EntityTabPersonaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation?.extras?.state;
    // console.log('LLega a actualizar: ', this.entity);

    this.formEntity = this.formBuilder.group({
      idPersona: [''],
      idTipoRegimen: ['', Validators.required],
      idTipoCategoriaPersona: ['', Validators.required],
      identificacion: [''],
      idUsuario: ['', Validators.maxLength(20)],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.required]],
      email: ['', [Validators.email, Validators.required, Validators.maxLength(300)]],
      idTipoEstadoPersona: ['',Validators.required],
      idTipoArea: ['',],
      idTipoCargo: ['',],
      idTipoRol: [''],
    }, { updateOn: 'blur'});
   }

  ngOnInit(): void {
    if (typeof this.entity === 'undefined'){
      // Redirigir
      this.router.navigate(['dashboard/administracion-personas/listar']);
    }else{
      this.formEntity.controls.idPersona.setValue(this.entity.id_persona);
      this.formEntity.controls.idTipoRegimen.setValue(this.entity.id_tipo_regimen);
      this.formEntity.controls.idTipoCategoriaPersona.setValue(this.entity.id_tipo_categoria_persona);
      this.formEntity.controls.identificacion.setValue(this.entity.identificacion);
      this.formEntity.controls.nombre.setValue(this.entity.nombre);
      this.formEntity.controls.telefono.setValue(this.entity.telefono);
      this.formEntity.controls.email.setValue(this.entity.email);
      this.formEntity.controls.idTipoArea.setValue(this.entity.id_tipo_area);
      this.formEntity.controls.idTipoCargo.setValue(this.entity.id_tipo_cargo);
      this.formEntity.controls.idTipoEstadoPersona.setValue(this.entity.id_tipo_estado_persona);
      this.formEntity.controls.idUsuario.setValue(this.entity.id_usuario);
      this.formEntity.controls.idTipoRol.setValue(this.entity.id_tipo_rol);
      this.listasService.consultarListas([14,67,13,3,4,82,2271]).then((listas) => {this.listas = listas; this.ready = true;});
      this.entityPersona.listUsuarios('').then((listaUsuarios) => { this.listaUsuarios = listaUsuarios; this.ready = true;});
    }
  }

  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        // console.log('Datos actualizar ', value);
        this.entityPersona.actualizar(value);
        dialogRef.close();
        this.operationSuccess();
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
    };
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
    return this.formEntity.get('usuario');
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
