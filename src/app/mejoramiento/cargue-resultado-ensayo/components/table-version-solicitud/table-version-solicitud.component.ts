import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';
import { ModalVersionComponent } from '../modal-version/modal-version.component';

@Component({
  selector: 'app-table-version-solicitud',
  templateUrl: './table-version-solicitud.component.html',
  styleUrls: ['./table-version-solicitud.component.scss']
})
export class TableVersionSolicitudComponent implements OnInit {

  /***
   * campos de la tabla 
   */
  searchkey: string = '';
  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id_ensayo', 'fecha_solicitud', 'codigo_ensayo', 'consecutivo', 'fecha_programada', 'fecha_recepcion', 'version', 'BOTON'];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8' ];

  /**
   * Obtiene true cuando se desea bloquear elementos de la tabla
   */
  @Input() bloquear: boolean = false;
  

  /**
   * Obtiene el CODIGO UNICO por la solicitud tomar en cuenta que este codigo se duplica por version pero es unico por solicitud
   */
  @Input() set codigo_ensayo(codigo_ensayo: any) {
    this.creaFiltroXColumna(codigo_ensayo);
  }



  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  @Output() rowTotal = new EventEmitter();
  
  /**Tamanio del modal Confirmacion */
  wDialog: string = '80%';
  hDialog: string = '80%';

  search0 = new FormControl('');
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  search5 = new FormControl('');
  search6 = new FormControl('');

  filterValues = {
    id_ensayo                 : '',
    fecha_solicitud           : '',
    codigo_ensayo             : '',
    consecutivo               : '',
    fecha_programada          : '',
    fecha_recepcion           : '',
    version                   : '',
  };
    
  constructor(private cargueResultadoEnsayoService: CargueResultadoEnsayoService, private dialog: MatDialog,) {  }

  ngOnInit(): void { 
    /** Inicio Filtros por Columna */
    this.search0.valueChanges
    .subscribe(
      valor0 => {
        this.filterValues.id_ensayo                 = valor0;
        this.filterValues.fecha_solicitud           = '';
        this.filterValues.codigo_ensayo             = '';
        this.filterValues.consecutivo               = '';
        this.filterValues.fecha_programada          = '';
        this.filterValues.fecha_recepcion           = '';
        this.filterValues.version                   = '';
        this.dataSource.filter                      = JSON.stringify(this.filterValues);
      }
    );
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.id_ensayo = valor1;
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
          this.filterValues.codigo_ensayo = valor3;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.consecutivo = valor4;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search5.valueChanges
      .subscribe(
        valor5 => {
          this.filterValues.fecha_programada = valor5;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search6.valueChanges
      .subscribe(
        valor6 => {
          this.filterValues.fecha_programada = valor6;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    /** Fin Filtros por Columna */
   }



  /** Crea los filtros por cada columna */
  async creaFiltroXColumna(codigo_ensayo: string) {

    await this.cargueResultadoEnsayoService.buscarVersiones(codigo_ensayo).then( (resp : any)  => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })


    this.dataSource.filterPredicate = ((data: any, filter: any) => {
      const searchTerms = JSON.parse(filter);
      return (data.id_ensayo                || '').toString().toLowerCase().indexOf(searchTerms.id_ensayo)                  !== -1
        && (data.fecha_solicitud            || '').toString().toLowerCase().indexOf(searchTerms.fecha_solicitud)            !== -1
        && (data.codigo_ensayo              || '').toString().toLowerCase().indexOf(searchTerms.codigo_ensayo)              !== -1
        && (data.consecutivo                || '').toString().toLowerCase().indexOf(searchTerms.consecutivo)                !== -1
        && (data.fecha_programada           || '').toString().toLowerCase().indexOf(searchTerms.fecha_programada)           !== -1
        && (data.fecha_recepcion            || '').toString().toLowerCase().indexOf(searchTerms.fecha_recepcion)            !== -1
        && (data.version                    || '').toString().toLowerCase().indexOf(searchTerms.version)                    !== -1;
    });

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  /** Limpiar los filtros de cada columna */
  onClearFilters() {
    this.search1.setValue('');
    this.search2.setValue('');
    this.search3.setValue('');
    this.search4.setValue('');
    this.search5.setValue('');
    this.search6.setValue('');
  }

  /**
   * Despliega la version aterior de la solicitud
   * 
   * @param itm 
   */
  modalVersion(itm: SolicitudEnsayoLaboratorio){
    const dialogRef = this.dialog.open(ModalVersionComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: itm
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          console.log
      }
    });
  }
}
