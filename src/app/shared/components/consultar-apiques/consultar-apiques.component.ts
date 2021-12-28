import { AfterViewInit, Component, ViewChild, OnInit, Input   } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Routes, Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { EntityTabApiqueService } from 'src/app/core/services/entity-tab-apique.service';

@Component({
  selector: 'app-consultar-apiques',
  templateUrl: './consultar-apiques.component.html',
  styleUrls: ['./consultar-apiques.component.scss']
})
export class ConsultarApiquesComponent implements OnInit {
  @Input() idMantenimientoVialEvento: number = 0;
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
  ) { }

  ngOnInit(): void {
    const condicion = "id_Mantenimiento_Vial_Evento=" + this.idMantenimientoVialEvento;
    this.apiqueService.list(condicion).then((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      console.log('Datasource ', this.dataSource);
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
}
