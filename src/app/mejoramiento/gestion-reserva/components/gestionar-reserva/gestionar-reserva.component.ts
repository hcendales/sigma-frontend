import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EntityTabMantenimientoVialService } from 'src/app/core/services/entity-tab-mantenimiento-vial.service';
import { GestionService } from 'src/app/core/services/gestion.service';
import { MantenimientoVialEventoService } from 'src/app/core/services/mantenimiento-vial-evento.service';
import { UtilitariosService } from 'src/app/core/services/utilitarios.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { BuscarRadicadoComponent } from '../buscar-radicado/buscar-radicado.component';
import { TablaGestionPendienteComponent } from '../tabla-gestion-pendiente/tabla-gestion-pendiente.component';

@Component({
  selector: 'app-gestionar-reserva',
  templateUrl: './gestionar-reserva.component.html',
  styleUrls: ['./gestionar-reserva.component.scss']
})
export class GestionarReservaComponent implements OnInit {
  // Indice que esta activo
  active = 0;
  currentTabIndex:number = -1;
  @ViewChild('buscarRadicado')
  buscarRadicado!: BuscarRadicadoComponent;
  @ViewChildren('tablaSolicitudesGestionPendiente')
  tablaSolicitudesGestionPendienteComponent!: any;
  //@ViewChild('seleccionActividadDestinoMult') seleccionActividadDestinoMult: SeleccionActividadesDestinoComponent;
  //@ViewChild('CalculokmCarrilImpacto') calculokmCarrilImpacto: CalculoKmCarrilImpactoComponent;
  //@ViewChild('gestionSolicitud') gestionSolicitudComponent: GestionSolicitudComponent;
  //mapCenter = [-74.113, 4.667];
  //basemapType = 'gray';//environment.webMapAllPKsId;
  //mapZoomLevel = 12;
  tipoRad!: string;
  checkKey!: string;
  checkVal: any;
  solCargada: boolean | undefined;
  totalesKmCarrilImpacto!: { seleccionados: number; total: number; discriminado: any[]; };
  idsProcesoGestion!: any[];
  actDestino: number = 0;
  objDestino!: any;
  tablaReady!: boolean;
  avanzarGestion!: boolean;
  actualizaGestion!: boolean;
  listPriorizar: any[] = [];
  listDisenio: any[] = [];
  listaGestiones: any[] = [];
  transiciones: any = [];
  constructor(private activatedRoute: ActivatedRoute, private sanitization: DomSanitizer,
    private solicitudesMantenimientoService: GestionService, private mantService: MantenimientoVialEventoService,
    private router: Router, private UtilitariosService: UtilitariosService, public dialog: MatDialog) {
  }
  ngOnInit (){
      this.tipoRad = 'Salida';
      this.checkKey = 'numero_radicado_sol_reserva';
      this.objDestino = {} as any;
      this.totalesKmCarrilImpacto = {seleccionados:0,total:0,discriminado:[]};
      this.idsProcesoGestion = [];
      this.tablaReady = false;
      this.avanzarGestion = false;
      this.actualizaGestion = false;
      this.solicitudesMantenimientoService.listarTransicionesPorActividad(11).then((resp: any) => {
        //console.log('Yas: ',resp.respuesta);
        this.transiciones = resp.respuesta;
        //this.cargarGestiones();
      });
  }
  async onTabChange(e: any){
    if(e == -1){
      return;
    }
    //this.tipoRad = 'Salida'
    this.currentTabIndex = e;
    console.log('tabIdx: ',this.currentTabIndex);
    this.listaGestiones = [];
    let resp = await this.solicitudesMantenimientoService.listarBandejaGestionTransicion(11,Number(this.transiciones[this.currentTabIndex]["id_actividad_transicion"]));
    this.listaGestiones = resp.respuesta;
    this.objDestino = this.transiciones[this.currentTabIndex];
    //console.log('List: ',this.listaGestiones);
    //console.log('dest: ',this.objDestino);
    console.log(this.tablaSolicitudesGestionPendienteComponent.toArray());
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].dataSourceSolicitudes.data = [...this.listaGestiones];
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].dataSourceSolicitudes._updateChangeSubscription();
    this.setTable();
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].ngOnInit();
  }
  cargarGestiones(){
    let arrAg = ["CC", "RH", "FE", "FEM", ""];
    this.solicitudesMantenimientoService.listarBandejaGestionPendiente(11).then((resp: any) => {
      resp.respuesta.forEach((value:any) => {
        if(!(value['codigo_actividad_agrupada']) || arrAg.indexOf(value['codigo_actividad_agrupada'].toString()) != -1)
          this.listDisenio.push(value);
        else
          this.listPriorizar.push(value);
      });
    });
  }
  setTable(){
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].checkKey = this.checkKey;
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].checkVal = false;
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].numEnabled = 0;
    this.tablaReady = true;
    console.log('ready:',this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex]);
  }
  aprobarMultiplesSolicitudes () {
    let requestArray: any[] = [];
    let data = this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].dataSourceSolicitudes.data;
    data.forEach((value:any) => {
      let evento:string = '';
      if(this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].selection.isSelected(value['id_mantenimiento_vial'])){
          if(this.buscarRadicado.tipoRad == "Entrada")
            evento = 'numero_Radicado_Res_Reserva;';
          else
            evento = 'numero_Radicado_Sol_Reserva';
          requestArray.push(this.mantService.actualizarCampo(value['id_mantenimiento_vial_evento'],evento+';',this.buscarRadicado.radicadoStr+';'));
        }
    });
    console.log(this.buscarRadicado.tipoRad+': ', requestArray);
    forkJoin(requestArray).toPromise().then((lista) => {
      console.log('Updated: ',lista);
      if(this.tipoRad=='Entrada')
        this.avanzarGestion  = true;
      else {
        const dialogRef = this.dialog.open(SimpleDialogComponent,{
          data: {
            titulo: 'Se vincula radicado Orfeo de Salida',
            contenido: '',
            aceptar: false,
            cancelar: false,
            cerrar: true
          }
        });
        dialogRef.afterClosed().subscribe((result:any) => {
          this.onTabChange(this.currentTabIndex);
          //this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].dataSourceSolicitudes._updateChangeSubscription();
          //this.setTable();
          //this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].ngOnInit();
          //return;
        });
      }
    });
  }

  selTipoRad( ) {
    console.log(this.tipoRad);
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].selection.clear();
    //this.tablaSolicitudesGestionPendienteComponent.dataSourceSolicitudes._updateChangeSubscription();
    if (this.tipoRad == 'Entrada') {
        this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].checkVal = true;

    } else {
        this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].checkVal = false;
    }
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].verificarRegHabilitados();
  }

  vincularG() {
    this.actualizaGestion=false;
    this.ngOnInit();
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].selection.clear();
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].ngOnInit();
  }
  vincular(){

  }
  async clickSelectSolicitudGestionPendiente (event: any) {
    //console.log(event);
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].disabledChecks = true;
    try {
      let selItems = this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].selection.selected;
      let data = this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].dataSourceSolicitudes.data;
      data = data.filter((p:any)=>this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].selection.isSelected(p.id_mantenimiento_vial));
      this.idsProcesoGestion = data.map((p:any)=>p.id_proceso_gestion);
      //console.log('selPiD: ', this.idsProcesoGestion);
      let objDisc = {} as any;
      for(let idt of data){
        objDisc[idt.codigo_actividad_agrupada] = objDisc[idt.codigo_actividad_agrupada]?objDisc[idt.codigo_actividad_agrupada] + idt.km_carril_impacto:idt.km_carril_impacto;
      }

      let arrayDisc = [];
      let total = 0;
      for(let d in objDisc){
        arrayDisc.push({codigo_actividad_agrupada:d,km_carril_impacto:Math.round(objDisc[d]*100)/100});
        total += Number(objDisc[d]);
      }

      this.totalesKmCarrilImpacto.seleccionados = selItems.length;
      this.totalesKmCarrilImpacto.discriminado = arrayDisc;
      this.totalesKmCarrilImpacto.total = Math.round(total*100)/100;
    }catch(e){
      console.log(e);
    }
    this.tablaSolicitudesGestionPendienteComponent.toArray()[this.currentTabIndex].disabledChecks = false;
  }

  desSeleccionGestionPendiente(event: any){
    console.log('se reeeesta la cosa: ');
    console.log(event);
    let arrayDisc: any[];
    arrayDisc=this.totalesKmCarrilImpacto.discriminado.filter((val)=>{
      return val.codigo_actividad_agrupada == event.codigo_actividad_agrupada;
    });
    let idx = this.totalesKmCarrilImpacto.discriminado.indexOf(arrayDisc[0]);
    if((Math.round((arrayDisc[0].km_carril_impacto-event.km_carril_impacto)*100)/100)==0)
      this.totalesKmCarrilImpacto.discriminado.splice(idx,1);
    else
      this.totalesKmCarrilImpacto.discriminado[idx].km_carril_impacto = Math.round((this.totalesKmCarrilImpacto.discriminado[idx].km_carril_impacto - event.km_carril_impacto)*100)/100;
    this.totalesKmCarrilImpacto.total = Math.round((this.totalesKmCarrilImpacto.total - event.km_carril_impacto)*100)/100;
  }

  desSeleccionTotal(){
    this.idsProcesoGestion = {}as any;
    this.totalesKmCarrilImpacto={}as any;
    this.actDestino = 6;
    //this.calculokmCarrilImpacto.borrarCalculos();
  }
  setTipoRespuesta(event: any){
    //this.gestionService.listarTransicionesPorActividad(this.idActividad);
    console.log(event)
    if(event=="0") {
      this.objDestino = this.transiciones[1];
      console.log('dest: ',this.objDestino);
    }
  }
  gestionRealizadaEvt(){
    this.idsProcesoGestion = {}as any;
    this.totalesKmCarrilImpacto={}as any;
    this.ngOnInit();
  }
  processGeoData(evt:any){
    console.log("geodata",evt);
  }
}
