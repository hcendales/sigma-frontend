import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesoMantenimientoService } from '../../../core/services/proceso-mantenimiento.service';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';
import { Fallo } from './fallo';


/**
 * Componenete para gestionar la lista de fallos.
 */
@Component({
  selector: 'app-lista-fallos',
  templateUrl: './lista-fallos.component.html',
  styleUrls: ['./lista-fallos.component.scss']
})
export class ListaFallosComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'numero_interno',
    'fecha_reporto_fallo',
    'descripcion_fallo',
    'variable_control_fallo',
    'valor_var_fallo',
    'ubicacion',
  ];

  /**
   * Define los datos del componente.
   */
  dataSource!: MatTableDataSource<any>;
  
  /**
   * Define las columnas de filtro.
   */
  filterColumns: string[] = [
    'numero_interno_filtro',
    'fecha_reporto_fallo_filtro',
    'descripcion_fallo_filtro',
    'variable_control_fallo_filtro',
    'valor_var_fallo_filtro',
    'ubicacion_filtro',
  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */
  descripcion_fallo_filtro = new FormControl('');
  variable_control_fallo_filtro = new FormControl('');
  valor_var_fallo_filtro = new FormControl('');
  ubicacion_filtro = new FormControl('');
  numero_interno_filtro = new FormControl('');
  fecha_reporto_fallo_filtro = new FormControl('');

  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    numero_interno: '',
    fecha_reporto_fallo: '',
    descripcion_fallo: '',
    variable_control_fallo: '',
    valor_var_fallo: '',
    ubicacion: '',
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
   * Array de registros.
   */
  registros:Fallo[] = [];
  
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
    // Define el manejador de cambio del filtro numero_interno.
    this.numero_interno_filtro.valueChanges.subscribe(
      numero_interno_valor => {
        this.filterValues.numero_interno = numero_interno_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro fecha_reporto_fallo.
    this.fecha_reporto_fallo_filtro.valueChanges.subscribe(
      fecha_reporto_fallo_valor => {
        this.filterValues.fecha_reporto_fallo = fecha_reporto_fallo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro descripcion_fallo.
    this.descripcion_fallo_filtro.valueChanges.subscribe(
      descripcion_fallo_valor => {
        this.filterValues.descripcion_fallo = descripcion_fallo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro variable_control_fallo.
    this.variable_control_fallo_filtro.valueChanges.subscribe(
      variable_control_fallo_valor => {
        this.filterValues.variable_control_fallo = variable_control_fallo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro valor_var_fallo.
    this.valor_var_fallo_filtro.valueChanges.subscribe(
      valor_var_fallo_valor => {
        this.filterValues.valor_var_fallo = valor_var_fallo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro ubicacion.
    this.ubicacion_filtro.valueChanges.subscribe(
      ubicacion_valor => {
        this.filterValues.ubicacion = ubicacion_valor;
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
    this.numero_interno_filtro.setValue('');
    this.fecha_reporto_fallo_filtro.setValue('');
    this.descripcion_fallo_filtro.setValue('');
    this.variable_control_fallo_filtro.setValue('');
    this.valor_var_fallo_filtro.setValue('');
    this.ubicacion_filtro.setValue('');
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
      return (data.numero_interno || '').toString().toLowerCase().indexOf(searchTerms.numero_interno) !== -1 &&
        (data.fecha_reporto_fallo || '').toString().toLowerCase().indexOf(searchTerms.fecha_reporto_fallo) !== -1 &&
        (data.descripcion_fallo || '').toString().toLowerCase().indexOf(searchTerms.descripcion_fallo) !== -1 &&
        (data.variable_control_fallo || '').toString().toLowerCase().indexOf(searchTerms.variable_control_fallo) !== -1 &&
        (data.valor_var_fallo || '').toString().toLowerCase().indexOf(searchTerms.valor_var_fallo) !== -1 &&
        (data.ubicacion || '').toString().toLowerCase().indexOf(searchTerms.ubicacion) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Permite exportar los datos de la lista a archivo excel.
   */
  exportexcel() {
    if (this.registros.length > 0) {
      let headers = {header:[
        'No. Interno',
        'Fecha Reporte',
        'Descripcion del Fallo',
        'Variable de Control',
        'Valor',
        'Ubicación',
      ]};
      let datos = [];
      let fecha = '';
      for (let registro of this.registros) {
        datos.push({
          'No. Interno': registro.numero_interno,
          'Fecha Reporte': new Date(registro.fecha_reporto_fallo ? registro.fecha_reporto_fallo : '').toISOString(),
          'Descripcion del Fallo': registro.descripcion_fallo,
          'Variable de Control': registro.variable_control_fallo,
          'Valor': registro.valor_var_fallo,
          'Ubicación': registro.ubicacion,
        });
      }
      const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(datos, headers);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, "Reporte_Fallas.xlsx");
    }
  }

  /**
   * Permite regresar al componente padre.
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
        let respServ = await this.procesoMantenimiento.listarFallos(filtro);
        if (respServ.codError == 0) {
          console.info("Respuesta:");
          console.info(respServ.respuesta);
          this.registros = respServ.respuesta;
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
