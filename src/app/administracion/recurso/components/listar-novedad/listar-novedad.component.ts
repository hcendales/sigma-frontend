import { AfterViewInit, Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Routes, Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { EntityTabNovedadService } from '../../../../core/services/entity-tab-novedad.service';
import { InsertarNovedadComponent } from '../insertar-novedad/insertar-novedad.component';

@Component({
  selector: 'app-listar-novedad',
  templateUrl: './listar-novedad.component.html',
  styleUrls: ['./listar-novedad.component.scss']
})
export class ListarNovedadComponent implements OnInit {
  @Input() idRecurso: number = 0;
  // Titulo
  public titulo = 'NOVEDADES';
  // Propiedades
  displayedColumns: string[] = [
    'descripcion_tipo_novedad', 'hora_desde', 'hora_hasta', 'observaciones',  'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5'];
  // Campos de filtro en el formulario
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  search5 = new FormControl('');

  filterValues = {
    descripcion_tipo_novedad: '',
    hora_desde: '',
    hora_hasta: '',
    observaciones: '',
  };

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private entityTabNovedadService: EntityTabNovedadService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const condicion = "id_Recurso=" + this.idRecurso;
    this.entityTabNovedadService.list(condicion).then((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      // console.log('Datasource ', this.dataSource.data.length);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltro();
      this.onClearFilters();
    });
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.descripcion_tipo_novedad = valor1.toLowerCase();
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.hora_desde = valor2.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
      this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.hora_hasta = valor3.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
      this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.observaciones = valor4.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  }
  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) =>{
      const searchTerms = JSON.parse(filter);
      return (data.descripcion_tipo_novedad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_novedad) !== -1
      && (data.hora_desde || '').toString().toLowerCase().indexOf(searchTerms.hora_desde) !== -1
      && (data.hora_hasta || '').toString().toLowerCase().indexOf(searchTerms.hora_hasta) !== -1
      && (data.observaciones || '').toString().toLowerCase().indexOf(searchTerms.observaciones) !== -1;

    });
    setTimeout( () => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort      = this.sort;
    });
  }
  onClearFilters(){
    this.search1.setValue('');
    this.search2.setValue('');
    this.search3.setValue('');
    this.search4.setValue('');
    this.search5.setValue('');
  }

  // Abre la ventana de ubicar apique crear
  // Abre la ventana de ubicar apiques actualizacion
  openDialogInsertar(): void {
    const dialogRef = this.dialog.open(InsertarNovedadComponent, {
      width: '850px',
      disableClose: true,
      data: {idRecurso: this.idRecurso,
      cantidadRegistros: this.dataSource.data.length}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
}
  // Abre la ventana de ubicar apiques actualizacion
  openDialog(row: any): void {
    // console.log('Row ', row);
    const dialogRef = this.dialog.open(InsertarNovedadComponent, {
      width: '850px',
      disableClose: false,
      data: {idRecursoNovedad: row.id_recurso_novedad,
        idRecurso: row.id_recurso,
        idTipoNovedad: row.id_tipo_novedad,
        horaDesde: row.hora_desde,
        horaHasta: row.hora_hasta,
        observaciones: row.observaciones,
        descripcionTipoNovedad: row.descripcion_Tipo_novedad,
        valorTipoNovedad: row.valor_tipo_novedad,
        descripcionRecurso: row.descripcion_recurso,
        identificacionRecurso: row.identificacion_recurso,
    }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.ngOnInit();
    });
  }
  async onEliminar(idEntity: number): Promise<void>{
    try{
      // console.log('idEntity', idEntity);
      if(confirm('Esta seguro de borrar 111?')){
        await this.entityTabNovedadService.eliminar(idEntity);
        alert('Registro Borrado.');
        this.ngOnInit();
      }
    }catch (err){
      console.log(err);
    }
  }

}
