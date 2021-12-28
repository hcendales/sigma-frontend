import { Component, OnInit, Inject, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionMasivaComponent } from 'src/app/shared/components/gestion-masiva/gestion-masiva.component';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';
import { MantenimientoVialEventoService } from '../../../core/services/mantenimiento-vial-evento.service';
import { forkJoin } from 'rxjs';
import { DialogVerVisitaDiagnostico } from 'src/app/mejoramiento/gestion-misionalidad/components/gestionar-seguimiento/gestionar-seguimiento.component';
import { EntityTabEventoService } from 'src/app/core/services/entity-tab-evento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asignar-visitas',
  templateUrl: './asignar-visitas.component.html',
  styleUrls: ['./asignar-visitas.component.scss']
})
export class AsignarVisitasComponent implements OnInit {
  public cargandoComponente :boolean = false;
  public routeReady :boolean = false;
  @ViewChild('mapa') mapElement!: MapaUmvComponent;
  @ViewChild('listaTransicion')
  listaTransicion!: GestionMasivaComponent;
  mapCenter = [-74.113, 4.667];
  basemapType = 'gray';//environment.webMapAllPKsId;
  mapZoomLevel = 12;

  title:string = ""
  idActividad:number = 1460;
  selectedFeatures:any[]=[];

  export_flag = false;

  public acciones :any[] = [];

  displayedColumns: string[] = [];

  constructor(
    public dialog: MatDialog,
    private router:Router,
    private snackBar:MatSnackBar,
    private activatedroute: ActivatedRoute,
    public entityTabEventoService: EntityTabEventoService,
    public mantenimientoVialEventoService:MantenimientoVialEventoService) { }

  ngOnInit(): void {
    this.routeReady = true;
    this.cargandoComponente = true;
    this.activatedroute.paramMap.subscribe(params => {
      this.acciones = [];
      this.idActividad =  Number(params.get('idActividad'));
      switch (this.idActividad) {
        case 1460:
          this.title = "Asignar visita de prediseño";
          this.displayedColumns = [
            'ch','id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
            'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
            'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
            'nombre_responsable_visita', 'requiere_actualizacion_diag','_CTRL_ACCION_TRABAJAR'];
          break;
        case 1620:
          this.displayedColumns = [
            'ch','id_mantenimiento_vial', 'pk_id_calzada', 'civ', 'descripcion_localidad', 'descripcion_zona',
            'descripcion_barrio', 'descripcion_actividad_agrupada', 'priorizacion_trimestre', 'eje_vial', '_CTRL_ACCION_TRABAJAR'];
          this.export_flag = true;
          this.title = "Asigna visita técnica de verificación";
          this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Permite visualizar la ficha de diagnóstico'});
          // this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Permite visualizar el registro de diseño'});
          this.acciones.push({nombre: 'verHistorial',icon:'description',label:null,tooltip:'Permite visualizar historial'});
          break;
        case 1681:
          this.title = "Asignar visita de diseño";
          this.displayedColumns = [
            'ch','id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
            'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
            'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
            'nombre_responsable_visita', 'requiere_actualizacion_diag', '_CTRL_ACCION_TRABAJAR'];
        break;
        case 2:
          this.title = "Asignar visita de diagnostico";
          this.displayedColumns = [
            'ch','id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
            'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
            'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
             '_CTRL_ACCION_TRABAJAR'];
        break;
        default:
          break;
      }
    });
  }

  pkSelectedEvt($event:any){
    this.selectedFeatures = $event;
  }

  filterDataPK($event:any){
    console.log('filtrartabla',$event);
    console.log(this.listaTransicion?.tabTransicion);
    this.listaTransicion.tabTransicion.setValorBusqueda('pk_id_calzada',String($event));
  }
  componenteListo(){
    this.cargandoComponente = false;
    this.dialog.closeAll();
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
  getDataSource($event:any){
    let inArr = $event;
    let inStr = this.getWhereString(inArr);
    let scope = this;
    let ctx = this;
    setTimeout(function(){ ctx.mapElement.PksFL.load().then(()=>{
      scope.mapElement.queryFeatures(inStr);
    }); }, 5000);
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

  handleError(msg: string) {
    this.snackBar.open('Error al realizar la operación: ' + msg, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  async onOpcionSelectedEvt(e:any) {
    console.info("Respuesta");
    console.info(e);
    if(e.opcion == 'verDiseno') {
      const filtro = `id_mantenimiento_vial_evento = ${e.data.id_mantenimiento_vial} and evento = 'DISENIO'`;
      let respServ = await this.entityTabEventoService.obtenerEvento(filtro);
      if(respServ && respServ.codError == 0) {
        console.info("Respuesta");
        console.info(respServ);
        this.dialog.open(DialogVerVisitaDiseno,{height: '85vh',width: '85vw',data:{titulo:"Visita de diseño",dataMantenimiento:respServ.respuesta[0]}});
      } else {
        let msg = '';
        if (respServ) {
          msg = respServ.msgError;
        }
        this.handleError(msg);
      }
    } else if(e.opcion == 'verDiagnostico') {
      this.dialog.open(DialogVerVisitaDiagnostico,{height: '85vh',width: '85vw',data:{titulo:"Visita de diagnóstico",dataMantenimiento:e.data}});
    } else if(e.opcion == 'verHistorial'){
      // console.log('Llamar url + idDocumento mejoramiento-consultas/ver-detalle/:idMantenimientoEvento');
      this.router.navigate(["dashboard/mejoramiento-consultas/ver-detalle/" + e.data.id_mantenimiento_vial]);
    }
  }

  async gestionRealizadaEvt(event:any) {
    let idsMantenimiento = event.evento.map((x:any) => x.id_mantenimiento_vial_evento);
    try{
      let arrayFork = [];
    for(let idMant of idsMantenimiento){
      if(this.idActividad == 1460){
        arrayFork.push(this.mantenimientoVialEventoService.crearMantenimientoVialEvento(idMant,'PREDISENIO'));
      }else if(this.idActividad == 1681){
        arrayFork.push(this.mantenimientoVialEventoService.crearMantenimientoVialEvento(idMant,'DISENIO'));
      }

    }
      forkJoin(arrayFork).subscribe(
        (lista) =>{
          for(let r of lista){
            if(r['codError'] != 0){
              console.error('Error al crear el nuevo evento:',r['msgError']);
            }
          }
        }
      );
    }catch(e){
      console.log(e);
    }
  }
}

@Component({
  selector: 'dialog-ver-visita-diseno',
  templateUrl: 'dialog-ver-visita-diseno.html',
})
export class DialogVerVisitaDiseno {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('la data es:',data);
  }
}
