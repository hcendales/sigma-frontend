import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, AsyncValidatorFn, ValidationErrors  } from '@angular/forms';
import { EntityTabApiqueService } from 'src/app/core/services/entity-tab-apique.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { MantenimientoVialEventoService } from '../../../../core/services/mantenimiento-vial-evento.service';



@Component({
  selector: 'app-actualizar-apiques',
  templateUrl: './actualizar-apiques.component.html',
  styleUrls: ['./actualizar-apiques.component.scss']
})
export class ActualizarApiquesComponent implements OnInit {
  entity: any = null;
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Actualizar Apique';
  // Variable de validación
  public ready: boolean = false;
  public guardadoTodo: boolean = false;
  public listas: any;
  public tituloCampo: string = 'Nomenclatura';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      idPredisenioApique: number,
      idMantenimientoVialEvento: number,
      nomenclatura: string, observacion: string,
      requiereApiques: string},
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private entityApique: EntityTabApiqueService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private mantenimientoVialEventoService: MantenimientoVialEventoService,
  ) {

    this.formEntity = this.formBuilder.group({
      idPredisenioApique: [''],
      idMantenimientoVialEvento: [''],
      nomenclatura: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    },{ updateOn: 'blur'});
  }

  ngOnInit(): void {
    if(!this.data.idPredisenioApique){
      console.error('No hay id de mantenimiento definido');
    }
    else{
      this.formEntity.controls.idPredisenioApique.setValue(this.data.idPredisenioApique);
      this.formEntity.controls.idMantenimientoVialEvento.setValue(this.data.idMantenimientoVialEvento);
      this.formEntity.controls.nomenclatura.setValue(this.data.nomenclatura);
      this.formEntity.controls.observacion.setValue(this.data.observacion);
      console.log("Apiques ", this.data.requiereApiques);
      if(this.data.requiereApiques === 'AL'){
        this.tituloCampo = 'PK ID';
      }
    }
  }
  validarPkId(control: AbstractControl): any | null{
    // Verifica si se requiere validar campo PK ID | Nomenclarura
    const condicion = "pk_id_calzada=" + control.value;
    // Validacion cuando digita un PK
    return this.mantenimientoVialEventoService.list(condicion).then(resp =>{
      return resp.msgError===null ? null: { nomenclaturaExists: true}
    })
  }

  validarApique(control: AbstractControl): any | null{
    // Verifica que no se ingrese un valor ya ingresado PK ID | Nomenclatura
    let condicion = "id_mantenimiento_vial_evento=" + this.data.idMantenimientoVialEvento;
    condicion += " AND nomenclatura='" + control.value + "'";
    console.log('Condicion', condicion);
    return this.entityApique.list(condicion).then(resp =>{
      return resp.msgError===null ? { nomenclaturaIgual: true}: null
    })
  }
  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log(value);
        this.entityApique.actualizar(value);
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
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }
    // Campos a validar Tipo Lugar
    get nomenclaturaField(): any{
      return this.formEntity.get('nomenclatura');
    }
  // Campo a validar Tipo Origen
  get observacionField(): any{
    return this.formEntity.get('observacion');
  }

}
