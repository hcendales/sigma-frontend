import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';
import { RegistroProgramacionDiariaService } from 'src/app/core/services/registro-programacion-diaria.service';
import { ActivatedRoute, Params } from '@angular/router';


interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-registro-diario',
  templateUrl: './registro-diario.component.html',
  styleUrls: ['./registro-diario.component.scss']
})
export class RegistroDiarioComponent implements OnInit {


  displayedColumns: string[] = [
    'descripcion_zona',
    'descripcion_localidad',
    'descripcion_upz',
    'descripcion_barrio',
    'descripcion_actividad_agrupada',
    'desde',
    'pk_id_calzada',
    'civ',
    'nombre_persona_elabora_progdiaria',
    'descripcion_estado_progdiaria',
    'max_fecha_progdiaria',
    'descripcion_jornada_progdiaria',
    '_CTRL_ACCION_TRABAJAR'];

  filterValues = {
    descripcion_zona: '',
    descripcion_localidad: '',
    descripcion_upz: '',
    descripcion_barrio: '',
    descripcion_actividad_agrupada: '',
    desde: '',
    pk_id_calzada: '',
    civ: '',
    nombre_persona_elabora_progdiaria: '',
    descripcion_estado_progdiaria: '',
    max_fecha_progdiaria: '',
    descripcion_jornada_progdiaria: '',
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
  idActividad:number=0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
    private programacionDiariaService: RegistroProgramacionDiariaService
  ) { }

  async ngOnInit(){
    this.ready = false;
    this.activatedRoute.params.subscribe((params: Params) => { this.idActividad = +params['idActividad']; });

    this.cargarColumnas().then(
      () => {
        this.programacionDiariaService.listarBandejaGestionPendiente(this.idActividad.toString()).then(async (resp: any) => {

        this.inArr = [];
        resp.forEach((value: { descripcion_localidad: any; }) => {
          this.inArr.push(value.descripcion_localidad);
        });
        
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.creaFiltroXColumna();
        this.onClearFilters();
      });
    });

    this.search0.valueChanges
      .subscribe(
        valor0 => {
          this.filterValues.descripcion_zona = valor0.toString().toLowerCase();;
          this.filterValues.descripcion_localidad = '';
          this.filterValues.descripcion_upz = '';
          this.filterValues.descripcion_barrio = '';
          this.filterValues.descripcion_actividad_agrupada = '';
          this.filterValues.desde = '';
          this.filterValues.pk_id_calzada = '';
          this.filterValues.civ = '';
          this.filterValues.nombre_persona_elabora_progdiaria = '';
          this.filterValues.descripcion_estado_progdiaria = '';
          this.filterValues.max_fecha_progdiaria = '';
          this.filterValues.descripcion_jornada_progdiaria = '';
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    
    this.ready = true;
  }

  
  creaFiltroXColumna() {

    let inArr: Array<any> = [];
    this.dataSource.filterPredicate = ((data: any, filter: any) => {
      inArr.push(data.pk_id_calzada);
      const searchTerms = JSON.parse(filter);
      return (data.descripcion_zona || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona.toString().toLowerCase()) !== -1
        && (data.descripcion_localidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad.toString().toLowerCase()) !== -1
        && (data.descripcion_upz || '').toString().toLowerCase().indexOf(searchTerms.descripcion_upz.toString().toLowerCase()) !== -1
        && (data.descripcion_barrio || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio.toString().toLowerCase()) !== -1
        && (data.descripcion_actividad_agrupada || '').toString().toLowerCase().indexOf(searchTerms.descripcion_actividad_agrupada.toString().toLowerCase()) !== -1
        && (data.desde || '').toString().toLowerCase().indexOf(searchTerms.desde.toString().toLowerCase()) !== -1
        && (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada.toString().toLowerCase()) !== -1
        && (data.civ || '').toString().toLowerCase().indexOf(searchTerms.civ.toString().toLowerCase()) !== -1
        && (data.nombre_persona_elabora_progdiaria || '').toString().toLowerCase().indexOf(searchTerms.nombre_persona_elabora_progdiaria.toString().toLowerCase()) !== -1
        && (data.descripcion_estado_progdiaria || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_progdiaria.toString().toLowerCase()) !== -1
        && (data.max_fecha_progdiaria || '').toString().toLowerCase().indexOf(searchTerms.max_fecha_progdiaria.toString().toLowerCase()) !== -1
        && (data.descripcion_jornada_progdiaria || '').toString().toLowerCase().indexOf(searchTerms.descripcion_jornada_progdiaria.toString().toLowerCase()) !== -1;
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