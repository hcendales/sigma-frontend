import { EventEmitter, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { EntityTabMantenimientoVialService } from 'src/app/core/services/entity-tab-mantenimiento-vial.service';
import { VincularRadicadoService } from 'src/app/core/services/vincular-radicado.service';
import { BuscarRadicadoComponent } from 'src/app/mejoramiento/gestion-reserva/components/buscar-radicado/buscar-radicado.component';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';
import { TablaRadicadoVinculadoComponent } from '../tabla-radicado-vinculado/tabla-radicado-vinculado.component';

@Component({
  selector: 'app-gestionar-peticionario',
  templateUrl: './gestionar-peticionario.component.html',
  styleUrls: ['./gestionar-peticionario.component.scss']
})
export class GestionarPeticionarioComponent implements OnInit {
  mapCenter = [-74.113, 4.667];
  mapZoomLevel = 12;
  basemapType = "gray";
  inStr:string = '';
  tipoRad = 'Salida';
  respuestaSeleccionada:number = 1;
  strActividad:string = '';
  strStep:string = '';
  selectedFeatures:any[]=[];
  public cargandoComponente :boolean = false;
  public routeReady :boolean = false;
  public sending :boolean = false;
  @ViewChild('mapa') mapElement!: MapaUmvComponent;
  @ViewChild('buscarRadicado')
  buscarRadicado!: BuscarRadicadoComponent;
  @Output() dataSource = new EventEmitter();
  @Output() selecteDataSource = new EventEmitter();
  @ViewChild('listaTransicion')
  tabRadicados!: TablaRadicadoVinculadoComponent;

  constructor(public dialog: MatDialog,
      public entityMantenimientoService: EntityTabMantenimientoVialService,
      public vincularService: VincularRadicadoService) { }

  ngOnInit(): void {
    this.cargandoComponente = true;
    this.routeReady = true;
    //this.respuestaSeleccionada = 1;
  }
  filterDataPK($event:any){
      console.log('filtrartabla',$event);
      this.tabRadicados.search9.setValue($event);
  }
  clearFilters($event:any){
      console.log('filtrartabla',$event);
      this.tabRadicados.search9.setValue('');
  }
  pkSelectedEvt($event:any){
    this.selectedFeatures = $event;
  }
  irAPk($event:string){
    this.mapElement.goTo($event);
  }
  componenteListo(){
    this.cargandoComponente = false;
    this.dialog.closeAll();
  }
  vincular(pkId:any, idMant?:any){
    let dataS = this.tabRadicados.dataSource.data;
    let peticionarioArray: any[] = [];
    let idRad = dataS.filter((val)=>{
      return val.pk_id_calzada == pkId;
    });
    idRad.forEach((rad)=>{
      let radicadoVinculado = {
          idRadicadoVinculado: rad.id_radicado_vinculado,
          pkIdCalzada:rad.pk_id_calzada,
          idTipoDestinoRadicado:11,
          numeroRadicado:rad.numero_radicado,
          fechaRadicado:rad.fecha_radicado,
          remitente:rad.remitente,
          entidad:rad.entidad,
          dirigidoA:rad.dirigida_a,
          fechaVencimiento:rad.fecha_vencimiento,
          fechaVinculacion:rad.fecha_vinculacion,
          fechaRadicadoSalida: this.buscarRadicado.radicado.radi_fech_radi,
          numeroRadicadoSalida:this.buscarRadicado.radicadoStr,
          fechaDesvinculacion:Date.now(),
          registroActivo:"SI"
      } as any;
      if(idMant)
        radicadoVinculado['idMantenimientoVial'] = {"idMantenimientoVial":idMant}
      peticionarioArray.push(this.vincularService.update(radicadoVinculado));
    });
    return peticionarioArray;
  }
  gestionar(){
    this.sending = true;
    let idMant:any[]=[];
    let data = this.selectedFeatures;
    let requestArray: any[] = [];
    data.forEach(value => {
      console.log('sel pk:', value);
      if(this.respuestaSeleccionada==1){
        this.strStep = "Creando gestión de mantenimiento (Solicitar Programación)";
        requestArray.push(this.entityMantenimientoService.insert({pkIdCalzada:value,idTipoOrigen:371}));
      } else {
        this.strStep = "Actualizando peticionario (Vinculando salida)";
        requestArray = requestArray.concat(this.vincular(value));
      }
    });
    if(this.respuestaSeleccionada==1){
      console.log('Req1: ',requestArray);
      forkJoin(requestArray).toPromise().then((lista: any[]) => {
        console.log('Created: ',lista);
        this.strStep = "Actualizando peticionario (Vinculando salida)";
        requestArray = [];
        lista.forEach((val:any, i:number)=>{
          //let idMantenimiento = val.respuesta[0].id_mantenimiento_vial_evento;
          //let idGestion = val.respuesta[0].id_proceso_gestion;
          //let idDocumento = val.respuesta[0].id_documento;
          requestArray = requestArray.concat(this.vincular(data[i],val.respuesta[0].id_mantenimiento_vial_evento));
        });
        console.log('Req2: ',requestArray);
        forkJoin(requestArray).toPromise().then((listaRad: any[]) => {
          console.log('Updated: ',listaRad);
          this.tabRadicados.ngOnInit();
          this.sending = false;
          this.selectedFeatures = [];
          this.mapElement.selectFeatures('1<1');
        });
      });
    } else {
      console.log('Req0: ',requestArray);
      forkJoin(requestArray).toPromise().then((listaRad: any[]) => {
        console.log('Updated: ',listaRad);
        this.tabRadicados.ngOnInit();
        this.sending = false;
        this.selectedFeatures = [];
        this.mapElement.selectFeatures('1<1');
      });
    }
  }

  selTipoResp() {
    if(this.respuestaSeleccionada == 1)
      this.strActividad = "Programar visita técnica";
    else
      this.strActividad = "Vincular salida";
  }

  getWhereString(inArr:any[]){
    let inStr = 'PK_ID_ELEMENTO in (';
    let M:any[] = [];
    inArr.forEach((val)=>{
      console.log('selpetic: ', val);
       if(!(M.includes(val.pk_id_calzada)))M.push(val.pk_id_calzada);
    });
    M.forEach((v:any,i:number)=>{
      if(i<M.length-1)
        inStr += v + ',';
      else
        inStr += v + ')';
    });
    return inStr;
  }
  getDataSource($event:any){
    let inArr = $event;
    this.inStr = this.getWhereString(inArr);
    console.log('pks',this.inStr);
    if(!this.cargandoComponente)
      this.queryPKs(true);
    /*setTimeout(function(){ scope.mapElement.PksFL.load().then(()=>{
      scope.mapElement.queryFeatures(inStr);
    }); }, 8000);*/
  }
  queryPKs($event:any){
    let scope = this;
    this.mapElement.PksFL.load().then(()=>{
      scope.mapElement.queryFeatures(this.inStr);
    });
    this.componenteListo();
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
}
