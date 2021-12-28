import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';

@Component({
  selector: 'app-ver-persona',
  templateUrl: './ver-persona.component.html',
  styleUrls: ['./ver-persona.component.scss']
})
export class VerPersonaComponent implements OnInit {
  @Input() identificadorPersona: string = '';
  @Output() idIdentificador = new EventEmitter<number>();
  public titulo = 'Datos Persona';
  public formEntity: FormGroup;
  public ready:boolean = false;
  public readyPersona:boolean = false;
  public listas: any;
  public listaUsuarios: any;
  public entity: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private entityPersona: EntityTabPersonaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formEntity = this.formBuilder.group({
      idPersona: [{value: '', disabled:true}],
      idTipoRegimen: [{value: '', disabled:true}, Validators.required],
      idTipoCategoriaPersona: [{value: '', disabled:true}, Validators.required],
      identificacion: [{value: '', disabled:true}],
      idUsuario: [{value: '', disabled:true}, Validators.maxLength(20)],
      nombre: [{value: '', disabled:true}, [Validators.required, Validators.maxLength(100)]],
      telefono: [{value: '', disabled:true}, [Validators.required, Validators.required]],
      email: [{value: '', disabled:true}, [Validators.email, Validators.required, Validators.maxLength(300)]],
      idTipoEstadoPersona: [{value: '', disabled:true},Validators.required],
      idTipoArea: [{value: '', disabled:true}],
      idTipoCargo: [{value: '', disabled:true}],
      idTipoRol: [{value: '', disabled:true}],
    }, { updateOn: 'blur'});
   }

  ngOnInit(): void {
    // console.log('Identificador hijo', this.identificador);
    if(this.identificadorPersona!==''){
      this.getPersona();
    }
  }

  async getPersona(){

    let condicion = "id_persona = " + this.identificadorPersona;
    console.log('condicion', condicion);
    let res:any = await this.entityPersona.list(condicion);
    if(res.respuesta[0]){
      this.entity = res.respuesta[0];
      // console.log('Respuesta', this.persona);
      this.idIdentificador.emit(this.entity['id_persona']);
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
      this.entityPersona.listUsuarios('').then((listaUsuarios) => { this.listaUsuarios = listaUsuarios; this.readyPersona = true;});
    }
  }

  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log('Datos actualizar ', value);
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
