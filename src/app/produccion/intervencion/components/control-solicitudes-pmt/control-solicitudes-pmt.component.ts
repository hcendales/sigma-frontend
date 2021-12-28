import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';
import { GestionMasivaComponent } from 'src/app/shared/components/gestion-masiva/gestion-masiva.component';

/**
 * Componenete para gestionar las solicitudes pmt.
 */
@Component({
  selector: 'app-control-solicitudes-pmt',
  templateUrl: './control-solicitudes-pmt.component.html',
  styleUrls: ['./control-solicitudes-pmt.component.scss']
})
export class ControlSolicitudesPmtComponent implements OnInit {

  /**
   * Modo de visualizacion de la vista.
   */
  modo = 'salida';

  /**
   * Referencia al registro seleccionado en la lista.
   */
  row:any = null;

  /**
   * Registros asigandos.
   */
  arrayChecked:any = []

  /**
   * Bandera para señalar que se esta cargando 
   * el componenete.
   */
  cargandoComponente :boolean = false;

  //------------------------------------------------------
  // Define las propiedades del mapa.
  //------------------------------------------------------
  
  /**
  * Centra el mapa.
  */
  mapCenter = [-74.113, 4.667];
 
  /**
  * Tipo de mapa.
  */
  basemapType = 'gray';
 
  /**
  * Zoom del mapa.
  */
  mapZoomLevel = 12;

  /**
   * PKs seleccionados
   */
  selectedFeatures:any[]=[];

  /**
   * Referencia de mapa.
   */
  @ViewChild('mapa') mapElement!: MapaUmvComponent;

  /**
   * Lista de PKs.
   */
  @ViewChild('listaTransicion') listaTransicion!: GestionMasivaComponent;
  
  /**
   * Bandera para indicar si fue seleccionado un registro. 
   */
  row_selected = false;

  /**
   * Emisor del evento de actualizacion de la lista.
   */
  updateSubject: Subject<void> = new Subject<void>();

  /**
   * Input de los PKs a proyectar en el mapa.
   */
  inStr:string = '';

  /**
   * Constructor por defecto.
   */
  constructor(private router: Router) { }

  /**
   * Metodo de carga del componente.
   */
  ngOnInit(): void {
    this.cargaMapa(true);
  }

  /**
   * PKs seleccionados.
   * @param $event Evento
   */
  pkSelectedEvt($event:any){
    if ($event.length > 0)
      this.irAPk($event.join())

    this.selectedFeatures = $event;
  }

  irAPk(pk: number) {
    this.mapElement.goTo("PK_ID_ELEMENTO IN (" + pk.toString() + ")");
  }

  /**
   * Filtra los datos de la tabla.
   * @param $event Evento de filtro.
   */
  filterDataPK($event:any){
    console.log('filtrartabla',$event);
    console.log(this.listaTransicion?.tabTransicion);
    this.listaTransicion.tabTransicion.setValorBusqueda('pk_id_calzada',String($event));
  }

  /**
   * Obtiene el identificador de la calsada.
   * @param inArr Datos del PK.
   * @returns Identificador de calsada.
   */
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

  /**
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado. 
   */
  async registroSeleccionadoEvt(row:any) {
    if (row) {
      this.row = row;
      this.row_selected = true;
    } else {
      this.row_selected = false;
    }
    this.getSelecteDataSource(row)
  }

  /**
   * Permite cargar los datos del mapa.
   * @param $event Evento.
   * @returns Salida anticipada
   */
  cargaMapa($event:boolean) {
      //debugger;
      if(!(this.mapElement?.PksFL) || this.inStr == '')
        return;
      this.mapElement.queryFeatures(this.inStr);
  }

  /**
   * Obtiene la locacion del pK.
   * @param $event PK.
   */
  getDataSource($event:any) {
    let inArr = $event;
    this.inStr = this.getWhereString(inArr);
    console.log('pks',this.inStr);
    //if(!this.cargandoComponente)
    //  this.queryPKs(true);
  }

  /**
   * Carga los PKs para visulizar en el mapa.
   * @param $event Evento
   */
  queryPKs($event:any){
    let scope = this;
    this.mapElement.PksFL.load().then(()=>{
      scope.mapElement.queryFeatures(this.inStr);
    });
    //this.componenteListo();
  }

  /**
   * Actualiza el foco del mapa con el cambio de los 
   * filtros.
   * @param $event Evento
   */
  filtrarMapa($event:any){
    //debugger;
    this.inStr = this.getWhereString($event);
    this.cargaMapa(true);
  }

  /**
   * Actualiza el mapa con la seleccion de la lista.
   * @param $event PK seleccionado.
   */
  getSelecteDataSource($event:any){
    try{
      let inArr = $event;
      console.log(inArr);
      if (inArr == undefined) return
      let inStr = '1<1';
      if (inArr.length > 0){
         inStr = this.getWhereString(inArr);
      }
      let scope = this;
      this.mapElement.PksFL.load().then(()=>{
        console.log(inStr);
        scope.mapElement.selectFeatures(inStr);
      });
    }catch(e:any){
      console.error(e.error?.msgError ? 'Error:' + e.error.msgError : e.message ? 'Error:' + e.message : 'Error interno')
    }
  }

  /**
   * Manejador de los eventos de la lista.
   * @param opcion Evento de la lista.
   */
  async opcionSeleccionadaEvt(opcion:any) {
    console.info(opcion);
    switch (opcion.accion) {
      case 'solicitud':
        this.arrayChecked = opcion.arrayChecked;
        this.modo = opcion.accion;
        break;
      case 'coi':
        this.arrayChecked = opcion.arrayChecked;
        this.modo = opcion.accion;
        break;
      default:
        this.row = opcion.row;
        this.modo = opcion.accion;
        break;
    }
  }

  buscarRegistros(filaSelecionada:any){
    this.arrayChecked = filaSelecionada
    this.modo = "radicados";
  }

}
