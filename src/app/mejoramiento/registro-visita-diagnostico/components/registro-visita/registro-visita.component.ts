import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import { FormBuilder, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { forkJoin } from 'rxjs';

import { RegistroUnidadMuestreoComponent } from '../registro-unidad-muestreo/registro-unidad-muestreo.component';
import { RegistroFallasComponent } from '../registro-fallas/registro-fallas.component';
import { RegistroFotoComponent } from '../registro-foto/registro-foto.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { EntityTabMantenimientoVialService } from '../../../../core/services/entity-tab-mantenimiento-vial.service';
import { EntityTabUnidadMuestreoService } from '../../../../core/services/entity-tab-unidad-muestreo-service';
import { EntityTabFallasServiceService } from '../../../../core/services/entity-tab-fallas-service.service';
import { EntityTabArchivoServiceService } from '../../../../core/services/entity-tab-archivo-service.service';
import { FormUnidadesMuestreoGeneradorService } from '../../services/form-unidades-muestreo-generador.service';
import { FormFallasGeneradorService } from '../../services/form-fallas-generador.service';

import { DatePipe } from '@angular/common';
import { RegistroOtrosFactoresComponent } from '../registro-otros-factores/registro-otros-factores.component';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { UnidadMuestreo } from '../../../../core/models/unidad-muestreo';
import { Falla } from '../../../../core/models/falla';
import { MantenimientoVial } from '../../../../core/models/mantenimiento-vial';
import { Archivo } from '../../../../core/models/archivo';
import { EntityTabOtrosFactoresServiceService } from '../../../../core/services/entity-tab-otros-factores-service.service';
import { OtroFactor } from '../../../../core/models/otro-factor';
import { UtilitariosService } from '../../../../core/services/utilitarios.service';
import { MantenimientoVialEventoService } from '../../../../core/services/mantenimiento-vial-evento.service';
import { SecurityService } from '../../../../core/security/services/security.service';
import { EntityTabPersonaService } from '../../../../core/services/entity-tab-persona.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-registro-visita',
  templateUrl: './registro-visita.component.html',
  styleUrls: ['./registro-visita.component.scss'],
  providers: [ DatePipe ]
})
export class RegistroVisitaComponent implements OnInit {

  public mantenimientoVialEvento:any;
  public idDocumento: any;
  public unidadesMantenimiento:UnidadMuestreo[] = [];
  public fallasMantenimiento:Falla[] = [];
  public fotosMantenimiento:any[] = [];
  public otrosFactoresMantenimiento:any[] = [];

  public pipedData:any;

  public formDiagnostico:FormGroup;
  //listas para llenar los checkbox
  public listas:any;


  public ready:boolean = false;

  //indicador de sección abierta del formulario
  public step = 0;

  public conUnidadesMuestreo = true;
  public conFallas = true;

  public URL_FOTOS = environment.URL_FOTOS;

  public ID_ACTIVIDAD_PREDISENIO = 13;
  public ID_ACTUALIZAR_PREDISENIO = 25;

  //despliega
  public formfotoTemporal = false;

  public idGestion:number = 0;

  public guardadoTodo = false;

  public idActividad = 0;

  public idMantenimientoVialEvento = 0;
  public idMantenimientoVial:number = 0;

  public titulo:string = '';

  @ViewChildren('inputFoto') inputsFotos:any;

  @ViewChild('inputFotoTemp') inputFotoTemp:any;

  @ViewChild('RegApiques') regApiques:any;
  public apiquesSaved = false;

  private idPersonaReg:any = {} as any;

  public tipoElemento:string = "calzada";
  public esEspacioPublico:boolean = false;
  public ElementosEspacioPublico:string[] = ["anden","alameda","pompeyano","plaza","separador"];

  public tiposIntervencionTotal:any[] = [];
  

  constructor(private activatedroute:ActivatedRoute,
              private router:Router,
              private fb: FormBuilder,
              private listasService: ConsultaListasService,
              private tabMantenimientoService:EntityTabMantenimientoVialService,
              private tabUnidadMuestreoService:EntityTabUnidadMuestreoService,
              private formUnidadesMuestreoService:FormUnidadesMuestreoGeneradorService,
              private tabFallasService:EntityTabFallasServiceService,
              private formFallasService:FormFallasGeneradorService,
              private tabArchivoService:EntityTabArchivoServiceService,
              private tabOtroFactorService:EntityTabOtrosFactoresServiceService,
              private datePipe: DatePipe,
              public dialog: MatDialog,
              private snackBar:MatSnackBar,
              private utilitariosService:UtilitariosService,
              private mantenimientoVialEventoService:MantenimientoVialEventoService,
              private securityService:SecurityService,
              private entityTabPersonaService:EntityTabPersonaService) {

    this.formDiagnostico = this.fb.group({
      encabezado: this.fb.group({
        id_localidad: [''],
        id_upz: [''],
        id_barrio: [''],
        civ: [''],
        pk_id_calzada: [''],
        eje_vial: [''],
        desde: [''],
        hasta: [''],
        id_zona: [''],
        fecha_visita_tecnica: [''],
        id_tipo_seccion_vial: [''],
        solicitud_fecha: [''],
        solicitud_nombre: [''],
        descripcion_origen: [''],
        id_tipo_uso_via: ['',Validators.required],
        id_tipo_malla: [''],
        rutas_transporte: ['',Validators.required],
        id_tipo_transitabilidad: ['',Validators.required],
        area_pk: [''],
        ancho_pk: [''],
        id_tipo_programa: [''],
        id_tipo_superficie: ['',Validators.required],
        id_tipo_intervencion_total: ['']
      }),
      unidadesMuestreo: this.fb.array([], [Validators.required]),
      fallas: this.fb.array([], []),
      fotos: this.fb.array([], [this.minLengthArray(2), this.maxLengthArray(6)]),
      otrosFactores: this.fb.array([], []),
      observaciones:['']
    });
  }

  get encabezadoForm() {
    return this.formDiagnostico.get('encabezado') as FormGroup;
  }

  get unidadesMuestreoForm() {
    return this.formDiagnostico.get('unidadesMuestreo') as FormArray;
  }

  get fallasForm() {
    return this.formDiagnostico.get('fallas') as FormArray;
  }

  get fotosForm() {
    return this.formDiagnostico.get('fotos') as FormArray;
  }

  get otrosFactoresForm() {
    return this.formDiagnostico.get('otrosFactores') as FormArray;
  }

  get observacionesForm(){
    return this.formDiagnostico.get('observaciones') as FormControl;
  }

   async ngOnInit() {

    this.activatedroute.queryParams.subscribe(params =>{
      this.idDocumento = params['idDocumento'];
      this.idGestion = params['idGestion'];
      this.idActividad = params['idActividad'];
      this.idMantenimientoVial = Number(params['idMantenimiento']);
      if(this.idActividad == 3){
        this.titulo = "Registrar Visita de diagnóstico";
      }else if (this.idActividad == 8){
        this.titulo = "Actualizar Visita de diagnóstico";
      }else if (this.idActividad == this.ID_ACTIVIDAD_PREDISENIO){
        this.titulo = "Registrar visita de Prediseño";
      }else if (this.idActividad == 25){
        this.titulo = "Actualizar visita de Prediseño";
      }else if ( this.idActividad == 43){
        this.titulo = 'Registro diagnóstico alcaldías';
      }else if ( this.idActividad == 1560){
        this.titulo = 'Actualizar visita de diseño';
      }  
      }
    );

    let respPersona = await this.entityTabPersonaService.list('ID_USUARIO = '+this.securityService.userSession.idUsuario);
    if(respPersona.respuesta.length == 0){
      this.handleError({msjError:"El usuario no esta asociado a una persona, favor contactar al servicio técnico"});
      return;
    }

    this.idPersonaReg = respPersona.respuesta[0];



    this.activatedroute.paramMap.subscribe(params => {
      this.idMantenimientoVialEvento =  Number(params.get('idEvento'));

      try{
        this.getMantenimientoVialEvento(this.idMantenimientoVialEvento).then(() =>{

          
          
          let operaciones = [this.listasService.consultarListas([9,11,19,20,24,29,42,48]),
                         this.getUnidadesYFallas(this.idMantenimientoVialEvento),
                         this.getOtrosFactores(this.idMantenimientoVialEvento),
                         this.utilitariosService.calculadoMantenimientoVial(this.idMantenimientoVialEvento)];
            if(this.idDocumento){
              operaciones.push(this.getFotos(this.idDocumento));
            }else{
              console.error('No hay un documento asociado a la captura');
            }
            forkJoin(operaciones).subscribe((lista) => {
              
              this.listas = lista[0];
              console.log('las superficies', this.listas[42]);

              if(lista[3].codError == 0 && lista[3].respuesta.length > 0){
                this.tipoElemento = lista[3].respuesta[0].tipo_elemento;
                
                if(this.tipoElemento && this.ElementosEspacioPublico.find((x:string)=> x == this.tipoElemento.toLowerCase())){
                  console.log('ES ESPACIO PUBLICO');
                  this.esEspacioPublico = true;
                  //pone los campos usa via como peatonal y rutas de transporte como NO y los bloquea
                  this.encabezadoForm.get('id_tipo_uso_via')?.setValue(572);
                  this.encabezadoForm.get('id_tipo_uso_via')?.disable();
                  this.encabezadoForm.get('rutas_transporte')?.setValue("NO");
                  this.encabezadoForm.get('rutas_transporte')?.disable();
                  //cambia los tipos de intervenci[on total
                  let tiposIntervEspacioPublico = ['MRE','MPE','RH','RC','BE','SI'];
                  this.tiposIntervencionTotal = this.listas[48].filter((x:any) => {return tiposIntervEspacioPublico.find((y:any) => {return x.valor == y})});

                }else{
                  console.log('NO ES ESPACIO PUBLICO');
                }
              }
              
              
              this.listas = lista[0];
              this.tiposIntervencionTotal = this.listas[48];

              this.ready = true;
            });
        });

      }catch(error){
        this.handleError(error);
      }
    });

    this.encabezadoForm.markAllAsTouched();
    /*
      ids listas
      9: Tipo Falla
      11: Tipo Otro Factor
      19:Uso de la via
      20:Programa
      24:Tipo Severidad
      29:Transitabilidad
      42:Superficie
      48:Intervención total
    */
  }

  async getMantenimientoVialEvento(idMantenimientoVialEvento:number){
    let respServ = await this.mantenimientoVialEventoService.get(idMantenimientoVialEvento);
    this.mantenimientoVialEvento = respServ.respuesta[0];
    console.log(this.mantenimientoVialEvento);
    //this.mantenimientoVialEvento = await this.tabMantenimientoService.get(idMantenimientoVialEvento);
    console.log('elEvento', this.mantenimientoVialEvento);
    this.mantenimientoVialEvento['id_mantenimiento_vial_evento'] = idMantenimientoVialEvento;

    this.encabezadoForm.patchValue(this.mantenimientoVialEvento);
    this.observacionesForm.setValue(this.mantenimientoVialEvento.observaciones_diagnostico);
    this.encabezadoForm.get('solicitud_fecha')?.setValue(this.datePipe.transform(this.mantenimientoVialEvento?.solicitud_fecha,'dd/MM/yyyy'))
    this.encabezadoForm.updateValueAndValidity();

    this.conUnidadesMuestreo = this.formUnidadesMuestreoService.aplicaUnidadesMuestreo(this.encabezadoForm.get('id_tipo_superficie')?.value,this.esEspacioPublico,this.encabezadoForm.get('id_tipo_programa')?.value);
    this.conFallas = this.formFallasService.aplicaFallas(this.encabezadoForm.get('id_tipo_superficie')?.value,this.esEspacioPublico);

    this.tipoSuperficieSelected();
    this.tipoProgramaSelected();
    return;
  }

  async getUnidadesMuestreo(idMantenimientoVialEvento:number){
    this.unidadesMantenimiento = [];
    this.unidadesMuestreoForm.clear();
    let respuestaServicio = await this.tabUnidadMuestreoService.get(idMantenimientoVialEvento);
    if(respuestaServicio.codError !== 0){
      throw respuestaServicio;
    }
    this.unidadesMantenimiento = respuestaServicio.respuesta.map((und:any) => this.formUnidadesMuestreoService.serviceResponseToObj(und as any));
    this.unidadesMantenimiento.sort((a:UnidadMuestreo,b:UnidadMuestreo) => !a?.abscisaInicial?-1:!b?.abscisaInicial?1:(a.abscisaInicial > b.abscisaInicial) ? 1 : ((b?.abscisaInicial > a.abscisaInicial) ? -1 : 0));
    console.log('Unidades de muestreo:',this.unidadesMantenimiento);

    let data:any = {
      tipoSuperficie:this.encabezadoForm.get('id_tipo_superficie')?.value,
      conUnidadesMuestreo:this.conUnidadesMuestreo,
    }

    for(let unidad of this.unidadesMantenimiento){
      let form = this.formUnidadesMuestreoService.getForm(data);
      form.patchValue(unidad);
      if(form.get('nLosas')){
        form.get('nLosas')?.setValue(unidad.area);
      }
      this.unidadesMuestreoForm.push(form);
    }
  }

  async getFallas(idUnidadMuestreo:number){
    this.fallasMantenimiento = [];
    this.fallasForm.clear();
    let respuestaServicio = await this.tabFallasService.get(idUnidadMuestreo);
    if(respuestaServicio.codError !== 0){
      throw respuestaServicio;
    }
    this.fallasMantenimiento = respuestaServicio.respuesta.map((falla:any) => this.formFallasService.serviceResponseToObj(falla as any));
    for(let falla of this.fallasMantenimiento){
      let index = this.unidadesMantenimiento.findIndex((und:UnidadMuestreo)=>und.idUnidadMuestreo==falla.idUnidadMuestreo);
      if(index != -1){
        falla.indexUnidadMuestreo = index;
      }
    }
    //ordena por id de unidad de muestreo, colocando de ultimas las fallas que no estén asociadas a una unidad, en caso de empate, se ordenan por idFalla
    this.fallasMantenimiento.sort((a:Falla,b:Falla) => !a?.indexUnidadMuestreo?-1:!b?.indexUnidadMuestreo?1:(a.indexUnidadMuestreo > b.indexUnidadMuestreo) ? 1 : ((b?.indexUnidadMuestreo > a.indexUnidadMuestreo) ? -1 : ((a.idFalla > b.idFalla) ? 1:(b.idFalla > a.idFalla) ? -1 :0)));
    console.log('fallas',this.fallasMantenimiento);
    let data:any = {
      tipoSuperficie:this.encabezadoForm.get('id_tipo_superficie')?.value,
      aplicaUnidadesMuestreo: this.conUnidadesMuestreo,
      intervencionTotal:this.encabezadoForm.get('id_tipo_intervencion_total')?.value,
      idFalla:null,
      idTipoFalla:null,
      formUnidadMuestreo : null
    }

    for(let falla of this.fallasMantenimiento){
      data.idFalla = falla.idFalla;
      data.idTipoFalla = falla.idTipoFalla;
      data.aplicaUnidadesMuestreo = this.conUnidadesMuestreo;
      if(falla.indexUnidadMuestreo >= 0){
        data.formUnidadMuestreo = this.unidadesMuestreoForm.get(falla.indexUnidadMuestreo.toString());
      }
      let form = this.formFallasService.getForm(data);

      form.patchValue(falla);
      if(form.get('anchoLosa')){
        form.get('anchoLosa')?.setValue(falla.ancho);
      }
      if(form.get('longitudLosa')){
        form.get('longitudLosa')?.setValue(falla.longitud);
      }
      form.updateValueAndValidity();
      this.fallasForm.push(form);
    }
  }

  async getUnidadesYFallas(idMantenimientoVialEvento:number){
    try{
      await this.getUnidadesMuestreo(idMantenimientoVialEvento);
      let arrayFork = [];
      for(let unidad of this.unidadesMantenimiento){
        arrayFork.push(this.getFallas(unidad.idUnidadMuestreo!));
      }
      await forkJoin(arrayFork);
    }catch(error){
        this.handleError(error);
    }
  }

  async getFotos(idDocumento:number){

    let res:any = await this.tabArchivoService.get(idDocumento);
    if(res.codError != 0){
      throw res;
    }else{
      let ListaArchivos = res.respuesta;
      for(let archivo of ListaArchivos){
        let objArchivo = {idArchivo:archivo.id_archivo,url:''+archivo.url_archivo,fileInfo:null};
        this.fotosMantenimiento.push(objArchivo);
        let form = this.fb.group(this.getFormFoto());
        form.patchValue(objArchivo);
        this.fotosForm.push(form);
      }
    }

  }

  async getOtrosFactores(idMantenimientoVialEvento:number){

    let res:any = await this.tabOtroFactorService.get(idMantenimientoVialEvento);
    if(res.codError != 0){
      throw res;
    }else{
      let ListaOtrosFactores = res.respuesta;
      for(let otroFactor of ListaOtrosFactores){
        let objFactor = {idOtroFactor:otroFactor.id_otro_factor,tipoFactor:otroFactor.id_tipo_otro_factor};
        this.otrosFactoresMantenimiento.push(objFactor);
        let form = this.fb.group(this.getFormOtroFactor());
        form.patchValue(objFactor);
        this.otrosFactoresForm.push(form);
      }
    }

  }

  addUnidadMuestreo() {
    this.openDialogUnidadMuestreo(this.unidadesMuestreoForm.length);
  }

  addOtroFactor() {
    this.openDialogOtroFactor(this.otrosFactoresForm.length,null);
  }

  addFalla() {
    //
    this.openDialogFalla(this.fallasForm.length);
  }

  addFoto(){
    if(this.fotosForm.controls.length == 6){
      const dialogRef = this.dialog.open(SimpleDialogComponent,{
        data:{
          contenido: 'Máximo 6 fotos',
          aceptar: true
        }
      });
    }else{
      this.openDialogFoto(this.fotosForm.length,null);
    }

  }

  getFormFoto(){
    let formFoto:any = {
      idArchivo:['',[]],
      url: ['',Validators.required],
      fileInfo :['',[]]
    };
    return formFoto;
  }

  getFormOtroFactor(){
    
    let formOtroFactor:any = {
      idOtroFactor:['',[]],
      tipoFactor: ['',[]]
      //tipoFactor: ['',[Validators.required]]
    };
    return formOtroFactor;
  }

  async onSubmit(){
    try{
      await this.guardarEncabezado();
      await this.saveCambiosUnidadesYFallas();
      await this.guardarFotos();
      await this.guardarOtrosFactores();
      await this.utilitariosService.calcularPCI(this.idMantenimientoVialEvento, this.encabezadoForm.get('id_tipo_superficie')?.value, this.mantenimientoVialEvento.id_tipo_origen, this.mantenimientoVialEvento.pk_id_calzada);
      let resCalculado = await this.utilitariosService.calculadoMantenimientoVial(this.mantenimientoVialEvento.id_mantenimiento_vial);
      if(resCalculado.codError == 0){
        //realiza validación: actividad agrupada no puede ser SF si el programa es IMV-PR-003
        if(resCalculado.respuesta[0].codigo_actividad_agrupada == 'SF' && this.encabezadoForm.get('id_tipo_programa')?.value == 599){
          this.handleError({msjError:"La actividad agrupada no puede ser SF si el programa es IMV-PR-003, se debe cambiar el tipo de intervención de las fallas o el programa."});
          return;
        }

/*
        let attrsActualizarMant = "codigo_actividad_agrupada;km_carril_impacto";
        let arrayValuesMant = [resCalculado.respuesta[0].codigo_actividad_agrupada,resCalculado.respuesta[0].km_carril_impacto]
*/
        let attrsActualizarEvento = "id_tipo_actividad_detallada;codigo_actividad_agrupada;km_carril_impacto;";
        let arrayValues = [resCalculado.respuesta[0].id_tipo_actividad,resCalculado.respuesta[0].codigo_actividad_agrupada?resCalculado.respuesta[0].codigo_actividad_agrupada:' ',resCalculado.respuesta[0].km_carril_impacto]
        
        if(!this.mantenimientoVialEvento.fecha_visita){
          attrsActualizarEvento += "fecha_visita;";
         // attrsActualizarMant += ";fecha_visita_tecnica";
          let fechaHoraSplited = resCalculado.respuesta[0].fecha_hora_char.split(' ');
          let fechaHoraISO = fechaHoraSplited[0]+'T'+fechaHoraSplited[1]+'Z'; 
          arrayValues.push(fechaHoraISO);
        // arrayValuesMant.push(fechaHoraISO);
        }
        
      //  this.tabMantenimientoService.actualizarCampo(this.idMantenimientoVial, attrsActualizarMant, arrayValuesMant.join(";"));
        this.mantenimientoVialEventoService.actualizarCampo(Number(this.idMantenimientoVialEvento), attrsActualizarEvento , arrayValues.join(";")+";");
      }
      console.log('La res',resCalculado);

      this.guardadoTodo = true;
    }catch(e){
      console.log('El error', e);
      console.error('ERROR al guardar todo');
    }

  }

  openDialogUnidadMuestreo(indexUnidad:number) {

    let data:any = {
      longituPk: this.mantenimientoVialEvento.longitud_horizontal_pk,
      anchoPk: this.mantenimientoVialEvento.ancho_pk,
      areaPk: this.mantenimientoVialEvento.area_pk,
      indexUnidad: indexUnidad,
      form: this.unidadesMuestreoForm.get(indexUnidad.toString()),
      tipoSuperficie:this.encabezadoForm.get('id_tipo_superficie')?.value,
      conUnidadesMuestreo:this.conUnidadesMuestreo
    }

    const dialogRef = this.dialog.open(RegistroUnidadMuestreoComponent,{
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.action=='delete'){
        this.unidadesMuestreoForm.removeAt(result.index);
        for(let falla of this.fallasForm.controls){
          if(falla.get('indexUnidadMuestreo')?.value == result.index){
            falla.get('indexUnidadMuestreo')?.setValue(null);
            falla.get('idUnidadMuestreo')?.setValue(null);
            falla.get('idFalla')?.setValue(null);
            falla.get('indexUnidadMuestreo')?.updateValueAndValidity();
          }
        }
      }else if(result.action=='update' && this.unidadesMuestreoForm.length == result.index){
          this.unidadesMuestreoForm.push(result.data)
      }else if(result.action == 'cancel'){
        if(this.unidadesMuestreoForm.get(indexUnidad.toString())){
          this.unidadesMuestreoForm.get(indexUnidad.toString())?.setValue(result.value);
        }
      }
      this.unidadesMuestreoForm.updateValueAndValidity();
      this.unidadesMuestreoForm.markAllAsTouched();
      for(let c of this.fallasForm.controls){
        c.updateValueAndValidity();
      }
    });
  }

  openDialogFalla(indexFalla:number){
    let listaUnidades = [];
    //obtiene el listado de unidades de muestreo para poder llenar el select de unidad de muestreo
    for(let i =0;i< this.unidadesMuestreoForm.controls.length;i++){
      let formUnidad = this.unidadesMuestreoForm.get(i.toString());
      listaUnidades.push({idUnidadMuestreo: formUnidad?.get('idUnidadMuestreo')?.value,value:i,text:(i+1).toString()+' ('+formUnidad?.get('abscisaInicial')?.value +'m - '+ formUnidad?.get('abscisaFinal')?.value+'m)'});
    }

    let data:any = {
      form: this.fallasForm.get(indexFalla.toString()),
      indexFalla: indexFalla,
      listaUnidades: listaUnidades,
      tipoSuperficie: this.encabezadoForm.get('id_tipo_superficie')?.value,
      intervencionTotal: this.encabezadoForm.get('id_tipo_intervencion_total')?.value,
      formUnidadMuestreo: this.unidadesMuestreoForm,
      idTipoPrograma: this.encabezadoForm.get('id_tipo_programa')?.value,
      aplicaUnidadesMuestreo: this.conUnidadesMuestreo,
    }

    const dialogRef = this.dialog.open(RegistroFallasComponent,{
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.action=='delete'){
        this.fallasForm.removeAt(result.index);
      }else if(result.action=='update' && this.fallasForm.length == result.index){
          this.fallasForm.push(result.data);
      }else if (result.action=='cancel'){
        if(this.fallasForm.get(indexFalla.toString())){
          this.fallasForm.get(indexFalla.toString())?.setValue(result.value);
        }
      }
      this.fallasForm.markAllAsTouched();
    });
  }

  openDialogOtroFactor(indexOtroFactor:number,formData:any){
    let newo:Boolean;
    if(indexOtroFactor == this.otrosFactoresForm.controls.length){
      this.otrosFactoresForm.push(this.fb.group(this.getFormOtroFactor()));
      newo = true;
    } else newo = false;
    let data:any = {
      //form: this.otrosFactoresForm.get(indexOtroFactor.toString()),
      indexOtroFactor: indexOtroFactor,
      nuevo: newo,
      otrosFactoresForm: this.otrosFactoresForm
    }
    data['formData'] =  this.otrosFactoresForm.get(indexOtroFactor.toString());
    const dialogRef = this.dialog.open(RegistroOtrosFactoresComponent,{
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.action=='delete'){
        this.otrosFactoresForm.removeAt(result.index);
      }else if(result.action=='update'){
        if(this.otrosFactoresForm.length == result.index){
          this.otrosFactoresForm.push(result.data)
        }else{
          this.otrosFactoresForm.setControl(result.index.toString(),result.data);
        }
      }else if (result.action=='cancel'){
        if(this.otrosFactoresForm.get(result.index.toString())){
          this.otrosFactoresForm.get(result.index.toString())?.setValue(formData);
        }
      }
      this.otrosFactoresForm.markAllAsTouched();
    });
  }

  openDialogFoto(indexFoto:number,formData:any){

    if(indexFoto == this.fotosForm.controls.length){
      //this.fotosForm.push(this.fb.group(this.getFormFoto()));
      //setTimeout(() => {this.fotosForm.markAllAsTouched(); this.inputsFotos.toArray()[indexFoto].nativeElement.click();}, 100);
      this.inputFotoTemp.nativeElement.click();
    }else{
      let data:any = {
        form: this.fotosForm.get(indexFoto.toString()),
        indexFoto: indexFoto,
        urlFotos: this.URL_FOTOS
      }
      const dialogRef = this.dialog.open(RegistroFotoComponent,{
        data: data
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.action=='delete'){
          this.fotosForm.removeAt(result.index);
        }else if(result.action=='update' && this.fotosForm.length == result.index){
          this.fotosForm.get(result.index.toString())?.get('url')?.setValue(result.data);
        }else if (result.action=='cancel'){
          if(this.fotosForm.get(result.index.toString())){
            this.fotosForm.get(result.index.toString())?.patchValue(result.data);
          }
        }
        this.fotosForm.markAllAsTouched();
      });

    }
  }

  onFotoChanged(event:any, index:number) {
    const reader: FileReader = new FileReader();
    const fileInfo = event.target.files[0];
    reader.readAsDataURL(fileInfo);
    reader.onload = (e) => {
      if(index == this.fotosForm.controls.length){
        let formFoto = this.fb.group(this.getFormFoto());
        formFoto.get('url')?.setValue(reader.result?.toString());
        formFoto.get('fileInfo')?.setValue(fileInfo);
        this.fotosForm.push(formFoto);
      }else{
        this.fotosForm.get(index.toString())?.get('url')?.setValue(reader.result?.toString());
        this.fotosForm.get(index.toString())?.get('fileInfo')?.setValue(fileInfo);
      }
      this.fotosForm.markAllAsTouched();
    }
  }

  //IMPORTANTE: cuando se cambie el tipo de superficie se debe asegurar que elimine todas las fallas
  //y unidades, de lo contrario afectará los procesos de generación, actualización y guardado de fallas y unidades.
  tipoSuperficieSelected(){
    this.unidadesMuestreoForm.clear();
    this.fallasForm.clear();

    if(!this.formUnidadesMuestreoService.aplicaUnidadesMuestreo(this.encabezadoForm.get('id_tipo_superficie')?.value,this.esEspacioPublico,this.encabezadoForm.get('id_tipo_programa')?.value)){
      let formUnicaUnidad = this.formUnidadesMuestreoService.getForm({'tipoSuperficie':this.encabezadoForm.get('id_tipo_superficie')?.value,'aplicaUnidadesMuestreo':this.conUnidadesMuestreo});

      formUnicaUnidad.get('abscisaInicial')?.setValue(0);
      formUnicaUnidad.get('abscisaFinal')?.setValue(this.mantenimientoVialEvento.longitud_horizontal_pk?this.mantenimientoVialEvento.longitud_horizontal_pk:1);
      formUnicaUnidad.get('ancho')?.setValue(this.mantenimientoVialEvento.ancho_pk?this.mantenimientoVialEvento.ancho_pk:1);

      this.unidadesMuestreoForm.push(
        formUnicaUnidad
      );
      this.conUnidadesMuestreo = false;
    }else{
      this.conUnidadesMuestreo = true;
    }
    this.conFallas = this.formFallasService.aplicaFallas(this.encabezadoForm.get('id_tipo_superficie')?.value,this.esEspacioPublico);
  }
/*
  aplicaUnidadesMuestreo(){
    //revisa si para el tipo de superficie aplican unidades de muestreo
    let tiposSuperficieUnidad = [1102,1103,1105,1106];//tipos de superficie para los que aplica unidad de muestreo
    return tiposSuperficieUnidad.indexOf(this.encabezadoForm.get('id_tipo_superficie')?.value) != -1
  }
*/
  intervTotalSelected(){
    //si la intervencion total es igual a cambio de carpeta el campo tipo de intervención no es obligatorio.
    //si no se eligió ninguna intervención total, el tipo de intervención es obligatorio.
    //esta regla se encuentra repetida en registroFalla cuando se arma el form
    if(this.encabezadoForm.get('id_tipo_intervencion_total')?.value == 1244 || this.encabezadoForm.get('id_tipo_intervencion_total')?.value == null || this.encabezadoForm.get('id_tipo_intervencion_total')?.value == ''){
      for(let i = 0;i<this.fallasForm.controls.length;i++){
        let control = this.fallasForm.get(i.toString()) as FormGroup;
        if(control.get('idTipoIntervencion')){
          control.removeControl('idTipoIntervencion');
        }
          control.addControl('idTipoIntervencion', new FormControl('',this.encabezadoForm.get('id_tipo_intervencion_total')?.value == 1244?[]:Validators.required));
      }
    }else{
      
      for(let i = 0;i<this.fallasForm.controls.length;i++){
        let control = this.fallasForm.get(i.toString()) as FormGroup;
        control.removeControl('idTipoIntervencion');
      }
    }
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

  findTipo(idLista:number, idTipo:number){
    let lista = this.listas[idLista]
    let indexTipo = lista.findIndex((tipo: { id_tipo: number; }) => tipo.id_tipo === idTipo);
    return lista[indexTipo];
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

  async saveCambiosUnidadesYFallas(){
    let dialogRef = this.mostrarVentanaEnEspera('Guardando');
    try{

    let cambiosUnidades = this.getCambiosUnidadesMuestreo();
    let cambiosFallas = this.getCambiosFallas();

    //eliminar fallas
    console.log('eliminando fallas');
    let peticionesEliminarFallas = cambiosFallas.idsFallasEliminar.map(idFalla => this.tabFallasService.delete(idFalla));
    try{
      await forkJoin(peticionesEliminarFallas).toPromise();
    }catch(error){
      throw error;
    }
    //elimina en el array de fallas
    for(let i = this.fallasMantenimiento.length - 1;i>=0;i--){
      if(cambiosFallas.idsFallasEliminar.findIndex(idFalla => idFalla == this.fallasMantenimiento[i].idFalla) != -1){
        this.fallasMantenimiento.splice(i,1);
      }
    }

    //eliminar unidades
    console.log('eliminando unidades');
    let peticionesEliminarUnidades = cambiosUnidades.idsUnidadesEliminar.map(idUnidad => this.tabUnidadMuestreoService.delete(idUnidad!));
    try{
      await forkJoin(peticionesEliminarUnidades).toPromise();
    }catch(error){
      throw error;
    }

    //eliminar en el array de unidades
    for(let i = this.unidadesMantenimiento.length - 1;i>=0;i--){
      if(cambiosUnidades.idsUnidadesEliminar.findIndex(idUnidad => idUnidad == this.unidadesMantenimiento[i].idUnidadMuestreo) != -1){
        this.unidadesMantenimiento.splice(i,1);
      }
    }

    //insertar unidades
    console.log('insertando unidades');
    let peticionesInsertarUnidades = cambiosUnidades.unidadesInsertar.map(unidad => this.tabUnidadMuestreoService.create(unidad));
    let idsNuevasUnidades:any[];
    try{
      idsNuevasUnidades = await forkJoin(peticionesInsertarUnidades).toPromise();
    }
    catch(error){
      throw error;
    }
    //inserta en el array de unidades, le asina el nuevo id y la agrega al array de unidades
    for(let i =0;i<cambiosUnidades.unidadesInsertar.length;i++){
      if(idsNuevasUnidades[i].codError !== 0){
        throw idsNuevasUnidades[i].msgError;
      }
      //el llamado a :b1 es temporal, mientras se cambia el nombre de la variable en la respuesta del servicio
      cambiosUnidades.unidadesInsertar[i].idUnidadMuestreo = idsNuevasUnidades[i].respuesta[0][':b1'];
      this.unidadesMantenimiento.push(cambiosUnidades.unidadesInsertar[i]);
      //actualiza en el form los ids de las fallas insertadas.
      this.unidadesMuestreoForm.get(cambiosUnidades.unidadesInsertar[i].indexUnidad.toString())?.get('idUnidadMuestreo')?.setValue(cambiosUnidades.unidadesInsertar[i].idUnidadMuestreo);
    }

    //asigna el id de unidad de muestreo a las fallas que esten asociadas con las unidades de muestreo que se insertaron
    for(let unidad of cambiosUnidades.unidadesInsertar){
      for(let falla of [...cambiosFallas.fallasActualizar, ...cambiosFallas.fallasInsertar]){
        if(falla.indexUnidadMuestreo == unidad.indexUnidad){
          falla.idUnidadMuestreo = unidad.idUnidadMuestreo;
          this.fallasForm.get(falla.indexFalla.toString())?.get('idUnidadMuestreo')?.setValue(unidad.idUnidadMuestreo);
        }
      }
    }

    //insertar fallas
    console.log('insertando fallas');
    let peticionesInsertarFallas = cambiosFallas.fallasInsertar.map(falla => this.tabFallasService.create(falla));

    let idsNuevasFallas:any[];
    try{
      idsNuevasFallas = await forkJoin(peticionesInsertarFallas).toPromise();
    }catch(error){
      throw error;
    }
    //inserta en el array de fallas, le asigna el nuevo id y la agrega al array de fallas
    for(let i =0;i<cambiosFallas.fallasInsertar.length;i++){
      if(idsNuevasFallas[i].codError !== 0){
        throw idsNuevasFallas[i];
      }
      //el llamado a :b1 es temporal, mientras se cambia el nombre de la variable en el servicio
      let idNuevaFalla = idsNuevasFallas[i].respuesta[0][":b1"];

      cambiosFallas.fallasInsertar[i].idFalla = idNuevaFalla;
      //actualiza en el objeto
      this.fallasMantenimiento.push(cambiosFallas.fallasInsertar[i]);
      //actualiza en el form
      this.fallasForm.get(cambiosFallas.fallasInsertar[i].indexFalla.toString())?.get('idFalla')?.setValue(idNuevaFalla);
    }

    //actualizar unidades
    console.log('actualizando unidades');
    let peticionesUpdateUnidades = cambiosUnidades.unidadesActualizar.map(unidad => this.tabUnidadMuestreoService.update(unidad));
    try{
      idsNuevasFallas = await forkJoin(peticionesUpdateUnidades).toPromise();
    }catch(error){
      throw error;
    }
    //actualiza en el array de unidades
    for(let i = 0;i<this.unidadesMantenimiento.length;i++){
      let index = cambiosUnidades.unidadesActualizar.findIndex(unidad => unidad.idUnidadMuestreo == this.unidadesMantenimiento[i].idUnidadMuestreo);
      if(index != -1){
        this.unidadesMantenimiento[i] = cambiosUnidades.unidadesActualizar[index];
      }
    }

    //actualizar fallas
    console.log('actualizando fallas');
    let peticionesActualizarFallas = cambiosFallas.fallasActualizar.map(falla => this.tabFallasService.update(falla));
    try{
      await forkJoin(peticionesActualizarFallas).toPromise();
    }catch(error){
      throw error;
    }
    //actualiza en el array de unidades
    for(let i = 0;i<this.fallasMantenimiento.length;i++){
      let index = cambiosFallas.fallasActualizar.findIndex(falla => falla.idfalla == this.fallasMantenimiento[i].idFalla);
      if(index != -1){
        this.fallasMantenimiento[i] = cambiosFallas.fallasActualizar[index];
      }
    }
    dialogRef.close();
    this.operationSuccess();
    }
    catch(error){
      this.handleError(error);
      dialogRef.close();
    }
  }

  getCambiosUnidadesMuestreo(){
    let unidadesAActualizar = [];
    let unidadesAInsertar = [];
    let idsUnidadesAEliminar = [];

    let res = {'idsUnidadesEliminar':new Array<any>(), 'unidadesInsertar':new Array<any>(), 'unidadesActualizar':new Array<any>()};
    //determina las unidades a insertar y actualizar
    let i = 0;
    for(let control of this.unidadesMuestreoForm.controls){
      let undObj:UnidadMuestreo = this.formUnidadesMuestreoService.formToObj(control as FormGroup);
      undObj.area = undObj.area?undObj.area:(this.mantenimientoVialEvento.area_pk?this.mantenimientoVialEvento.area_pk:0);
      undObj.indexUnidad = i;
      i++;
      undObj.idMantenimientoVialEvento = this.mantenimientoVialEvento.id_mantenimiento_vial_evento;
      if(undObj.idUnidadMuestreo){
        unidadesAActualizar.push(undObj);
      }else{
        unidadesAInsertar.push(undObj);
      }
    }
    //determina las unidades a eliminar
    for(let unidadMant of this.unidadesMantenimiento){
      let index = unidadesAActualizar.findIndex(unidad => unidad.idUnidadMuestreo == unidadMant.idUnidadMuestreo);
      if(index == -1){
        idsUnidadesAEliminar.push(unidadMant.idUnidadMuestreo);
      }
    }

    if(idsUnidadesAEliminar.length>0){
      res.idsUnidadesEliminar = idsUnidadesAEliminar;
    }

    if(unidadesAActualizar.length>0){
      res.unidadesActualizar = unidadesAActualizar;
    }

    if(unidadesAInsertar.length>0){
      res.unidadesInsertar = unidadesAInsertar;
    }
    return res;
  }

  getCambiosFallas(){
    let fallasAActualizar = [];
    let fallasAInsertar = [];
    let idsFallasAEliminar = [];
    let res = {'idsFallasEliminar':new Array<any>(), 'fallasInsertar':new Array<any>(), 'fallasActualizar':new Array<any>()};
    //determina las fallas a insertar y actualizar
    let i = 0;
    for(let control of this.fallasForm.controls){
      let fallaObj:Falla = this.formFallasService.formToObj(control as FormGroup);
      fallaObj.indexFalla = i;
      i++;
      if(fallaObj.idFalla){
        fallasAActualizar.push(fallaObj);
      }else{
        fallasAInsertar.push(fallaObj);
      }
    }
    //determina las fallas a eliminar
    for(let fallaMant of this.fallasMantenimiento){
      let index = fallasAActualizar.findIndex(falla => falla.idFalla == fallaMant.idFalla);
      if(index == -1){
        idsFallasAEliminar.push(fallaMant.idFalla);
      }
    }

    if(idsFallasAEliminar.length>0){
      res.idsFallasEliminar = idsFallasAEliminar;
    }

    if(fallasAActualizar.length > 0){
      res.fallasActualizar = fallasAActualizar;
    }

    if(fallasAInsertar.length>0){
      res.fallasInsertar = fallasAInsertar;
    }
    return res;
  }

  async guardarEncabezado(){

    let dialogRef = this.mostrarVentanaEnEspera('Guardando');
    try{
    let encabezado = new MantenimientoVial();
    encabezado.idMantenimientoVial = this.mantenimientoVialEvento.id_mantenimiento_vial_evento;
    encabezado.idTipoOrigen = this.mantenimientoVialEvento.id_tipo_origen;
    encabezado.fecha = this.datePipe.transform(Date.now(),'yyyy-MM-dd')!;
    encabezado.solicitudNombre = this.mantenimientoVialEvento.solicitud_nombre;
    encabezado.solicitudFecha = this.datePipe.transform(this.mantenimientoVialEvento.solicitud_fecha,'yyyy-MM-dd')!;
    encabezado.solicitudVencimiento = this.datePipe.transform(this.mantenimientoVialEvento.solicitud_vencimiento,'yyyy-MM-dd')!;
    encabezado.pkIdCalzada = this.encabezadoForm.get('pk_id_calzada')?.value;
    encabezado.areaPk = this.encabezadoForm.get('area_pk')?.value;
    encabezado.anchoPk = this.encabezadoForm.get('ancho_pk')?.value;
    encabezado.idTipoEstadoPk = this.mantenimientoVialEvento.id_tipo_estado_pk;
    encabezado.longitudHorizontalPk = this.mantenimientoVialEvento.longitud_horizontal_pk;
    encabezado.kmCarrilImpacto = this.mantenimientoVialEvento.km_carril_impacto;
    encabezado.idLocalidad = this.encabezadoForm.get('id_localidad')?.value;
    encabezado.idUpz = this.encabezadoForm.get('id_upz')?.value;
    encabezado.idBarrio = this.encabezadoForm.get('id_barrio')?.value;
    encabezado.civ = this.encabezadoForm.get('civ')?.value;
    encabezado.pkIdCalzada = this.encabezadoForm.get('pk_id_calzada')?.value;
    encabezado.ejeVial = this.encabezadoForm.get('eje_vial')?.value;
    encabezado.desde = this.encabezadoForm.get('desde')?.value;
    encabezado.hasta = this.encabezadoForm.get('hasta')?.value;
    encabezado.idZona = this.encabezadoForm.get('id_zona')?.value;
    encabezado.fechaVisitaTecnica = this.encabezadoForm.get('fecha_visita_tecnica')?.value;
    encabezado.idTipoSeccionVial = this.encabezadoForm.get('id_tipo_seccion_vial')?.value;
    encabezado.descripcionOrigen = this.encabezadoForm.get('descripcion_origen')?.value;
    encabezado.idTipoUsoVia = this.encabezadoForm.get('id_tipo_uso_via')?.value;
    encabezado.idTipoMalla = this.encabezadoForm.get('id_tipo_malla')?.value;
    encabezado.rutasTransporte = this.encabezadoForm.get('rutas_transporte')?.value;
    encabezado.idTipoTransitabilidad = this.encabezadoForm.get('id_tipo_transitabilidad')?.value;
    encabezado.idTipoPrograma = this.encabezadoForm.get('id_tipo_programa')?.value?this.encabezadoForm.get('id_tipo_programa')?.value:' ';
    console.log('EN EL ENCABEZADO SE VA',encabezado.idTipoPrograma );
    encabezado.idTipoSuperficie = this.encabezadoForm.get('id_tipo_superficie')?.value;
    encabezado.idTipoIntervencionTotal = this.encabezadoForm.get('id_tipo_intervencion_total')?.value;
    encabezado.observacionesDiagnostico = this.observacionesForm.value;
    encabezado.idResponsableVisita = this.securityService.userSession.login;
    //let result = await this.tabMantenimientoService.update(encabezado as MantenimientoVial).toPromise();
    let result = await this.actualizarMantVialEvento();
    //let result = await this.mantenimientoVialEventoService.update(encabezado as MantenimientoVial);
    if(result.codError !== 0){
      throw result;
    }
    if(!this.formUnidadesMuestreoService.aplicaUnidadesMuestreo(this.encabezadoForm.get('id_tipo_superficie')?.value,this.esEspacioPublico,this.encabezadoForm.get('id_tipo_programa')?.value)){
      this.saveCambiosUnidadesYFallas();
    }
    
    dialogRef.close();
    this.operationSuccess();
    }catch(error){
      this.handleError(error);
      dialogRef.close();
    }
  }

  async guardarFotos(){
    let dialogRef = this.mostrarVentanaEnEspera('Guardando');
    try{
    let fotosActualizar = [];
    let fotosInsertar = [];
    let idsfotosEliminar = [];

    //convierte lo existente en el form, a objetos;
    let ObjFotos =  this.fotosForm.controls.map(
      control => {
        let fileInfo = null;
        fileInfo = control.get('fileInfo')?.value;
        let archivo = new Archivo();
        archivo.idMantenimientoVial = this.mantenimientoVialEvento.id_mantenimiento_vial_evento;
        archivo.idArchivo = control.get('idArchivo')?.value;
        archivo.urlTmp = control.get('url')?.value;
        archivo.selectedFile = fileInfo;
        archivo.idDocumento = this.idDocumento;
        return archivo;
      }
    );

    //determina las fotos a insertar y actualizar

    for(let i = 0;i<ObjFotos.length;i++){
      let archivo = ObjFotos[i];

      if(!archivo.idArchivo && archivo.selectedFile && archivo.urlTmp?.startsWith('data:')){
        fotosInsertar.push({archivo:archivo, index:i});
      }else if(archivo.idArchivo && archivo.selectedFile && archivo.urlTmp?.startsWith('data:')){
        fotosActualizar.push({archivo:archivo, index:i});
      }
    }

    //determina las fotos a eliminar
    for(let foto of this.fotosMantenimiento){
      let index = ObjFotos.findIndex(archivo => archivo.idArchivo == foto.idArchivo);
      if(index == -1){
        idsfotosEliminar.push(foto.idArchivo);
      }
    }

    //alista las operaciones
    let operacionesEliminar = idsfotosEliminar.map(idFoto => this.tabArchivoService.delete(idFoto));
    let operacionesInsertar = fotosInsertar.map(
        foto =>{
          return {llamadoServ:this.tabArchivoService.create(foto.archivo,"2051"), index:foto.index};
        }
      );

    let operacionesActualizar = fotosActualizar.map(
        foto =>{
          return {llamadoServ:this.tabArchivoService.update(foto.archivo,"2051"), index:foto.index};
        }
      );

      //ejecuta operaciones
      if(operacionesEliminar.length > 0){
        let respElim = await forkJoin(operacionesEliminar).toPromise();
        for(let resp of respElim){
          if(resp.codError != 0){
            throw resp.msgError;
          }
          //elimina fotos en el array de fotos
          for(let i = this.fotosMantenimiento.length - 1;i>=0;i--){
            if(idsfotosEliminar.findIndex(idArchivo => idArchivo == this.fotosMantenimiento[i].idArchivo) != -1){
              this.fallasMantenimiento.splice(i,1);
            }
          }
        }
      }

      if(operacionesInsertar.length > 0){
        let respInsert = await forkJoin(operacionesInsertar.map(f => f.llamadoServ)).toPromise();
        //asigna los nuevos ids de fotos
        for(let i=0;i<respInsert.length;i++){
          let nuevoId = (respInsert as any)[i].respuesta[0].idArchivo;
          let indexFoto = fotosInsertar[i].index;
          console.log('nuevaFoto',nuevoId,'index',indexFoto);
          this.fotosForm.get(indexFoto.toString())?.get('idArchivo')?.setValue(nuevoId);
          this.fotosForm.get(indexFoto.toString())?.get('fileInfo')?.setValue(null);
        }
        console.log('insert', respInsert);
      }

      if(operacionesActualizar.length > 0){
        let respActualizar = await forkJoin(operacionesActualizar.map(f => f.llamadoServ)).toPromise();

        for(let i=0;i<respActualizar.length;i++){
          let indexFoto = fotosActualizar[i].index;
          this.fotosForm.get(indexFoto.toString())?.get('fileInfo')?.setValue(null);
        }
        console.log('update', respActualizar);
      }
      dialogRef.close();
      this.operationSuccess();
    }catch(error){
      this.handleError(error);
      dialogRef.close();
    }
  }

  async guardarOtrosFactores(){

    let factoresActualizar = [];
    let factoresInsertar: any[] = [];
    let idsfactoresEliminar = [];

    //convierte lo existente en el form, a objetos;
    let ObjFactores =  this.otrosFactoresForm.controls.map(
      control => {
        let factor = new OtroFactor(this.mantenimientoVialEvento.id_mantenimiento_vial_evento);
        factor.idOtroFactor = control.get('idOtroFactor')?.value;
        factor.idTipoOtroFactor = control.get('tipoFactor')?.value;
        return factor;
      }
    );
    console.log('asdsadasdasd',ObjFactores);

    //determina los factores a insertar y actualizar
    for(let factor of ObjFactores){
      let idx = this.otrosFactoresMantenimiento.findIndex(e => e.idOtroFactor == factor.idOtroFactor);
      if(!factor.idOtroFactor && factor.idTipoOtroFactor){
        factoresInsertar.push(factor);
      }else if(idx != -1 && factor.idTipoOtroFactor != this.otrosFactoresMantenimiento[idx].tipoFactor){
        factoresActualizar.push(factor);
      }
    }

    //determina los factores a eliminar
    for(let factor of this.otrosFactoresMantenimiento){
      let index = ObjFactores.findIndex(oFactor => oFactor.idOtroFactor == factor.idOtroFactor);
      if(index == -1){
        idsfactoresEliminar.push(factor.idOtroFactor);
      }
    }
    let dialogRef = this.mostrarVentanaEnEspera('Guardando');
    try{
      //alista las operaciones
      let operacionesEliminar = idsfactoresEliminar.map(idFactor => this.tabOtroFactorService.delete(idFactor));
      let operacionesInsertar = factoresInsertar.map(
          factor =>{
            return this.tabOtroFactorService.create(factor);
          }
        );

      let operacionesActualizar = factoresActualizar.map(
          factor =>{
            return this.tabOtroFactorService.update(factor);
          }
        );

      //ejecuta operaciones
      if(operacionesEliminar.length > 0){
        let respElim = await forkJoin(operacionesEliminar).toPromise();
        for(let resp of respElim){
          if(resp.codError != 0){
            throw resp.msgError;
          }
        //elimina fotos en el array de fotos
          for(let i = this.otrosFactoresMantenimiento.length - 1;i>=0;i--){
            if(idsfactoresEliminar.findIndex(idFactor => idFactor == this.otrosFactoresMantenimiento[i].idOtroFactor) != -1){
              this.otrosFactoresMantenimiento.splice(i,1);
            }
          }
        }
      }

      if(operacionesInsertar.length > 0){
        let respInsert:any = await forkJoin(operacionesInsertar).toPromise();
        for(let i=0;i<respInsert.length;i++){
          let idx = ObjFactores.findIndex(e => e.idTipoOtroFactor == factoresInsertar[i].idTipoOtroFactor);
          //console.log('insertad', respInsert[0].respuesta[i][":b1"]);
          //ObjFactores[idx].idOtroFactor = respInsert[0].respuesta[i][":b1"];
          let nuevoId = (respInsert as any)[i].respuesta[0][":b1"];
          console.log('nuevoFct',nuevoId,'index',idx);
          this.otrosFactoresForm.get(idx.toString())?.get('idOtroFactor')?.setValue(nuevoId);
        }
      }

      if(operacionesActualizar.length > 0){
        let respActualizar = await forkJoin(operacionesActualizar).toPromise();
        console.log('update', respActualizar);
      }
      dialogRef.close();
      this.operationSuccess();
    } catch(error){
      this.handleError(error);
      dialogRef.close();
    }
}

  mostrarVentanaEnEspera(titulo:string, footer?:string){
    let data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
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

  operationSuccess(){

    this.snackBar.open('Cambios realizados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  //evento de click para que no comunique el evento al componente padre ni al componente hijo
  stopPropagation(e:any){
    e.stopPropagation();
  }
/*
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
 }
*/

gestionRealizada(){
  this.router.navigate(["dashboard/lista-pendientes/" + this.idActividad]);
}

accionGestion(e:any){
  if(e.action == 'cancel'){
    this.guardadoTodo = false;
  }
}

guardadoApiquesEvt(e:any){
  this.apiquesSaved = e;
}

public async  actualizarMantVialEvento(){

        let objActualizar = {... this.encabezadoForm.value};
        delete objActualizar.id_localidad;
        delete objActualizar.id_upz;
        delete objActualizar.id_barrio;
        delete objActualizar.civ;
        delete objActualizar.pk_id_calzada;
        delete objActualizar.id_zona;
        delete objActualizar.fecha_visita_tecnica;
        delete objActualizar.id_tipo_seccion_vial;
        delete objActualizar.solicitud_fecha;
        delete objActualizar.solicitud_nombre;
        objActualizar.id_responsable_visita = this.idPersonaReg.id_persona;
        objActualizar['observaciones'] = this.observacionesForm.value;

        objActualizar.id_tipo_programa = objActualizar.id_tipo_programa?objActualizar.id_tipo_programa:'';
        objActualizar.id_tipo_intervencion_total = objActualizar.id_tipo_intervencion_total?objActualizar.id_tipo_intervencion_total:'';


        let strClaves = '';
        let strValues = '';
        // Arma los nombres de campos y valores respectivos segun los campos de la forma
       // let valueEncabezado = this.encabezadoForm.value;
        for(let clave in objActualizar){
          strClaves += clave + ';';
          strValues += objActualizar[clave] + ';';
        }
        let res = await this.mantenimientoVialEventoService.actualizarCampo(this.idMantenimientoVialEvento, strClaves, strValues);
        return res;
}

public tipoProgramaSelected(){
  
    this.unidadesMuestreoForm.clear();
    this.fallasForm.clear();

    if(!this.formUnidadesMuestreoService.aplicaUnidadesMuestreo(this.encabezadoForm.get('id_tipo_superficie')?.value,this.esEspacioPublico,this.encabezadoForm.get('id_tipo_programa')?.value)){

      let formUnicaUnidad = this.formUnidadesMuestreoService.getForm({'tipoSuperficie':this.encabezadoForm.get('id_tipo_superficie')?.value,aplicaUnidadesMuestreo:this.conUnidadesMuestreo});

      formUnicaUnidad.get('abscisaInicial')?.setValue(0);
      formUnicaUnidad.get('abscisaFinal')?.setValue(this.mantenimientoVialEvento.longitud_horizontal_pk?this.mantenimientoVialEvento.longitud_horizontal_pk:1);
      formUnicaUnidad.get('ancho')?.setValue(this.mantenimientoVialEvento.ancho_pk?this.mantenimientoVialEvento.ancho_pk:1);
      formUnicaUnidad.get('area')?.setValue(this.mantenimientoVialEvento.area_pk?this.mantenimientoVialEvento.area_pk:1);

      this.unidadesMuestreoForm.push(
        formUnicaUnidad
      );
      console.log('la unica unidad')
      this.conUnidadesMuestreo = false;
    }else{
      this.conUnidadesMuestreo = true;
    }
}

}
