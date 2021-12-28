import { EntityTabEquipoService } from './../../../../core/services/entity-tab-equipo.service';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Routes, Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      value: null
    }
  };
  // Titulo
  public titulo = 'EQUIPOS';
  // Propiedades
  displayedColumns: string[] = [
    'numero_interno', 'placa_inventario', 'placa', 'movil', 'descripcion_clase_equipo', 'descripcion_tipo_equipo', 'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7'];
  // Campos de filtro en el formulario
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  search5 = new FormControl('');
  search6 = new FormControl('');

  filterValues = {
    numero_interno: '',
    placa_inventario: '',
    placa: '',
    movil: '',
    descripcion_clase_equipo: '',
    descripcion_tipo_equipo: '',
  };

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private equipoService: EntityTabEquipoService
  ) { }

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe(params => {

      const idActividad =  Number(params.get('idActividad'));
      this.equipoService.list('').then((resp: any) =>{
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
          this.filterValues.numero_interno = valor1.toLowerCase();
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.placa_inventario = valor2.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.placa = valor3.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.movil = valor4.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search5.valueChanges
    .subscribe(
      valor5 => {
        this.filterValues.descripcion_clase_equipo = valor5.toLowerCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
    this.search6.valueChanges
    .subscribe(
      valor6 => {
        this.filterValues.descripcion_tipo_equipo = valor6.toLowerCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
  }
  creaFiltro(): void{
    this.dataSource.filterPredicate = ((data, filter) =>{
      const searchTerms = JSON.parse(filter);
      return (data.numero_interno || '').toString().toLowerCase().indexOf(searchTerms.numero_interno) !== -1
      && (data.placa_inventario || '').toString().toLowerCase().indexOf(searchTerms.placa_inventario) !== -1
      && (data.placa || '').toString().toLowerCase().indexOf(searchTerms.placa) !== -1
      && (data.movil || '').toString().toLowerCase().indexOf(searchTerms.movil) !== -1
      && (data.descripcion_clase_equipo || '').toString().toLowerCase().indexOf(searchTerms.descripcion_clase_equipo) !== -1
      && (data.descripcion_tipo_equipo || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_equipo) !== -1;
    });
    setTimeout( () => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort      = this.sort;
    });
  }

  onClearFilters(): void{
    this.search1.setValue('');
    this.search2.setValue('');
    this.search3.setValue('');
    this.search4.setValue('');
    this.search5.setValue('');
    this.search6.setValue('');
  }

  onInsertar(): void{
    this.router.navigate(['dashboard/administracion-equipos/insertar']);
  }

  onActualizar(row: any): void{
    console.log('Row ', row);
    this.navigationExtras.state = row;
    this.router.navigate(['dashboard/administracion-equipos/actualizar'], this.navigationExtras);
  }

  onVer(row: any): void{
    console.log('Row ', row);
    this.navigationExtras.state = row;
    this.router.navigate(['dashboard/administracion-equipos/ver'], this.navigationExtras);
  }

  async onEliminar(idEntity: number): Promise<void>{
    try{
      if(confirm('Esta seguro de borrar?')){
        await this.equipoService.eliminar(idEntity);
        alert('Registro Borrado.');
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(()=>
        this.router.navigate(['dashboard/administracion-equipos/listar']));
      }
    }catch (err){
      console.log(err);
    }
  }
}
