import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';

@Component({
  selector: 'app-informe-detalle',
  templateUrl: './informe-detalle.component.html',
  styleUrls: ['./informe-detalle.component.scss'],
})
export class InformeDetalleComponent implements OnInit {
  
  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['numero_radicado', 'id_documento_informe', 'asunto', 'descripcion_tipo_resultado', 'fecha_radicado', 'fecha_resultado' ];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6'];

  @Input() rowUpdate: any;
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  @Output() cancelar = new EventEmitter();
  
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  search5 = new FormControl('');
  search6 = new FormControl('');

  
  
  filterValues = {
    numero_radicado: '',
    id_documento_informe:'',
    asunto: '',
    descripcion_tipo_resultado:'',
    fecha_radicado: '',
    fecha_resultado: '',
  };


 constructor(private cargueResultadoEnsayoService: CargueResultadoEnsayoService, private snackBar: MatSnackBar,) { }


 async ngOnInit(): Promise<void> { 
    
    await this.cargueResultadoEnsayoService.buscarInforme("id_ensayo = " + this.rowUpdate.id_ensayo).then(r => {
      
      this.dataSource = new MatTableDataSource(r.respuesta);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltroXColumna();

    }).catch(error => {
      this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    });

   /** Inicio Filtros por Columna */

   this.search1.valueChanges
     .subscribe(
       valor1 => {
         this.filterValues.numero_radicado = valor1;
         this.dataSource.filter = JSON.stringify(this.filterValues);
       }
     );
   this.search2.valueChanges
     .subscribe(
       valor2 => {
         this.filterValues.id_documento_informe = valor2;
         this.dataSource.filter = JSON.stringify(this.filterValues);
       }
     );
   this.search3.valueChanges
     .subscribe(
       valor3 => {
         this.filterValues.asunto = valor3;
         this.dataSource.filter = JSON.stringify(this.filterValues);
       }
     );
   this.search4.valueChanges
     .subscribe(
       valor4 => {
         this.filterValues.descripcion_tipo_resultado = valor4;
         this.dataSource.filter = JSON.stringify(this.filterValues);
       }
     );
    /** Fin Filtros por Columna */

  }


  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {

      const searchTerms = JSON.parse(filter);
      return (data.numero_radicado || '').toString().toLowerCase().indexOf(searchTerms.numero_radicado) !== -1
        && (data.id_documento_informe || '').toString().toLowerCase().indexOf(searchTerms.id_documento_informe) !== -1
        && (data.asunto || '').toString().toLowerCase().indexOf(searchTerms.asunto) !== -1
        && (data.descripcion_tipo_resultado || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_resultado) !== -1
        && (data.fecha_radicado || '').toString().toLowerCase().indexOf(searchTerms.fecha_radicado) !== -1
        && (data.fecha_resultado || '').toString().toLowerCase().indexOf(searchTerms.fecha_resultado) !== -1;
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
  }

  handlCancelar(): void {
    this.cancelar.emit(true);
  }
}


