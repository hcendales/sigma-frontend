import { EntityTabLugarService } from './../../../../core/services/entity-tab-lugar.service';
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
  public titulo = 'LISTADO LUGARES';
  // Propiedades
  displayedColumns: string[] = [
    'id_lugar', 'descripcion_tipo_lugar', 'descripcion_tipo_origen', 'nombre', 'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5'];
  // Campos de filtro en el formulario
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');

  filterValues = {
    id_lugar: '',
    descripcion_tipo_lugar: '',
    descripcion_tipo_origen: '',
    nombre: '',
  };

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private lugarService: EntityTabLugarService
  ) { }

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe(params => {
      const idActividad =  Number(params.get('idActividad'));
      this.lugarService.list('').then((resp: any) => {
        this.dataSource = new MatTableDataSource(resp.respuesta);
        console.log('Datasource ', this.dataSource);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.creaFiltro();
        this.onClearFilters();
      });
    });
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.id_lugar = valor1.toLowerCase();
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.descripcion_tipo_lugar = valor2.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.descripcion_tipo_origen = valor3.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.nombre = valor4.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) =>{
      const searchTerms = JSON.parse(filter);
      return (data.id_lugar || '').toString().toLowerCase().indexOf(searchTerms.id_lugar) !== -1
      && (data.descripcion_tipo_lugar || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_lugar) !== -1
      && (data.descripcion_tipo_origen || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_origen) !== -1
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

  onInsertar(): void{
    this.router.navigate(['dashboard/administracion-lugares/insertar']);
  }
  onActualizar(row: any): void{
    // console.log('Row ', row);
    this.navigationExtras.state = row;
    this.router.navigate(['dashboard/administracion-lugares/actualizar'], this.navigationExtras);
  }
  onVer(row: any): void{
    // console.log('Row ', row);
    this.navigationExtras.state = row;
    this.router.navigate(['dashboard/administracion-lugares/ver'], this.navigationExtras);
  }
  async onEliminar(idEntity: number): Promise<void>{
    try{
      if(confirm('Esta seguro de borrar?')){
        await this.lugarService.eliminar(idEntity);
        alert('Registro Borrado.');
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(()=>
        this.router.navigate(["dashboard/administracion-lugares/listar"]));
      }
    }catch (err){
      console.log(err);
    }
  }
}
