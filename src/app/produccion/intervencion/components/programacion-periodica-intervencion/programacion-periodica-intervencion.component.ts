import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GestionMasivaComponent } from 'src/app/shared/components/gestion-masiva/gestion-masiva.component';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';
import { GestionService } from 'src/app/core/services/gestion.service';
import { ProcesoIntervencionService } from 'src/app/core/services/proceso-intervencion.service';
import { Router } from '@angular/router';

/**
 * Componenete para gestionar la programacion periodica de intervencion.
 */
@Component({
  selector: 'app-programacion-periodica-intervencion',
  templateUrl: './programacion-periodica-intervencion.component.html',
  styleUrls: ['./programacion-periodica-intervencion.component.scss']
})
export class ProgramacionPeriodicaIntervencionComponent implements OnInit {

  /**
   * Modo de visualizacion de la vista.
   */
  modo = 'salida';

  /**
   * Referencia al registro seleccionado en la lista.
   */
  row:any = null;

  /**
   * Bandera para señalar que se esta cargando 
   * el componenete.
   */
  cargandoComponente :boolean = false;

  /**
   * Bandera paraindicar PKs seleccionados.
   */
  selectedRowFlag = false;

  /**
   * Lista de registros seleciionados.
   */
  rowSelectedList: any[] = []

  /**
   * Temporal de seleccion.
   */
  tempSel:any[]=[];

  /**
   * Emisor del evento de actualizacion de la lista de 
   * periodos.
   */
  perUpdateSubject: Subject<void> = new Subject<void>();

  /**
   * Emisor del evento de actualizacion de la lista de 
   * PKs a asociar.
   */
  asoUpdateSubject: Subject<any> = new Subject<any>();

  /**
   * Lista de PKs.
   */
  @ViewChild('listaTransicion') listaTransicion!: GestionMasivaComponent;
  
  //------------------------------------------------------
  // Define las propiedades del mapa.
  //------------------------------------------------------
  
  /**
   * Define formulario de totales
   */
  formTotales:FormGroup;

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
   * Bandera de esicion.
   */
  edit_flag = false;

  /**
   * Input de los PKs a proyectar en el mapa.
   */
  inStr:string = '';

  /**
   * PKs seleccionados
   */
  selectedFeatures:any[]=[];

  /**
   * Referencia de mapa.
   */
  @ViewChild('mapa') mapElement!: MapaUmvComponent;
  
  /**
   * Bandera para indicar si fue seleccionado un registro 
   * de bandeja. 
   */
  row_selected = false;

  /**
   * Bandera para indicar si fue seleccionado un registro
   * de PKs a asignar. 
   */
  pks_selected = false;

  /**
   * Bandera para indicar si fue seleccionado un registro
   * de periodos a asignar. 
   */
  periodos_selected = false;

  /**
   * Lista de PKs a enviar.
   */
  idPkSendList:number[] = [];

  /**
   * Lista de PKs seleccionados.
   */
  pksList:any[] = [];

  /**
   * Periodo seleccionado.
   */
  idPeriodo:number = 0;

  /**
   *  Bandera para mostrar la lista.
   */
  mostrar_lista_asociar = false;

  /**
   * Constructor por defecto.
   */
  constructor(
    public fb:FormBuilder,
    private router: Router,
    private snackBar:MatSnackBar,
    private gestionService: GestionService,
    private procesoIntervencionService: ProcesoIntervencionService
  ) {
    this.formTotales = this.fb.group({
      impacto: new FormControl(0),
      lineal: new FormControl(0),
      obra: new FormControl(0),
      duracion: new FormControl(0),
      cuadras: new FormControl(0)
    });
  }

  /**
   * Metodo de carga del componente.
   */
  ngOnInit(): void {
    this.cargaMapa(true);
  }

  /**
   * Maneja el error de las peticiones.
   */
  handleError(msg: string) {
    this.snackBar.open('Error al realizar la operación'+ msg, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado. 
   */
  async registroSeleccionadoEvt(selList:any[]) {
    if (selList && selList.length > 0) {
      //debugger;
      this.idPkSendList = [];
      for(let i=0;i< selList.length;i++) {
        if (selList[i].vigencia_programacion_periodica != null || selList[i].descripcion_periodicidad != null || selList[i].nombre_periodo != null) {
          this.idPkSendList.push(selList[i].id_proceso_gestion);
        }
      }
      this.row_selected = true;
    } else {
      this.row_selected = false;
    }
  }


  irAPk(pk: number) {
    this.mapElement.goTo("PK_ID_ELEMENTO IN (" + pk.toString() + ")");
  }

  /**
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado. 
   */
  async regSelecPeriodosEvts(reg:any) {
    if(reg) {
      //debugger;
      this.idPeriodo = reg.id_programacion_periodica
      this.periodos_selected = true;
      this.row = reg;
      if (this.mostrar_lista_asociar) {
        this.asoUpdateSubject.next(reg.id_programacion_periodica);
      }
      this.mostrar_lista_asociar = true;
    }  
  }

  /**
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado. 
   */
  async regSelecPksEvts(selectList:any) {
    let km_carril_impacto = 0;
    let km_linea = 0;
    let km_obra = 0;
    let dias_laborales = 0;
    let cudras = 0;
    this.pksList = [];
    //debugger;
    if(selectList && selectList.length > 0) {
      for (let row of selectList) {
        this.pksList.push({
          id_mantenimiento_vial: row.id_mantenimiento_vial,
          idProgramacionPeriodicaMV: row.id_programacion_periodica_mv
        });
        km_carril_impacto += row.km_carril_impacto && row.km_carril_impacto > 0 ? row.km_carril_impacto : 0;
        dias_laborales = row.dias_laborales && row.dias_laborales  > 0 ? row.dias_laborales: 0;
        km_obra += row.km_carril_obra && row.km_carril_obra  > 0 ? row.km_carril_obra: 0;
        km_linea += row.km_lineal && row.km_lineal  > 0 ? row.km_lineal: 0;
        cudras += row.dias_laborales && row.dias_laborales  > 0 ?  row.durancion_planeada_obra / row.dias_laborales : 0; 
        //cudras = Math.ceil(cudras);
      }
      this.pks_selected = true;
    } else {
      this.pks_selected = false;
    }
    this.formTotales.controls['impacto'].setValue(this.toFix(km_carril_impacto));
    this.formTotales.controls['lineal'].setValue(this.toFix(km_linea));
    this.formTotales.controls['obra'].setValue(this.toFix(km_obra));
    this.formTotales.controls['duracion'].setValue(dias_laborales);
    this.formTotales.controls['cuadras'].setValue(Math.ceil(cudras));
  }

  toFix(num: number){
    return (Math.round(num * 100) / 100).toFixed(2);
  }

  /**
   * Manejador de los eventos de la lista.
   * @param opcion Evento de la lista.
   */
  async opcionSeleccionadaEvt(opcion:any) {
    console.info(opcion);
    switch (opcion.accion) {
      case 'editar':
        this.row = opcion.row;
        this.edit_flag = true;
        this.modo = opcion.accion;
        break;
      case 'nueva':
        this.modo = 'editar';
        this.edit_flag = false;
        break;
      default:
        this.row = opcion.row;
        this.modo = opcion.accion;
        break;
    }
  }

  /**
   * Maneja la respuesta con exito de las peticiones.
   */
  operationSuccess() {
    this.snackBar.open('Operación Realizada', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Efectua la accion de asignar y cambia la transicion.
   */
  async asignar() {
    let success = true;
    let respServ = null;
    for (let pk of this.pksList) {
      if (pk.idProgramacionPeriodicaMV == null) {
        respServ = await this.procesoIntervencionService.adicionarPKGrupo(this.idPeriodo, pk.id_mantenimiento_vial);
        success &&= (respServ && respServ.codError == 0);
      }
    }
    if(success) {
      this.clearPanels();
      this.operationSuccess();
      this.perUpdateSubject.next();
      //this.modo = 'salida';
    } else {
      this.handleError('');
    }
  }

  /**
   * Desasigna PKs.
   */
  async desasignar() {
    let success = true;
    let respServ = null;
    for (let pk of this.pksList) {
      if (pk.idProgramacionPeriodicaMV != null) {
        respServ = await this.procesoIntervencionService.remuevePKGrupo(pk.idProgramacionPeriodicaMV);
        success &&= (respServ && respServ.codError == 0);
      }
    }
    if(success) {
      this.operationSuccess();
      this.clearPanels();
      this.perUpdateSubject.next();
      //this.modo = 'salida';
    } else {
      this.handleError('');
    }
  }

  clearPanels() {
    this.formTotales.controls['impacto'].setValue(0);
    this.formTotales.controls['lineal'].setValue(0);
    this.formTotales.controls['obra'].setValue(0);
    this.formTotales.controls['duracion'].setValue(0);
    this.formTotales.controls['cuadras'].setValue(0);
    this.mostrar_lista_asociar = false;
  }

  /**
   * Cancel la asignacion.
   */
  cancelarAsig() {
    this.clearPanels();
    this.selectedRowFlag = false;
    this.modo = 'salida';
  }

  /**
   * Efectua la accion de asignar y cambia la transicion.
   */
  async enviar() {
    try {  
      //debugger;
      if (this.idPkSendList.length > 0) {
        let idActividadTransicion = await this.gestionService.listarTransicionesPorActividad(1720);
        let respServ = await this.gestionService.avanzarMantenimientoMasivo(this.idPkSendList, idActividadTransicion.respuesta[0].id_actividad_transicion,"", false, 0);
        if(respServ && respServ.codError == 0) {
          this.operationSuccess();
          this.clearPanels();
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate([currentUrl]);
          });
        } else {
          this.handleError('');
        }
      } else {
        this.handleError(': Los PKs seleccionados no se pueden enviar');
      }
    } catch(e) {
      console.log(e);
      this.handleError('');
    }  
  }

  /**
   * PKs seleccionados.
   * @param $event Evento
   */
  pkSelectedEvt($event:any) {
    //debugger;
    //this.selectedFeatures = $event;

    if ($event.length > 0)
      this.irAPk($event.join())

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

  /**
   * Filtra los datos de la tabla.
   * @param $event Evento de filtro.
   */
  filterDataPK($event:any){
    //debugger;
    console.log('filtrartabla',$event);
    console.log(this.listaTransicion?.tabTransicion);
    this.listaTransicion.tabTransicion.setValorBusqueda('pk_id_calzada',String($event));
  }

  /**
   * Manejador del evento de confirmacion de 
   * almacenamiento del editor.
   * 
   * @param event Evento del editor.
   */
  almacenado(event: any) {
    if (event) {
      this.perUpdateSubject.next();
    }
    this.clearPanels();
    this.mostrar_lista_asociar = false;
    this.modo = 'seleccion';
  }

  /**
   * Accion de evento de regresar del editar periodos.
   */
  regresarEvt() {
    this.clearPanels();
    this.mostrar_lista_asociar = false;
    this.modo = 'seleccion';
  }

  /**
   * Permite cargar los datos del mapa.
   * @param $event Evento.
   * @returns Salida anticipada
   */
  cargaMapa($event:boolean){
    //debugger;
    if(!(this.mapElement?.PksFL) || this.inStr == '')
      return;
    this.mapElement.queryFeatures(this.inStr);
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
   * Obtiene la locacion del pK.
   * @param $event PK.
   */
  getDataSource($event:any){
    //debugger;
    let inArr = $event;
    this.inStr = this.getWhereString(inArr);
    console.log('pks',this.inStr);
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
  getSelecteDataSource($event:any) {
    let inArr = $event;
    console.log(">>>>",inArr);
    let inStr = '1<1';
    if(inArr.length > 0){
       inStr = this.getWhereString(inArr);
    }
    for (let index = 0; index < inArr.length; index++) {
      if (inArr[index].checked) {
        if (inArr[index].vigencia_programacion_periodica != null || inArr[index].descripcion_periodicidad != null || inArr[index].nombre_periodo != null) {
          this.rowSelectedList.push(inArr[index].pk_id_calzada);
        }
      } else {
        this.rowSelectedList = this.rowSelectedList.filter(obj => obj !== inArr[index].pk_id_calzada);
      }
    }
    this.rowSelectedList = [...new Set(this.rowSelectedList)];
    if (inArr.length > 0) {
      this.selectedRowFlag = true;
    } else {
      this.selectedRowFlag = false;
    }
    let scope = this;
    this.mapElement.PksFL.load().then(()=>{
      console.log(inStr);
      scope.mapElement.selectFeatures(inStr);
    });
  }

}
