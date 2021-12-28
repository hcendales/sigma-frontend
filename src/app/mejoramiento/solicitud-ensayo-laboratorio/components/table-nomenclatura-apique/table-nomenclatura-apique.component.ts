import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-nomenclatura-apique',
  templateUrl: './table-nomenclatura-apique.component.html',
  styleUrls: ['./table-nomenclatura-apique.component.scss']
})
export class TableNomenclaturaApiqueComponent implements OnInit {


  searchkey: string = '';
  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id_mantenimiento_vial_evento', 'observacion'];
  //filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8', 'search9', 'search10', 'search11','search12' ];


  /**
   * (CUS 12 / Cargue de Resultado), solicita solo ver los datos y no deben modificar.
   */
  @Input() bloquear: boolean = false;         


  /**
   * Aqui quien recibe el objeto de datos para luego imprimir. llama a metodo creaFiltroXColumna
   */
  @Input() set nomenclatura(nomenclatura: any) {
    this.dataSource = new MatTableDataSource(nomenclatura);
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

  filterValues = {
    id_mantenimiento_vial_evento: '',
    observacion: '',
  };
    



  constructor() {  }

  ngOnInit(): void { 

   }



  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {

      const searchTerms = JSON.parse(filter);
      return (data.id_mantenimiento_vial_evento || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial_evento)    !== -1
        && (data.observacion      || '').toString().toLowerCase().indexOf(searchTerms.observacion)       !== -1;

    });

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  /** Limpiar los filtros de cada columna */
  onClearFilters() {

  }
 

}
