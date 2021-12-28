import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';
import { EntityTabEquipoService } from './../../../../core/services/entity-tab-equipo.service';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss']
})
export class ActualizarComponent implements OnInit {
  entity: any = null;
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Actualizar Equipo';
  // Variable de validación
  public ready: boolean = false;
  public guardadoTodo: boolean = false;
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
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation?.extras?.state;
    this.formEntity = this.formBuilder.group({
      idEquipo: [''],
      numeroInterno: [''],
      placaInventario: [''],
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
      descripcion: ['',Validators.maxLength(100)],
      volumenM3: ['',Validators.maxLength(30)],
      idTipoUnidadUso: ['', Validators.required],
    }, { updateOn: 'blur'});
  }

  ngOnInit(): void {
    if (typeof this.entity === 'undefined'){
      // Redirigir
      this.router.navigate(['dashboard/administracion-equipos/listar']);
    }else{
      this.formEntity.controls.idEquipo.setValue(this.entity.id_equipo);
      this.formEntity.controls.numeroInterno.setValue(this.entity.numero_interno);
      this.formEntity.controls.placaInventario.setValue(this.entity.placa_inventario);
      this.formEntity.controls.placa.setValue(this.entity.placa);
      this.formEntity.controls.movil.setValue(this.entity.movil);
      this.formEntity.controls.idTipoClaseEquipo.setValue(this.entity.id_tipo_clase_equipo);
      this.formEntity.controls.idTipoEquipo.setValue(this.entity.id_tipo_equipo);
      this.formEntity.controls.picoYPlaca.setValue(this.entity.pico_y_placa);
      this.formEntity.controls.idTipoOrigenEquipo.setValue(this.entity.id_tipo_origen_equipo);
      this.formEntity.controls.plazoDiasMantenimiento.setValue(this.entity.plazo_dias_mantenimiento);
      this.formEntity.controls.horasMantenimiento.setValue(this.entity.horas_mantenimiento);
      this.formEntity.controls.kilometrosMantenimiento.setValue(this.entity.kilometros_mantenimiento);
      let fechault = new Date(this.entity.fecha_ultimo_mantenimiento).toISOString().slice(0, 22);
      // console.log('Fecha ', fechault.toString());
      this.formEntity.controls.fechaUltimoMantenimiento.setValue(fechault.toString());
      if(this.entity.fecha_siguiente_mantenimiento !== null){
        let fechasig = new Date(this.entity.fecha_siguiente_mantenimiento).toISOString().slice(0, 22);
        this.formEntity.controls.fechaSiguienteMantenimiento.setValue(fechasig.toString());
      }
      this.formEntity.controls.idTipoEstadoEquipo.setValue(this.entity.id_tipo_estado_equipo);
      this.formEntity.controls.idTipoMarcaEquipo.setValue(this.entity.id_tipo_marca_equipo);
      this.formEntity.controls.numeroMotor.setValue(this.entity.numero_motor);
      this.formEntity.controls.numeroChasis.setValue(this.entity.numero_chasis);
      this.formEntity.controls.idTipoCombustible.setValue(this.entity.id_tipo_combustible);
      this.formEntity.controls.modelo.setValue(this.entity.modelo);
      this.formEntity.controls.linea.setValue(this.entity.linea);
      this.formEntity.controls.color.setValue(this.entity.color);
      this.formEntity.controls.idTipoArea.setValue(this.entity.id_tipo_area);

      if(this.entity.fecha_inicio !== null) {
        let fechaini = new Date(this.entity.fecha_inicio).toISOString().slice(0, 22);
        this.formEntity.controls.fechaInicio.setValue(fechaini.toString());
      }

      if(this.entity.fecha_fin !== null){
        let fechafin = new Date(this.entity.fecha_fin).toISOString().slice(0, 22);
        this.formEntity.controls.fechaFin.setValue(fechafin.toString());
      }
      this.formEntity.controls.toneladas.setValue(this.entity.toneladas);
      this.formEntity.controls.pasajeros.setValue(this.entity.pasajeros);
      this.formEntity.controls.numeroSerial.setValue(this.entity.numero_serial);
      this.formEntity.controls.referencia.setValue(this.entity.referencia);
      this.formEntity.controls.descripcion.setValue(this.entity.descripcion);
      this.formEntity.controls.volumenM3.setValue(this.entity.volumen_m3);
      this.formEntity.controls.cilindraje.setValue(this.entity.cilindraje);
      this.formEntity.controls.idTipoUnidadUso.setValue(this.entity.id_tipo_unidad_uso);
      this.listasService.consultarListas([3481, 3485, 3480, 3483, 3484, 3482, 3, 3486, 3489]).then((listas) => {this.listas = listas; this.ready = true;});
    }
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

  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        console.log(value);
        this.entityEquipo.actualizar(value);
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
    this.router.navigate(['dashboard/administracion-equipos/listar']);
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
