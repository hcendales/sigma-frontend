import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Routes, Router, ActivatedRoute, Params } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
// import { RevisionVisitas } from '../../../../core/models/revision-visitas';
import { ConsultaListaRevisionVisitaService } from '../../../core/services/consulta-lista-revision-visita.service';
import { Respuesta } from './../../../core/models/revision-visitas';
import { GestionService } from '../../../core/services/gestion.service';
//import * as classBreaks from 'esri/renderers/smartMapping/statistics/classBreaks';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-lista-seguimiento',
  templateUrl: './lista-seguimiento.component.html',
  styleUrls: ['./lista-seguimiento.component.scss']
})
export class ListaSeguimientoComponent implements AfterViewInit, OnInit {

  // Propiedades
  displayedColumns: string[] = [
    'id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
    'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
    'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
    'nombre_responsable_visita', 'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  // MatPaginator Inputs
  filterColumns: string[] = [
    'search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8',
    'search9', 'search10', 'search11', 'search12', 'search13'] ;

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
  search9 = new FormControl('');
  search10 = new FormControl('');
  search11 = new FormControl('');
  search12 = new FormControl('');
  search13 = new FormControl('');

  filterValues = {
    id_mantenimiento_vial: '',
    pk_id_calzada: '',
    solicitud_radicado_entrada: '',
    descripcion_origen: '',
    descripcion_estado_pk: '',
    fecha_asignacion: '',
    fecha_vencimiento: '',
    nombre_responsable_visita: '',
    descripcion_localidad: '',
    descripcion_zona: '',
    descripcion_barrio: '',
    descripcion_upz: ''
  };

  // tslint:disable-next-line: member-ordering
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  // Propiedad para leer parametros
  idActividad: string | null  = '';

  titulo = '';


  constructor(
    private revisioVisitasService: ConsultaListaRevisionVisitaService,
    private router: Router,
    private gestionService: GestionService,
    private activatedroute: ActivatedRoute) {}

ngOnInit(): void {
  this.activatedroute.paramMap.subscribe(params => {

    const idActividad =  Number(params.get('idActividad'));

    this.setTitulo(idActividad);
    let act = idActividad==6?4:idActividad;
    this.gestionService.listarBandejaGestionPendiente(act).then((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltro();
      this.onClearFilters();
    });
  });
  this.idActividad = this.activatedroute.snapshot.paramMap.get('idActividad');
  // this.setTitulo(Number(this.idActividad));
  // this.firstTime = false;
  // console.log('Parametro: ', this.idActividad);
  this.search0.valueChanges
  .subscribe(
    valor0 => {
      this.filterValues.id_mantenimiento_vial = valor0;
      this.filterValues.pk_id_calzada = '';
      this.filterValues.descripcion_origen = '';
      this.filterValues.descripcion_estado_pk = '';
      this.filterValues.fecha_asignacion = '';
      this.filterValues.fecha_vencimiento = '';
      this.filterValues.nombre_responsable_visita = '';
      this.filterValues.descripcion_localidad = '';
      this.filterValues.descripcion_zona = '';
      this.filterValues.descripcion_barrio = '';
      this.filterValues.descripcion_upz = '';
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
          this.filterValues.descripcion_localidad = valor3;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.descripcion_zona = valor4;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search5.valueChanges
      .subscribe(
        valor5 => {
          this.filterValues.descripcion_barrio = valor5;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search6.valueChanges
      .subscribe(
        valor6 => {
          this.filterValues.descripcion_upz = valor6;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search7.valueChanges
      .subscribe(
        valor7 => {
          this.filterValues.solicitud_radicado_entrada = valor7;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search8.valueChanges
      .subscribe(
        valor8 => {
          this.filterValues.descripcion_origen = valor8;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search9.valueChanges
      .subscribe(
        valor9 => {
          this.filterValues.descripcion_estado_pk = valor9;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search10.valueChanges
      .subscribe(
        valor10 => {
          this.filterValues.fecha_asignacion = valor10;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search11.valueChanges
      .subscribe(
        valor11 => {
          this.filterValues.fecha_vencimiento = valor11;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  this.search12.valueChanges
      .subscribe(
        valor12 => {
          this.filterValues.nombre_responsable_visita = valor12;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
}

ngAfterViewInit(): void {
  /*
>>>>>>> 5880a4eead627c6d3766bfae992132b6bd4a1641

    this.revisioVisitasService.consultarListaRevision().subscribe((resp: any) => {
    this.dataSource = new MatTableDataSource(resp.respuesta);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.creaFiltro();
    });
*/

  }

  // tslint:disable-next-line: typedef
  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) => {
      // console.log('Filtro: ', filter);
      const searchTerms = JSON.parse(filter);
      // console.log('searchTerms: ', searchTerms);
      return (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial) !== -1
      && (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada) !== -1
      && (data.descripcion_origen || '').toString().toLowerCase().indexOf(searchTerms.descripcion_origen) !== -1
      && (data.descripcion_estado_pk || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_pk) !== -1
      && (data.fecha_asignacion || '').toString().toLowerCase().indexOf(searchTerms.fecha_asignacion) !== -1
      && (data.fecha_vencimiento || '').toString().toLowerCase().indexOf(searchTerms.fecha_vencimiento) !== -1
      && (data.nombre_responsable_visita || '').toString().toLowerCase().indexOf(searchTerms.nombre_responsable_visita) !== -1
      && (data.descripcion_localidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad) !== -1
      && (data.descripcion_zona || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona) !== -1
      && (data.descripcion_barrio || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio) !== -1
      && (data.descripcion_upz || '').toString().toLowerCase().indexOf(searchTerms.descripcion_upz) !== -1
      && (data.solicitud_radicado_entrada || '').toString().toLowerCase().indexOf(searchTerms.solicitud_radicado_entrada) !== -1;
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
    this.search9.setValue('');
    this.search10.setValue('');
    this.search11.setValue('');
    this.search12.setValue('');
  }
  // tslint:disable-next-line: typedef
onRegistroVisita(mantenimiento: any){
    // console.log('el mant', mantenimiento);
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['dashboard/' + mantenimiento.url + '/' + mantenimiento.id_mantenimiento_vial], {queryParams: { idGestion: mantenimiento.id_proceso_gestion, idActividad: mantenimiento.id_actividad, idDocumento: mantenimiento.id_documento}});
  }

  // tslint:disable-next-line: typedef
  updateCheckedList(event: any, index: number){
    if ( event.checked ){
      console.log('Id: ', index);
    }
  }

  getClassTiempo(fecha: number): string{
    const hoy = new Date().getTime();
    const ven = new Date(fecha).getTime();
    let day = hoy - ven;
    day = Math.round(day / ( 1000 * 60 * 60 * 24));
    if ( day === -1 ){
      return 'undia';
    }
    else{
      if (day >= 0 ){
        return 'retraso';
      }
    }
    return 'normal';
  }
  // metodo temporal
  // tslint:disable-next-line: typedef
  setTitulo(idActividad: number){
    if ( idActividad === 3){
      this.titulo = 'Registrar visita de diagnóstico';
    }else if ( idActividad === 4){
      this.titulo = 'Revisar visita de diagnóstico';
    }else if ( idActividad === 5){
      this.titulo = 'Validar visita de diagnóstico';
    }else if ( idActividad === 6){
      this.titulo = 'Gestionar PKs Programación';
    }
  }
}
