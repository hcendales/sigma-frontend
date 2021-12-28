import { EntityTabEquipoService } from './../../../../core/services/entity-tab-equipo.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';


@Component({
  selector: 'app-insertar',
  templateUrl: './insertar.component.html',
  styleUrls: ['./insertar.component.scss']
})
export class InsertarComponent implements OnInit {
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Crear Equipo';
  public ready: boolean = false;
  public listas: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private entityEquipo: EntityTabEquipoService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    let NUMBERS_PATTERN = /^[0-9]*$/;
    this.formEntity = this.formBuilder.group({
      numeroInterno: ['',[Validators.required, Validators.maxLength(20)], this.validarNumeroInterno.bind(this)],
      placaInventario: ['',[Validators.required, Validators.maxLength(20)], this.validarPlacaInventario.bind(this)] ,
      placa: ['', [Validators.maxLength(20)]],
      movil: ['', [Validators.maxLength(10)]],
      idTipoClaseEquipo: [''],
      idTipoEquipo: ['', [Validators.required]],
      picoYPlaca: ['', [Validators.required]],
      idTipoOrigenEquipo: ['', [Validators.required]],
      plazoDiasMantenimiento: ['', [Validators.required, Validators.maxLength(10),Validators.pattern(NUMBERS_PATTERN)]],
      horasMantenimiento: ['', [Validators.required, Validators.maxLength(12),Validators.pattern(NUMBERS_PATTERN)]],
      kilometrosMantenimiento: ['', [Validators.required, Validators.maxLength(12),Validators.pattern(NUMBERS_PATTERN)]],
      fechaUltimoMantenimiento: ['', [Validators.required]],
      fechaSiguienteMantenimiento: [''],
      idTipoEstadoEquipo: ['', [Validators.required]],
      idTipoMarcaEquipo: ['', [Validators.required]],
      linea: ['',Validators.maxLength(30)],
      cilindraje: ['', [Validators.maxLength(12),Validators.pattern(NUMBERS_PATTERN)]],
      numeroMotor: ['',Validators.maxLength(20)],
      numeroChasis: ['',Validators.maxLength(20)],
      idTipoCombustible: [''],
      modelo: ['',[Validators.maxLength(5),Validators.pattern(NUMBERS_PATTERN)]],
      color: ['',Validators.maxLength(100)],
      idTipoArea: [''],
      fechaInicio: [''],
      fechaFin: [''],
      toneladas: ['',[Validators.maxLength(5),Validators.pattern(NUMBERS_PATTERN)]],
      pasajeros: ['',[Validators.maxLength(2),Validators.pattern(NUMBERS_PATTERN)]],
      numeroSerial: ['',Validators.maxLength(30)],
      referencia: ['', Validators.maxLength(30)],
      descripcion: ['',Validators.maxLength(50)],
      volumenM3: ['',Validators.maxLength(30)],
      idTipoUnidadUso: ['', Validators.required],
    }, { updateOn: 'blur'});
   }

  ngOnInit(): void {
    this.listasService.consultarListas([3481, 3485, 3480, 3483, 3484, 3482, 3, 3486,3489]).then((listas) => {this.listas = listas; this.ready = true;});
  }
  validarNumeroInterno(control: AbstractControl): any | null{
    // Verifica si se requiere validar campo numero Interno
    const condicion = "numero_interno='" + control.value + "'";
    // console.log('Condicion: ', condicion);
    return this.entityEquipo.list(condicion).then(resp =>{
      return resp.msgError===null ? { placaInternaExists: true} : null
    })
  }

  validarPlacaInventario(control: AbstractControl): any | null{
    // Verifica si se requiere validar campo placa inventario
    const condicion = "placa_inventario='" + control.value + "'";
    // console.log('Condicion: ', condicion);
    return this.entityEquipo.list(condicion).then(resp =>{
      return resp.msgError===null ? { placaInventarioExists: true} : null
    })
  }
  save(event: Event): void {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log(value);
        this.entityEquipo.insertar(value);
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
  cancel(event: Event): void {
    event.preventDefault();
    console.log('click');
  }

  returnlist(): void{
    this.router.navigate(['dashboard/administracion-equipos/listar']);
  }

  operationSuccess(): void{

    this.snackBar.open('Cambios realizados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  handleError(error?: any){
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

  mostrarVentanaEnEspera(titulo: string, footer?: string): any{
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
  get numeroInternoField(): any{
    return this.formEntity.get('numeroInterno');
  }

  get placaInventarioField(): any{
    return this.formEntity.get('placaInventario');
  }

  get placaField(): any{
    return this.formEntity.get('placa');
  }

  get movilField(): any{
    return this.formEntity.get('movil');
  }

  get picoYPlacaField(): any{
    return this.formEntity.get('picoYPlaca');
  }
  get tipoField(): any{
    return this.formEntity.get('idTipoEquipo');
  }

  get tipoOrigenField(): any{
    return this.formEntity.get('idTipoOrigenEquipo');
  }

  get diasMantenimientoField(): any{
    return this.formEntity.get('plazoDiasMantenimiento');
  }

  get horasMantenimientoField(): any{
    return this.formEntity.get('horasMantenimiento');
  }

  get KmMantenimientoField(): any{
    return this.formEntity.get('kilometrosMantenimiento');
  }
  get fechaUltimoMantenimientoField(): any{
    return this.formEntity.get('kilometrosMantenimiento');
  }
  get tipoEstadoField(): any{
    return this.formEntity.get('idTipoEstadoEquipo');
  }

  get tipoMarcaField(): any{
    return this.formEntity.get('idTipoMarcaEquipo');
  }

  get lineaField(): any{
    return this.formEntity.get('linea');
  }

  get cilindrajeField(): any{
    return this.formEntity.get('cilindraje');
  }

  get numeroMotorField(): any{
    return this.formEntity.get('numeroMotor');
  }

  get numeroChasisField(): any{
    return this.formEntity.get('numeroChasis');
  }

  get modeloField(): any{
    return this.formEntity.get('modelo');
  }

  get colorField(): any{
    return this.formEntity.get('color');
  }
  get toneladasField(): any{
    return this.formEntity.get('toneladas');
  }

  get pasajerosField(): any{
    return this.formEntity.get('pasajeros');
  }

  get numeroSerialField(): any{
    return this.formEntity.get('numeroSerial');
  }


  get referenciaField(): any{
    return this.formEntity.get('referencia');
  }

  get descripcionField(): any{
    return this.formEntity.get('descripcion');
  }

  get volumenM3Field(): any{
    return this.formEntity.get('volumenM3');
  }

  get tipoUnidadUsoField(): any{
    return this.formEntity.get('idTipoUnidadUso');
  }

}
