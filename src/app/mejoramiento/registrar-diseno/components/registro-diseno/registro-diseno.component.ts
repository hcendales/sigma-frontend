import { Component, OnInit, ViewChildren, ViewChild, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';

import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { MantenimientoVialEventoService } from '../../../../core/services/mantenimiento-vial-evento.service';
import { EntityTabApiqueService } from '../../../../core/services/entity-tab-apique.service';
import { EntityTabAlternativaService } from 'src/app/core/services/entity-tab-alternativa.service';
import { DatePipe } from '@angular/common';

import { RegistroAlternativaComponent } from '../registro-alternativa/registro-alternativa.component';
import { RegistroInsumosComponent } from '../registro-insumos/registro-insumos.component';
import { EntityTabArchivoServiceService } from '../../../../core/services/entity-tab-archivo-service.service';
import { VerOtroFactorComponent } from '../ver-otro-factor/ver-otro-factor.component';
import { VerFotosComponent } from '../ver-fotos/ver-fotos.component';
import { VerFallasComponent } from '../ver-fallas/ver-fallas.component';


@Component({
  selector: 'app-registro-diseno',
  templateUrl: './registro-diseno.component.html',
  styleUrls: ['./registro-diseno.component.scss'],
  providers: [
    DatePipe,
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
  ]
})
export class RegistroDisenoComponent implements OnInit {

  public idGestion:number = 0;
  public listas:any;
  public ready:boolean = false;
  public mantenimientoVialEvento:any;
  public apiques: any[] = [];
  public displayedColumnsApiques: string[] = ['nomenclatura', 'observacion'];
  public step = 0;
  public encabezadoFormGroup: FormGroup;

  public firstFormEntity: FormGroup;
  public secondFormEntity: FormGroup;
  public alternativaDisenio: any[] = [];
  public documentosMantenimiento:any[] = [];

  public guardadoTodo = false;

  isEditable = true;

  @Input() idDocumento:number = 0;
  @Input() idMantenimientoVialEvento: number = 0;
  @Input() idTiposArchivos: number = 0;
  public idActividad = 0;
  public titulo = '';
  public verRegistro: boolean = false;
  public verActualizar: boolean = false;


  constructor(
    private activatedroute:ActivatedRoute,
    private router:Router,
    private listasService: ConsultaListasService,
    public dialog: MatDialog,
    private snackBar:MatSnackBar,
    private formBuilder: FormBuilder,
    private mantenimientoVialEventoService: MantenimientoVialEventoService,
    private entityTabApiqueService: EntityTabApiqueService,
    private entityTabAlternativaService: EntityTabAlternativaService,
    private datePipe: DatePipe,
    private tabArchivoService:EntityTabArchivoServiceService,
  ) {

    let NUMBERS_PATTERN = /^[0-9]*$/;
    let DECIMAL_PATTERN = /^[0-9]+([.][0-9]+)*$/;
    // Forma de encabezado
    this.encabezadoFormGroup = this.formBuilder.group({
      id_localidad: [{value: '', disabled: true}],
        id_upz: [{value: '', disabled: true}],
        id_barrio: [{value: '', disabled: true}],
        civ: [{value: '', disabled: true}],
        pk_id_calzada: [{value: '', disabled: true}],
        eje_vial: [{value: '', disabled: true}],
        desde: [{value: '', disabled: true}],
        hasta: [{value: '', disabled: true}],
        id_zona: [{value: '', disabled: true}],
        fecha_visita_tecnica: [{value: '', disabled: true}],
        id_tipo_seccion_vial: [{value: '', disabled: true}],
        solicitud_fecha: [{value: '', disabled: true}],
        solicitud_nombre: [{value: '', disabled: true}],
        id_tipo_uso_via: [{value: '', disabled: true}],
        id_tipo_malla: [{value: '', disabled: true}],
        rutas_transporte: [{value: '', disabled: true}],
        id_tipo_transitabilidad: [{value: '', disabled: true}],
        area_pk: [{value: '', disabled: true}],
        ancho_pk: [{value: '', disabled: true}],
        id_tipo_programa: [{value: '', disabled: true}],
        id_tipo_superficie: [{value: '', disabled: true}],
        id_tipo_intervencion_total: ['']
      });

    this.firstFormEntity = this.formBuilder.group({
        id_tipo_clasificacion_subrasant: ['',[Validators.required, Validators.maxLength(20)]],
        nee_disenio: ['',[Validators.required, Validators.maxLength(20), Validators.min(50000), Validators.pattern(NUMBERS_PATTERN)]],
        cbr_disenio_pct: ['',[Validators.required, Validators.maxLength(5), Validators.min(0), Validators.max(100), Validators.pattern(DECIMAL_PATTERN)]],
        tpdvc_disenio: ['',[Validators.maxLength(20), Validators.min(1), Validators.pattern(NUMBERS_PATTERN)]],
        ks_disenio: ['',[Validators.maxLength(6), Validators.min(0), Validators.max(250), Validators.pattern(DECIMAL_PATTERN)]],
        numero_estructural_efectivo_disenio: ['',[Validators.maxLength(5), Validators.min(0), Validators.max(20), Validators.pattern(DECIMAL_PATTERN)]],
      },{ updateOn: 'blur'});

    this.secondFormEntity = this.formBuilder.group({
      fotos: this.formBuilder.array([], [this.minLengthArray(2), this.maxLengthArray(6)]),
    })
   }

   async ngOnInit(){
     this.activatedroute.queryParams.subscribe(async params =>{
      this.idDocumento = params['idDocumento'];
      this.idGestion = params['idGestion'];
      this.idActividad = params['idActividad'];
      console.log('idActividad', this.idActividad);
      if(this.idActividad==25){
        this.titulo = 'Actualizar Diseño';
        this.verActualizar = true;
      }else{
        this.titulo = 'Registrar Diseño';
        this.verRegistro = true;
      }
    });

    this.activatedroute.paramMap.subscribe(params => {
      this.idMantenimientoVialEvento =  Number(params.get('idEvento'));

      try{
        this.getMantenimientoVialEvento(this.idMantenimientoVialEvento).then(() =>{
          this.listasService.consultarListas([48,42,20,29,19,109]).then((listas) => {this.listas = listas; this.ready = true;});
        });

      }catch(error){
        this.handleError(error);
      }
    });
  }

  gestionRealizada(){
    this.router.navigate(["dashboard/lista-pendientes/" + this.idActividad]);
  }

  accionGestion(e:any){
    if(e.action == 'cancel'){
      this.guardadoTodo = false;
    }
  }

  minLengthArray = (min: number) => {
    return (c: AbstractControl): {[key: string]: any} => {
      return (c.value.length >= min)?null as any:{ MinLengthArray: true}
    }
  }

  maxLengthArray = (max: number) => {
    return (c: AbstractControl): {[key: string]: any} => {
      return (c.value.length <= max)?null as any:{ MaxLengthArray: true}
    }
  }

  async getDocumentos(idDocumento:number){

    let res:any = await this.tabArchivoService.get(idDocumento);
    if(res.codError != 0){
      throw res;
    }else{
      let ListaArchivos = res.respuesta;
      for(let archivo of ListaArchivos){
        let objArchivo = {idArchivo:archivo.id_archivo,url:''+archivo.url_archivo,fileInfo:null};
        this.documentosMantenimiento.push(objArchivo);
        let form = this.formBuilder.group(this.getFormDocumento());
        form.patchValue(objArchivo);
        this.DocumentosForm.push(form);
      }
    }
  }
  get DocumentosForm() {
    return this.secondFormEntity.get('documentos') as FormArray;
  }
  getFormDocumento(){
    let formFoto:any = {
      idArchivo:['',[]],
      url: ['',Validators.required],
      fileInfo :['',[]]
    };
    return formFoto;
  }

  //Para el encabezado

  onAction1(){}

  saveEvento(event: Event): void {
    event.preventDefault();
    console.log('Valida', this.encabezadoFormGroup.valid);
    if (this.encabezadoFormGroup.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.encabezadoFormGroup.value;
        console.log(value);
        // Generar información para actualizar
        let strClaves = '';
        let strValues = '';
        // Arma los nombres de campos y valores respectivos segun los campos de la forma
        for(let clave in value){
          strClaves += clave + ';';
          strValues += value[clave] + ';';
        console.log('Key',value[clave]);
        }
        this.mantenimientoVialEventoService.actualizarCampo(this.idMantenimientoVialEvento, strClaves, strValues);
        dialogRef.close();
        this.operationSuccess();
        // this.formEntity.reset();
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
    }else {
      this.firstFormEntity.markAllAsTouched();
    }
  }

  save(event: Event): void {
    event.preventDefault();
    console.log('Valida', this.firstFormEntity.valid);
    if (this.firstFormEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.firstFormEntity.value;
        // console.log(value);
        // Generar información para actualizar
        let strClaves = '';
        let strValues = '';
        // Arma los nombres de campos y valores respectivos segun los campos de la forma
        for(let clave in value){
          strClaves += clave + ';';
          strValues += value[clave] + ';';
          // console.log('Key',value[clave]);
        }
        this.mantenimientoVialEventoService.actualizarCampo(this.idMantenimientoVialEvento, strClaves, strValues);
        dialogRef.close();
        this.operationSuccess();
        // this.formEntity.reset();
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
    }else {
      this.firstFormEntity.markAllAsTouched();
    }
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


  async getMantenimientoVialEvento(idMantenimientoVialEvento:number){
    let respServ = await this.mantenimientoVialEventoService.get(idMantenimientoVialEvento);
    this.mantenimientoVialEvento = respServ.respuesta[0];
    console.log('elEvento aqui', this.mantenimientoVialEvento);

    // this.mantenimientoVialEvento['id_mantenimiento_vial_evento'] = idMantenimientoVialEvento;
    this.encabezadoFormGroup.controls.id_localidad.setValue(this.mantenimientoVialEvento.id_localidad);
    this.encabezadoFormGroup.controls.id_upz.setValue(this.mantenimientoVialEvento.id_upz);
    this.encabezadoFormGroup.controls.id_barrio.setValue(this.mantenimientoVialEvento.id_barrio);
    this.encabezadoFormGroup.controls.civ.setValue(this.mantenimientoVialEvento.civ);
    this.encabezadoFormGroup.controls.pk_id_calzada.setValue(this.mantenimientoVialEvento.pk_id_calzada);
    this.encabezadoFormGroup.controls.eje_vial.setValue(this.mantenimientoVialEvento.eje_vial);
    this.encabezadoFormGroup.controls.desde.setValue(this.mantenimientoVialEvento.desde);
    this.encabezadoFormGroup.controls.hasta.setValue(this.mantenimientoVialEvento.hasta);
    this.encabezadoFormGroup.controls.id_zona.setValue(this.mantenimientoVialEvento.id_zona);
    this.encabezadoFormGroup.controls.id_tipo_seccion_vial.setValue(this.mantenimientoVialEvento.id_tipo_seccion_vial);
    this.encabezadoFormGroup.controls.solicitud_fecha.setValue(this.mantenimientoVialEvento.solicitud_fecha);
    this.encabezadoFormGroup.controls.id_tipo_uso_via.setValue(this.mantenimientoVialEvento.id_tipo_uso_via);
    this.encabezadoFormGroup.controls.id_tipo_malla.setValue(this.mantenimientoVialEvento.id_tipo_malla);
    this.encabezadoFormGroup.controls.rutas_transporte.setValue(this.mantenimientoVialEvento.rutas_transporte);
    this.encabezadoFormGroup.controls.id_tipo_transitabilidad.setValue(this.mantenimientoVialEvento.id_tipo_transitabilidad);
    this.encabezadoFormGroup.controls.area_pk.setValue(this.mantenimientoVialEvento.area_pk);
    this.encabezadoFormGroup.controls.ancho_pk.setValue(this.mantenimientoVialEvento.ancho_pk);
    this.encabezadoFormGroup.controls.id_tipo_programa.setValue(this.mantenimientoVialEvento.id_tipo_programa);
    this.encabezadoFormGroup.controls.id_tipo_superficie.setValue(this.mantenimientoVialEvento.id_tipo_superficie);
    this.encabezadoFormGroup.controls.id_tipo_intervencion_total.setValue(this.mantenimientoVialEvento.id_tipo_intervencion_total);

    this.encabezadoFormGroup.get('fecha_visita_tecnica')?.setValue(this.datePipe.transform(this.mantenimientoVialEvento?.fecha_visita_tecnica,'dd/MM/yyyy'));
    this.encabezadoFormGroup.get('solicitud_fecha')?.setValue(this.datePipe.transform(this.mantenimientoVialEvento?.solicitud_fecha,'dd/MM/yyyy'));

    this.firstFormEntity.controls.id_tipo_clasificacion_subrasant.setValue(this.mantenimientoVialEvento.id_tipo_clasificacion_subrasant);
    this.firstFormEntity.controls.nee_disenio.setValue(this.mantenimientoVialEvento.nee_disenio);
    this.firstFormEntity.controls.cbr_disenio_pct.setValue(this.mantenimientoVialEvento.cbr_disenio_pct);
    this.firstFormEntity.controls.tpdvc_disenio.setValue(this.mantenimientoVialEvento.tpdvc_disenio);
    this.firstFormEntity.controls.ks_disenio.setValue(this.mantenimientoVialEvento.ks_disenio);
    this.firstFormEntity.controls.numero_estructural_efectivo_disenio.setValue(this.mantenimientoVialEvento.numero_estructural_efectivo_disenio);
    // this.encabezadoFormGroup.updateValueAndValidity();
    return;
  }

  setStep(index: number) {
    this.step = index;
  }
  nextStep(){
    this.step++;
  }
  prevStep(){
    this.step--;
  }

  get tipoClasificacionSubrasantField():any{
    return this.firstFormEntity.get('id_tipo_clasificacion_subrasant');
  }
  get neeDisenioField(): any{
    return this.firstFormEntity.get('nee_disenio');
  }
  get cbrDisenioPctField(): any{
    return this.firstFormEntity.get('cbr_disenio_pct');
  }
  get tpdvcDisenioField(): any{
    return this.firstFormEntity.get('tpdvc_disenio');
  }
  get KsDisenioField(): any{
    return this.firstFormEntity.get('ks_disenio');
  }
  get numeroEstructuralEfectivoField(): any{
    return this.firstFormEntity.get('numero_estructural_efectivo_disenio');
  }
}
