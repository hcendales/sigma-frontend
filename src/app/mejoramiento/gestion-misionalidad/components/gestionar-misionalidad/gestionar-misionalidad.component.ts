import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Routes, Router, ActivatedRoute, Params } from '@angular/router';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, ValidationErrors, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { UtilitariosService } from '../../../../core/services/utilitarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogVerVisitaDiagnostico } from '../gestionar-seguimiento/gestionar-seguimiento.component';
import { CargarDocumentoService } from '../../../../core/services/cargar-documento.service'; 



import { MapaUmvComponent } from '../../../../shared/components/mapa-umv/mapa-umv.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gestionar-misionalidad',
  templateUrl: './gestionar-misionalidad.component.html',
  styleUrls: ['./gestionar-misionalidad.component.scss']
})
export class GestionarMisionalidadComponent implements OnInit {

  public idActividad:number = -1;
  public titulo:string = '';
  public routeReady :boolean = false;
  public cargandoComponente :boolean = false;
  public formFiltros:FormGroup;
  public barrios: any[] = [];
  public consultaDivTerritorial:boolean = false;
  public listas:any = {};
  //////////////
  public mostrarOpcionDefaultTabla:boolean = true;
  public acciones:any[] = [];
  public tituloBton = ""
  public cargueAutomatico:boolean = false;
  public export_flag:boolean = false;

  @ViewChild('gestionMasivaComponent') gestionMasivaComponent:any;
@ViewChild('mapa') mapElement!: MapaUmvComponent;

mapCenter = [-74.113, 4.667];
basemapType = 'gray';//environment.webMapAllPKsId;
mapZoomLevel = 12;

selectedFeatures:any[]=[];

  constructor(private activatedroute: ActivatedRoute,public dialog: MatDialog,public fb:FormBuilder, public listasService:ConsultaListasService, public utilitariosService:UtilitariosService, private snackBar:MatSnackBar, private cargarDocumentoService:CargarDocumentoService) {
    this.formFiltros = this.fb.group({
      pkIdCalzada: [''],
      idLocalidad: [''],
      idBarrio: [''],
      idOrigen: [''],
      codigoActividadAgrupada: [''],
    });
  }

  async ngOnInit() {
    //this.mostrarVentanaEnEspera("Cargando");

    this.cargandoComponente = true;

    this.activatedroute.paramMap.subscribe(params => {
      this.cargandoComponente = true;

      this.routeReady = false;
      this.idActividad =  Number(params.get('idActividad'));
      console.log('La actividad es:', this.idActividad);
      if(this.idActividad == 9){
        this.titulo = 'Gestionar seguimiento';
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
        this.mostrarOpcionDefaultTabla = false;
      }else if (this.idActividad == 10){
        this.titulo = 'Gestionar misionalidad';
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
        this.mostrarOpcionDefaultTabla = false;
      }else if(this.idActividad == 5){
        this.titulo = 'Validar visita de diagnóstico';
      }else if(this.idActividad == 15){
        this.titulo = 'Validar visita de prediseño';
      }else if(this.idActividad == 1561){
        this.titulo = 'Gestionar visitas de pre-diseño';
      }else if(this.idActividad == 1540){
        this.titulo = 'Validar visita de diseño';
      }else if(this.idActividad == 6){
        this.titulo = 'Priorizar intervenciones';
        this.cargueAutomatico = true;
        this.mostrarOpcionDefaultTabla = false;
        this.export_flag = true;
      }else if(this.idActividad == 12){
        this.titulo = 'Validar priorización';
      }else if(this.idActividad == 26){
        this.titulo = 'Gestionar visitas de diseño';
      }else if(this.idActividad == 1821){
        this.titulo = 'Gestionar cambios de diagnóstico';
      }
      let ctx = this;
      setTimeout(function(){ ctx.routeReady = true; }, 0);
    });
    //7 barrios
    //15 origenes
    //2001 actividades agrupadas
    this.listas = await this.listasService.consultarListas([7,15,2001]);
    this.listas[7].sort((a:any,b:any) => (a.valor > b.valor) ? 1 : ((b?.valor > a.valor) ? -1 : 0));
    //obtiene las listas agrupadas
    let actAgDict = {} as any;
    let arrActAg = [];
    for(let ag of this.listas[2001]){
      actAgDict[ag.descripcion] = true;
    }
    for(let key in actAgDict){
      arrActAg.push(key);
    }
    arrActAg.sort();
    this.listas[2001] = arrActAg;
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

  componenteListo(){
    this.cargandoComponente = false;
    this.dialog.closeAll();
  }

  ejecutarCargue(){

    let valueFiltro = this.formFiltros.value;
    let filtro = {
      pkIdCalzada:valueFiltro.pkIdCalzada,
      idLocalidad:valueFiltro.idLocalidad?.id_tipo,
      idBarrio:valueFiltro.idBarrio,
      idOrigen:valueFiltro.idOrigen?.id_tipo,
      codigoActividadAgrupada:valueFiltro.codigoActividadAgrupada,
    }
    this.gestionMasivaComponent.cargarData(filtro);
  }

  async localidadSelected(){
    this.consultaDivTerritorial = true;
    let valorLocalidad = this.formFiltros.get('idLocalidad')?.value?.valor;

    if(!valorLocalidad){
      this.barrios = [];
      this.consultaDivTerritorial = false;
      this.formFiltros.get('idBarrio')?.setValue(null);
      return;
    }
    let respServ = await this.utilitariosService.consultarDivTerritorial(valorLocalidad, null, null, null);
    if(respServ.codError == 0){
      this.barrios = [];
      this.consultaDivTerritorial = false;
      let barriosDict = {} as any;
      for(let a of respServ.respuesta){
        if(!barriosDict[String(a.id_barrio)]){
          barriosDict[String(a.id_barrio)] = a;
        }
      }
      for(let key in barriosDict){
        this.barrios.push(barriosDict[key]);
      }

      this.barrios.sort((a:any,b:any) => (a.nom_sector > b.nom_sector) ? 1 : ((b?.nom_sector > a.nom_sector) ? -1 : 0));
    }else{
      this.handleError('Error al consultar Barrios');
      this.consultaDivTerritorial = false;
    }
  }

  handleError(msg?:string){
    this.snackBar.open(msg?msg:'Error al realizar la consulta', 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  limpiarCampos(){
    if(!this.formFiltros){
      return;
    }
    this.barrios = [];
    for(let c in this.formFiltros.controls){
        this.formFiltros.get(c)?.setValue(null);
    }
  }
  cambioPestanaEvt(){
    this.limpiarCampos();
  }
  getDataSource($event:any){
    let inArr = $event;
    let inStr = this.getWhereString(inArr);
    let scope = this;
    this.mapElement.PksFL.load().then(()=>{
      scope.mapElement.queryFeatures(inStr);
    });
  }

  getSelecteDataSource($event:any){
    let inArr = $event;
    console.log(inArr);
    let inStr = '1<1';
    if(inArr.length > 0){
       inStr = this.getWhereString(inArr);
    }

    let scope = this;
    this.mapElement.PksFL.load().then(()=>{
      console.log(inStr);
      scope.mapElement.selectFeatures(inStr);
    });
  }

  getWhereString(inArr:any[]){
    let inStr = 'PK_ID_ELEMENTO in (';
    let M = inArr.length - 1;
    inArr.forEach((v:any,i:number)=>{
      if(i<M)
         inStr += v.pk_id_calzada + ',';
      else
         inStr += v.pk_id_calzada + ')';
    });
    return inStr;
  }

  pkSelectedEvt($event:any){
    this.selectedFeatures = $event;
  }

  onOpcionSelectedEvt(e:any){

    if(e.opcion == 'verDiagnostico'){
      this.dialog.open(DialogVerVisitaDiagnostico,{height: '85vh',width: '85vw',data:{titulo:"Visita de diagnóstico",dataMantenimiento:e.data}});
    }
  }

  async gestionRealizadaEvt(e:any){
      
      if((this.idActividad == 5 || this.idActividad == 15) && (e.transicion == 69 || e.transicion == 12 || e.transicion == 2105)){
        console.log('**GENRA ACTAS DE VISITA **');
        for(let gestion of e.evento){
          let idDocumento = gestion.id_documento;
          let idMantenimientoVial = gestion.id_mantenimiento_vial;
          let idMantenimientoVialEvento = gestion.id_mantenimiento_vial_evento;
          let extent = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1";
          let bboxSR = "102100";
          let res = await this.utilitariosService.generarActaDianostico(idDocumento,idMantenimientoVial, idMantenimientoVialEvento, extent, bboxSR,this.idActividad, true);
          //console.log('La res de la generación', res);
        }
      }
      if(this.idActividad == 6 && (e.transicion == 24 || e.transicion == 24)){
        console.log('**GENERA MEMORANDO **');
        let documento = {
          idTipoDocumento:244,
          idTipoEstadoDocumento:18,
          fecha:new Date().getTime(),
          registroActivo:'SI'
        }
        let resp = await this.cargarDocumentoService.crearDocumento(documento);
        console.log('la resp',resp);
        
        if(resp.codError == 0 && JSON.parse(resp.respuesta[0].json).codError == 0){
          let idDocumento = JSON.parse(resp.respuesta[0].json).respuesta[0].id_documento;
          let arrayPeticiones:any[] = e.evento.map((gestion:any) =>{ return this.utilitariosService.asociarDocumentoAMantenimiento(idDocumento, gestion.id_mantenimiento_vial)});
          let respuestasPeticiones:any[] = await forkJoin(arrayPeticiones).toPromise();
          console.log('las respuestas peticiones', respuestasPeticiones);
          for(let r of respuestasPeticiones){
            console.log('la r', r);
            if(r.codError != 0){
              this.snackBar.open(r.msgError, 'X', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
              return;
            }
          }
          this.snackBar.open('Memorandos generados', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        }else{
          this.snackBar.open(resp.msgError, 'X', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return;
        }
      }else if(this.idActividad == 44 && e.transicion == 43){
        console.log('**GENRA ACTAS DE VISITA ALCALDÍAS**')
        for(let gestion of e.evento){
          let idDocumento = gestion.id_documento;
          let idMantenimientoVial = gestion.id_mantenimiento_vial;
          let idMantenimientoVialEvento = gestion.id_mantenimiento_vial_evento;
          let extent = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1";
          let bboxSR = "102100";
          let res = this.utilitariosService.generarActaDianostico(idDocumento,idMantenimientoVial, idMantenimientoVialEvento, extent, bboxSR,this.idActividad, true);
      }
    }
  }
}
