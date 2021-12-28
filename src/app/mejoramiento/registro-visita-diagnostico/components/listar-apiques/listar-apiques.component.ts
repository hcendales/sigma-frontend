import { AfterViewInit, Component, ViewChild, OnInit, Input   } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Routes, Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { EntityTabApiqueService } from 'src/app/core/services/entity-tab-apique.service';
import { ActualizarApiquesComponent } from '../actualizar-apiques/actualizar-apiques.component';
import { UbicarApiqueComponent } from '../ubicar-apique/ubicar-apique.component';
import { ApiquesAledaniosComponent } from '../apiques-aledanios/apiques-aledanios.component';
import { EntityTabAledanioService } from '../../../../core/services/entity-tab-aledanio.service';

@Component({
  selector: 'app-listar-apiques',
  templateUrl: './listar-apiques.component.html',
  styleUrls: ['./listar-apiques.component.scss']
})
export class ListarApiquesComponent implements OnInit {
  @Input() idMantenimientoVialEvento: number = 0;
  @Input() requiereApiques: string = '';
  @Input() idPkCalzada: number = 0;

  // Titulo
  public titulo = 'LISTADO APIQUES';
  // Propiedades
  displayedColumns: string[] = [
    'nomenclatura', 'observacion', 'TRABAJAR'];
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  filterColumns: string[] = ['search1', 'search2', 'search3'];
  // Campos de filtro en el formulario
  search1 = new FormControl('');
  search2 = new FormControl('');

  pksAledanios:any[] = [];

  filterValues = {
    nomenclatura: '',
    observacion: '',
  };

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private apiqueService: EntityTabApiqueService,
    public dialog: MatDialog,
    private entityTabAledanioService:EntityTabAledanioService
  ) { }

  ngOnInit(): void {
    this.consultarAledanios();
    const condicion = "id_Mantenimiento_Vial_Evento=" + this.idMantenimientoVialEvento;
    this.apiqueService.list(condicion).then((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      // console.log('Datasource ', this.dataSource);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltro();
      this.onClearFilters();
    });
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.nomenclatura = valor1.toLowerCase();
          // console.log('FilterValues: ', JSON.stringify(this.filterValues));
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.observacion = valor2.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  creaFiltro(){
    this.dataSource.filterPredicate = ((data, filter) =>{
      const searchTerms = JSON.parse(filter);
      return (data.nomenclatura || '').toString().toLowerCase().indexOf(searchTerms.nomenclatura) !== -1
      && (data.observacion || '').toString().toLowerCase().indexOf(searchTerms.observacion) !== -1;
    });
    setTimeout( () => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort      = this.sort;
    });
  }
  onClearFilters(){
    this.search1.setValue('');
    this.search2.setValue('');
  }

  // Abre la ventana de ubicar apique crear
  // Abre la ventana de ubicar apiques actualizacion
  openDialogUbicar(): void {
    const dialogRef = this.dialog.open(UbicarApiqueComponent, {
      width: '400px',
      disableClose: true,
      data: {idMantenimientoVialEvento: this.idMantenimientoVialEvento,
      apiqueValor: this.requiereApiques,
      idPkCalzada: this.idPkCalzada}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
}
  // Abre la ventana de ubicar apiques actualizacion
  openDialog(row: any): void {
    // console.log('Row ', row);
    const dialogRef = this.dialog.open(ActualizarApiquesComponent, {
      width: '400px',
      disableClose: true,
      data: {idPredisenioApique: row.id_predisenio_apique,
      idMantenimientoVialEvento: row.id_mantenimiento_vial_evento,
      nomenclatura: row.nomenclatura,
      observacion: row.observacion,
      requiereApiques: this.requiereApiques}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.ngOnInit();
    });
  }
  async onEliminar(idEntity: number): Promise<void>{
    try{
      if(confirm('Esta seguro de borrar?')){
        await this.apiqueService.eliminar(idEntity);
        alert('Registro Borrado.');
        this.ngOnInit();
      }
    }catch (err){
      console.log(err);
    }
  }

  openDialogAledanios(){
    ApiquesAledaniosComponent
    // console.log('Row ', row);
    const dialogRef = this.dialog.open(ApiquesAledaniosComponent, {
      width: '400px',
      disableClose: true,
      data: {idMantenimientoVialEvento:this.idMantenimientoVialEvento,pksAledanios:this.pksAledanios}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.consultarAledanios();
    });
  }

  consultarAledanios(){
    this.entityTabAledanioService.consultarXFiltro('ID_MANTENIMIENTO_VIAL_EVENTO = '+this.idMantenimientoVialEvento).then(
      (res:any) => {
        if(res.codError == 0){
          this.pksAledanios = res.respuesta;
        }
      }
    );
  }
}
