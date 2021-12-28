import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';
import { EntityTabLugarService } from './../../../../core/services/entity-tab-lugar.service';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss']
})
export class ActualizarComponent implements OnInit {
  entity: any = null;
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Actualizar Lugar';
  // Variable de validación
  public ready: boolean = false;
  public guardadoTodo: boolean = false;
  public listas: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private entityLugar: EntityTabLugarService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation?.extras?.state;
    // console.log('Entity ', this.entity);

    this.formEntity = this.formBuilder.group({
      idLugar: [''],
      idTipoLugar: ['', [Validators.required]],
      idTipoOrigen: ['', [Validators.required]],
      contactoNombre: ['', [Validators.required, Validators.maxLength(100)]],
      contactoCorreoElectronico: ['', [ Validators.required ,Validators.email, Validators.maxLength(100)]],
      contactoTelefono: ['', [Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(100)]],
      idTipoEstadoLugar: ['', [Validators.required]],
      nombre: [''],
      descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    }, { updateOn: 'blur'});
   }

  ngOnInit(): void {
    if (typeof this.entity === 'undefined'){
      // Redirigir
      this.router.navigate(['dashboard/administracion-lugares/listar']);
    }else{
      this.formEntity.controls.idLugar.setValue(this.entity.id_lugar);
      this.formEntity.controls.idTipoLugar.setValue(this.entity.id_tipo_lugar);
      this.formEntity.controls.idTipoOrigen.setValue(this.entity.id_tipo_origen);
      this.formEntity.controls.contactoNombre.setValue(this.entity.contacto_nombre);
      this.formEntity.controls.contactoCorreoElectronico.setValue(this.entity.contacto_correo_electronico);
      this.formEntity.controls.contactoTelefono.setValue(this.entity.contacto_telefono);
      this.formEntity.controls.direccion.setValue(this.entity.direccion);
      this.formEntity.controls.idTipoEstadoLugar.setValue(this.entity.id_tipo_estado_lugar);
      this.formEntity.controls.nombre.setValue(this.entity.nombre);
      this.formEntity.controls.descripcion.setValue(this.entity.descripcion);
      this.listasService.consultarListas([3486, 3487, 3488]).then((listas) => {this.listas = listas; this.ready = true;});
    }
  }

  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log(value);
        this.entityLugar.actualizar(value);
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
    this.router.navigate(['dashboard/administracion-lugares/listar']);
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
    // Campos a validar Tipo Lugar
    get tipoLugarField(): any{
      return this.formEntity.get('idTipoLugar');
    }
  // Campo a validar Tipo Origen
  get tipoOrigenField(): any{
    return this.formEntity.get('idTipoOrigen');
  }
  // Campo a validar Contacto Nombre
  get contactoNombreField(): any{
    return this.formEntity.get('contactoNombre');
  }
  // Campo a validar nombre
  get nombreField(): any{
    return this.formEntity.get('nombre');
  }
  // Campo a validar descripción
  get descripcionField(): any{
    return this.formEntity.get('descripcion');
  }
  // Campo a validar direccion
  get direccionField(): any{
    return this.formEntity.get('direccion');
  }
  // Campo a valida contacto numero
  get contactoTelefonoField(): any{
    return this.formEntity.get('contactoTelefono');
  }
  // Campo a validar correo electronico
  get contactoCorreoField(): any{
    return this.formEntity.get('contactoCorreoElectronico');
  }
  // Campo a validar estado
  get estadoField(): any{
    return this.formEntity.get('idTipoEstadoLugar');
  }
}
