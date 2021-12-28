import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Routes, Router, ActivatedRoute, Params } from '@angular/router';
import { EntityTabLugarService } from '../../../../core/services/entity-tab-lugar.service';

@Component({
  selector: 'app-lista-lugar',
  templateUrl: './lista-lugar.component.html',
  styleUrls: ['./lista-lugar.component.scss']
})
export class ListaLugarComponent implements OnInit {
  // Titulo
  public tittle = 'LUGARES';
  // Propiedades
  displayedColumns: string[] = [
    'id_lugar', 'id_tipo_lugar', 'id_tipo_origen', 'nombre', 'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4'];
  // Campos de filtro en el formulario
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');

  filterValues = {
    id_lugar: '',
    id_tipo_lugar: '',
    id_tipo_origen: '',
    nombre: '',
  };

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private router: Router,
    private lugarService: EntityTabLugarService,
    private activatedroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe(params => {

      const idActividad =  Number(params.get('idActividad'));
      this.lugarService.list('').then((resp: any) =>{
        this.dataSource = new MatTableDataSource(resp.respuesta);
        // console.log('Datasource ', this.dataSource);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.creaFiltro();
        this.onClearFilters();
      });
    });
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.id_lugar = valor1;
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.id_tipo_lugar = valor2;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.id_tipo_origen = valor3;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.nombre = valor4;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) =>{
      const searchTerms = JSON.parse(filter);
      return (data.id_lugar || '').toString().toLowerCase().indexOf(searchTerms.id_lugar) !== -1
      && (data.id_tipo_lugar || '').toString().toLowerCase().indexOf(searchTerms.id_tipo_lugar) !== -1
      && (data.id_tipo_origen || '').toString().toLowerCase().indexOf(searchTerms.id_tipo_origen) !== -1
      && (data.nombre || '').toString().toLowerCase().indexOf(searchTerms.nombre) !== -1;
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
  }

  onRegistroVisita(row: number){
    console.log('Row ', row);
  }

}
