import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesoMantenimientoService } from '../../../core/services/proceso-mantenimiento.service';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';


/**
 * Componenete para la gestion de la lista de maquinaria disponible.
 */
@Component({
  selector: 'app-lista-maq-equ-disponibles',
  templateUrl: './lista-maq-equ-disponibles.component.html',
  styleUrls: ['./lista-maq-equ-disponibles.component.scss']
})
export class ListaMaqEquDisponiblesComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'id_equipo',
    'placa',
    'placa_inventario',
    'descripcion_tipo_equipo',
    'descripcion_clase_equipo',
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
    'id_equipo_filtro',
    'placa_filtro',
    'placa_inventario_filtro',
    'descripcion_tipo_equipo_filtro',
    'descripcion_clase_equipo_filtro',
    'space_1',
  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */

  id_equipo_filtro = new FormControl('');
  placa_filtro = new FormControl('');
  placa_inventario_filtro = new FormControl('');
  descripcion_tipo_equipo_filtro = new FormControl('');
  descripcion_clase_equipo_filtro = new FormControl('');

  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    id_equipo: '',
    placa: '',
    placa_inventario: '',
    descripcion_tipo_equipo: '',
    descripcion_clase_equipo: '',
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
    private procesoMantenimiento: ProcesoMantenimientoService
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
    // Define el manejador de cambio del filtro id_equipo.
    this.id_equipo_filtro.valueChanges.subscribe(
      id_equipo_valor => {
        this.filterValues.id_equipo = id_equipo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro placa.
    this.placa_filtro.valueChanges.subscribe(
      placa_valor => {
        this.filterValues.placa = placa_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro placa_inventario.
    this.placa_inventario_filtro.valueChanges.subscribe(
      placa_inventario_valor => {
        this.filterValues.placa_inventario = placa_inventario_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_tipo_equipo.
    this.descripcion_tipo_equipo_filtro.valueChanges.subscribe(
      descripcion_tipo_equipo_valor => {
        this.filterValues.descripcion_tipo_equipo = descripcion_tipo_equipo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_clase_equipo.
    this.descripcion_clase_equipo_filtro.valueChanges.subscribe(
      descripcion_clase_equipo_valor => {
        this.filterValues.descripcion_clase_equipo = descripcion_clase_equipo_valor;
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
    this.id_equipo_filtro.setValue('');
    this.placa_filtro.setValue('');
    this.placa_inventario_filtro.setValue('');
    this.descripcion_tipo_equipo_filtro.setValue('');
    this.descripcion_clase_equipo_filtro.setValue('');
  }

  /**
   * Actualiza la lista de chekeo.
   * @param event Evento.
   * @param index Inidice del registro.
   */
  updateCheckedList(event: any, index: any) {
    if (event.checked) {
      this.selectedList[index.id_proceso_gestion] = index;
    } else {
      delete this.selectedList[index.id_proceso_gestion];
    }
    let arrayChecked = [];
    for(let key in this.selectedList) {
      arrayChecked.push(this.selectedList[key]);
    }
    this.registroSeleccionado.emit(arrayChecked);
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
      this.registroSeleccionado.emit(arrayChecked);
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
      return (data.id_equipo || '').toString().toLowerCase().indexOf(searchTerms.id_equipo) !== -1 &&
        (data.placa || '').toString().toLowerCase().indexOf(searchTerms.placa) !== -1 &&
        (data.placa_inventario || '').toString().toLowerCase().indexOf(searchTerms.placa_inventario) !== -1 &&
        (data.descripcion_tipo_equipo || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_equipo) !== -1 &&
        (data.descripcion_clase_equipo || '').toString().toLowerCase().indexOf(searchTerms.descripcion_clase_equipo) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Ejecuta la accion de Nueva.
   * @param mantenimiento Item selecconado
   */
  nueva(row: any) {
    this.opcionSeleccionada.emit({accion: 'nueva', row: row});
  }

  /**
   * Ejecuta la accion de Calendario.
   * @param mantenimiento Item selecconado
   */
  calendario(row: any) {
    this.opcionSeleccionada.emit({accion: 'calendario', row: row});
  }

  /**
   * Verifica si el registro tiene franjas asignadas.
   * @param row 
   * @returns true: si existen franjas | fasle: caso contrario
   */
  btnCheck(row: any) {
    /*let resp = await this.procesoMantenimiento.consultarRelaciones(`equipo = '${row.placa}'`);
    if(resp && resp.codError == 0) {
      resp.respuesta;
      if (resp.respuesta.length > 0) {
        return true;
      }
    }*/
    return false;
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
        let respServ = await this.procesoMantenimiento.listarEquiposDisponibles(filtro);
        if (respServ.codError == 0) {
          console.info("Equipos disponibles:");
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
