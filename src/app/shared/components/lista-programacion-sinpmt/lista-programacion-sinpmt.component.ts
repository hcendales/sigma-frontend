import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';
import { SolicitudPmt } from './solicitud-pmt';
import { GestionService } from 'src/app/core/services/gestion.service';
import { SelectionModel } from '@angular/cdk/collections';


/**
 * Componenete para gestionar la lista de asignaciones sin PMT.
 */
@Component({
  selector: 'app-lista-programacion-sinpmt',
  templateUrl: './lista-programacion-sinpmt.component.html',
  styleUrls: ['./lista-programacion-sinpmt.component.scss']
})
export class ListaProgramacionSinpmtComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'checks',
    'pk_id_calzada',
    'civ',
    'descripcion_localidad',
    'descripcion_zona',
    'descripcion_barrio',
    'descripcion_actividad_agrupada',
    'priorizacion_trimestre',
    'eje_vial',
    'numero_radicado_pmt',
    'coi',
    'TRABAJAR',
  ];

  /**
   * Define los datos del componente.
   */
  dataSource!: MatTableDataSource<any>;
  
  /**
   * Define las columnas de filtro.
   */
  filterColumns: string[] = [
    'space_1',
    'pk_id_calzada_filtro',
    'civ_filtro',
    'descripcion_localidad_filtro',
    'descripcion_zona_filtro',
    'descripcion_barrio_filtro',
    'descripcion_actividad_agrupada_filtro',
    'priorizacion_trimestre_filtro',
    'eje_vial_filtro',
    'numero_radicado_pmt_filtro',
    'coi_filtro',
    'CLEAR',
  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */
  pk_id_calzada_filtro = new FormControl('');
  civ_filtro = new FormControl('');
  descripcion_localidad_filtro = new FormControl('');
  descripcion_zona_filtro = new FormControl('');
  descripcion_barrio_filtro = new FormControl('');
  descripcion_actividad_agrupada_filtro = new FormControl('');
  priorizacion_trimestre_filtro = new FormControl('');
  eje_vial_filtro = new FormControl('');
  numero_radicado_pmt_filtro = new FormControl('');
  km_carril_obra_filtro = new FormControl('');
  vigencia_programacion_periodica_filtro = new FormControl('');
  descripcion_periodicidad_filtro = new FormControl('');
  nombre_periodo_filtro = new FormControl('');
  numero_dias_duracion_planeada_filtro = new FormControl('');
  nombre_responsable_visita_filtro = new FormControl('');
  coi_filtro = new FormControl('');

  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    pk_id_calzada: '',
    civ: '',
    descripcion_localidad: '',
    descripcion_zona: '',
    descripcion_barrio: '',
    descripcion_actividad_agrupada: '',
    priorizacion_trimestre: '',
    eje_vial: '',
    numero_radicado_pmt: '',
    km_carril_obra: '',
    vigencia_programacion_periodica: '',
    descripcion_periodicidad: '',
    nombre_periodo: '',
    numero_dias_duracion_planeada: '',
    nombre_responsable_visita: '',
    coi: '',
  };

  /**
   * Lista de seleccionados.
   */
  selectedList:any = {} as any;

  /**
   * Registro seleccionado.
   */
  masterCheck:boolean = false;

  /**
   * Datos de inicio de sesion.
   */
  loadingData:boolean = false;

  selection: any = new SelectionModel<any>(true, []);

  /**
   * Bandera que determina los seleccionados.
   */
  selectedRowFlag = false;

  /**
   * Termino actual de busqueda.
   */
  searchkey = '';

  /**
   * ID de la actividad.
   */
  idActividad = -1

  /**
   * Lista de selecinados.
   */
  arrayChecked:any = []

  /**
   * Array de registros.
   */
  registros:SolicitudPmt[] = [];

  /**
   * Referencia al objeto organizador de la grilla.
   */
  @ViewChild(MatSort) sort: any;

  /**
   * Obtiene el elemento de paginacion de la tabla.
   */
  @ViewChild(MatPaginator) paginator: any;

  /**
   * Evento para indicar la opcion seleccioanda.
   */
  @Output() opcionSeleccionada: EventEmitter<any> = new EventEmitter();
   
  /**
   * Evento para indicar el registro seleccioando.
   */
  @Output() registroSeleccionado: EventEmitter<any> = new EventEmitter();

  /**
   * Emisor de cambio en los datos de la grilla.
   */
  @Output() dataSourceEmiter: EventEmitter<any> = new EventEmitter();

  /**
   * Emisor de cambios en los filtros de la grilla.
   */
  @Output() filterPKs: EventEmitter<any> = new EventEmitter();

  /**
   * Emisor de busqueda de PK
   */
  @Output() irPK: EventEmitter<any> = new EventEmitter();

  /**
   * Emisor de busqueda COI Y Radicados
   */
  @Output() modal: EventEmitter<any> = new EventEmitter();


  /**
   * Constructor del componenete.
   * 
   * @param router Enrutador del sistema. 
   * @param gestionService Servicio de gestion.
   */
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private gestionService: GestionService,
  ) {}

  /**
   * Metodo para liberara recursos.
   */
  ngAfterViewInit(): void {}

  /**
   * Metodo de carge incial del componente.
   */
  ngOnInit(): void {
    // Carga los datos de la vista.
    this.activatedroute.paramMap.subscribe(params => {
      this.idActividad =  Number(params.get('idActividad'));
      this.consultarData(null);
    });
    // Define el manejador de cambio del filtro pk_id_calzada.
    this.pk_id_calzada_filtro.valueChanges.subscribe(
      pk_id_calzada_valor => {
        this.filterValues.pk_id_calzada = pk_id_calzada_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro civ.
    this.civ_filtro.valueChanges.subscribe(
      civ_valor => {
        this.filterValues.civ = civ_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_localidad.
    this.descripcion_localidad_filtro.valueChanges.subscribe(
      descripcion_localidad_valor => {
        this.filterValues.descripcion_localidad = descripcion_localidad_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_zona.
    this.descripcion_zona_filtro.valueChanges.subscribe(
      descripcion_zona_valor => {
        this.filterValues.descripcion_zona = descripcion_zona_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_barrio.
    this.descripcion_barrio_filtro.valueChanges.subscribe(
      descripcion_barrio_valor => {
        this.filterValues.descripcion_barrio = descripcion_barrio_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_actividad_agrupada.
    this.descripcion_actividad_agrupada_filtro.valueChanges.subscribe(
      descripcion_actividad_agrupada_valor => {
        this.filterValues.descripcion_actividad_agrupada = descripcion_actividad_agrupada_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro priorizacion_trimestre.
    this.priorizacion_trimestre_filtro.valueChanges.subscribe(
      priorizacion_trimestre_valor => {
        this.filterValues.priorizacion_trimestre = priorizacion_trimestre_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro eje_vial.
    this.eje_vial_filtro.valueChanges.subscribe(
      eje_vial_valor => {
        this.filterValues.eje_vial = eje_vial_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro numero_radicado_pmt.
    this.numero_radicado_pmt_filtro.valueChanges.subscribe(
      numero_radicado_pmt_valor => {
        this.filterValues.numero_radicado_pmt = numero_radicado_pmt_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro km_carril_obra.
    this.km_carril_obra_filtro.valueChanges.subscribe(
      km_carril_obra_valor => {
        this.filterValues.km_carril_obra = km_carril_obra_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro vigencia_programacion_periodica.
    this.vigencia_programacion_periodica_filtro.valueChanges.subscribe(
      vigencia_programacion_periodica_valor => {
        this.filterValues.vigencia_programacion_periodica = vigencia_programacion_periodica_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_periodicidad.
    this.descripcion_periodicidad_filtro.valueChanges.subscribe(
      descripcion_periodicidad_valor => {
        this.filterValues.descripcion_periodicidad = descripcion_periodicidad_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro nombre_periodo.
    this.nombre_periodo_filtro.valueChanges.subscribe(
      nombre_periodo_valor => {
        this.filterValues.nombre_periodo = nombre_periodo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro numero_dias_duracion_planeada.
    this.numero_dias_duracion_planeada_filtro.valueChanges.subscribe(
      numero_dias_duracion_planeada_valor => {
        this.filterValues.numero_dias_duracion_planeada = numero_dias_duracion_planeada_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro nombre_responsable_visita.
    this.nombre_responsable_visita_filtro.valueChanges.subscribe(
      nombre_responsable_visita_valor => {
        this.filterValues.nombre_responsable_visita = nombre_responsable_visita_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro nombre_responsable_visita.
    this.coi_filtro.valueChanges.subscribe(
      coi_valor => {
        this.filterValues.coi = coi_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
  }

  /**
   * Aplica el filtro.
   * @param valor Valor del filtro.
   */
  applyFilter(valor: string): void {
    this.dataSource.filter = valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Limpia el filtro.
   */
  onSearchClear() {
    this.searchkey = '';
    this.applyFilter('');
  }

  /**
   * Reaccion al evento de limpiar todos los filtros.
   * @returns Null en caso de no haber datos.
   */
  onClearFilters() {
    if(!this.dataSource) {
      return
    }
    this.pk_id_calzada_filtro.setValue('');
    this.civ_filtro.setValue('');
    this.descripcion_localidad_filtro.setValue('');
    this.descripcion_zona_filtro.setValue('');
    this.descripcion_barrio_filtro.setValue('');
    this.descripcion_actividad_agrupada_filtro.setValue('');
    this.priorizacion_trimestre_filtro.setValue('');
    this.eje_vial_filtro.setValue('');
    this.numero_radicado_pmt_filtro.setValue('');
    this.km_carril_obra_filtro.setValue('');
    this.vigencia_programacion_periodica_filtro.setValue('');
    this.descripcion_periodicidad_filtro.setValue('');
    this.nombre_periodo_filtro.setValue('');
    this.numero_dias_duracion_planeada_filtro.setValue('');
    this.nombre_responsable_visita_filtro.setValue('');
    this.coi_filtro.setValue('');
  }

  /**
   * Actualiza la lista de chekeo.
   * @param event Evento.
   * @param index Inidice del registro.
   */
  updateCheckedList(event: any, index: any) {

    let arrayChecked = [];
    index['checked'] = event.checked;

    if (event.checked) {
      if (index.length > 1)
        this.selectedList = index.map((e: any) => {
          let dat = [];
          return dat[e.id_proceso_gestion] = e;
        })
      else
        this.selectedList[index.id_proceso_gestion] = index;
    } else {
      if (index.length > 1) this.selectedList = [];
      delete this.selectedList[index.id_proceso_gestion];
    }

    for (let key in this.selectedList) {
      arrayChecked.push(this.selectedList[key]);
    }

    if (!this.isAlternated()) {
      this.masterCheck = this.dataSource.filteredData[0].checked;
    }

    this.arrayChecked = arrayChecked;
    this.selectedRowFlag = arrayChecked.length > 0;
    this.registroSeleccionado.emit(arrayChecked); 
  }

  /**
   * Limpial el registro con check.
   */
  clearchecked() {
    if(this.dataSource) {
      this.masterCheck = false;
      //this.masterToggle({checked:false});
    }
  }

  /**
   * Actualiza los registros frente al chekeo de un 
   * reglon.
   * @param e Evento de check.
   */
  // masterToggle(e:any) {
  //   if(this.dataSource) {
  //     this.selectedList = {};
  //     for(let i=0;i<this.dataSource.filteredData.length;i++) {
  //       this.dataSource.filteredData[i].checked = e.checked;
  //       this.selectedList[this.dataSource.filteredData[i].id_proceso_gestion] = this.dataSource.filteredData[i];
  //     }
  //     let arrayChecked = [];
  //     if(e.checked) {
  //       for(let key in this.selectedList) {
  //         arrayChecked.push(this.selectedList[key]);
  //       }
  //     } else {
  //       this.selectedList = {};
  //     }
  //     this.registroSeleccionado.emit(arrayChecked);
  //     this.filterPKs.emit(this.dataSource.filteredData);
  //   }
  // }

  /**
   * Actualiza los registros frente al chekeo de un 
   * reglon.
   * @param e Evento de check.
   */
  masterToggle(e: any = "") {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row: any) => this.selection.select(row));
    this.registroSeleccionado.emit(this.dataSource.data);
    this.filterPKs.emit(this.dataSource.filteredData);
  }

  /**
   * Verifica si hay algunos registros seleccionados, para
   * establecer el estado "indeterminado" del check 
   * de la cabecera.
   * @returns true si existen / false en el caso contrario.  
   */
  isAlternated() {
    if(this.dataSource && this.dataSource.filteredData.length >1) {
      let antValue = this.dataSource.filteredData[0].checked;
      for(let i = 1; i<this.dataSource.filteredData.length; i++) {
        if(this.dataSource.filteredData[i].checked != antValue) {
          return true;
        } else {
          antValue = this.dataSource.filteredData[i].checked;
        }
      }
    }
    return false; 
  }

  /**
   * Inicializa los filtros de la tabla.
   */
  creaFiltro() {
    try{
      this.dataSource.filterPredicate = ((data, filter) => {
        const searchTerms = JSON.parse(filter);
        return (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada.toLowerCase()) !== -1 &&
          (data.civ || '').toString().toLowerCase().indexOf(searchTerms.civ.toLowerCase()) !== -1 &&
          (data.descripcion_localidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad.toLowerCase()) !== -1 &&
          (data.descripcion_zona || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona.toLowerCase()) !== -1 &&
          (data.descripcion_barrio || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio.toLowerCase()) !== -1 &&
          (data.descripcion_actividad_agrupada || '').toString().toLowerCase().indexOf(searchTerms.descripcion_actividad_agrupada.toLowerCase()) !== -1 &&
          (data.priorizacion_trimestre || '').toString().toLowerCase().indexOf(searchTerms.priorizacion_trimestre.toLowerCase()) !== -1 &&
          (data.eje_vial || '').toString().toLowerCase().indexOf(searchTerms.eje_vial.toLowerCase()) !== -1 &&
          (data.numero_radicado_pmt || '').toString().toLowerCase().indexOf(searchTerms.numero_radicado_pmt.toLowerCase()) !== -1 &&
          (data.km_carril_obra || '').toString().toLowerCase().indexOf(searchTerms.km_carril_obra.toLowerCase()) !== -1 &&
          (data.vigencia_programacion_periodica || '').toString().toLowerCase().indexOf(searchTerms.vigencia_programacion_periodica.toLowerCase()) !== -1 &&
          (data.descripcion_periodicidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_periodicidad.toLowerCase()) !== -1 &&
          (data.nombre_periodo || '').toString().toLowerCase().indexOf(searchTerms.nombre_periodo.toLowerCase()) !== -1 &&
          (data.numero_dias_duracion_planeada || '').toString().toLowerCase().indexOf(searchTerms.numero_dias_duracion_planeada.toLowerCase()) !== -1 &&
          (data.nombre_responsable_visita || '').toString().toLowerCase().indexOf(searchTerms.nombre_responsable_visita.toLowerCase()) !== -1 &&
          (data.coi || '').toString().toLowerCase().indexOf(searchTerms.coi.toString().toLowerCase()) !== -1;
      });
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }catch(e:any){
      console.error(e.error?.msgError ? 'Error:' + e.error.msgError : e.message ? 'Error:' + e.message : 'Error interno')
    }
  }

  /**
   * Permite exportar los datos de la lista a archivo excel.
   */
  exportexcel() {
    if (this.registros.length > 0) {
      let headers = {header:[
        'PK',
        'CIV',
        'LOCALIDAD',
        'ZONA',
        'BARRIO',
        'TIPO DE INTERVENCIÓN',
        'PRIORIZACIÓN',
        'EJE VIAL',
        'RADICADO',
        'COI',
      ]};
      let datos = [];
      for (let registro of this.registros) {
        datos.push({
          'PK': registro.pk_id_calzada,
          'CIV': registro.civ,
          'LOCALIDAD': registro.descripcion_localidad,
          'ZONA': registro.descripcion_zona,
          'BARRIO': registro.descripcion_barrio,
          'TIPO DE INTERVENCIÓN': registro.descripcion_actividad_agrupada,
          'PRIORIZACIÓN': registro.priorizacion_trimestre,
          'EJE VIAL': registro.eje_vial,
          'COI': registro.coi,
        });
      }
      const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(datos, headers);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, "Reporte_Programadas_Sin_PMT.xlsx");
    }
  }
  
  /**
   * Permite regresar al componente padre.
   */
  volver() {
    this.opcionSeleccionada.emit({accion: 'salida', row: null});
  }

  /**
   * 
   */
  asignarSolicitud() {
    this.opcionSeleccionada.emit({accion: 'solicitud', arrayChecked: this.arrayChecked});
  }

  /**
   * 
   */
  asignarCOI() {
    this.opcionSeleccionada.emit({accion: 'coi', arrayChecked: this.arrayChecked});
  }

  /**
   * Consulta los datos de la vista. 
   * @param filtro Filtro actual.
   */  
  async consultarData(filtro:any) {
    if (!this.loadingData) {
      this.dataSource = new MatTableDataSource();
      this.loadingData = true;
      try {
        let respServ = await this.gestionService.listarBandejaGestionPendiente(this.idActividad);
        if (respServ.codError == 0) {
          console.log("Lista pendientes");
          console.log(respServ.respuesta);
          this.registros = respServ.respuesta;
          this.dataSource = new MatTableDataSource(respServ.respuesta);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.creaFiltro();
          this.onClearFilters();
          this.loadingData = false;
          this.dataSourceEmiter.emit(this.dataSource.data);
        }
      } catch(e) {
        console.log(e);
        this.loadingData = false;
      } 
    } 
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  trabajar(fila:any){
    this.modal.emit(fila);
  }
}
