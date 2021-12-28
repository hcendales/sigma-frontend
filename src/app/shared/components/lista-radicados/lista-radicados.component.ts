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
 * Componenete para gestionar la lista de radicados.
 */
@Component({
  selector: 'app-lista-radicados',
  templateUrl: './lista-radicados.component.html',
  styleUrls: ['./lista-radicados.component.scss']
})
export class ListaRadicadosComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'id_mantenimiento_vial',
    'numero',
    'fecha',
    'tipo',
    'url_archivo',
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
    'id_mantenimiento_vial_filtro',
    'numero_filtro',
    'fecha_filtro',
    'tipo_filtro',
    'url_archivo_filtro',
    'space_2',

  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */

  id_mantenimiento_vial_filtro = new FormControl('');
  numero_filtro = new FormControl('');
  fecha_filtro = new FormControl('');
  tipo_filtro = new FormControl('');
  url_archivo_filtro = new FormControl('');


  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    id_mantenimiento_vial:'',
    numero: '',
    fecha: '',
    tipo: '',
    url_archivo: '',

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
   * ID del registros a procesar.
   */
  @Input() arrayChecked: any = [];

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
    this.consultarData(this.arrayChecked.id_mantenimiento_vial);
    // Carga los datos de la vista.
    //this.consultarData(null);
    // Define al suscripcion de actualizacion de la lista.
    this.updateSubscription = this.actualizador.subscribe((filtro) => this.consultarData(filtro));
    // Define el manejador de cambio del filtro numero.
    this.id_mantenimiento_vial_filtro.valueChanges.subscribe(
      id_mantenimiento_vial_valor => {
        this.filterValues.id_mantenimiento_vial = id_mantenimiento_vial_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    this.numero_filtro.valueChanges.subscribe(
      numero_valor => {
        this.filterValues.numero = numero_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro fecha.
    this.fecha_filtro.valueChanges.subscribe(
      fecha_valor => {
        this.filterValues.fecha = fecha_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro tipo.
    this.tipo_filtro.valueChanges.subscribe(
      tipo_valor => {
        this.filterValues.tipo = tipo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro url_archivo.
    this.url_archivo_filtro.valueChanges.subscribe(
      url_archivo_valor => {
        this.filterValues.url_archivo = url_archivo_valor;
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
    this.numero_filtro.setValue('');
    this.fecha_filtro.setValue('');
    this.tipo_filtro.setValue('');
    this.url_archivo_filtro.setValue('');

  }

  /**
   * Actualiza la lista de chekeo.
   * @param event Evento.
   * @param index Inidice del registro.
   */
  updateCheckedList(event: any, index: any) {
    if (event.source._checked) {
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
      return (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial) !== -1 &&
        (data.numero || '').toString().toLowerCase().indexOf(searchTerms.numero) !== -1 &&
        (data.fecha || '').toString().toLowerCase().indexOf(searchTerms.fecha) !== -1 &&
        (data.tipo || '').toString().toLowerCase().indexOf(searchTerms.tipo) !== -1 &&
        (data.url_archivo || '').toString().toLowerCase().indexOf(searchTerms.url_archivo) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Ejecuta la accion de Eliminar.
   * @param mantenimiento Item selecconado
   */
  eliminarRadicado(selected: any) {
    //this.opcionSeleccionada.emit({accion: 'eliminar', row: row});3
    console.log(selected);
    this.procesoIntervencion.desasociarRadicado(selected)
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
        let respServ = await this.procesoIntervencion.consultarRadicados(filtro);
        if (respServ.codError == 0) {
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
  /**
   * Permite regresar al componente padre.
   */
  volver() {
    this.opcionSeleccionada.emit({ accion: 'salida', row: null });
  }
}
