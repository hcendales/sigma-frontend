import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaListaRevisionVisitaService } from 'src/app/core/services/consulta-lista-revision-visita.service';
import { VincularRadicadoService } from 'src/app/core/services/vincular-radicado.service';

@Component({
  selector: 'app-tabla-radicado-vinculado',
  templateUrl: './tabla-radicado-vinculado.component.html',
  styleUrls: ['./tabla-radicado-vinculado.component.scss']
})
export class TablaRadicadoVinculadoComponent implements OnInit {
  displayedColumns: string[] = ['checks', 'numero_radicado',
     'fecha_radicado', 'entidad', 'remitente', 'dirigido_a', 'fecha_vinculacion','pk_id_calzada', 'tipo_elemento'];
  /*[
    'checks','id_radicado_vinculado', 'numero_radicado', 'descripcion_localidad',
     'fecha_radicado', 'entidad', 'remitente', 'dirigido_a',
    'fecha_vinculacion', 'fecha_vencimiento', 'pkId', 'id_mantenimiento_vial'];*/
  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  // MatPaginator Inputs
  filterColumns: string[] = ['ch', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search9', 'search10'] ;
    //'ch','search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8',
    //'search9', 'search10'] ;

  searchkey = '';
  // Campos de filtro en el formulario
  // search0 = new FormControl('');
  public search1 = new FormControl('');
  public search2 = new FormControl('');
  public search3 = new FormControl('');
  public search4 = new FormControl('');
  public search5 = new FormControl('');
  public search6 = new FormControl('');
  public search7 = new FormControl('');
  public search8 = new FormControl('');
  public search9 = new FormControl('');
  public search10 = new FormControl('');
  public search11 = new FormControl('');

  filterValues = {
    id_radicado_vinculado: '',
    numero_radicado: '',
    fecha_radicado: '',
    entidad: '',
    remitente: '',
    dirigido_a: '',
    fecha_vinculacion: '',
    fecha_vencimiento: '',
    pk_id_calzada: '',
    tipo_elemento: '',
    id_mantenimiento_vial: ''
  };

  // tslint:disable-next-line: member-ordering
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  // Propiedad para leer parametros
  @Input() idActividad = 5;
  @Input() idActividadTransicion = 9;
  @Input() selectedFeatures:any;
  @Output() registroSeleccionado: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceEmiter: EventEmitter<any> = new EventEmitter();
  @Output() selecteDataSourceEmiter: EventEmitter<any> = new EventEmitter();
  @Output() irAPkEmiter: EventEmitter<any> = new EventEmitter();
  selectedList:any = {} as any;

  masterCheck:boolean = false;

  loadingData:boolean = false;

  constructor(
    private revisioVisitasService: ConsultaListaRevisionVisitaService,
    private router: Router,
    private gestionService: VincularRadicadoService,
    private activatedroute: ActivatedRoute) { }

    ngOnChanges(e:any){
        console.log('cambios_radVin',e);
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

    async ngOnInit() {
      await this.consultarData({});
       this.search1.valueChanges
          .subscribe(
            valor1 => {
              this.filterValues.id_radicado_vinculado = valor1;
              // console.log('FilterValues: ', JSON.stringify(this.filterValues));
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search2.valueChanges
          .subscribe(
            valor2 => {
              this.filterValues.numero_radicado = valor2;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search3.valueChanges
          .subscribe(
            valor3 => {
              this.filterValues.fecha_radicado = valor3;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search4.valueChanges
          .subscribe(
            valor4 => {
              this.filterValues.entidad = valor4;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search5.valueChanges
          .subscribe(
            valor5 => {
              this.filterValues.remitente = valor5;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search6.valueChanges
          .subscribe(
            valor6 => {
              this.filterValues.dirigido_a = valor6;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search7.valueChanges
          .subscribe(
            valor7 => {
              this.filterValues.fecha_vinculacion = valor7;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search8.valueChanges
          .subscribe(
            valor8 => {
              this.filterValues.fecha_vencimiento = valor8;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search9.valueChanges
          .subscribe(
            valor9 => {
              this.filterValues.pk_id_calzada = valor9;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
       this.search10.valueChanges
          .subscribe(
            valor10 => {
              this.filterValues.tipo_elemento = valor10;
              this.dataSource.filter = JSON.stringify(this.filterValues);
              this.dataSourceEmiter.emit(this.dataSource.filteredData);
              this.clearchecked();
            }
          );
          this.search11.valueChanges
             .subscribe(
               valor11 => {
                 this.filterValues.id_mantenimiento_vial = valor11;
                 this.dataSource.filter = JSON.stringify(this.filterValues);
                 this.dataSourceEmiter.emit(this.dataSource.filteredData);
                 this.clearchecked();
               }
             );
    }

    creaFiltro(){
      this.dataSource.filterPredicate = ((data, filter) => {
        // console.log('Filtro: ', filter);
        const searchTerms = JSON.parse(filter);
        // console.log('searchTerms: ', searchTerms);
        return (data.id_radicado_vinculado || '').toString().toLowerCase().indexOf(searchTerms.id_radicado_vinculado) !== -1
        && (data.numero_radicado || '').toString().toLowerCase().indexOf(searchTerms.numero_radicado) !== -1
        && (data.fecha_radicado || '').toString().toLowerCase().indexOf(searchTerms.fecha_radicado) !== -1
        && (data.entidad || '').toString().toLowerCase().indexOf(searchTerms.entidad) !== -1
        && (data.remitente || '').toString().toLowerCase().indexOf(searchTerms.remitente) !== -1
        && (data.dirigido_a || '').toString().toLowerCase().indexOf(searchTerms.dirigido_a) !== -1
        && (data.fecha_vinculacion || '').toString().toLowerCase().indexOf(searchTerms.fecha_vinculacion) !== -1
        && (data.fecha_vencimiento || '').toString().toLowerCase().indexOf(searchTerms.fecha_vencimiento) !== -1
        && (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada) !== -1
        && (data.tipo_elemento || '').toString().toLowerCase().indexOf(searchTerms.tipo_elemento) !== -1
        && (data.id_mantenimiento_vial || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial) !== -1
      });
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort      = this.sort;
      });
    }
    irAPk (pk: number) {
      let w = "PK_ID_ELEMENTO = " + pk.toString();
      console.log(w);
      this.irAPkEmiter.emit(w);
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
      this.search1.setValue('');
      this.search2.setValue('');
      this.search3.setValue('');
      this.search4.setValue('');
      this.search5.setValue('');
      this.search6.setValue('');
      this.search7.setValue('');
      this.search8.setValue('');
      this.search9.setValue('');
      this.search10.setValue('');
    }

    // tslint:disable-next-line: typedef
    updateCheckedList(event: any, index: any){
      if ( event.checked ){
        this.selectedList[index.id_radicado_vinculado] = index;
      }else{
        delete this.selectedList[index.id_radicado_vinculado];
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
            this.selectedList[this.dataSource.filteredData[i].id_radicado_vinculado] = this.dataSource.filteredData[i];
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
          let respServ = await this.gestionService.getAll();
          if(respServ.codError == 0){
            this.dataSource = new MatTableDataSource(respServ.respuesta);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.creaFiltro();
            this.onClearFilters();
            this.loadingData = false;
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
}
