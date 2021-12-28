
import { AfterViewInit, Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Routes, Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { EntityTabFranjaService } from './../../../../core/services/entity-tab-franja.service';
import { Franja } from '../../../../core/models/franjas';
import { InsertarFranjaComponent } from '../insertar-franja/insertar-franja.component';

@Component({
  selector: 'app-listar-franja',
  templateUrl: './listar-franja.component.html',
  styleUrls: ['./listar-franja.component.scss']
})
export class ListarFranjaComponent implements OnInit {
  @Input() idRecurso: number=0;
  @Input() fechaDesde: number=0;
  @Input() fechaHasta: number=0;
  @Input() horaInicio: string='';
  @Input() horaFin: string='';
  @Input() intervalo: number=0;
  // Titulo
  public titulo = 'FRANJAS';
  // Propiedades
  displayedColumns: string[] = [
    'fecha_inicio', 'fecha_fin', 'franjausada',  'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4'];
  // Campos de filtro en el formulario
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');

  filterValues = {
    fecha_inicio: '',
    fecha_fin: '',
    franjausada: '',
  };

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;


  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private entityTabFranjaService: EntityTabFranjaService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    let objFranja : Franja = {
      idRecurso: this.idRecurso,
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      intervalo: this.intervalo,
    }
    // console.log('objFranja', objFranja);
    this.entityTabFranjaService.consultar(objFranja).then((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      // console.log('Respuesta franja', resp.respuesta);
      // console.log('Datasource ', this.dataSource.data.length);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltro();
      this.onClearFilters();
    });
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.fecha_inicio = valor1.toLowerCase();
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.fecha_fin= valor2.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
      this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.franjausada= valor3.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );

  }
  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) =>{
      const searchTerms = JSON.parse(filter);
      console.log('datos fecha', new Date(data.fecha_inicio).toLocaleDateString('ca-ES',{ year: 'numeric', month: '2-digit', day: '2-digit' }));
      // console.log('fecha ', searchTerms.fecha_inicio);
      return (new Date(data.fecha_inicio).toLocaleDateString('ca-ES',{ year: 'numeric', month: '2-digit', day: '2-digit' }) || '').toLowerCase().indexOf(searchTerms.fecha_inicio) !== -1
      && (new Date(data.fecha_fin).toLocaleDateString('ca-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '').toLowerCase().indexOf(searchTerms.fecha_fin) !== -1
      && (data.franjausada || '').toString().toLowerCase().indexOf(searchTerms.franjausada) !== -1;
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
  }

  // Abre la ventana de ubicar apique crear
  // Abre la ventana de ubicar apiques actualizacion
  openDialogInsertar(): void {
    const dialogRef = this.dialog.open(InsertarFranjaComponent, {
      width: '950px',
      disableClose: true,
      data: {idRecurso: this.idRecurso,
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta,
        horaInicio: this.horaInicio,
        horaFin: this.horaFin,
        intervalo: this.intervalo,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
}

  async onEliminar(entity: any): Promise<void>{
    try{
      // console.log('Entity Borrar: ', entity);
      if(confirm('Esta seguro de borrar?')){
        await this.entityTabFranjaService.eliminar(entity.id_recurso, entity.fecha_inicio, entity.fecha_fin);
        alert('Registro Borrado.');
        this.ngOnInit();
      }
    }catch (err){
      console.log(err);
    }
  }

}
