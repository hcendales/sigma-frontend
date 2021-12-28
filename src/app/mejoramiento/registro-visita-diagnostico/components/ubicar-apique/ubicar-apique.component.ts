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
import { EntityTabAledanioService } from '../../../../core/services/entity-tab-aledanio.service';


@Component({
  selector: 'app-ubicar-apique',
  templateUrl: './ubicar-apique.component.html',
  styleUrls: ['./ubicar-apique.component.scss']
})
export class UbicarApiqueComponent implements OnInit {
  public formEntity: FormGroup;
  public titulo = 'Ubicar Apique';
  public idMantenimientoVialEvento: any;
  public varApiqueValor: string = '';
  public idPKCalzada: number = 0;
  public tituloCampo: string = 'Nomenclatura';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {idMantenimientoVialEvento: string,
      apiqueValor: string, idPkCalzada: number},
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private entityTabApiqueService: EntityTabApiqueService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private mantenimientoVialEventoService: MantenimientoVialEventoService,
    private entityTabAledanioService:EntityTabAledanioService
    ) {
      this.formEntity = this.formBuilder.group({
        idMantenimientoVialEvento: [''],
        nomenclatura: ['',Validators.required],
        observacion: ['', Validators.maxLength(100)]
     }, { updateOn: 'blur'});
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
      return this.entityTabApiqueService.list(condicion).then(resp =>{
        return resp.msgError===null ? { nomenclaturaIgual: true}: null
      })
    }

  ngOnInit(): void {
    if(!this.data.idMantenimientoVialEvento){
      console.error('No hay id de mantenimiento definido');
    }
    console.log('id', this.data.idMantenimientoVialEvento);
    this.formEntity.controls['idMantenimientoVialEvento'].setValue(this.data.idMantenimientoVialEvento);
    if(this.data.apiqueValor === 'AL'){
      this.tituloCampo = 'PK ID';
      this.formEntity.controls['nomenclatura'].setAsyncValidators([
        this.validarPkId.bind(this), this.validarApique.bind(this)]);
    }else{
      this.formEntity.controls['nomenclatura'].setAsyncValidators(this.validarApique.bind(this));
    }

    

    
  }
  // tslint:disable-next-line: typedef
 async save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log('Insertar ',value);
        await this.entityTabApiqueService.insertar(value);
        this.formEntity.reset();
        this.operationSuccess();
        dialogRef.close();
        this.dialog.closeAll();
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
    }else {
      this.formEntity.markAllAsTouched();
    }
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

  mostrarVentanaEnEspera(titulo:string, footer?:string){
    const data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }

  //
  onNoClick(): void {
    //this.dialogRef.close();
  }
   // Campo a validar Nomenclaruta
   get nomenclaturaField(): any{
    return this.formEntity.get('nomenclatura');
  }
   // Campo a validar observacion
   get observacionField(): any{
    return this.formEntity.get('observacion');
  }

}
