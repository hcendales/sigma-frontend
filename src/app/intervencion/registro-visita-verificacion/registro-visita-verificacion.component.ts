import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';

import { AbstractControl,
        FormBuilder,
        Validators,
        FormGroup,
        FormControl,
        FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';

import { RegistroFotoComponent } from '../../mejoramiento/registro-visita-diagnostico/components/registro-foto/registro-foto.component';
import { AreaIntervencionComponent } from '../area-intervencion/area-intervencion.component';
import { Archivo } from '../../core/models/archivo';

import { MantenimientoVial } from '../../core/models/mantenimiento-vial';
import { DatePipe } from '@angular/common';

import { MantenimientoVialEventoService } from '../../core/services/mantenimiento-vial-evento.service';
import { ConsultaListasService } from '../../core/services/consulta-listas.service';
import { EntityTabPersonaService } from '../../core/services/entity-tab-persona.service';
import { SecurityService } from '../../core/security/services/security.service';
import { IntervencionService } from '../../core/services/intervencion.service';
import { EntityTabArchivoServiceService } from '../../core/services/entity-tab-archivo-service.service';

import { EnEsperaComponent } from '../../core/en-espera/en-espera.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UtilitariosService } from 'src/app/core/services/utilitarios.service';

@Component({
  selector: 'app-registro-visita-verificacion',
  templateUrl: './registro-visita-verificacion.component.html',
  styleUrls: ['./registro-visita-verificacion.component.scss'],
  providers: [ DatePipe ]
})
export class RegistroVisitaVerificacionComponent implements OnInit {

  titulo:string = 'Registro de visita de verificación';
  formVerificacion: any;
  public generandoFicha: boolean = false;
  public listas:any;

  private idPersonaReg:any = {} as any;

  public ready:boolean = false;
  public guardadoTodo = false;

  public idDocumento: any;

  public idMantenimientoVialEvento = 0;
  public mantenimientoVialEvento:any;
  public areasIntervencion:any[] = [];
  public novedades:any[] = [];

  public fotosMantenimiento:any[] = [];

  public idActividad = 0;
  public apiquesSaved = false;

  public URL_FOTOS = environment.URL_FOTOS;

  public step = 0;

  public conUnidadesMuestreo = true;

  @ViewChildren('inputFoto') inputsFotos:any;

  @ViewChild('inputFotoTemp') inputFotoTemp:any;

  constructor(
    private activatedroute:ActivatedRoute,
    private router:Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private mantenimientoVialEventoService:MantenimientoVialEventoService,
    private datePipe: DatePipe,
    private listasService: ConsultaListasService,
    private snackBar:MatSnackBar,
    private entityTabPersonaService:EntityTabPersonaService,
    private securityService:SecurityService,
    private intervencionService:IntervencionService,
    private tabArchivoService:EntityTabArchivoServiceService,
    private utilitariosService:UtilitariosService
  ) {
    this.formVerificacion = this.fb.group({
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
        solicitud_fecha: [''],
        /*solicitud_nombre: [''],*/
        id_tipo_seccion_vial: ['',Validators.required],
        id_tipo_transitabilidad: ['',Validators.required],
        codigo_actividad_agrupada: ['',Validators.required],
        id_tipo_pmt: ['',Validators.required]
      }),
      areaIntervencion: this.fb.array([], [Validators.required]),
      //fallas: this.fb.array([], []),
      fotos: this.fb.array([], [this.minLengthArray(2), this.maxLengthArray(6)]),
      //otrosFactores: this.fb.array([], []),
      novedades: this.fb.group({activity: [{value: '', disabled: false}, [Validators.required]]}),
      observaciones:['']
    });
  }

  getFormAreaIntervencion(){
    let formAreaIntervencion:any = {
      idAreaIntervencion:['',[]],
      elemento:['',[Validators.required]],
      idTipoSuperficie:['',[Validators.required]],
      longitud:['',[Validators.required]],
      ancho:['',[Validators.required]],
      area:['',[Validators.required]],
      idTipoIntervencion:['',[Validators.required]]
    };
    return formAreaIntervencion;
  }

    get encabezadoForm() {
      return this.formVerificacion.get('encabezado') as FormGroup;
    }

    get areaIntervencionForm() {
      return this.formVerificacion.get('areaIntervencion') as FormArray;
    }

    get fotosForm() {
      return this.formVerificacion.get('fotos') as FormArray;
    }

    get novedadesForm(){
      return this.formVerificacion.get('novedades') as FormArray;
    }

    get observacionesForm(){
      return this.formVerificacion.get('observaciones') as FormControl;
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

  gestionRealizada(){
    this.router.navigate(["dashboard/lista-pendientes/" + this.idActividad]);
  }

  accionGestion(e:any){
    if(e.action == 'cancel'){
      this.guardadoTodo = false;
    }
  }

  async ngOnInit() {
    //idMantenimientoVial
    let respPersona = await this.entityTabPersonaService.list('ID_USUARIO = '+this.securityService.userSession.idUsuario);
    this.idPersonaReg = respPersona.respuesta[0];

    let listasIds = [
      19, //Uso vía
      93, //Tipo PMT: (DOMINIO: TAB_MANTENIMIENTO_VIAL_ID_TIPO_PMT)
      38, //Tipo de ejecución:  (DOMINIO:TAB_MANTENIMIENTO_VIAL_ID_TIPO_EJECUCION)
      39, //Tipo de clase: (DOMINIO:TAB_MANTENIMIENTO_VIAL_ID_TIPO_CLASE)
      43, //Tipo de rutas transporte: (DOMINIO: TAB_MANTENIMIENTO_VIAL_ID_TIPO_RUTAS_TRANSPORTE)
      42, //Tipo de superficie: (DOMINIO: TAB_FALLA_ID_TIPO_SUPERFICIE)
      25, //Tipo de intervención: (DOMINIO: TAB_FALLA_ID_TIPO_INTERVENCION)
      116, //CRUD TAB_INTERVENCION_NOVEDAD LISTA DE NOVEDAD --> TAB_INTERVENCION_NOVEDAD_ID_TIPO_NOVEDAD
      44,  //Tipo de vía
      116  //Novedades
    ];

    this.activatedroute.queryParams.subscribe(params =>{
      this.idDocumento = params['idDocumento'];
    });

      this.activatedroute.paramMap.subscribe(params=>{
      this.idMantenimientoVialEvento =  Number(params.get('idMantenimientoVial'));


      try{
        this.getMantenimientoVialEvento(this.idMantenimientoVialEvento).then((d:any) =>{
            let operaciones = [
                               this.listasService.consultarListas(listasIds),
                               this.intervencionService.parentQueryAreaIntervencion(this.idMantenimientoVialEvento),
                               this.intervencionService.parentQueryIntervencionNovedad(this.idMantenimientoVialEvento)
                             ];
            if(this.idDocumento){
                 operaciones.push(this.getFotos(this.idDocumento));
            }else{
             console.error('No hay un documento asociado a la captura');
            }

              forkJoin(operaciones).subscribe((res:any) => {
                this.listas = res[0];
                this.areasIntervencion = res[1].respuesta;
                this.novedades = res[2].respuesta;
                console.log(this.novedades,this.listas[116]);
                this.setNovedadesForm();
                this.getAreasIntervencion(this.areasIntervencion);
                this.ready = true;
              });
        });
      }catch(error){
        this.handleError(error);
      }
    });

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
              this.fotosMantenimiento.splice(i,1);
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
          this.fotosForm.get(indexFoto.toString())?.get('idArchivo')?.setValue(nuevoId);
          this.fotosForm.get(indexFoto.toString())?.get('fileInfo')?.setValue(null);
        }
      }

      if(operacionesActualizar.length > 0){
        let respActualizar = await forkJoin(operacionesActualizar.map(f => f.llamadoServ)).toPromise();

        for(let i=0;i<respActualizar.length;i++){
          let indexFoto = fotosActualizar[i].index;
          this.fotosForm.get(indexFoto.toString())?.get('fileInfo')?.setValue(null);
        }
      }
      dialogRef.close();
      this.operationSuccess();
    }catch(error){
      this.handleError(error);
      dialogRef.close();
    }
  }

  setNovedadesForm(){
    console.log(this.novedades);
    let activities:any[] = this.listas[116].filter( (p:any) => this.includes(this.novedades,'id_tipo_novedad',p.id_tipo));
    console.log(activities);
    let obj = { activity : activities };
    //this.novedadesForm.patchValue(obj);
    this.novedadesForm.get('activity')?.setValue(activities);
    this.novedadesForm.updateValueAndValidity();
  }

  includes(array:any,key:any,id:any){
    return array.filter((p:any) => p[key] == id).length == 0 ? false : true;
  }

  notIncludes(array:any,key:any,id:any){
    return array.filter((p:any) =>p[key] == id).length == 0 ? true : false;
  }

  saveNovedades(){
    let arrayNovedades = {... this.novedadesForm.value}.activity;
    arrayNovedades.forEach((v:any)=>{
      v.idMantenimientoVialEvento = this.mantenimientoVialEvento.id_mantenimiento_vial_evento;
    });
    //arrayInsertar.filter((p:any)=>this.includes(this.novedades,'id_tipo_novedad',p.id_tipo));
    let arrayInsertar = arrayNovedades.filter((p:any)=>!this.includes(this.novedades,'id_tipo_novedad',p.id_tipo));
    console.log('to insert',arrayInsertar);
    let arrayDelete = this.novedades.filter((p:any)=>this.notIncludes(arrayNovedades,'id_tipo',p.id_tipo_novedad));
    console.log('to delete',arrayDelete);

    let operacionesInsertar = arrayInsertar.map(
       (novedad: any) => this.intervencionService.setIntervencionNovedad(novedad)
     );
     let operacionesDelete = arrayDelete.map(
       (novedad:any) => this.intervencionService.deleteIntervencionNovedad(novedad.id_intervencion_novedad)
     );

    forkJoin(operacionesInsertar)
               .subscribe((d:any)=>{
                 this.guardadoTodo = true;
               });
    forkJoin(operacionesDelete)
              .subscribe((d:any)=>{
                this.guardadoTodo = true;
               });
  }

  onSubmit(){
    try{
      this.guardarEncabezado();
      this.guardaAreasIntervencion();
      this.guardarFotos();
      this.saveNovedades();
    }catch(e){
      console.log('El error', e);
      console.error('ERROR al guardar todo');
    }
  }

  addAreaIntervecion(){
    this.openDialogAreaIntervecion(this.areaIntervencionForm.length,null);
  }

  stopPropagation(e:any){
    e.stopPropagation();
  }

  areasIntervencionformToObj(areaIntervencionForm:FormGroup){
    let res:any = {};
    res.idAreaIntervencion = areaIntervencionForm.get('idAreaIntervencion')?.value;
    res.area = areaIntervencionForm.get('area')?.value;
    res.longitud = areaIntervencionForm.get('longitud')?.value;
    res.elemento = areaIntervencionForm.get('elemento')?.value;
    res.idTipoIntervencion = areaIntervencionForm.get('idTipoIntervencion')?.value;
    res.idTipoSuperficie = areaIntervencionForm.get('idTipoSuperficie')?.value;
    res.ancho = areaIntervencionForm.get('ancho')?.value;
    res.idMantenimientoVialEvento = areaIntervencionForm.get('idMantenimientoVialEvento')?.value;
    return res;
  }

  getAreasIntervencion(listaAreasIntervenciion:any){

    for(let area of listaAreasIntervenciion){

      let obj = {
                idAreaIntervencion:area.id_area_intervencion,
                elemento:area.elemento.toString(),
                idTipoSuperficie:area.id_tipo_superficie,
                longitud:area.longitud,
                ancho:area.ancho,
                area:area.area,
                idTipoIntervencion:area.id_tipo_intervencion
              };

      let form = this.fb.group(this.getFormAreaIntervencion());
      form.patchValue(obj);
      this.areaIntervencionForm.push(form);
    }
  }

  guardaAreasIntervencion(){

    let dialogRef = this.mostrarVentanaEnEspera('Guardando');

    let areasIntervencionAActualizar:any[] = [];
    let areasIntervencionAInsertar:any[] = [];
    let idsAreasIntervencionAEliminar: any[] = [];

    let res = {
               'idsAreasIntervencionAEliminar':new Array<any>(),
               'areasIntervencionAInsertar':new Array<any>(),
               'areasIntervencionAActualizar':new Array<any>()};
    //determina las unidades a insertar y actualizar
    let i = 0;
    for(let control of this.areaIntervencionForm.controls){
      let areaIntervencionObj:any = this.areasIntervencionformToObj(control as FormGroup);
      areaIntervencionObj.indexUnidad = i;
      i++;
      areaIntervencionObj.idMantenimientoVialEvento = this.mantenimientoVialEvento.id_mantenimiento_vial_evento;
      if(areaIntervencionObj.idAreaIntervencion){
        areasIntervencionAActualizar.push(areaIntervencionObj);
      }else{
        areasIntervencionAInsertar.push(areaIntervencionObj);
      }
    }

    this.areasIntervencion.forEach((e,i)=>{
      let idx = this.areasIntervencion.findIndex(e =>
        {
          let areaIntervencionObj:any = this.areaIntervencionForm.controls[i] ? this.areasIntervencionformToObj(this.areaIntervencionForm.controls[i] as FormGroup) : {id_area_intervencion:-1};
          return e.idAreaIntervencion == areaIntervencionObj.id_area_intervencion;
        }
      );
      if(idx == -1)
          idsAreasIntervencionAEliminar.push(e.id_area_intervencion);
    });

    res.areasIntervencionAInsertar = areasIntervencionAInsertar;
    res.areasIntervencionAActualizar = areasIntervencionAActualizar;
    res.idsAreasIntervencionAEliminar = idsAreasIntervencionAEliminar;

    let operacionesInsertar = areasIntervencionAInsertar.map(
        areaIntervencion => this.intervencionService.setAreaIntervencion(areaIntervencion)
      );

      let operacionesActualizar = areasIntervencionAActualizar.map(
        areaIntervencion => this.intervencionService.updateAreaIntervencion(areaIntervencion)
      );

      let operacionesEliminar = idsAreasIntervencionAEliminar.map(
        idAreaIntervencion => this.intervencionService.deleteAreaIntervencion(idAreaIntervencion)
      );

      forkJoin(operacionesInsertar)
             .subscribe(respInsert=>{
               respInsert.forEach((r,i)=>{
                 dialogRef.close();
                 let idx = this.areasIntervencion.findIndex(e => e.idAreaIntervencion == areasIntervencionAInsertar[i].idAreaIntervencion);
                 let nuevoId = (respInsert as any)[i].respuesta[0][":b1"];
                 this.areaIntervencionForm.get(idx.toString())?.get('idAreaIntervencion')?.setValue(nuevoId);
               });
             });
      forkJoin(operacionesActualizar)
              .subscribe(respActualizar=>{
                dialogRef.close();
                //console.log(respActualizar);
              });
      forkJoin(operacionesEliminar)
             .subscribe(resDelete=>{
               dialogRef.close();
               for(let i = this.areasIntervencion.length - 1;i>=0;i--){
                 if(idsAreasIntervencionAEliminar.findIndex(id => id == this.areasIntervencion[i].id_area_intervencion) != -1){
                   this.areasIntervencion.splice(i,1);
                 }
               }
             });

    return res;
  }

  saveCambiosAreasIntervencion(){
    this.guardaAreasIntervencion();
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

  async getMantenimientoVialEvento(idMantenimientoVialEvento:number){
    let respServ = await this.mantenimientoVialEventoService.get(idMantenimientoVialEvento);
    this.mantenimientoVialEvento = respServ.respuesta[0];
    //this.mantenimientoVialEvento = await this.tabMantenimientoService.get(idMantenimientoVialEvento);
    //console.log('elEvento', this.mantenimientoVialEvento);
    this.mantenimientoVialEvento['id_mantenimiento_vial_evento'] = idMantenimientoVialEvento;

    this.encabezadoForm.patchValue(this.mantenimientoVialEvento);
    this.observacionesForm.setValue(this.mantenimientoVialEvento.observaciones_diagnostico);
    this.encabezadoForm.get('solicitud_fecha')?.setValue(this.datePipe.transform(this.mantenimientoVialEvento?.solicitud_fecha,'dd/MM/yyyy'));
    this.encabezadoForm.get('codigo_actividad_agrupada')?.setValue(this.mantenimientoVialEvento.codigo_actividad_agrupada +' * '+ this.mantenimientoVialEvento.descripcion_actividad_agrupada);
    this.encabezadoForm.get('fecha_visita_tecnica')?.setValue(this.datePipe.transform(this.mantenimientoVialEvento?.fecha_visita,'dd/MM/yyyy'));
    this.encabezadoForm.updateValueAndValidity();

    return;
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
  openDialogAreaIntervecion(indexUnidad:number,formData:any){

    let newo:Boolean;
    if(indexUnidad == this.areaIntervencionForm.controls.length){
      this.areaIntervencionForm.push(this.fb.group(this.getFormAreaIntervencion()));
      newo = true;
    }else{
      newo= false;
    }
    let data:any = {
                     "indexAreraIntervencion" : indexUnidad,
                     "formData" : this.areaIntervencionForm.get(indexUnidad.toString()),
                     "nuevo" : newo,
                     "filtroAG": this.mantenimientoVialEvento.codigo_actividad_agrupada
                  };
    const dialogRef = this.dialog.open(AreaIntervencionComponent,{
      data: data
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result && result.action == "cancel"){
        //console.log(result);
      }
      if(result && result.action=='delete'){
        this.areaIntervencionForm.removeAt(result.index);
      }else if(result && result.action=='update'){
        if(this.areaIntervencionForm.length == result.index){
          this.areaIntervencionForm.push(result.data)
        }else{
          this.areaIntervencionForm.setControl(result.index.toString(),result.data);
        }
      }else if (result && result.action=='cancel'){
        if(this.areaIntervencionForm.get(result.index.toString())){
          this.areaIntervencionForm.get(result.index.toString())?.setValue(formData);
        }
      }
      this.areaIntervencionForm.markAllAsTouched();
    })
  }


  findTipo(idLista:number, idTipo:number){
    let lista = this.listas[idLista]
    let indexTipo = lista.findIndex((tipo: { id_tipo: number; }) => tipo.id_tipo === idTipo);
    return lista[indexTipo];
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


    async guardarEncabezado(){

      let dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
      let encabezado = new MantenimientoVial();
      encabezado.idMantenimientoVial = this.mantenimientoVialEvento.id_mantenimiento_vial_evento;
      encabezado.idTipoOrigen = this.mantenimientoVialEvento.id_tipo_origen;
      encabezado.fecha = this.datePipe.transform(Date.now(),'yyyy-MM-dd')!;
      //encabezado.solicitudNombre = this.mantenimientoVialEvento.solicitud_nombre;
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
      encabezado.ejeVial = this.encabezadoForm.get('eje_vial')?.value;
      encabezado.desde = this.encabezadoForm.get('desde')?.value;
      encabezado.hasta = this.encabezadoForm.get('hasta')?.value;
      encabezado.idZona = this.encabezadoForm.get('id_zona')?.value;
      encabezado.fechaVisitaTecnica = this.encabezadoForm.get('fecha_visita_tecnica')?.value;
      encabezado.idTipoSeccionVial = this.encabezadoForm.get('id_tipo_seccion_vial')?.value;
      encabezado.idTipoUsoVia = this.encabezadoForm.get('id_tipo_seccion_vial')?.value;
      //encabezado.idTipoMalla = this.encabezadoForm.get('id_tipo_malla')?.value;
      encabezado.rutasTransporte = this.encabezadoForm.get('id_tipo_transitabilidad')?.value;
      encabezado.idTipoTransitabilidad = this.encabezadoForm.get('id_tipo_pmt')?.value;
      encabezado.idTipoPrograma = this.encabezadoForm.get('id_tipo_programa')?.value;
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
      dialogRef.close();
      this.operationSuccess();
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
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

    operationSuccess(){

      this.snackBar.open('Cambios realizados', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
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
    public async generarDocumentoActa(event:any){
      this.generandoFicha = true;
      event.stopPropagation();
      event.preventDefault();
      let extent = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1";
      let bboxSR = "102100";
      try{
        console.log("reporte: ", this.mantenimientoVialEvento);
        let res = await this.utilitariosService.generarActaVerificacion(parseInt(this.idDocumento),this.mantenimientoVialEvento.id_mantenimiento_vial, this.mantenimientoVialEvento.id_mantenimiento_vial_evento, extent, bboxSR, false);
        const blob = new Blob([res.body as BlobPart], { type: 'application/PDF' });
        const url= window.URL.createObjectURL(blob);
        window.open(url);
      }catch(e){
        console.log(e);
      }
      this.generandoFicha = false;
    }
}
