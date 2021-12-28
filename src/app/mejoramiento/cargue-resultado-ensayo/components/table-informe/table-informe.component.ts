import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { informeDetalle } from '../../../../core/models/solicitud-ensayo-laboratorio';

@Component({
  selector: 'app-table-informe',
  templateUrl: './table-informe.component.html',
  styleUrls: ['./table-informe.component.scss']
})
export class TableInformeComponent implements OnInit {

  searchkey: string = '';
  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['numero_radicado','id_documento_informe', 'asunto', 'fecha_radicado','TRABAJAR'];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5'];

  @Input() set listaInformes(listaInformes: any) {
    this.dataSource = new MatTableDataSource(listaInformes);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.creaFiltroXColumna();
  }

  @Input() set borrarInforme(borrarInforme: informeDetalle) {
    this.dataSource.data = this.dataSource.data.filter(e => e !== borrarInforme);
  }

  /**
   * Si la situacion de la solicitud es Finalizado debe quedar todo bloqueado
   */
  @Input() bloquear: boolean = false;          
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  @Output() rowInforme = new EventEmitter();  

/**
 * cuando elimina aqui Emite las filas retantes
 */
  @Output() rowTotal = new EventEmitter();

  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  
  filterValues = {
    numero_radicado: '',
    id_documento_informe:'',
    asunto: '',
  };
    
  constructor() {  }

  ngOnInit(): void { 
    /** Inicio Filtros por Columna */

    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.numero_radicado      = valor1;
          this.dataSource.filter                 = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.id_documento_informe = valor2;
          this.dataSource.filter                 = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.asunto               = valor3;
          this.dataSource.filter                 = JSON.stringify(this.filterValues);
        }
      );
    /** Fin Filtros por Columna */
   }



  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {

      const searchTerms = JSON.parse(filter);
      return (data.numero_radicado || '').toString().toLowerCase().indexOf(searchTerms.numero_radicado)    !== -1
        && (data.id_documento_informe || '').toString().toLowerCase().indexOf(searchTerms.id_documento_informe)!== -1
        && (data.asunto            || '').toString().toLowerCase().indexOf(searchTerms.asunto)             !== -1;

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
  }

  onCargarFila(row : informeDetalle){
    this.rowInforme.emit(row)
  }

  onConfirmEliminar(itm: any) {
    this.rowTotal.emit(itm);
  }
}
