import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';

@Component({
  selector: 'app-modal-table-asociar',
  templateUrl: './modal-table-asociar.component.html',
  styleUrls: ['./modal-table-asociar.component.scss'],
})
export class ModalTableAsociarComponent implements OnInit {

  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id_mantenimiento_vial', 'cod_mantenimiento_vial', 'pk_id_calzada', 'descripcion_estado_pk', 'civ', 'eje_vial', 'desde', 'hasta', 'id_localidad', 'descripcion_localidad', 'descripcion_zona', 'descripcion_barrio'];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8', 'search9', 'search10', 'search11', 'search12', 'search13'];
  
  searchkey = '';
  inArr: Array<any> = [];
  titulo: string = '';
  mapCenter = [-74.113, 4.667];
  basemapType = 'gray';
  mapZoomLevel = 12;
  formControls: FormControl[] = [];
  pageSize = 3;

  @ViewChild('mapa')
  mapElement!: MapaUmvComponent;
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  @Output() pKsSelected = new EventEmitter();       ///Devuelve los PKs seleccionados en la tabla

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

  filterValues = {
    id_mantenimiento_vial: '',
    cod_mantenimiento_vial: '',
    pk_id_calzada: '',
    descripcion_estado_pk: '',
    civ: '',
    eje_vial: '',
    desde: '',
    hasta: '',
    id_localidad: '',
    descripcion_localidad: '',
    descripcion_zona: '',
    descripcion_barrio: '',
  };

  constructor(
    public dialogRef: MatDialogRef<ModalTableAsociarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
  ) { }

  ngOnInit(): void {

    /**
     * Entra solo cuando esta Consultando los PKs
     * no entra en la condicion cuando va a Insertar Nuevos o Actualizar.
     */
    let pkIdCalzada : string = ""
    if (this.data.lock){

      let pkId: Array<any> = [];
      this.data.itm.forEach((element : any ) => {
        return pkId.push(element.pk_id_calzada);
      });
      
      pkIdCalzada = pkId.join();
      this.pageSize = pkId.length > 3 && pkId.length <=5 ? pkId.length : 3;
      
    }

    /** Llama el metodo que carga los datos */
    this.solicitudEnsayoLaboratorioService.buscarMantenimientoActivo(pkIdCalzada, "", null, null, null, null).then(async (resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);

      if (this.data.itm !== "" && this.data.itm !== undefined)
      this.dataSource.data.map(element => {
          this.data.itm.find((input: any) => {
            if (input.id_mantenimiento_vial === element.id_mantenimiento_vial)
              this.selection.select(element)
          });
      });

      //console.log(this.data.itm);
      //resp.respuesta.sort((a: any, b: any) => (a.id_mantenimiento_vial < b.id_mantenimiento_vial) ? 1 : ((b.id_mantenimiento_vial < a.id_mantenimiento_vial) ? -1 : 0));

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      await this.creaFiltroXColumna();
      this.onClearFilters();
    });

    /** Inicio Filtros por Columna */
    this.search0.valueChanges.subscribe(
      valor0 => {
        this.filterValues.id_mantenimiento_vial = valor0;
        this.filterValues.id_mantenimiento_vial = '';
        this.filterValues.pk_id_calzada = '';
        this.filterValues.descripcion_estado_pk = '';
        this.filterValues.civ = '';
        this.filterValues.eje_vial = '';
        this.filterValues.desde = '';
        this.filterValues.hasta = '';
        this.filterValues.id_localidad = '';
        this.filterValues.descripcion_localidad = '';
        this.filterValues.descripcion_zona = '';
        this.filterValues.descripcion_barrio = '';
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.id_mantenimiento_vial = valor2;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.pk_id_calzada = valor3;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.descripcion_estado_pk = valor4;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search5.valueChanges
      .subscribe(
        valor5 => {
          this.filterValues.civ = valor5;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search6.valueChanges
      .subscribe(
        valor6 => {
          this.filterValues.eje_vial = valor6;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search7.valueChanges
      .subscribe(
        valor7 => {
          this.filterValues.desde = valor7;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search8.valueChanges
      .subscribe(
        valor8 => {
          this.filterValues.hasta = valor8;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search9.valueChanges
      .subscribe(
        valor9 => {
          this.filterValues.id_localidad = valor9;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search10.valueChanges
      .subscribe(
        valor10 => {
          this.filterValues.descripcion_localidad = valor10;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search11.valueChanges
      .subscribe(
        valor11 => {
          this.filterValues.descripcion_zona = valor11;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search12.valueChanges
      .subscribe(
        valor12 => {
          this.filterValues.descripcion_barrio = valor12;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    /** Fin Filtros por Columna */
  }

  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    let inArr: Array<any> = [];
    let inStr = '';
    this.dataSource.filterPredicate = ((data: any, filter: any) => {
      inArr.push(data.pk_id_calzada);
      const searchTerms = JSON.parse(filter);
      return (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial)  !== -1
        && (data.id_mantenimiento_vial   || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial)  !== -1
        && (data.pk_id_calzada           || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada)          !== -1
        && (data.descripcion_estado_pk   || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_pk)  !== -1
        && (data.civ                     || '').toString().toLowerCase().indexOf(searchTerms.civ)                    !== -1
        && (data.eje_vial                || '').toString().toLowerCase().indexOf(searchTerms.eje_vial)               !== -1
        && (data.desde                   || '').toString().toLowerCase().indexOf(searchTerms.desde)                  !== -1
        && (data.hasta                   || '').toString().toLowerCase().indexOf(searchTerms.hasta)                  !== -1
        && (data.id_localidad            || '').toString().toLowerCase().indexOf(searchTerms.id_localidad)           !== -1
        && (data.descripcion_localidad   || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad)  !== -1
        && (data.descripcion_zona        || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona)       !== -1
        && (data.descripcion_barrio      || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio)     !== -1;
    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  cargaMapa($event: boolean) {
    if (!this.mapElement.PksFL || this.inArr.length == 0)
      return;
    let scope = this;
    let inStr: string = '';
    let count = 0, pos = 0;
    if (this.inArr.length > 999) {
      count = Math.ceil(this.inArr.length / 1000);
      for (let i = 0; i < count; i++) {
        pos = i * 1000;
        if (i < count - 1)
          inStr += 'PK_ID_ELEMENTO in (' + this.inArr.slice(pos, 999 + pos).toString() + ') OR ';
        else
          inStr += 'PK_ID_ELEMENTO in (' + this.inArr.slice(pos, 999 + pos).toString() + ')';
      }
    } else
      inStr += 'PK_ID_ELEMENTO in (' + this.inArr.toString() + ')';
    scope.mapElement.queryFeatures(inStr);
  }
  irAPk(pk: number) {
    this.mapElement.goTo("PK_ID_ELEMENTO = " + pk.toString());
  }
  setValorBusqueda(attr: string, valor: string) {
    let index = this.displayedColumns.indexOf(attr);
    this.formControls[index].setValue(valor);
  }
  filterDataPK($event: any) {
    ////console.log('filtrartabla', $event);
    this.setValorBusqueda('pk_id_calzada', String($event));
  }
  
  onSearchClear() {
    this.searchkey = '';
  }

  mapClearFilters($event: any) {
    this.onSearchClear();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Limpiar los filtros de cada columna */
  onClearFilters() {
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


  onNoClick(): void {
    this.dialogRef.close();
  }


  onAsociar(): void {
    this.dialogRef.close(this.selection.selected);
  }
}
