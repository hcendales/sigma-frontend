import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesoIntervencionService } from '../../../core/services/proceso-intervencion.service';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GestionService } from 'src/app/core/services/gestion.service';
import { SelectionModel } from '@angular/cdk/collections';


/**
 * Componenete para gestionar la lista de PKs con acta.
 */
@Component({
  selector: 'app-lista-pks-acta',
  templateUrl: './lista-pks-acta.component.html',
  styleUrls: ['./lista-pks-acta.component.scss']
})
export class ListaPksActaComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'checks',
    'pk_id_calzada',
    'civ',
    'descripcion_localidad',
    'descripcion_upz',
    'descripcion_actividad_agrupada',
    'descripcion_tipo_estrategia',
    'nombre_director_obra',
    'km_carril_impacto',
    'km_lineal',
    'km_carril_obra',
    'vigencia_programacion_periodica',
    'descripcion_periodicidad',
    'nombre_periodo',
    'numero_dias_duracion_planeada',
    

  ];

  /**
   * Define los datos del componente.
   */
  dataSource!: MatTableDataSource<any>;
  selection: any = new SelectionModel<any>(true, []);
  
  /**
   * Define las columnas de filtro.
   */
  filterColumns: string[] = [
    'space_1',
    'pk_id_calzada_filtro',
    'civ_filtro',
    'descripcion_localidad_filtro',
    'descripcion_upz_filtro',
    'descripcion_actividad_agrupada_filtro',
    'descripcion_tipo_estrategia_filtro',
    'nombre_director_obra_filtro',
    'km_carril_impacto_filtro',
    'km_lineal_filtro',
    'km_carril_obra_filtro',
    'vigencia_programacion_periodica_filtro',
    'descripcion_periodicidad_filtro',
    'nombre_periodo_filtro',
    'numero_dias_duracion_planeada_filtro',
    

  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */

  pk_id_calzada_filtro = new FormControl('');
  civ_filtro = new FormControl('');
  descripcion_localidad_filtro = new FormControl('');
  descripcion_upz_filtro = new FormControl('');
  descripcion_actividad_agrupada_filtro = new FormControl('');
  descripcion_tipo_estrategia_filtro = new FormControl('');
  nombre_director_obra_filtro = new FormControl('');
  km_carril_impacto_filtro = new FormControl('');
  km_lineal_filtro = new FormControl('');
  km_carril_obra_filtro = new FormControl('');
  vigencia_programacion_periodica_filtro = new FormControl('');
  descripcion_periodicidad_filtro = new FormControl('');
  nombre_periodo_filtro = new FormControl('');
  numero_dias_duracion_planeada_filtro = new FormControl('');
  // nombre_responsable_visita_filtro = new FormControl('');


  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    pk_id_calzada: '',
    civ: '',
    descripcion_localidad: '',
    descripcion_upz: '',
    descripcion_actividad_agrupada: '',
    descripcion_tipo_estrategia: '',
    nombre_director_obra: '',
    km_carril_impacto: '',
    km_lineal: '',
    km_carril_obra: '',
    vigencia_programacion_periodica: '',
    descripcion_periodicidad: '',
    nombre_periodo: '',
    numero_dias_duracion_planeada: '',
    // nombre_responsable_visita: '',

  };

  /**
   * Lista de seleccionados.
   */
  selectedList = [] as any;

  /**
   * Registro seleccionado.
   */
  masterCheck:boolean = false;

  /**
   * Datos de inicio de sesion.
   */
  loadingData:boolean = false;

  /**
   * Termino actual de busqueda.
   */
  searchkey = '';

  /**
   * Organizador del elemento.
   */
  @ViewChild(MatSort) sort: any;

  /**
   * Obtiene el elemento de paginacion de la tabla.
   */
  @ViewChild(MatPaginator) paginator: any;

  /**
   * PKs selecinados.
   */
  @Input() selectedFeatures:any;

  /**
   * Evento para indicar la opcion seleccioanda.
   */
  @Output() opcionSeleccionada: EventEmitter<any> = new EventEmitter();
   
  /**
   * Evento para indicar el registro seleccioando.
   */
  @Output() registroSeleccionado: EventEmitter<any> = new EventEmitter();

  /**
   * Evento para noftificat un cambio en el data source.
   */
  @Output() selecteDataSourceEmiter: EventEmitter<any> = new EventEmitter();
  
  @Output() dataSourceEmiter: EventEmitter<any> = new EventEmitter();

  @Output() filterPKs: EventEmitter<any> = new EventEmitter();
  
  /**
   * Constructor del componenete.
   * 
   * @param router Enrutador del sistema. 
   * @param gestionService Servicio de gestion.
   */
  constructor(
    private router: Router,
    private gestionService: GestionService,
    private procesoIntervencion: ProcesoIntervencionService
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
    this.consultarData(null);
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
    // Define el manejador de cambio del filtro descripcion_upz.
    this.descripcion_upz_filtro.valueChanges.subscribe(
      descripcion_upz_valor => {
        this.filterValues.descripcion_upz = descripcion_upz_valor;
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
    // Define el manejador de cambio del filtro descripcion_tipo_estrategia.
    this.descripcion_tipo_estrategia_filtro.valueChanges.subscribe(
      descripcion_tipo_estrategia_valor => {
        this.filterValues.descripcion_tipo_estrategia = descripcion_tipo_estrategia_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro nombre_director_obra.
    this.nombre_director_obra_filtro.valueChanges.subscribe(
      nombre_director_obra_valor => {
        this.filterValues.nombre_director_obra = nombre_director_obra_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro km_carril_impacto.
    this.km_carril_impacto_filtro.valueChanges.subscribe(
      km_carril_impacto_valor => {
        this.filterValues.km_carril_impacto = km_carril_impacto_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro km_lineal.
    this.km_lineal_filtro.valueChanges.subscribe(
      km_lineal_valor => {
        this.filterValues.km_lineal = km_lineal_valor;
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
    // this.nombre_responsable_visita_filtro.valueChanges.subscribe(
    //   nombre_responsable_visita_valor => {
    //     this.filterValues.nombre_responsable_visita = nombre_responsable_visita_valor;
    //     this.dataSource.filter = JSON.stringify(this.filterValues);
    //     this.clearchecked();
    //   }
    // );

  }

  /**
   * Reaccion al evento de cambio de la lista.
   * @param e Evento.
   * @returns Lista de seleccionados.
   */
  ngOnChanges(e:any){
    //debugger;
    console.log('ON changes de ' + 'Lista transicion');
    console.log(e);
    if(!e){return;}
    let selectedFeatures = e.selectedFeatures ? e.selectedFeatures.currentValue : null;
    if(selectedFeatures && this.dataSource && this.dataSource.filteredData){
      this.dataSource.filteredData.forEach((v:any)=>{
        if(selectedFeatures.includes(v.pk_id_calzada)){
          v.checked = true;
        }else{
          v.checked = false;
        }
      });
      }
  }

  /**
   * Aplica el filtro.
   * @param valor Valor del filtro.
   */
  applyFilter(valor: string): void {
    //debugger;
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
    this.descripcion_upz_filtro.setValue('');
    this.descripcion_actividad_agrupada_filtro.setValue('');
    this.descripcion_tipo_estrategia_filtro.setValue('');
    this.nombre_director_obra_filtro.setValue('');
    this.km_carril_impacto_filtro.setValue('');
    this.km_lineal_filtro.setValue('');
    this.km_carril_obra_filtro.setValue('');
    this.vigencia_programacion_periodica_filtro.setValue('');
    this.descripcion_periodicidad_filtro.setValue('');
    this.nombre_periodo_filtro.setValue('');
    this.numero_dias_duracion_planeada_filtro.setValue('');
    // this.nombre_responsable_visita_filtro.setValue('');

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
        this.selectedList = index.map((e:any) => {
          let dat = [];
          return dat[e.id_proceso_gestion]=e;
        })
      else
      this.selectedList[index.id_proceso_gestion] = index;
    } else {
      if (index.length > 1)this.selectedList = [];
      delete this.selectedList[index.id_proceso_gestion];
    }

    for (let key in this.selectedList) {
      arrayChecked.push(this.selectedList[key]);
    }

    if (!this.isAlternated()) {
      this.masterCheck = this.dataSource.filteredData[0].checked;
    }
    
    this.registroSeleccionado.emit(arrayChecked);
    this.selecteDataSourceEmiter.emit(arrayChecked);
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
  masterToggle(e:any="") {
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
      //debugger;
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
    this.dataSource.filterPredicate = ((data, filter) => {
      //debugger;
      const searchTerms = JSON.parse(filter);
      return (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada.toLowerCase()) !== -1 &&
        (data.civ || '').toString().toLowerCase().indexOf(searchTerms.civ.toLowerCase()) !== -1 &&
        (data.descripcion_localidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad.toLowerCase()) !== -1 &&
        (data.descripcion_upz || '').toString().toLowerCase().indexOf(searchTerms.descripcion_upz.toLowerCase()) !== -1 &&
        (data.descripcion_actividad_agrupada || '').toString().toLowerCase().indexOf(searchTerms.descripcion_actividad_agrupada.toLowerCase()) !== -1 &&
        (data.descripcion_tipo_estrategia || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_estrategia.toLowerCase()) !== -1 &&
        (data.nombre_director_obra || '').toString().toLowerCase().indexOf(searchTerms.nombre_director_obra.toLowerCase()) !== -1 &&
        (data.km_carril_impacto || '').toString().toLowerCase().indexOf(searchTerms.km_carril_impacto.toLowerCase()) !== -1 &&
        (data.km_lineal || '').toString().toLowerCase().indexOf(searchTerms.km_lineal.toLowerCase()) !== -1 &&
        (data.km_carril_obra || '').toString().toLowerCase().indexOf(searchTerms.km_carril_obra.toLowerCase()) !== -1 &&
        (data.vigencia_programacion_periodica || '').toString().toLowerCase().indexOf(searchTerms.vigencia_programacion_periodica.toLowerCase()) !== -1 &&
        (data.descripcion_periodicidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_periodicidad.toLowerCase()) !== -1 &&
        (data.nombre_periodo || '').toString().toLowerCase().indexOf(searchTerms.nombre_periodo.toLowerCase()) !== -1 &&
        (data.numero_dias_duracion_planeada || '').toString().toLowerCase().indexOf(searchTerms.numero_dias_duracion_planeada.toLowerCase()) !== -1;
        // (data.nombre_responsable_visita || '').toString().toLowerCase().indexOf(searchTerms.nombre_responsable_visita.toLowerCase()) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Permite concelar la asignacion.
   */
  volver() {
    this.opcionSeleccionada.emit({accion: 'salida', row: null});
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
        let respServ = await this.gestionService.listarBandejaGestionPendiente(1720);
        if (respServ.codError == 0) {
          console.info("Lista Bandeja Gestion Pendiente");
          console.info(respServ.respuesta);
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




}
