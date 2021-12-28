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
 * Componenete para gestionar las franjas de un día.
 */
@Component({
  selector: 'app-lista-franjas',
  templateUrl: './lista-franjas.component.html',
  styleUrls: ['./lista-franjas.component.scss']
})
export class ListaFranjasComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'id_recurso_disponibilidad_relacion',
    'persona',
    'email',
    'fecha_inicio',
    'fecha_fin',
    'relacion',
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
    'persona_filtro',
    'email_filtro',
    'fecha_inicio_filtro',
    'fecha_fin_filtro',
    'relacion_filtro',
    'space_2',

  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */

  persona_filtro = new FormControl('');
  email_filtro = new FormControl('');
  fecha_inicio_filtro = new FormControl('');
  fecha_fin_filtro = new FormControl('');
  relacion_filtro = new FormControl('');


  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    persona: '',
    email: '',
    fecha_inicio: '',
    fecha_fin: '',
    relacion: '',

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
   * ID del registro a procesar.
   */
  @Input() relaciones:any = [];

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
    // Define el manejador de cambio del filtro persona.
    this.persona_filtro.valueChanges.subscribe(
      persona_valor => {
        this.filterValues.persona = persona_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro email.
    this.email_filtro.valueChanges.subscribe(
      email_valor => {
        this.filterValues.email = email_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro fecha_inicio.
    this.fecha_inicio_filtro.valueChanges.subscribe(
      fecha_inicio_valor => {
        this.filterValues.fecha_inicio = fecha_inicio_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro fecha_fin.
    this.fecha_fin_filtro.valueChanges.subscribe(
      fecha_fin_valor => {
        this.filterValues.fecha_fin = fecha_fin_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro relacion.
    this.relacion_filtro.valueChanges.subscribe(
      relacion_valor => {
        this.filterValues.relacion = relacion_valor;
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
    this.persona_filtro.setValue('');
    this.email_filtro.setValue('');
    this.fecha_inicio_filtro.setValue('');
    this.fecha_fin_filtro.setValue('');
    this.relacion_filtro.setValue('');

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
      return (data.persona || '').toString().toLowerCase().indexOf(searchTerms.persona) !== -1 &&
(data.email || '').toString().toLowerCase().indexOf(searchTerms.email) !== -1 &&
(data.fecha_inicio || '').toString().toLowerCase().indexOf(searchTerms.fecha_inicio) !== -1 &&
(data.fecha_fin || '').toString().toLowerCase().indexOf(searchTerms.fecha_fin) !== -1 &&
(data.relacion || '').toString().toLowerCase().indexOf(searchTerms.relacion) !== -1;
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
  eliminar(row: any) {
    this.opcionSeleccionada.emit({accion: 'eliminar', row: row});
  }

  /**
   * Permite regresar al componente padre.
   */
  volver() {
    //debugger;
    this.opcionSeleccionada.emit({accion: 'salida', row: null});
  }

  /**
   * Consulta los datos de la vista. 
   * @param filtro Filtro actual.
   */  
  consultarData(filtro:any) {
    if (!this.loadingData) {
      this.dataSource = new MatTableDataSource();
      this.loadingData = true;
      try {
          console.info("Franjas de lista:");
          console.info(this.relaciones);
          console.info("Fecha:");
          console.info(new Date (this.relaciones[0].fecha_inicio));
          this.dataSource = new MatTableDataSource(this.relaciones);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.creaFiltro();
          this.onClearFilters();
          this.loadingData = false;
      } catch(e) {
        console.log(e);
        this.loadingData = false;
      } 
    } 
  }

}
