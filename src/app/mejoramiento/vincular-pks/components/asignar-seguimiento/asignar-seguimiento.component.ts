import { EventEmitter, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { EntityTabMantenimientoVialService } from 'src/app/core/services/entity-tab-mantenimiento-vial.service';
import { VincularRadicadoService } from 'src/app/core/services/vincular-radicado.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';
import { TablaRadicadoVinculadoComponent } from '../tabla-radicado-vinculado/tabla-radicado-vinculado.component';
import { TablaSeguimientosComponent } from '../tabla-seguimientos/tabla-seguimientos.component';

@Component({
  selector: 'app-asignar-seguimiento',
  templateUrl: './asignar-seguimiento.component.html',
  styleUrls: ['./asignar-seguimiento.component.scss']
})
export class AsignarSeguimientoComponent implements OnInit {
  mapCenter = [-74.113, 4.667];
  mapZoomLevel = 12;
  basemapType = "gray";
  inStr:string = '';
  tipoRad = 'Salida';
  respuestaSeleccionada:number = 1;
  strActividad:string = 'Asignar seguimiento';
  strStep:string = '';
  tempSel:any[]=[];
  selectedFeatures:any[]=[];
  totalesKmCarrilImpacto:any={}as any; //contiene los km carril impacto por transición
  public dataVinc:any[] = [];
  public cargandoComponente :boolean = false;
  public routeReady :boolean = false;
  public sending :boolean = false;
  @ViewChild('mapa') mapElement!: MapaUmvComponent;

  @Output() dataSource = new EventEmitter();
  @Output() selecteDataSource = new EventEmitter();
  @ViewChild('listaSeguimientos')
  tabSeguimientos!: TablaSeguimientosComponent;

  constructor(public dialog: MatDialog,
      public entityMantenimientoService: EntityTabMantenimientoVialService,
      public vincularService: VincularRadicadoService) { }

  ngOnInit(): void {
    this.cargandoComponente = true;
    this.routeReady = true;
    this.cargaMapa(true);
    //this.respuestaSeleccionada = 1;
  }
  addMantenimientoPk(event:any){
    console.log("Mant: ",event);
    this.tabSeguimientos.agregarPk(event);
    this.dataVinc = this.tabSeguimientos.dataSource.data;
  }
  addMultiplePk(event:any){
    console.log("Mant multi: ",event);
    this.tabSeguimientos.agregarPKs(event);
    this.dataVinc = this.tabSeguimientos.dataSource.data;
  }
  filterDataPK($event:any){
      console.log('filtrartabla',$event);
      this.tabSeguimientos.formControls[0].setValue($event);
  }
  clearFilters($event:any){
      console.log('filtrartabla',$event);
      this.tabSeguimientos.formControls[0].setValue('');
  }
  pkSelectedEvt($event:any){
    console.log('hey',$event);
    this.tempSel = [];
    if($event.length==0){
      this.tempSel = $event;
    } else {
      $event.forEach((i:any)=>{
        this.tempSel.push(i);
      });
    }
    this.selectedFeatures = this.tempSel;
  }
  irAPk($event:string){
    this.mapElement.goTo($event);
  }
  componenteListo(){
    this.cargandoComponente = false;
    this.dialog.closeAll();
  }
  vincular(pkId:any, idMant?:any){
    let dataS = this.tabSeguimientos.dataSource.data;
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
    //let data = this.tabSeguimientos.dataSource.data;
    let data = this.selectedFeatures;
    let requestArray: any[] = [];
    let dataD = {
      titulo: 'Asignar Pks vinculados a seguimiento',
      cerrar: true,
      cancelar: false,
      aceptar: false
    } as any;
    data.forEach(value => {
      console.log('sel pk:', value);
        this.strStep = "Creando gestión de mantenimiento (Solicitar Programación)";
        requestArray.push(this.entityMantenimientoService.insert({pkIdCalzada:value,idTipoOrigen:372}));

    });
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
          let strCont = '';
          lista.forEach((val:any, i:number)=>{
            strCont += 'pkId: ' + data[i] + ' * idMntmto: ' + val.respuesta[0].id_mantenimiento_vial_evento + ' \n ';
          });
          dataD['contenido'] = strCont;
          const dialogRef = this.dialog.open(SimpleDialogComponent,{
            data: dataD
          });
          dialogRef.afterClosed().subscribe(result => {
           //if (result.action=='cancelar')
            //this.tabSeguimientos.dataSource.data = [];
            this.dataVinc = [];
            this.routeReady = false;

          });
          console.log('Updated: ',lista);
          this.tabSeguimientos.ngOnInit();
          this.sending = false;
          this.selectedFeatures = [];
          this.mapElement.selectFeatures('1<1');
        });
      });

  }

  cargaMapa($event:boolean){
    if(!(this.mapElement?.PksFL) || this.inStr == '')
      return;
    console.log('here',this.tabSeguimientos.filterColumns);
    this.mapElement.queryFeatures(this.inStr);
  }
  getWhereString(inArr:any[]){
    let inStr = '';
    let M:any[] = [];
    let count = 0, pos = 0;
    inArr.forEach((val)=>{
      if(!(M.includes(val.pk_id_calzada)))M.push(val.pk_id_calzada);
    });
    if(inArr.length>999){
        count = Math.ceil(inArr.length/1000);
        for (let i = 0; i<count; i++){
          pos = i*1000;
          if(i<count-1)
            inStr += 'PK_ID_ELEMENTO in (' + M.slice(pos,999+pos).toString() + ') OR ';
          else
            inStr += 'PK_ID_ELEMENTO in (' + M.slice(pos,999+pos).toString() + ')';
        }
      } else
        inStr += 'PK_ID_ELEMENTO in (' + M.toString() + ')';
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
  filtrarMapa($event:any){
    /*let inArr = [];
    $event.forEach((value: { pk_id_calzada: any; }) => {
      inArr.push(value.pk_id_calzada);
    });*/
    this.inStr = this.getWhereString($event);
    this.cargaMapa(true);
  }
  registroSeleccionadoEvt($event:any){
    let objDisc = {} as any;
    for(let idt of $event){
      objDisc[idt.codigo_actividad_agrupada] = objDisc[idt.codigo_actividad_agrupada]?objDisc[idt.codigo_actividad_agrupada] + idt.km_carril_impacto:idt.km_carril_impacto;
    }

    let arrayDisc = [];
    let total = 0;
    for(let d in objDisc){
      arrayDisc.push({codigo_actividad_agrupada:d,km_carril_impacto:Math.round(objDisc[d]*100)/100});
      total += Number(objDisc[d]);
    }
    this.totalesKmCarrilImpacto['seleccionados'] = $event.length;
    this.totalesKmCarrilImpacto['discriminado'] = arrayDisc;
    this.totalesKmCarrilImpacto['total'] = Math.round(total*100)/100;
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
