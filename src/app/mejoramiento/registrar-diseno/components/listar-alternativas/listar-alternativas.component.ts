import { AfterViewInit, Component, ViewChild, OnInit, Input   } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Routes, Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { EntityTabAlternativaService } from '../../../../core/services/entity-tab-alternativa.service';
import { RegistroAlternativaComponent } from '../registro-alternativa/registro-alternativa.component';
import { ActualizarAlternativaComponent } from '../actualizar-alternativa/actualizar-alternativa.component';

@Component({
  selector: 'app-listar-alternativas',
  templateUrl: './listar-alternativas.component.html',
  styleUrls: ['./listar-alternativas.component.scss']
})
export class ListarAlternativasComponent implements OnInit {
  @Input() idMantenimientoVialEvento: number = 0;
  // Titulo
  public titulo = 'LISTADO ALTERNATIVAS';
  // Propiedades
  displayedColumns: string[] = [
    'alternativa', 'desc_superficie_disenio', 'desc_intervencion_final_disenio',
    'desc_metodologia_disenio', 'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6'];
  // Campos de filtro en el formulario
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  search5 = new FormControl('');
  search6 = new FormControl('');


  filterValues = {
    alternativa: '',
    desc_superficie_disenio: '',
    desc_intervencion_final_disenio: '',
    desc_metodologia_disenio: '',
    desc_material_granular: '',
  };

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private entityTabAlternativaService: EntityTabAlternativaService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const condicion = "id_mantenimiento_vial_evento=" + this.idMantenimientoVialEvento;
    this.entityTabAlternativaService.list(condicion).then((resp: any) => {
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
          this.filterValues.alternativa = valor1.toLowerCase();
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.desc_superficie_disenio = valor2.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
      this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.desc_intervencion_final_disenio = valor3.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
      this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.desc_metodologia_disenio = valor4.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
      this.search5.valueChanges
      .subscribe(
        valor5 => {
          this.filterValues.desc_material_granular = valor5.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  }
  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) =>{
      const searchTerms = JSON.parse(filter);
      return (data.alternativa || '').toString().toLowerCase().indexOf(searchTerms.alternativa) !== -1
      && (data.desc_superficie_disenio || '').toString().toLowerCase().indexOf(searchTerms.desc_superficie_disenio) !== -1
      && (data.desc_intervencion_final_disenio || '').toString().toLowerCase().indexOf(searchTerms.desc_intervencion_final_disenio) !== -1
      && (data.desc_metodologia_disenio || '').toString().toLowerCase().indexOf(searchTerms.desc_metodologia_disenio) !== -1
      && (data.desc_material_granular || '').toString().toLowerCase().indexOf(searchTerms.desc_material_granular) !== -1;

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
    const dialogRef = this.dialog.open(ActualizarAlternativaComponent, {
      width: '850px',
      disableClose: true,
      data: {idMantenimientoVialEvento: this.idMantenimientoVialEvento,
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
    const dialogRef = this.dialog.open(ActualizarAlternativaComponent, {
      width: '850px',
      disableClose: false,
      data: {idAlternativaDisenio: row.id_alternativa_disenio,
      idMantenimientoVialEvento: row.id_mantenimiento_vial_evento,
      alternativa: row.alternativa,
      idTipoSuperficieDisenio: row.id_tipo_superficie_disenio,
      idTipoIntervencionFinalDisenio: row.id_tipo_intervencion_final_disenio,
      idTipoMetodologiaDisenio: row.id_tipo_metodologia_disenio,
      idTipoMaterialGranular: row.id_tipo_material_granular,
      espesorDisenio: row.espesor_disenio,
      cbrInicialPct: row.cbr_inicial_pct,
      idTipoGeosinteticos: row.id_tipo_geosinteticos,
      idTipoSistemaDrenaje: row.id_tipo_sistema_drenaje,
      observaciones: row.observaciones}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.ngOnInit();
    });
  }
  async onEliminar(idEntity: number): Promise<void>{
    try{
      if(confirm('Esta seguro de borrar?')){
        await this.entityTabAlternativaService.eliminar(idEntity);
        alert('Registro Borrado.');
        this.ngOnInit();
      }
    }catch (err){
      console.log(err);
    }
  }

}
