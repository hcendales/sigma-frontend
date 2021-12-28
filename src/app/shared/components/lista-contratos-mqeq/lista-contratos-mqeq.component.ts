import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesoMantenimientoService } from '../../../core/services/proceso-mantenimiento.service';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';


/**
 * Componenete para gestionar la lista de contratos.
 */
@Component({
  selector: 'app-lista-contratos-mqeq',
  templateUrl: './lista-contratos-mqeq.component.html',
  styleUrls: ['./lista-contratos-mqeq.component.scss']
})
export class ListaContratosMqeqComponent implements AfterViewInit, OnInit {

  /**
   * Define las columnas de la tabla.
   */
  displayedColumns: string[] = [
    'checks',
    'numero_contrato',
    'nombre_contratista',
    'clase_contrato',
    'opciones'
  ];

  /**
   * Control de vigencia
   */
   formBuscar:FormGroup;

  /**
   * Define los datos del componente.
   */
  dataSource!: MatTableDataSource<any>;
  
  /**
   * Define las columnas de filtro.
   */
  filterColumns: string[] = [
    'space_1',
    'numero_contrato_filtro',
    'nombre_contratista_filtro',
    'clase_contrato_filtro',
    'space_2'
  ];

  /**
   * -----------------------------------------------------
   * Define los controles de los filtros.
   */

  numero_contrato_filtro = new FormControl('');
  nombre_contratista_filtro = new FormControl('');
  clase_contrato_filtro = new FormControl('');


  /**
   * Defeine los valores de filtro.
   */
  filterValues = {
    numero_contrato: '',
    nombre_contratista: '',
    clase_contrato: '',
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
   * Bandera para mostar resultados.
   */
   mostrar_resultados:boolean = false;

  /**
   * Datos de inicio de sesion.
   */
  loadingData:boolean = false;

  /**
   * Mensaje informativo.
   */
   mensaje = '';

  /**
   * Termino actual de busqueda.
   */
  searchkey = '';

  /**
   * Bandera para inidcar realizando consulta.
   */
  realizandoCounsulta = false;

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
   * Define el emisor del evento de regreso por 
   * cancelacion.
   * @see app-editar-programacion
   */
  @Output() regresarEvent: EventEmitter<void> = new EventEmitter();

  /**
   * Constructor del componenete.
   * 
   * @param router Enrutador del sistema. 
   * @param gestionService Servicio de gestion.
   */
  constructor(
    public fb:FormBuilder,
    private router: Router,
    private procesoMantenimiento: ProcesoMantenimientoService
  ) {
    // Define el formulario principal del componente.  
    this.formBuscar = this.fb.group({
      vigencia: new FormControl(''),
    });
  }

  /**
   * Metodo para liberara recursos.
   */
  ngAfterViewInit(): void {}

  /**
   * Metodo de carge incial del componente.
   */
  ngOnInit(): void {
    this.mensaje = "Ingrese una vigencia y luego de click en buscar para listar los posibles contratos.";
    // Define el manejador de cambio del filtro numero_contrato.
    this.numero_contrato_filtro.valueChanges.subscribe(
      numero_contrato_valor => {
        this.filterValues.numero_contrato = numero_contrato_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro nombre_contratista.
    this.nombre_contratista_filtro.valueChanges.subscribe(
      nombre_contratista_valor => {
        this.filterValues.nombre_contratista = nombre_contratista_valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.clearchecked();
      }
    );
    // Define el manejador de cambio del filtro clase_contrato.
    this.clase_contrato_filtro.valueChanges.subscribe(
      clase_contrato_valor => {
        this.filterValues.clase_contrato = clase_contrato_valor;
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
    this.numero_contrato_filtro.setValue('');
    this.nombre_contratista_filtro.setValue('');
    this.clase_contrato_filtro.setValue('');

  }

  /**
   * Emite el objeto seleccionado.
   * @param index Registro.
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
      return (data.numero_contrato || '').toString().toLowerCase().indexOf(searchTerms.numero_contrato) !== -1 &&
        (data.nombre_contratista || '').toString().toLowerCase().indexOf(searchTerms.nombre_contratista) !== -1 &&
        (data.clase_contrato || '').toString().toLowerCase().indexOf(searchTerms.clase_contrato) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  /**
   * Ejecuta la accion de Seleccionar.
   * @param mantenimiento Item selecconado
   */
  seleccionar(row: any) {
    this.opcionSeleccionada.emit({accion: 'seleccionar', row: row});
  }

  /**
   * Efectua la accion de buscar.
   */
   buscar() {
    let valueForm = this.formBuscar.value;
    let vigencia = valueForm.vigencia
    if (vigencia != null && vigencia != '') {
      this.consultarData(vigencia);
    } else {
      this.mostrar_resultados = false;
      this.mensaje = "(!) Debe igresar una vigencia válida."
    }
  }

  /**
   * Consulta los datos de la vista. 
   * @param filtro Filtro actual.
   */  
  async consultarData(vigencia:any) {
    if (!this.loadingData) {
      this.dataSource = new MatTableDataSource();
      this.loadingData = true;
      this.realizandoCounsulta = true;
      try {
        let respServ = await this.procesoMantenimiento.consultaContrato(vigencia);
        if (respServ.codError == 0) {
          console.info("Contratos:");
          console.info(respServ.respuesta);
          this.dataSource = new MatTableDataSource(respServ.respuesta);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.creaFiltro();
          this.onClearFilters();
          this.loadingData = false;
          this.mostrar_resultados = true;
        }
      } catch(e) {
        console.log(e);
        this.loadingData = false;
      }
      this.realizandoCounsulta = false;
    } 
  }
}
