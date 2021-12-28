import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesoIntervencionService } from '../../../core/services/proceso-intervencion.service';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';


/**
 * Componenete para gestionar la lista programacion periocidad.
 */
@Component({
  selector: 'app-lista-programacion-periocidad',
  templateUrl: './lista-programacion-periocidad.component.html',
  styleUrls: ['./lista-programacion-periocidad.component.scss']
})
export class ListaProgramacionPeriocidadComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'checks',
    'vigencia',
    'nombre_periodo',
    'descripcion',
    'dias_laborales',
    'km_carril_obra',
    'km_carril_impacto',
    'opciones',
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
    'vigencia_filtro',
    'nombre_periodo_filtro',
    'descripcion_filtro',
    'dias_laborales_filtro',
    'km_carril_obra_filtro',
    'km_carril_impacto_filtro',
    'space_2',
  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */
  vigencia_filtro = new FormControl('');
  nombre_periodo_filtro = new FormControl('');
  descripcion_filtro = new FormControl('');
  dias_laborales_filtro = new FormControl('');
  km_carril_obra_filtro = new FormControl('');
  km_carril_impacto_filtro = new FormControl('');

  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    vigencia: '',
    nombre_periodo: '',
    descripcion: '',
    dias_laborales: '',
    km_carril_obra: '',
    km_carril_impacto: '',
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

  /**
   * Termino actual de busqueda.
   */
  searchkey = '';

  /**
   * Suscripcion para actualizar la lista.
   */
  updateSubscription!: Subscription;

  /**
   * 
   */
  @ViewChild(MatSort) sort: any;

  /**
   * Obtiene el elemento de paginacion de la tabla.
   */
  @ViewChild(MatPaginator) paginator: any;

  /**
   * Evento de actualizar la lista.
   */
  @Input() actualizador!: Observable<void>;

  /**
   * Evento para indicar la opcion seleccioanda.
   */
  @Output() opcionSeleccionada: EventEmitter<any> = new EventEmitter();
   
  /**
   * Evento para indicar el registro seleccioando.
   */
  @Output() registroSeleccionado: EventEmitter<any> = new EventEmitter();

  /**
   * Constructor del componenete.
   * 
   * @param router Enrutador del sistema. 
   * @param gestionService Servicio de gestion.
   */
  constructor(
    private router: Router,
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
    // Define al suscripcion de actualizacion de la lista.
    this.updateSubscription = this.actualizador.subscribe(() => this.consultarData(null));
    // Define el manejador de cambio del filtro vigencia.
    this.vigencia_filtro.valueChanges.subscribe(
      vigencia_valor => {
        this.filterValues.vigencia = vigencia_valor;
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
    // Define el manejador de cambio del filtro descripcion.
    this.descripcion_filtro.valueChanges.subscribe(
      descripcion_valor => {
        this.filterValues.descripcion = descripcion_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro dias_laborales.
    this.dias_laborales_filtro.valueChanges.subscribe(
      dias_laborales_valor => {
        this.filterValues.dias_laborales = dias_laborales_valor;
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
    // Define el manejador de cambio del filtro km_carril_impacto.
    this.km_carril_impacto_filtro.valueChanges.subscribe(
      km_carril_impacto_valor => {
        this.filterValues.km_carril_impacto = km_carril_impacto_valor;
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
    this.vigencia_filtro.setValue('');
    this.nombre_periodo_filtro.setValue('');
    this.descripcion_filtro.setValue('');
    this.dias_laborales_filtro.setValue('');
    this.km_carril_obra_filtro.setValue('');
    this.km_carril_impacto_filtro.setValue('');
  }

  /**
   * Actualiza la lista de chekeo.
   * @param event Evento.
   * @param index Inidice del registro.
   */
  updateCheckedList(event: any, index: any) {
    this.selectedList = {};
    this.selectedList[index.id_proceso_gestion] = index;
    let arrayChecked = [];
    for(let key in this.selectedList) {
      arrayChecked.push(this.selectedList[key]);
    }
    this.registroSeleccionado.emit(index);
    if(!this.isAlternated()) {
      this.masterCheck = this.dataSource.filteredData[0].checked;
    }
  }

  /**
   * Limpial el registro con check.
   */
  clearchecked() {
    if(this.dataSource) {
      this.masterCheck = false;
      this.masterToggle({checked:false});
    }
  }

  /**
   * Actualiza los registros frente al chekeo de un 
   * reglon.
   * @param e Evento de check.
   */
  masterToggle(e:any) {
    if(this.dataSource) {
      this.selectedList = {};
      for(let i=0;i<this.dataSource.filteredData.length;i++) {
        this.dataSource.filteredData[i].checked = e.checked;
        this.selectedList[this.dataSource.filteredData[i].id_proceso_gestion] = this.dataSource.filteredData[i];
      }
      let arrayChecked = [];
      if(e.checked) {
        for(let key in this.selectedList) {
          arrayChecked.push(this.selectedList[key]);
        }
      } else {
        this.selectedList = {};
      }
      //debugger;
      //this.registroSeleccionado.emit(arrayChecked);
    }
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
    this.dataSource.filterPredicate = ((data, filter) => {
      const searchTerms = JSON.parse(filter);
      return (data.vigencia || '').toString().toLowerCase().indexOf(searchTerms.vigencia.toLowerCase()) !== -1 &&
      (data.nombre_periodo || '').toString().toLowerCase().indexOf(searchTerms.nombre_periodo.toLowerCase()) !== -1 &&
      (data.descripcion || '').toString().toLowerCase().indexOf(searchTerms.descripcion.toLowerCase()) !== -1 &&
      (data.dias_laborales || '').toString().toLowerCase().indexOf(searchTerms.dias_laborales.toLowerCase()) !== -1 &&
      (data.km_carril_obra || '').toString().toLowerCase().indexOf(searchTerms.km_carril_obra.toLowerCase()) !== -1 &&
      (data.km_carril_impacto || '').toString().toLowerCase().indexOf(searchTerms.km_carril_impacto.toLowerCase()) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Ejecuta la accion de Editar.
   * @param mantenimiento Item selecconado
   */
  editar(row: any) {
    this.opcionSeleccionada.emit({accion: 'editar', row: row});
  }

  /**
   * Ejecuta la accion de Eliminar.
   * @param mantenimiento Item selecconado
   */
  eliminar(row: any) {
    this.opcionSeleccionada.emit({accion: 'eliminar', row: row});
  }

  /**
   * Ejecuta la accion de nueva periocidad.
   */
  nuevaPeriocidad() {
    this.opcionSeleccionada.emit({accion: 'nueva', row: null});
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
        let respServ = await this.procesoIntervencion.listarProgramacionPeriocidad(filtro);
        if (respServ.codError == 0) {
          console.info("Lista Programacion Periocidad");
          console.info(respServ.respuesta);
          this.dataSource = new MatTableDataSource(respServ.respuesta);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.creaFiltro();
          this.onClearFilters();
          this.loadingData = false;
        }
      } catch(e) {
        console.log(e);
        this.loadingData = false;
      } 
    } 
  }
}
