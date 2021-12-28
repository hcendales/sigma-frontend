import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';
import { EntityTabLugarService } from './../../../../core/services/entity-tab-lugar.service';

@Component({
  selector: 'app-insertar',
  templateUrl: './insertar.component.html',
  styleUrls: ['./insertar.component.scss']
})
export class InsertarComponent implements OnInit {
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Crear Lugar';
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
    this.formEntity = this.formBuilder.group({
      idTipoLugar: ['', [Validators.required]],
      idTipoOrigen: ['', [Validators.required]],
      contactoNombre: ['', [Validators.required, Validators.maxLength(100)]],
      contactoCorreoElectronico: ['', [ Validators.required ,Validators.email, Validators.maxLength(100)]],
      contactoTelefono: ['', [Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(100)]],
      idTipoEstadoLugar: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(300)], this.validarNombre.bind(this)],
      descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    }, { updateOn: 'blur'});
  }

  ngOnInit(): void {
    this.listasService.consultarListas([3486, 3487, 3488]).then((listas) => {this.listas = listas; this.ready = true;});
  }

  validarNombre(control: AbstractControl): any | null{
    // Verifica si se requiere validar campo numero Interno
    const condicion = "nombre='" + control.value + "'";
    // console.log('Condicion: ', condicion);
    return this.entityLugar.list(condicion).then(resp =>{
      return resp.msgError===null ? { nombreExists: true} : null
    })
  }

  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log(value);
        this.entityLugar.insertar(value);
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
  // Campos a validar Tipo Lugar
  get tipoLugarField(): any{
    return this.formEntity.get('idTipoLugar');
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
