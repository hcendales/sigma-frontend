import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { Routes, Router, ActivatedRoute, Params } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
// import { RevisionVisitas } from '../../../../core/models/revision-visitas';
import { ConsultaListaRevisionVisitaService } from '../../../core/services/consulta-lista-revision-visita.service';
import { Respuesta } from './../../../core/models/revision-visitas';
import { GestionService } from '../../../core/services/gestion.service';
import { UtilitariosService } from '../../../core/services/utilitarios.service';
import * as XLSX from 'xlsx';
import { Transicion } from './transicion';

@Component({
  selector: 'app-lista-transicion',
  templateUrl: './lista-transicion.component.html',
  styleUrls: ['./lista-transicion.component.scss']
})
export class ListaTransicionComponent implements AfterViewInit, OnInit {
  // Propiedades
  /*
  displayedColumns: string[] = [
    'ch','id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
    'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
    'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
    'nombre_responsable_visita', '_CTRL_ACCION_TRABAJAR'];
    */
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  // MatPaginator Inputs
  filterColumns: string[] = [] ;

  searchkey = '';
  // Campos de filtro en el formulario
  // search0 = new FormControl('');

  registros:Transicion[] = [];


  public formControls:FormControl[] = [];

  filterValues = {
    id_mantenimiento_vial: '',
    pk_id_calzada: '',
    civ: '',
    solicitud_radicado_entrada: '',
    descripcion_origen: '',
    descripcion_estado_pk: '',
    fecha_asignacion: '',
    fecha_vencimiento: '',
    nombre_responsable_visita: '',
    descripcion_localidad: '',
    descripcion_zona: '',
    descripcion_barrio: '',
    descripcion_upz: '',
    descripcion_actividad_agrupada: '',
    priorizacion_trimestre: '',
    eje_vial: '',
    nombre_director_obra: '',
  };

  // tslint:disable-next-line: member-ordering
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  // Propiedad para leer parametros
  @Input() idActividad = 5;
  @Input() idActividadTransicion = 9;
  @Input() selectedFeatures:any;
  @Input() displayedColumns: string[] = [
    'ch','id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
    'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
    'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
    'nombre_responsable_visita', '_CTRL_ACCION_TRABAJAR'];
  @Output() registroSeleccionado: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceEmiter: EventEmitter<any> = new EventEmitter();
  @Output() selecteDataSourceEmiter: EventEmitter<any> = new EventEmitter();
  @Input() mostrarOpcionDefault:Boolean = true;
  @Input() opciones:{nombre:string,icon:string|null,label:string|null,tooltip:string}[] = [];
  @Output() onOpcionSelected: EventEmitter<any> = new EventEmitter();

  selectedList:any = {} as any;

  masterCheck:boolean = false;

  loadingData:boolean = false;

  @Input() export_flag:Boolean = false;

  constructor(
    private revisioVisitasService: ConsultaListaRevisionVisitaService,
    private router: Router,
    private gestionService: GestionService,
    private activatedroute: ActivatedRoute,
    private utilitariosService:UtilitariosService) { }

    ngOnInit(): void {

    }

    ngOnChanges(e:any){
      console.log('ON changes de ' + 'Lista transicion');
      console.log(e);
      if(!e){return;}
      let selectedFeatures = e.selectedFeatures ? e.selectedFeatures.currentValue : null;
      if(selectedFeatures && this.dataSource && this.dataSource.filteredData){
        this.dataSource.filteredData.forEach((v:any)=>{
          if(selectedFeatures.includes(v.pk_id_calzada)){
            v.checked = true;
          }else{
            v.checked = false;
          }
        });
        }
    }

    ngAfterViewInit(): void {

      }

      // tslint:disable-next-line: typedef
      creaFiltro(){
        this.dataSource.filterPredicate = ((data, filter) => {
          // console.log('Filtro: ', filter);
          const searchTerms = JSON.parse(filter);
           //console.log('searchTerms: ', searchTerms);
          return (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial.toLowerCase()) !== -1
          && (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada.toLowerCase()) !== -1
          && (data.descripcion_origen || '').toString().toLowerCase().indexOf(searchTerms.descripcion_origen.toLowerCase()) !== -1
          && (data.descripcion_estado_pk || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_pk.toLowerCase()) !== -1
          && (new Date(data.fecha_asignacion).toLocaleDateString('ca-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '').toString().toLowerCase().indexOf(searchTerms.fecha_asignacion.toLowerCase()) !== -1
          && (new Date(data.fecha_vencimiento).toLocaleDateString('ca-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '').toString().toLowerCase().indexOf(searchTerms.fecha_vencimiento.toLowerCase()) !== -1
          && (data.nombre_responsable_visita || '').toString().toLowerCase().indexOf(searchTerms.nombre_responsable_visita.toLowerCase()) !== -1
          && (data.descripcion_localidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad.toLowerCase()) !== -1
          && (data.descripcion_zona || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona.toLowerCase()) !== -1
          && (data.descripcion_barrio || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio.toLowerCase()) !== -1
          && (data.descripcion_upz || '').toString().toLowerCase().indexOf(searchTerms.descripcion_upz.toLowerCase()) !== -1
          && (data.solicitud_radicado_entrada || '').toString().toLowerCase().indexOf(searchTerms.solicitud_radicado_entrada.toLowerCase()) !== -1
          && (data.civ || '').toString().toLowerCase().indexOf(searchTerms.civ.toLowerCase()) !== -1
          && (data.descripcion_actividad_agrupada || '').toString().toLowerCase().indexOf(searchTerms.descripcion_actividad_agrupada.toLowerCase()) !== -1
          && (data.priorizacion_trimestre || '').toString().toLowerCase().indexOf(searchTerms.priorizacion_trimestre.toLowerCase()) !== -1
          && (data.eje_vial || '').toString().toLowerCase().indexOf(searchTerms.eje_vial.toLowerCase()) !== -1;
        });
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort      = this.sort;
        });
      }

    applyFilter(valor: string): void {
        this.dataSource.filter = valor.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
      // tslint:disable-next-line: typedef
    onSearchClear(){
        this.searchkey = '';
        this.applyFilter('');
      }
      // tslint:disable-next-line: typedef
      onClearFilters(){
        if(!this.dataSource){
          return
        }
        for (let c of this.formControls){
          c.setValue('');
        }

      }
      // tslint:disable-next-line: typedef
    onRegistroVisita(mantenimiento: any){
        // console.log('el mant', mantenimiento);
        // tslint:disable-next-line: max-line-length
        this.router.navigate(['dashboard/' + mantenimiento.url + '/' + mantenimiento.id_mantenimiento_vial], {queryParams: { idGestion: mantenimiento.id_proceso_gestion, idActividad: mantenimiento.id_actividad, idDocumento: mantenimiento.id_documento}});
      }

      // tslint:disable-next-line: typedef
      updateCheckedList(event: any, index: any){
        if ( event.checked ){
          this.selectedList[index.id_proceso_gestion] = index;
        }else{
          delete this.selectedList[index.id_proceso_gestion];
        }
        let arrayChecked = [];
        for(let key in this.selectedList){
          arrayChecked.push(this.selectedList[key]);
        }


        this.registroSeleccionado.emit(arrayChecked);
        this.selecteDataSourceEmiter.emit(arrayChecked);

        if(!this.isAlternated()){
          this.masterCheck = this.dataSource.filteredData[0].checked;
        }

      }

      getClassTiempo(fecha: number): string{
        const hoy = new Date().getTime();
        const ven = new Date(fecha).getTime();
        let day = hoy - ven;
        day = Math.round(day / ( 1000 * 60 * 60 * 24));
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

      clearchecked(){
        if(this.dataSource ){
          this.masterCheck = false;
          this.masterToggle({checked:false});
        }
      }

      //evento cuando se hace click en ek check de la cabecera
      masterToggle(e:any){
        if(this.dataSource){
          this.selectedList = {};
          for(let i=0;i<this.dataSource.filteredData.length;i++){
           // if(this.dataSource.filteredData[i].checked != e.checked){

              //this.updateCheckedList(e,this.dataSource.filteredData[i]);
              this.dataSource.filteredData[i].checked = e.checked;
              this.selectedList[this.dataSource.filteredData[i].id_proceso_gestion] = this.dataSource.filteredData[i];
            //}
          }
          let arrayChecked = [];
          if(e.checked){
            for(let key in this.selectedList){
              arrayChecked.push(this.selectedList[key]);
            }
          }else{
            this.selectedList = {};
          }
          this.registroSeleccionado.emit(arrayChecked);
          console.log(arrayChecked);
        }
      }

      //verifica si hay algunos registros seleccionados, para establecer el estado "indeterminado" del check de la cabecera
      isAlternated(){
        if(this.dataSource && this.dataSource.filteredData.length >1){
          let antValue = this.dataSource.filteredData[0].checked;
          for(let i = 1; i<this.dataSource.filteredData.length;i++){
            if(this.dataSource.filteredData[i].checked != antValue){
              return true;
            }else{
              antValue = this.dataSource.filteredData[i].checked;
            }
          }
        }
        return false;
      }

      async consultarData (filtro:any){

        if(!this.loadingData){
          this.dataSource = new MatTableDataSource();
          this.loadingData = true;
          try{
            let respServ = await this.gestionService.listarBandejaGestionTransicion(this.idActividad, this.idActividadTransicion, filtro);
            if(respServ.codError == 0){
              console.log("Datos de la vista:");
              console.log(respServ.respuesta);
              this.registros = respServ.respuesta;
              this.dataSource = new MatTableDataSource(respServ.respuesta);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.creaFiltro();
              this.onClearFilters();
              this.loadingData = false;
              this.filterColumns = [];
              await this.setFilterColoumns();
              this.dataSourceEmiter.emit(this.dataSource.data);
            }
          }catch(e){
            console.log(e);
            this.loadingData = false;
          }
        }
        else{
          this.dataSourceEmiter.emit(this.dataSource.data);
        }

      }

      private async setFilterColoumns(){
        let columnas = await this.utilitariosService.obtenerColumnasListaPendientes(String(this.idActividad));
        console.log('columns: ', columnas);
        if(columnas != null){
          this.displayedColumns = columnas;
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
                  this.dataSource.filter = JSON.stringify(this.filterValues);
                  this.dataSourceEmiter.emit(this.dataSource.filteredData);
                }
              );
            this.formControls.push(formControl);
          }
        }
      }
      public setValorBusqueda(attr:string,valor:string){
        let index = this.displayedColumns.indexOf(attr);
        this.formControls[index].setValue(valor);
      }

      exportexcel() {
        if (this.registros.length > 0) {
          let headers = {header:[
            'ID',
            'PK ID',
            'CIV',
            'VALOR LOCALIDAD',
            'LOCALIDAD',
            'ZONA',
            'BARRIO',
            'UPZ',
            'ACTIVIDAD AGRUPADA',
            'PRIORIZACIÓN',
            'EJE VIAL',
            'DESDE',
            'HASTA',
            'TIPO ELEMENTO',
            'SUPERFICIE',
            'TIPO DE MALLA',
            'KM CARRIL',
            'PROGRAMA',
            'ESTRATEGIA'
          ]};
          let datos = [];
          for (let registro of this.registros) {
            datos.push({
              'ID': registro.id_mantenimiento_vial_evento,
              'PK ID': registro.pk_id_calzada,
              'CIV': registro.civ,
              'VALOR LOCALIDAD': registro.valor_localidad,
              'LOCALIDAD': registro.descripcion_localidad,
              'ZONA': registro.descripcion_zona,
              'BARRIO': registro.descripcion_barrio,
              'ACTIVIDAD AGRUPADA': registro.descripcion_actividad_agrupada,
              'PRIORIZACIÓN': registro.priorizacion_trimestre,
              'EJE VIAL': registro.eje_vial,
              'DESDE': registro.desde,
              'HASTA': registro.hasta,
              'TIPO ELEMENTO': registro.tipo_elemento,
              'SUPERFICIE': registro.descripcion_tipo_superficie,
              'TIPO DE MALLA': registro.descripcion_tipo_malla,
              'KM CARRIL': registro.km_carril_impacto,
              'PROGRAMA': registro.descripcion_tipo_programa,
              'ESTRATEGIA': registro.descripcion_tipo_estrategia
            });
          }
          const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(datos, headers);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, '0');
          let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          let yyyy = today.getFullYear();
          XLSX.writeFile(wb, `Lista_PKs_Priorizados_${dd}${mm}${yyyy}.xlsx`);
        }
      }

}

interface LooseObject {
  [key: string]: any
}
