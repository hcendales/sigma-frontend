import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrarServicioComponent } from '../registrar-servicio/registrar-servicio.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConfirmarComponent } from '../modal-confirmar/modal-confirmar.component';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';



@Component({
  selector: 'app-solicitud-ensayo-laboratorio',
  templateUrl: './solicitud-ensayo-laboratorio.component.html',
  styleUrls: ['./solicitud-ensayo-laboratorio.component.scss']
})
export class SolicitudEnsayoLaboratorioComponent implements OnInit {

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  /**
   * declaracion e Inicio del dataSource
   */
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  /**
   * Limpiar el buscador
   */
  searchkey = '';

  /**
   * Spinner
   */
  loading: boolean = false;

  /**
   * Activa el bloqueador de campos en los formularios
   */
  bloquear : boolean = false;

  /**control del tamanio del mensaje de alerta */
  wDialog: string = '25%';
  hDialog: string = '22%';
  action: string | undefined;


  /**
   * Campos de la tabla de busqueda
   */
  displayedColumns: string[] = ['codigo_ensayo', 'fecha_solicitud', 'desc_servicio', 'nombre_usuario_solicitud', 'fecha_recepcion', 'TRABAJAR'];
  campos_export: string[] = ['CODIGO ENSAYO', 'FECHA SOLICITUD', 'SERVICIO', 'NOMBRE USUARIO SOLICITANTE', 'FECHA RECEPCION'];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6'];

  filterValues = {
    codigo_ensayo: '',
    fecha_solicitud: '',
    desc_servicio: '',
    nombre_usuario_solicitud: '',
    fecha_recepcion: '',
  };

  // total de columnas a mostrar
  public search0 = new FormControl('');
  public search1 = new FormControl('');
  public search2 = new FormControl('');
  public search3 = new FormControl('');
  public search4 = new FormControl('');
  public search5 = new FormControl('');
  public search6 = new FormControl('');

  /**
   * Seccion de detalle o informe de la solicitud
   */
  public showInformeDetalle: boolean = false;

  /**
   * Seccion de Nuevo y Actualizar Solicitudes
   */
  public showFormRegistro: boolean = false;

  /**
   * variable Generica donde se carga todos los valores que tiene la fila de la tabla
   */
  public rowUpdate: SolicitudEnsayoLaboratorio = {} as SolicitudEnsayoLaboratorio;

/**
 * Titulo del formulario
 */
  public tipoConsulta: string = '';

  /**
   * spinner de descarga archivo 
   */
  public archivoEnProceso: boolean = false;


  constructor(
    private solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cargueResultadoEnsayoService: CargueResultadoEnsayoService,
  ) { }

  async ngOnInit() {

    /**
     * Titulo del formulario
     */
    this.tipoConsulta = "Solicitudes Ensayo Laboratorio";

    /**
     * Obtiene todas las solciitudes cargadas
     */
    await this.cargueResultadoEnsayoService.buscarSolcitudesPriorizadas().then((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltro();
      this.onClearFilters();
    });


    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.codigo_ensayo = valor1.toLowerCase();;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.fecha_solicitud = valor2;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.desc_servicio = valor3.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );

    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.nombre_usuario_solicitud = valor4.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search5.valueChanges
      .subscribe(
        valor5 => {
          this.filterValues.fecha_recepcion = valor5;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );

    this.showFormRegistro = false;
  }


  creaFiltro() {
    this.dataSource.filterPredicate = ((data: any, filter: any) => {
      const searchTerms = JSON.parse(filter);
      return (data.codigo_ensayo || '').toString().toLowerCase().indexOf(searchTerms.codigo_ensayo) !== -1
        && (data.fecha_solicitud || '').toString().toLowerCase().indexOf(searchTerms.fecha_solicitud) !== -1
        && (data.desc_servicio || '').toString().toLowerCase().indexOf(searchTerms.desc_servicio) !== -1
        && (data.nombre_usuario_solicitud || '').toString().toLowerCase().indexOf(searchTerms.nombre_usuario_solicitud) !== -1
        && (data.fecha_recepcion || '').toString().toLowerCase().indexOf(searchTerms.fecha_recepcion) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /** Limpia cada campo de busqueda */
  onClearFilters() {
    this.search1.setValue('');
    this.search2.setValue('');
    this.search3.setValue('');
    this.search4.setValue('');
    this.search5.setValue('');
  }

  /** 
   * muestra la seccion de Creacion donde muestra todos los registros
   */
  crearRegistro() {
    this.showFormRegistro = true;
    this.bloquear = false;
    this.rowUpdate = {} as SolicitudEnsayoLaboratorio;
  }

  /**
   * Al tocar el Boton de Trabajar aqui se invoca los servicios de clonar la solicitud de ensayo los cuales retornan un nuevo ID 
   * y se invoca otro servicio de consulta para traer todos los datos de la tabla ensayo
   */
  async actualizaRegistro(row: SolicitudEnsayoLaboratorio) {

    if (row.situacion === "FINALIZADO"){
      this.snackBar.open('No se puede actualizar una solicitud con Estado Finalizada ', 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }
    if ( await this.cargueResultadoEnsayoService.buscarEstadoBloqueoDocumentoCaliope(row.id_documento)) {
      this.snackBar.open('No se puede actualizar una solicitud con Estado Bloqueado ', 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }

    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "U", itm: 0 }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.loading = true;
        this.bloquear = false;
        this.solicitudEnsayoLaboratorioService.clonarEnsayo(row.id_ensayo).then( element => {
            const new_idEnsayo = element.respuesta[0][":b1"];
            this.solicitudEnsayoLaboratorioService.buscarSolicitudes("id_ensayo = " + new_idEnsayo).then(async datos => {
              
              this.rowUpdate = datos.respuesta[0];
              this.showFormRegistro = true;

            }).catch(error => {
                this.snackBar.open('Error al consultar el ensayo ' + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
            });
        }).catch(error => {
          this.snackBar.open('Error al Clonar el Ensayo ' + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        });
        this.loading = false;
      }
    });
  }

  /**
   * Muestra el formulario y los datos cargados pero no permite editarlos.
   */
  consultarRegistro(row: SolicitudEnsayoLaboratorio){
      this.rowUpdate = row; 
      this.showFormRegistro = true;
      this.bloquear = true;
  }

  /**Cuando se desea ver campos del cargue de registro */
  detalleRegistro(row: SolicitudEnsayoLaboratorio) {
    this.showInformeDetalle = true;
    this.rowUpdate = row;
    this.bloquear = false;
  }

  /**
   * Recarga el formulario y cierra todas las secciones de Informe, editar y/o Nuevo
   */
  handleCancelar() {
    this.showFormRegistro = false;
    this.showInformeDetalle = false;
    this.bloquear = false;
    this.ngOnInit();
  }

  /**
   * Exportar Excel los datos
   */
  exportar() {
    this.archivoEnProceso = true;
    const blob = new Blob(['\ufeff' + this.getFileData()], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    let filename = 'SolicitudesEnsayoLaboratorio';

    filename += '_' + new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    this.archivoEnProceso = false;
  }

  private getFileData() {
    let texto = '';
    let separador = ';';
    let saltoLinea = '\n';
    let campoNull = ' - ';
    let region = 'es-CO';

    for (let i = 0; i < this.campos_export.length; i++) {
      texto += this.campos_export[i] + separador;
    }

    texto = texto.replace(/.$/, saltoLinea);

    for (let row of this.dataSource.data) {
      texto += (row.codigo_ensayo ? this.obtenerTextoReporte(row.codigo_ensayo) : campoNull) + separador;
      texto += (row.fecha_solicitud ? this.obtenerTextoReporte(new Date(row.fecha_solicitud).toLocaleDateString(region)) : campoNull) + separador;
      texto += (row.desc_servicio ? this.obtenerTextoReporte(row.desc_servicio) : campoNull) + separador;
      texto += (row.nombre_usuario_solicitud ? this.obtenerTextoReporte(row.nombre_usuario_solicitud) : campoNull) + separador;
      texto += (row.fecha_recepcion ? this.obtenerTextoReporte(new Date(row.fecha_recepcion).toLocaleDateString(region)) : campoNull) + separador;

      texto += saltoLinea;
    }
    return texto;
  }

  obtenerTextoReporte(texto: any) {
    if (typeof texto != "string") {
      return texto;
    }
    //si contiene ; o salto de linea encerrar el texto entre comillas y convertir las comillas del texto original en comillas dobles
    if (texto.includes(';') || texto.includes('\n')) {
      return `"${texto.replace(/"/g, '""')}"`;
    } else {
      return texto;
    }

  }
}

