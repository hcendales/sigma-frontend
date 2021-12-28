import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Mantenimineto } from './mantenimineto';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesoMantenimientoService } from '../../../core/services/proceso-mantenimiento.service';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Componenete que permite gestionar la lista de maquinario o equipo.
 */
@Component({
  selector: 'app-lista-maquinaria-equipos',
  templateUrl: './lista-maquinaria-equipos.component.html',
  styleUrls: ['./lista-maquinaria-equipos.component.scss']
})
export class ListaMaquinariaEquiposComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'checks',
    'numero_interno',
    'placa_inventario',
    'placa',
    'movil',
    'clase_equipo',
    'tipo_equipo',
    'placa_n_inventario',
    'marca_equipo',
    'estado_equipo',
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
    'numero_interno_filtro',
    'placa_inventario_filtro',
    'placa_filtro',
    'movil_filtro',
    'clase_equipo_filtro',
    'tipo_equipo_filtro',
    'placa_n_inventario_filtro',
    'marca_equipo_filtro',
    'estado_equipo_filtro',
    'space_2',
  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */

  numero_interno_filtro = new FormControl('');
  placa_inventario_filtro = new FormControl('');
  placa_filtro = new FormControl('');
  movil_filtro = new FormControl('');
  clase_equipo_filtro = new FormControl('');
  tipo_equipo_filtro = new FormControl('');
  placa_n_inventario_filtro = new FormControl('');
  marca_equipo_filtro = new FormControl('');
  estado_equipo_filtro = new FormControl('');


  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    numero_interno: '',
    placa_inventario: '',
    placa: '',
    movil: '',
    clase_equipo: '',
    tipo_equipo: '',
    placa_n_inventario: '',
    marca_equipo: '',
    estado_equipo: '',
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
  registros:Mantenimineto[] = [];

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
    // Define el manejador de cambio del filtro numero_interno.
    this.numero_interno_filtro.valueChanges.subscribe(
      numero_interno_valor => {
        this.filterValues.numero_interno = numero_interno_valor;
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
    // Define el manejador de cambio del filtro placa.
    this.placa_filtro.valueChanges.subscribe(
      placa_valor => {
        this.filterValues.placa = placa_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro movil.
    this.movil_filtro.valueChanges.subscribe(
      movil_valor => {
        this.filterValues.movil = movil_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro clase_equipo.
    this.clase_equipo_filtro.valueChanges.subscribe(
      clase_equipo_valor => {
        this.filterValues.clase_equipo = clase_equipo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro tipo_equipo.
    this.tipo_equipo_filtro.valueChanges.subscribe(
      tipo_equipo_valor => {
        this.filterValues.tipo_equipo = tipo_equipo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro placa_n_inventario.
    this.placa_n_inventario_filtro.valueChanges.subscribe(
      placa_n_inventario_valor => {
        this.filterValues.placa_n_inventario = placa_n_inventario_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro marca_equipo.
    this.marca_equipo_filtro.valueChanges.subscribe(
      marca_equipo_valor => {
        this.filterValues.marca_equipo = marca_equipo_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro estado_equipo.
    this.estado_equipo_filtro.valueChanges.subscribe(
      estado_equipo_valor => {
        this.filterValues.estado_equipo = estado_equipo_valor;
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
    this.placa_inventario_filtro.setValue('');
    this.placa_filtro.setValue('');
    this.movil_filtro.setValue('');
    this.clase_equipo_filtro.setValue('');
    this.tipo_equipo_filtro.setValue('');
    this.placa_n_inventario_filtro.setValue('');
    this.marca_equipo_filtro.setValue('');
    this.estado_equipo_filtro.setValue('');
  }

  /**
   * Emite el registro selecionado.
   * @param reg Registro.
   */
  updateChecked(reg: any) {
    this.registroSeleccionado.emit(reg);
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
        (data.placa_inventario || '').toString().toLowerCase().indexOf(searchTerms.placa_inventario) !== -1 &&
        (data.placa || '').toString().toLowerCase().indexOf(searchTerms.placa) !== -1 &&
        (data.movil || '').toString().toLowerCase().indexOf(searchTerms.movil) !== -1 &&
        (data.clase_equipo || '').toString().toLowerCase().indexOf(searchTerms.clase_equipo) !== -1 &&
        (data.tipo_equipo || '').toString().toLowerCase().indexOf(searchTerms.tipo_equipo) !== -1 &&
        (data.placa_n_inventario || '').toString().toLowerCase().indexOf(searchTerms.placa_n_inventario) !== -1 &&
        (data.marca_equipo || '').toString().toLowerCase().indexOf(searchTerms.marca_equipo) !== -1 &&
        (data.estado_equipo || '').toString().toLowerCase().indexOf(searchTerms.estado_equipo) !== -1;
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
   * Ejecuta la accion de Cancelar.
   * @param mantenimiento Item selecconado
   */
  eliminar(row: any) {
    this.opcionSeleccionada.emit({accion: 'eliminar', row: row});
  }

  /**
   * Ejecuta la accion de Finalizar.
   * @param mantenimiento Item selecconado
   */
  finalizar(row: any) {
    this.opcionSeleccionada.emit({accion: 'finalizar', row: row});
  }

  /**
   * Ejecuta la accion de Reporte.
   * @param mantenimiento Item selecconado
   */
  reporte(row: any) {
    this.opcionSeleccionada.emit({accion: 'reporte', row: row});
  }

  /**
   * Permite exportar los datos de la lista a archivo excel.
   */
  exportexcel() {
    if (this.registros.length > 0) {
      let headers = {header:[
        'No. Interno',
        'Placa Inventario',
        'Placa',
        'Móvil',
        'Clase de equipo',
        'Tipo',
        'Placa/N. inventario',
        'Marca',
        'Estado'
      ]};
      let datos = [];
      for (let registro of this.registros) {
        datos.push({
          'No. Interno': registro.numero_interno,
          'Placa Inventario': registro.placa_inventario,
          'Placa': registro.placa,
          'Móvil': registro.movil,
          'Clase de equipo': registro.clase_equipo,
          'Tipo': registro.tipo_equipo,
          'Placa/N. inventario': registro.placa_n_inventario,
          'Marca': registro.marca_equipo,
          'Estado': registro.estado_equipo
        });
      }
      const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(datos, headers);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, "Reporte_Maq_Equ.xlsx");
    }
  }

  /**
   * Habilita o deshabilita los botones de edicion.
   * @param row Registro.
   * @returns Resultado de habilitacion : bool
   */
  btnCheck(row: any) {
    return row.id_mantenimiento_equipo == null && (row.ingreso_como_fallo == 0 || row.ingreso_como_fallo == null);
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
        let respServ = await this.procesoMantenimiento.listarMaquinariaEquipos(filtro);
        if (respServ.codError == 0) {
          console.info("Lista maq equi:");
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
