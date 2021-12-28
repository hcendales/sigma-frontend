import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-mantenimientos-activos',
  templateUrl: './table-mantenimientos-activos.component.html',
  styleUrls: ['./table-mantenimientos-activos.component.scss']
})
export class TableMantenimientosActivosComponent implements OnInit {

  searchkey: string = '';
  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_estado_pk', 'civ', 'eje_vial', 'desde', 'hasta', 'id_localidad', 'descripcion_localidad', 'descripcion_zona', 'descripcion_barrio', 'eliminar'];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8', 'search9', 'search10', 'search11','search12' ];


  /**
   * (CUS 12 / Cargue de Resultado), solicita solo ver los datos y no deben modificar.
   */
  @Input() bloquear: boolean = false;         


  /**
   * Aqui quien recibe el objeto de datos para luego imprimir. llama a metodo creaFiltroXColumna
   */
  @Input() set pKsSelected(pKsSelected: any) {
    this.dataSource = new MatTableDataSource(pKsSelected);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.creaFiltroXColumna();
  }

  /**
   * cuando elimina aqui Emite las filas retantes
   */
  @Output() rowTotal = new EventEmitter();      


  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  
  
  search0 = new FormControl('');
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  search5 = new FormControl('');
  search6 = new FormControl('');
  search7 = new FormControl('');
  search8 = new FormControl('');
  search9 = new FormControl('');
  search10 = new FormControl('');
  search11 = new FormControl('');

  filterValues = {
    id_mantenimiento_vial: '',
    pk_id_calzada: '',
    descripcion_estado_pk: '',
    civ: '',
    eje_vial: '',
    desde: '',
    hasta: '',
    id_localidad: '',
    descripcion_localidad: '',
    descripcion_zona: '',
    descripcion_barrio: '',
  };
    



  constructor() {  }

  ngOnInit(): void { 
    /** Inicio Filtros por Columna */
    this.search0.valueChanges
    .subscribe(
      valor0 => {
        this.filterValues.id_mantenimiento_vial  = valor0;
        this.filterValues.pk_id_calzada          = '';
        this.filterValues.descripcion_estado_pk  = '';
        this.filterValues.civ                    = '';
        this.filterValues.eje_vial               = '';
        this.filterValues.desde                  = '';
        this.filterValues.hasta                  = '';
        this.filterValues.id_localidad           = '';
        this.filterValues.descripcion_localidad  = '';
        this.filterValues.descripcion_zona       = '';
        this.filterValues.descripcion_barrio     = '';
        this.dataSource.filter                   = JSON.stringify(this.filterValues);
      }
    );
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.id_mantenimiento_vial = valor1;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.pk_id_calzada = valor2;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.descripcion_estado_pk = valor3;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.civ = valor4;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search5.valueChanges
      .subscribe(
        valor5 => {
          this.filterValues.eje_vial = valor5;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search6.valueChanges
      .subscribe(
        valor6 => {
          this.filterValues.desde = valor6;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search7.valueChanges
      .subscribe(
        valor7 => {
          this.filterValues.hasta = valor7;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search8.valueChanges
      .subscribe(
        valor8 => {
          this.filterValues.id_localidad = valor8;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search9.valueChanges
      .subscribe(
        valor9 => {
          this.filterValues.descripcion_localidad = valor9;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search10.valueChanges
      .subscribe(
        valor10 => {
          this.filterValues.descripcion_zona = valor10;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search11.valueChanges
      .subscribe(
        valor11 => {
          this.filterValues.descripcion_barrio = valor11;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    /** Fin Filtros por Columna */


   }



  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {

      const searchTerms = JSON.parse(filter);
      return (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial)    !== -1
        && (data.pk_id_calzada           || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada)            !== -1
        && (data.descripcion_estado_pk   || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_pk)    !== -1
        && (data.civ                     || '').toString().toLowerCase().indexOf(searchTerms.civ)                      !== -1
        && (data.eje_vial                || '').toString().toLowerCase().indexOf(searchTerms.eje_vial)                 !== -1
        && (data.desde                   || '').toString().toLowerCase().indexOf(searchTerms.desde)                    !== -1
        && (data.hasta                   || '').toString().toLowerCase().indexOf(searchTerms.hasta)                    !== -1
        && (data.id_localidad            || '').toString().toLowerCase().indexOf(searchTerms.id_localidad)             !== -1
        && (data.descripcion_localidad   || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad)    !== -1
        && (data.descripcion_zona        || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona)         !== -1
        && (data.descripcion_barrio      || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio)       !== -1;

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
    this.search7.setValue('');
    this.search8.setValue('');
    this.search9.setValue('');
    this.search10.setValue('');
    this.search11.setValue('');
  }

  onDeleteRow(id: number, itm : any){
    this.dataSource.data = this.dataSource.data.filter(e => e !== itm)

    this.rowTotal.emit(this.dataSource.data);
    

  }


}
