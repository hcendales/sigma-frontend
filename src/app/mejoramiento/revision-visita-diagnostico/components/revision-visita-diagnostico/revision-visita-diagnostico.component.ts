import { Routes } from '@angular/router';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
// import { RevisionVisitas } from '../../../../core/models/revision-visitas';
import { ConsultaListaRevisionVisitaService } from '../../../../core/services/consulta-lista-revision-visita.service';
import { Respuesta } from './../../../../core/models/revision-visitas';

@Component({
  selector: 'app-revision-visita-diagnostico',
  templateUrl: './revision-visita-diagnostico.component.html',
  styleUrls: ['./revision-visita-diagnostico.component.scss']
})
export class RevisionVisitaDiagnosticoComponent implements AfterViewInit, OnInit {

  // Propiedades
  displayedColumns: string[] = [
    'id_mantenimiento_vial', 'pk_id_calzada', 'solicitud_radicado_entrada',
    'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
    'nombre_responsable_visita', 'TRABAJAR'];
    // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  // MatPaginator Inputs
  filterColumns: string[] = [
    'search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8', 'search9'];

  searchkey = '';
  // Campos de filtro en el formulario
  search0 = new FormControl('');
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  search5 = new FormControl('');
  search6 = new FormControl('');
  search7 = new FormControl('');
  search8 = new FormControl('');

  filterValues = {
    id_mantenimiento_vial: '',
    pk_id_calzada: '',
    solicitud_radicado_entrada: '',
    descripcion_origen: '',
    descripcion_estado_pk: '',
    fecha_asignacion: '',
    fecha_vencimiento: '',
    nombre_responsable_visita: ''
  };
  // tslint:disable-next-line: member-ordering
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private revisioVisitasService: ConsultaListaRevisionVisitaService) {}

ngOnInit(): void {
  this.search0.valueChanges
  .subscribe(
    valor0 => {
      this.filterValues.id_mantenimiento_vial = valor0;
      this.filterValues.pk_id_calzada = '';
      this.filterValues.descripcion_origen = '';
      this.filterValues.descripcion_estado_pk = '';
      this.filterValues.fecha_asignacion = '';
      this.filterValues.fecha_vencimiento = '';
      this.filterValues.nombre_responsable_visita = valor0;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    }
  );
  this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.id_mantenimiento_vial = valor1;
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
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
          this.filterValues.solicitud_radicado_entrada = valor3;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.descripcion_origen = valor4;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search5.valueChanges
      .subscribe(
        valor5 => {
          this.filterValues.descripcion_estado_pk = valor5;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search6.valueChanges
      .subscribe(
        valor6 => {
          this.filterValues.fecha_asignacion = valor6;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search7.valueChanges
      .subscribe(
        valor7 => {
          this.filterValues.fecha_vencimiento = valor7;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search8.valueChanges
      .subscribe(
        valor8 => {
          this.filterValues.nombre_responsable_visita = valor8;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
}

ngAfterViewInit(): void {
  /*
    this.revisioVisitasService.listarValidar().subscribe((resp: any) => {
    this.dataSource = new MatTableDataSource(resp.respuesta);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.creaFiltro();
  });*/
  }

  // tslint:disable-next-line: typedef
  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) => {
      console.log('Filtro: ', filter);
      const searchTerms = JSON.parse(filter);
      // console.log('searchTerms: ', searchTerms);
      return data.id_mantenimiento_vial.toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial) !== -1
      && data.pk_id_calzada.toString().toLowerCase().indexOf(searchTerms.pk_id_calzada) !== -1
      && data.descripcion_origen.toString().toLowerCase().indexOf(searchTerms.descripcion_origen) !== -1
      && data.descripcion_estado_pk.toString().toLowerCase().indexOf(searchTerms.descripcion_estado_pk) !== -1
      && data.fecha_asignacion.toString().toLowerCase().indexOf(searchTerms.fecha_asignacion) !== -1
      && data.fecha_vencimiento.toString().toLowerCase().indexOf(searchTerms.fecha_vencimiento) !== -1
      && data.nombre_responsable_visita.toString().toLowerCase().indexOf(searchTerms.nombre_responsable_visita) !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort      = this.sort;
    });
  }

applyFilter(valor: string): void {
    this.dataSource.filter = valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // tslint:disable-next-line: typedef
onSearchClear(){
    this.searchkey = '';
    this.applyFilter('');
  }
  // tslint:disable-next-line: typedef
  onClearFilters(){
    this.search1.setValue('');
    this.search2.setValue('');
    this.search3.setValue('');
    this.search4.setValue('');
    this.search5.setValue('');
    this.search6.setValue('');
    this.search7.setValue('');
    this.search8.setValue('');
  }
  // tslint:disable-next-line: typedef
onRegistroVisita(idMantenimiento: number){
    console.log(idMantenimiento);
  }
}
