import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';
import { formatDate } from 'esri/intl';
import { isValidDate } from '../../../../produccion/mantenimiento/components/editar-programacion/editar-programacion.component';
import { DatePipe } from '@angular/common';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';


@Component({
  selector: 'app-resultado-ensayo',
  templateUrl: './resultado-ensayo.component.html',
  styleUrls: ['./resultado-ensayo.component.scss'],
  providers: [DatePipe]
})
export class ResultadoEnsayoComponent implements OnInit {


  
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchkey = '';

  displayedColumns: string[] = ['codigo_ensayo', 'fecha_solicitud', 'desc_servicio', 'nombre_usuario_solicitud', 'fecha_recepcion', 'prioridad', 'situacion', 'TRABAJAR'];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8'];

  exportColumns: string[] = ['codigo_ensayo', 'fecha_solicitud', 'desc_servicio', 'nombre_usuario_solicitud', 'nombre_usuario_recibe_muestra', 'fecha_recepcion', 'prioridad', 'situacion', 'desc_jornada', 'descripcion', 'observacion'];
  exportCaption: string[] = ['CODIGO ENSAYO', 'FECHA SOLICITUD', 'SERVICIO', 'USUARIO SOLICITANTE', 'QUIEN RECIBE LA MUESTRA', 'FECHA RECEPCION', 'PRIORIDAD', 'ESTADO','JORNADA', 'DESCRIPCION', 'OBSERVACIONES'];

  filterValues = {
    codigo_ensayo: '',
    fecha_solicitud: '',
    desc_servicio: '',
    nombre_usuario_solicitud: '',
    fecha_recepcion: '',
    prioridad: '',
    situacion: '',
  };

  // total de columnas a mostrar
  public search1 = new FormControl('');
  public search2 = new FormControl('');
  public search3 = new FormControl('');
  public search4 = new FormControl('');
  public search5 = new FormControl('');
  public search6 = new FormControl('');
  public search7 = new FormControl('');

  /**
   * muestra o oculta Seccion donde esta la solicitud [ apique, densidad, otros, etc ]
   */
  public showResultado: boolean = false;    

  /**
   * muestra o oculta la seccion de gestion campos adicionales a la solicitud que seran llenados por la persona en el labortarorio
   */
  public showGestion: boolean = false;      

  /**
   * variable Generica donde se carga todos los valores que tiene la fila de la tabla
   */
  public rowUpdate: SolicitudEnsayoLaboratorio = {} as SolicitudEnsayoLaboratorio;


  public archivoEnProceso: boolean = false;


  constructor(
    private fb: FormBuilder,
    private activatedroute: ActivatedRoute,
    public cargueResultadoEnsayoService: CargueResultadoEnsayoService,
    public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
    private datePipe: DatePipe,
    ) { }

  ngOnInit(): void {   
    this.activatedroute.paramMap.subscribe(async params => {
      await this.cargueResultadoEnsayoService.buscarSolcitudesPriorizadas().then((resp: any) => {
        this.dataSource = new MatTableDataSource(resp.respuesta);
        //resp.respuesta.sort((a: { situacion: string; }, b: { situacion: string; }) => (a.situacion === "FINALIZADO" ? -1 : 0) );
        this.dataSource.paginator = this.paginator;
        this.creaFiltro();
        this.onClearFilters();
      });
    });

    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.codigo_ensayo = valor1.toLowerCase();
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
    this.search6.valueChanges
      .subscribe(
        valor6 => {
          this.filterValues.prioridad = valor6;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search7.valueChanges
      .subscribe(
        valor7 => {
          this.filterValues.situacion = valor7;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.showResultado = true;
  }
  creaFiltro() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {
      const searchTerms = JSON.parse(filter);
      return (data.codigo_ensayo              || '').toString().toLowerCase().indexOf(searchTerms.codigo_ensayo)                 !== -1
        && (data.fecha_solicitud          || '').toString().toLowerCase().indexOf(searchTerms.fecha_solicitud)           !== -1
        && (data.desc_servicio            || '').toString().toLowerCase().indexOf(searchTerms.desc_servicio)             !== -1
        && (data.nombre_usuario_solicitud || '').toString().toLowerCase().indexOf(searchTerms.nombre_usuario_solicitud)  !== -1
        && (data.fecha_recepcion          || '').toString().toLowerCase().indexOf(searchTerms.fecha_recepcion)           !== -1
        && (data.prioridad                || '').toString().toLowerCase().indexOf(searchTerms.prioridad)           !== -1
        && (data.situacion                || '').toString().toLowerCase().indexOf(searchTerms.situacion)           !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onSearchClear() {
    this.searchkey = '';
    this.applyFilter('');
  }

  applyFilter(valor: string): void {
    this.dataSource.filter = valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * limpia los objetos de busqueda de cada columna
   */
  onClearFilters() {
    this.search1.setValue('');
    this.search2.setValue('');
    this.search3.setValue('');
    this.search4.setValue('');
    this.search5.setValue('');
    this.search6.setValue('');
    this.search7.setValue('');
  }


  calcularColorFila(itm: SolicitudEnsayoLaboratorio) {
    
    const colors = [
      '#fce1e1', // rojo
      '#fcf4e1', // amarillo
      '#f1fce1', // verde
    ]
    if (itm.situacion === "EDITADA") return colors[1];
    return itm.prioridad <= 3 ? colors[0] : ""
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
    let filename = 'CargueResultadoEnsayos';

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

    for (let i = 0; i < this.exportCaption.length; i++) {
      texto += this.exportCaption[i] + separador;
    }

    texto = texto.replace(/.$/, saltoLinea);

    for (let row of this.dataSource.data) {
      for (let i = 0; i < this.exportColumns.length; i++) {
        
        let valorColumna = row[this.exportColumns[i].toString()];
        let obtieneFecha = this.esFecha(valorColumna);
        
        texto += (row[this.exportColumns[i].toString()] ? this.obtenerTextoReporte(obtieneFecha === "false" ? valorColumna : obtieneFecha  ) : campoNull) + separador;
      }
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

  /**
   * Valida si el campo es una fecha 
   * true = devuelve la fecha
   * false = lo devuelve tipo string
   * 
   * @param dato 
   * @returns 
   */
  esFecha(dato: string){
    let retVal : string = 'false';

    try {
      const dateConversion = new Date(dato.toString().length > 8 ? dato : "false").toLocaleDateString('es-CO');
      retVal = dateConversion === "Invalid Date" ? "false" : dateConversion.toString();
    }catch(e){
      retVal = 'false';
    }

    return retVal
  }

}