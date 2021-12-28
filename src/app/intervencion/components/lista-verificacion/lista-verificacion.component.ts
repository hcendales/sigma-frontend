import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConsultaListaRevisionVisitaService } from 'src/app/core/services/consulta-lista-revision-visita.service';
import { EntityTabEventoService } from 'src/app/core/services/entity-tab-evento.service';
import { GestionService } from 'src/app/core/services/gestion.service';
import { MantenimientoVialEventoService } from 'src/app/core/services/mantenimiento-vial-evento.service';
import { UtilitariosService } from 'src/app/core/services/utilitarios.service';
import { DialogVerVisitaDiagnostico } from 'src/app/mejoramiento/gestion-misionalidad/components/gestionar-seguimiento/gestionar-seguimiento.component';
import { GestionMasivaComponent } from 'src/app/shared/components/gestion-masiva/gestion-masiva.component';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';

@Component({
  selector: 'app-lista-verificacion',
  templateUrl: './lista-verificacion.component.html',
  styleUrls: ['./lista-verificacion.component.scss']
})
export class ListaVerificacionComponent implements OnInit {

    // Propiedades
    inArr: Array<any> = [];
    displayedColumns: string[] = [
      'id_mantenimiento_vial', 'pk_id_elemento', 'descripcion_localidad', 'descripcion_zona',
      'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
      'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
      'nombre_responsable_visita', '_CTRL_ACCION_TRABAJAR'];
    // Datos para la lista
    dataSource!: MatTableDataSource<any>;
    // MatPaginator Inputs
    filterColumns: string[] = [];
    searchkey = '';
    // Campos de filtro en el formulario
    public search0 = new FormControl('');

    public formControls:FormControl[] = [];

    filterValues = {
      id_mantenimiento_vial: '',
      pk_id_elemento: '',
      solicitud_radicado_entrada: '',
      descripcion_origen: '',
      descripcion_estado_pk: '',
      fecha_asignacion: '',
      fecha_vencimiento: '',
      nombre_responsable_visita: '',
      descripcion_localidad: '',
      descripcion_zona: '',
      descripcion_barrio: '',
      descripcion_upz: ''
    };
    mapCenter = [-74.113, 4.667];
    basemapType = 'gray';//environment.webMapAllPKsId;
    mapZoomLevel = 12;
    @ViewChild(MatSort) sort: any;
    @ViewChild(MatPaginator) paginator: any;
    @ViewChild('mapa')
    mapElement!: MapaUmvComponent;
    // Propiedad para leer parametros
    idActividad: string | null  = '';

    titulo: string = '';

    ready = false;

    constructor(
      private revisioVisitasService: ConsultaListaRevisionVisitaService,
      private router: Router,
      private gestionService: GestionService,
      private activatedroute: ActivatedRoute,
      private utilitariosService:UtilitariosService) {}

  async ngOnInit(){
    this.ready = false;



    this.activatedroute.paramMap.subscribe(params => {
      const idActividad =  Number(params.get('idActividad'));
      this.idActividad = params.get('idActividad');
      this.setTitulo(idActividad);
      console.log('act:',this.idActividad);
      this.cargarColumnas().then(
        () =>{
          this.gestionService.listarBandejaGestionPendiente(idActividad).then((resp: any) => {
            this.inArr = [];
            resp.respuesta.forEach((value: { pk_id_calzada: any; }) => {
              this.inArr.push(value.pk_id_calzada);
            });
            this.dataSource = new MatTableDataSource(resp.respuesta);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.creaFiltro();
            this.cargaMapa(true);
            this.onClearFilters();
          });
        }
      );

    });

    this.search0.valueChanges
    .subscribe(
      valor0 => {
        this.filterValues.id_mantenimiento_vial = valor0;
        this.filterValues.pk_id_elemento = '';
        this.filterValues.descripcion_origen = '';
        this.filterValues.descripcion_estado_pk = '';
        this.filterValues.fecha_asignacion = '';
        this.filterValues.fecha_vencimiento = '';
        this.filterValues.nombre_responsable_visita = '';
        this.filterValues.descripcion_localidad = '';
        this.filterValues.descripcion_zona = '';
        this.filterValues.descripcion_barrio = '';
        this.filterValues.descripcion_upz = '';
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
    //console.log('losFilterColumns', this.filterColumns);
    this.ready = true;
  }

  ngAfterViewInit(): void {
    /*
  >>>>>>> 5880a4eead627c6d3766bfae992132b6bd4a1641

      this.revisioVisitasService.consultarListaRevision().subscribe((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltro();
      });
  */

    }

    ngOnChanges(){
      console.log('onChanges!')
      if(!!this.mapElement.PksFL){console.log('Salio porque aun no está listo');return;}
      this.creaFiltro();
    }

    // tslint:disable-next-line: typedef
    creaFiltro(){
        this.dataSource.filterPredicate = ((data, filter) => {
        const searchTerms = JSON.parse(filter);
        //console.log('data: ', data);
        //console.log('searchTerms: ', searchTerms);
        return (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial.toLowerCase()) !== -1
        && (data.pk_id_elemento || '').toString().toLowerCase().indexOf(searchTerms.pk_id_elemento.toLowerCase()) !== -1
        && (data.descripcion_origen || '').toString().toLowerCase().indexOf(searchTerms.descripcion_origen.toLowerCase()) !== -1
        && (data.descripcion_estado_pk || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_pk.toLowerCase()) !== -1
        && (data.fecha_asignacion || '').toString().toLowerCase().indexOf(searchTerms.fecha_asignacion.toLowerCase()) !== -1
        && (data.fecha_vencimiento || '').toString().toLowerCase().indexOf(searchTerms.fecha_vencimiento.toLowerCase()) !== -1
        && (data.nombre_responsable_visita || '').toString().toLowerCase().indexOf(searchTerms.nombre_responsable_visita.toLowerCase()) !== -1
        && (data.descripcion_localidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad.toLowerCase()) !== -1
        && (data.descripcion_zona || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona.toLowerCase()) !== -1
        && (data.descripcion_barrio || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio.toLowerCase()) !== -1
        && (data.descripcion_upz || '').toString().toLowerCase().indexOf(searchTerms.descripcion_upz.toLowerCase()) !== -1
        && (data.solicitud_radicado_entrada || '').toString().toLowerCase().indexOf(searchTerms.solicitud_radicado_entrada.toLowerCase()) !== -1
        && (data.nombre_responsable_predise || '').toString().toLowerCase().indexOf((searchTerms.nombre_responsable_predise||'').toLowerCase()) !== -1;
      });
    }
    cargaMapa($event:boolean){
      if(!this.mapElement.PksFL || this.inArr.length == 0)
        return;
      let scope = this;
      let inStr:string='';
      let count = 0, pos = 0;
      if(this.inArr.length>999){
          count = Math.ceil(this.inArr.length/1000);
          for (let i = 0; i<count; i++){
            pos = i*1000;
            if(i<count-1)
              inStr += 'PK_ID_ELEMENTO in (' + this.inArr.slice(pos,999+pos).toString() + ') OR ';
            else
              inStr += 'PK_ID_ELEMENTO in (' + this.inArr.slice(pos,999+pos).toString() + ')';
          }
        } else
          inStr += 'PK_ID_ELEMENTO in (' + this.inArr.toString() + ')';
        scope.mapElement.queryFeatures(inStr);
    }
    irAPk (pk: number) {
      let w = "PK_ID_ELEMENTO = " + pk.toString();
      console.log(w);
      this.mapElement.goTo(w);
    }
    filterDataPK($event:any){
        console.log('filtrartabla',$event);
        this.setValorBusqueda('pk_id_calzada',String($event));
    }
    mapClearFilters($event:any){
      this.onSearchClear();
    }
    applyFilter(valor: string): void {
        this.dataSource.filter = valor.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        this.dataSource.filteredData
      }
    // tslint:disable-next-line: typedef
  onSearchClear(){
      this.searchkey = '';
      this.applyFilter('');
    }
    // tslint:disable-next-line: typedef
    onClearFilters(){
      for (let c of this.formControls){
        c.setValue('');
      }
    }
    // tslint:disable-next-line: typedef
  onRegistroVisita(mantenimiento: any){
       console.log('el mant', mantenimiento);
       console.log('Url', mantenimiento.url);
      this.router.navigate(['dashboard/intervencion/' + mantenimiento.url +'/' + mantenimiento.id_mantenimiento_vial_evento], {queryParams: { idGestion: mantenimiento.id_proceso_gestion, idActividad: mantenimiento.id_actividad, idDocumento: mantenimiento.id_documento, idMantenimiento:mantenimiento.id_mantenimiento_vial}});
    }
    onVersionesVisita(mantenimiento: any){
         console.log('el mant', mantenimiento);
        this.router.navigate(['dashboard/mejoramiento-consultas/ver-detalle/' + mantenimiento.id_mantenimiento_vial]);//, {queryParams: { idGestion: mantenimiento.id_proceso_gestion, idActividad: mantenimiento.id_actividad, idDocumento: mantenimiento.id_documento}});
    }
    getClassTiempo(fecha: number): string{
      const hoy = new Date().getTime();
      const ven = new Date(fecha).getTime();
      let day = hoy - ven;
      day = Math.round(day/(1000*60*60*24));
      if ( day === -1 ){
        return 'undia';
      }
      else{
        if (day >= 0 ){
          return 'retraso';
        }
      }
      return 'normal';
    }

    //metodo temporal
    setTitulo(idActividad:number){
      if( idActividad == 24)
        this.titulo = 'Registrar visita de verificación';
    }

    public setValorBusqueda(attr:string,valor:string){
      let index = this.displayedColumns.indexOf(attr);
      this.formControls[index].setValue(valor);
    }

    processGeoData(m:any){
      console.log(m);
    }

    public async cargarColumnas(){
      this.filterColumns = [];
      this.formControls = [];
      let columnas = await this.utilitariosService.obtenerColumnasListaPendientes(this.idActividad as string);

      if(columnas != null){
        this.displayedColumns = columnas;
      }else{
        this.displayedColumns = [
          'id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
          'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
          'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
          'nombre_responsable_visita', '_CTRL_ACCION_TRABAJAR'];
      }

    for(let a of this.displayedColumns){
      this.filterColumns.push(a+'_');
      if(!a.startsWith('_CTRL_ACCION_')){
        let formControl = new FormControl('');
        formControl.valueChanges
          .subscribe(
            valor => {
              const attr:string = a as string;
              (this.filterValues as LooseObject)[attr] = valor;
              console.log(this.filterValues);
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

  }

  interface LooseObject {
    [key: string]: any
  }
