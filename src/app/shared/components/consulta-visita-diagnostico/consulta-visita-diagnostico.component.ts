import { Component, OnInit, Input} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { ConsultaListasService } from '../../../core/services/consulta-listas.service'
import { EntityTabMantenimientoVialService } from '../../../core/services/entity-tab-mantenimiento-vial.service';
import { EntityTabUnidadMuestreoService } from '../../../core/services/entity-tab-unidad-muestreo-service';
import { EntityTabFallasServiceService } from '../../../core/services/entity-tab-fallas-service.service';
import { EntityTabArchivoServiceService } from '../../../core/services/entity-tab-archivo-service.service';
import { EntityTabAledanioService } from '../../../core/services/entity-tab-aledanio.service';

import { DatePipe } from '@angular/common';

import { UnidadMuestreo } from '../../../core/models/unidad-muestreo';
import { Falla } from '../../../core/models/falla';
import { MantenimientoVial } from '../../../core/models/mantenimiento-vial';
import { Archivo } from '../../../core/models/archivo';
import { EntityTabOtrosFactoresServiceService } from '../../../core/services/entity-tab-otros-factores-service.service';
import { OtroFactor } from '../../../core/models/otro-factor';
import { SimpleDialogComponent } from '../../../core/simple-dialog/simple-dialog.component';
import { MantenimientoVialEventoService } from '../../../core/services/mantenimiento-vial-evento.service';
import { EntityTabApiqueService } from '../../../core/services/entity-tab-apique.service';
import { UtilitariosService } from '../../../core/services/utilitarios.service';
import { environment } from '../../../../environments/environment';
import { CargarDocumentoService } from '../../../core/services/cargar-documento.service';



@Component({
  selector: 'app-consulta-visita-diagnostico',
  templateUrl: './consulta-visita-diagnostico.component.html',
  styleUrls: ['./consulta-visita-diagnostico.component.scss'],
  providers: [ DatePipe ]
})
export class ConsultaVisitaDiagnosticoComponent implements OnInit {

  @Input() idMantenimientoEvento:number = 0;
  @Input() idMantenimientoVial:number = 0;
  @Input() idDocumento:number = 0;
  @Input() idActividad:number = 0;

  //public mantenimientoVial:any;
  public mantenimientoVialEvento:any;
  //public idDocumento: any;
  public unidadesMantenimiento:UnidadMuestreo[] = [];
  public fallasMantenimiento:Falla[] = [];
  public fotosMantenimiento:any[] = [];
  public otrosFactoresMantenimiento:any[] = [];

  public listas:any;

  public ready:boolean = false;

  public URL_FOTOS = environment.URL_FOTOS;

  public step = 0;

  public arrayValores = new Array<any>();
  public dictValores = {} as any;

  public IDS_FALLAS_LONGITUD =  [604, 607, 608, 609, 610, 1567, 645, 648];

  public conUnidadesMuestreo = true;

  public apiques: any[] = [];
  public displayedColumnsApiques: string[] = ['nomenclatura', 'observacion'];

  public generandoFicha: boolean = false;

  //pk id en le que se maercó que este pk es aledaño
  public aledanioDe:String = '';

  constructor(private activatedroute:ActivatedRoute,
              private router:Router,
              private listasService: ConsultaListasService,
              private tabMantenimientoService:EntityTabMantenimientoVialService,
              private tabUnidadMuestreoService:EntityTabUnidadMuestreoService,
              private tabFallasService:EntityTabFallasServiceService,
              private tabArchivoService:EntityTabArchivoServiceService,
              private tabOtroFactorService:EntityTabOtrosFactoresServiceService,
              private datePipe: DatePipe,
              public dialog: MatDialog,
              private snackBar:MatSnackBar,
              private mantenimientoVialEventoService: MantenimientoVialEventoService,
              public entityTabApiqueService:EntityTabApiqueService,
              private utilitariosService:UtilitariosService,
              private entityTabAledanioService:EntityTabAledanioService,
              private cargarDocumentoService:CargarDocumentoService,
  ) {}

  async ngOnInit(){
    //console.log('La actividad!!!!!!!!!!!!!!!', this.idActividad);
    try{
    let operaciones = [
                       this.getMantenimientoVialEvento(this.idMantenimientoEvento),
                       this.getUnidadesYFallas(this.idMantenimientoEvento),
                       this.getOtrosFactores(this.idMantenimientoEvento),
                      ];
                        
    if(this.idDocumento){
      operaciones.push(this.getFotos(this.idDocumento));
    }else{
      console.error('No hay un documento asociado a la captura');
    }
    forkJoin(operaciones).subscribe((lista) => {
      this.conUnidadesMuestreo = this.aplicaUnidadesMuestreo();
      if(this.idActividad == 14 || this.idActividad == 15){
        this.consultarApiques(this.idMantenimientoEvento);
      }
      this.ready = true;
    });

    if(this.mostrarApiquesAforos()){
      let res = await this.entityTabAledanioService.consultarXFiltro("ID_MV_EVENTO_ALEDANIO = " + this.idMantenimientoEvento);
      if(res.codError == 0 && res.respuesta.length > 0){
        let res2 = await this.mantenimientoVialEventoService.get(res.respuesta[0].id_mantenimiento_vial_evento);
        if(res2.codError == 0 && res2.respuesta.length>0){
          this.aledanioDe = String(res2.respuesta[0].pk_id_calzada);
        }
      }
    }
    
    }catch(error){
      this.handleError(error);
    }
  
  }

  async getMantenimientoVialEvento(idMantenimientoVialEvento:number){
    let respServ = await this.mantenimientoVialEventoService.get(idMantenimientoVialEvento);
    this.mantenimientoVialEvento = respServ.respuesta[0];
    console.log('elEvento', this.mantenimientoVialEvento);
    return;
  }

  async getUnidadesYFallas(idMantenimiento:number){
    try{
      await this.getUnidadesMuestreo(idMantenimiento);
      
      let arrayFork = [];
      for(let unidad of this.unidadesMantenimiento){
        arrayFork.push(this.getFallas(unidad.idUnidadMuestreo!));
      }
      await forkJoin(arrayFork);
    }catch(error){
        this.handleError(error);
    }
    console.log('fallas',this.fallasMantenimiento);
  }

  async getUnidadesMuestreo(idMantenimiento:number){

    let respuestaServicio = await this.tabUnidadMuestreoService.get(idMantenimiento);
    if(respuestaServicio.codError !== 0){
      throw respuestaServicio;
    }
    this.unidadesMantenimiento = respuestaServicio.respuesta.map((und:any) => this.serviceResponseToUnidadMuestreo(und as any));
    this.unidadesMantenimiento.sort((a:UnidadMuestreo,b:UnidadMuestreo) => !a?.abscisaInicial?-1:!b?.abscisaInicial?1:(a.abscisaInicial > b.abscisaInicial) ? 1 : ((b?.abscisaInicial > a.abscisaInicial) ? -1 : 0));
    console.log('Unidades de muestreo:',this.unidadesMantenimiento);

  }

  async getFallas(idUnidadMuestreo:number){
    let respuestaServicio = await this.tabFallasService.get(idUnidadMuestreo);
    if(respuestaServicio.codError !== 0){
      throw respuestaServicio;
    }
    this.fallasMantenimiento = [...this.fallasMantenimiento,...respuestaServicio.respuesta.map((falla:any) => this.serviceResponseToFalla(falla as any))];
    for(let falla of this.fallasMantenimiento){
      let index = this.unidadesMantenimiento.findIndex((und:UnidadMuestreo)=>und.idUnidadMuestreo==falla.idUnidadMuestreo);
      if(index != -1){
        falla.indexUnidadMuestreo = index;
      }
      this.arrayValores.push(falla.idTipoFalla);
      this.arrayValores.push(falla.idTipoSeveridad);
      this.arrayValores.push(falla.idTipoIntervencion);
    }
    this.arrayValores = this.arrayValores.filter((x:any)=>{return x!=null});
    if(this.arrayValores.length > 0){
      this.dictValores = {...this.dictValores,...await this.listasService.consultarTipos(this.arrayValores)};
    }
    this.fallasMantenimiento.sort((a:Falla,b:Falla) => !a?.indexUnidadMuestreo?-1:!b?.indexUnidadMuestreo?1:(a.indexUnidadMuestreo > b.indexUnidadMuestreo) ? 1 : ((b?.indexUnidadMuestreo > a.indexUnidadMuestreo) ? -1 : 0));
    console.log('dictValores',this.dictValores);
    console.log('Fallas ',this.fallasMantenimiento, idUnidadMuestreo);
  }

  async getOtrosFactores(idMantenimientoVial:number){

    let res:any = await this.tabOtroFactorService.get(idMantenimientoVial);
    if(res.codError != 0){
      throw res;
    }else{
      let ListaOtrosFactores = res.respuesta;
      for(let otroFactor of ListaOtrosFactores){
        let objFactor = {idOtroFactor:otroFactor.id_otro_factor,tipoFactor:otroFactor.id_tipo_otro_factor};
        this.otrosFactoresMantenimiento.push(objFactor);
        this.arrayValores.push(objFactor.tipoFactor);
      }
      if(this.arrayValores.length > 0){
        this.dictValores = {...this.dictValores,...await this.listasService.consultarTipos(this.arrayValores)};
      }
      console.log('otros factores', this.otrosFactoresMantenimiento);
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
      }
      console.log('Fotos',this.fotosMantenimiento);
    }

  }

  serviceResponseToUnidadMuestreo(unidadResponse:any){
    let res:UnidadMuestreo = new UnidadMuestreo();
    res.idUnidadMuestreo = unidadResponse.id_unidad_muestreo;
    res.abscisaInicial = unidadResponse.abscisa_inicial;
    res.abscisaFinal = unidadResponse.abscisa_final;
    res.ancho = unidadResponse.ancho;
    res.area = unidadResponse.area;
    res.pci = unidadResponse.pci;
    return res;
  }

  serviceResponseToFalla(fallaResponse:any){
    let res:Falla = new Falla();
    res.idFalla = fallaResponse.id_falla;
    res.distancia = fallaResponse.distancia;
    res.idTipoSuperficie = fallaResponse.id_tipo_superficie;
    res.idTipoFalla = fallaResponse.id_tipo_falla;
    res.idTipoSeveridad = fallaResponse.id_tipo_severidad;
    res.longitud = fallaResponse.longitud;
    res.ancho = fallaResponse.ancho;
    res.area = fallaResponse.area;
    res.idTipoIntervencion = fallaResponse.id_tipo_intervencion;
    res.numeroLosas = fallaResponse.numero_losas;
    res.idUnidadMuestreo = fallaResponse.id_unidad_muestreo;
    return res;
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

  setStep(index: number) {
    this.step = index;
  }
  nextStep(){
    this.step++;
  }
  prevStep(){
    this.step--;
  }
/*
 async coso(){
    let a = await this.listasService.consultarTipos([610,922]);

    console.log('coso', a);
  }
*/
  esFallaLongitudinal(idFalla:any){
    return this.IDS_FALLAS_LONGITUD.includes(idFalla);
  }

  aplicaUnidadesMuestreo(){
    //revisa si para el tipo de superficie aplican unidades de muestreo
    let tiposSuperficieUnidad = [1102,1103,1105,1106];//tipos de superficie para los que aplica unidad de muestreo
    return tiposSuperficieUnidad.indexOf(this.mantenimientoVialEvento.id_tipo_superficie) != -1
  }

  async consultarApiques(idEvento:number){
    try{
      let respServ = await this.entityTabApiqueService.list1(idEvento);
      if(respServ.codError == 0){
        this.apiques = respServ.respuesta;
        this.apiques.sort((a:any,b:any) => (a.nomenclatura > b.nomenclatura) ? 1 : (b.nomenclatura > b.nomenclatura) ? -1 : 0);
      }else{
        this.handleError(respServ);
      }
    }catch(e){
      this.handleError(e);
    }
    
    
  }

  public async generarDocumentoActa(event:any){
    this.generandoFicha = true;
    event.stopPropagation();
    event.preventDefault();

    let res = await this.cargarDocumentoService.consultarXFiltro("id_documento = " +this.idDocumento);
    if(res.codError == 0){
      
      if(res.respuesta.length>0 && res.respuesta[0].valor_estado_documento == 'EN FIRME'){
        //si el documento existe, llama el servicio de consultar.
        try{
          let res = await this.tabArchivoService.consultarDocumentoAdjunto(this.idDocumento);
          const blob = new Blob([res.body as BlobPart], { type: 'application/PDF' });
          const url= window.URL.createObjectURL(blob);
          window.open(url);
        }catch(e){
          console.log(e);
        }
      }else{  
        //si el documento no existe llama el servicio de generarActa
        let extent = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1";
        let bboxSR = "102100";
        try{
          let res = await this.utilitariosService.generarActaDianostico(this.idDocumento,this.idMantenimientoVial, this.idMantenimientoEvento, extent, bboxSR, this.idActividad, false);
          const blob = new Blob([res.body as BlobPart], { type: 'application/PDF' });
          const url= window.URL.createObjectURL(blob);
          window.open(url);
        }catch(e){
          console.log(e);
        }
      }
    }else{
      this.snackBar
    }
      
    
    
    this.generandoFicha = false;
  }

  mostrarApiquesAforos(){
    return this.idActividad == 13 || this.idActividad == 15 || this.idActividad == 25;
  }
  


  
}
