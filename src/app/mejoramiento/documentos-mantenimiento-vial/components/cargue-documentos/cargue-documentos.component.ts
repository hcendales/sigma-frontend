import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-cargue-documentos',
  templateUrl: './cargue-documentos.component.html',
  styleUrls: ['./cargue-documentos.component.scss']
})
export class CargueDocumentosComponent implements OnInit {


  displayedColumns: string[] = [
    'id_mantenimiento_vial',
    'pk_id_calzada',
    'descripcion_estado_pk',
    'civ',
    '_CTRL_ACCION_TRABAJAR'];

  filterValues = {
    id_mantenimiento_vial: '',
    pk_id_calzada: '',
    descripcion_estado_pk: '',
    civ: '',
  };


  @ViewChild('mapa') mapElement!: MapaUmvComponent;
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  basemapType = 'gray';
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  filterColumns: string[] = [];
  formControls: FormControl[] = [];
  inArr: Array<any> = [];
  mapCenter = [-74.113, 4.667];
  mapZoomLevel = 12;
  pageSize = 20;
  ready = false;
  search0 = new FormControl('');
  searchkey = '';
  selection: any = new SelectionModel<any>(true, []);
  titulo: string = '';


  constructor(
    private solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
  ) { }

  ngOnInit(): void {
    this.ready = false;

    this.cargarColumnas().then(
      () => {
        this.solicitudEnsayoLaboratorioService.buscarMantenimientoActivo("", "", null, null, null, null).then(async (resp: any) => {

          this.inArr = [];
          resp.respuesta.forEach((value: { pk_id_calzada: any; }) => {
            this.inArr.push(value.pk_id_calzada);
          });

          this.dataSource = new MatTableDataSource(resp.respuesta);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.creaFiltroXColumna();
          this.onClearFilters();
        });
      });

    this.search0.valueChanges
      .subscribe(
        valor0 => {
          this.filterValues.id_mantenimiento_vial = valor0.toString().toLowerCase();
          this.filterValues.pk_id_calzada = '';
          this.filterValues.descripcion_estado_pk = '';
          this.filterValues.civ = '';
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );

    this.ready = true;
  }


  creaFiltroXColumna() {

    let inArr: Array<any> = [];
    let inStr = '';
    this.dataSource.filterPredicate = ((data: any, filter: any) => {
      inArr.push(data.pk_id_calzada);
      const searchTerms = JSON.parse(filter);
      return (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial) !== -1
        && (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada) !== -1
        && (data.descripcion_estado_pk || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_pk) !== -1
        && (data.civ || '').toString().toLowerCase().indexOf(searchTerms.civ) !== -1;
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
          inStr += 'PK_ID_CALZADA in (' + this.inArr.slice(pos, 999 + pos).toString() + ') OR ';
        else
          inStr += 'PK_ID_CALZADA in (' + this.inArr.slice(pos, 999 + pos).toString() + ')';
      }
    } else
      inStr += 'PK_ID_CALZADA in (' + this.inArr.toString() + ')';
    scope.mapElement.queryFeatures(inStr);
  }


  irAPk(pk: number) {
    this.mapElement.goTo("PK_ID_CALZADA = " + pk.toString());
  }


  public setValorBusqueda(attr: string, valor: string) {
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


  public async cargarColumnas() {
    this.filterColumns = [];
    this.formControls = [];

    //console.log("~>"+this.displayedColumns)
    for (let a of this.displayedColumns) {
      this.filterColumns.push(a + '_');
      if (!a.startsWith('_CTRL_ACCION_')) {
        let formControl = new FormControl('');
        formControl.valueChanges
          .subscribe(
            valor => {
              const attr: string = a as string;
              (this.filterValues as LooseObject)[attr] = valor;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.inArr = [];
              this.dataSource.filteredData.forEach((value: { pk_id_calzada: any; }) => {
                this.inArr.push(value.pk_id_calzada);
              });
              this.cargaMapa(true);
            }
          );
        this.formControls.push(formControl);
      }
    }

  }

  onClearFilters() {
    for (let c of this.formControls) {
      c.setValue('');
    }
  }

}