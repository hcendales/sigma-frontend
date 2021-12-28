import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaListaRevisionVisitaService } from 'src/app/core/services/consulta-lista-revision-visita.service';
import { VincularRadicadoService } from 'src/app/core/services/vincular-radicado.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-tabla-seguimientos',
  templateUrl: './tabla-seguimientos.component.html',
  styleUrls: ['./tabla-seguimientos.component.scss']
})
export class TablaSeguimientosComponent implements OnInit {
  displayedColumns: string[] = ['checks', 'pk_id_calzada', 'civ', 'tipo_malla', 'descripcion_zona', 'descripcion_localidad',
  'descripcion_barrio', 'descripcion_upz', 'seccion_vial', 'km_carril_impacto', 'codigo_actividad_agrupada', 'posible_danio_redes',
  'indice_priorizacion', 'fecha_visita_tecnica', 'seguimientos',
  'mes_ultima_fecha_seguimiento_masanio', 'dias_desde_ultima_visita', 'fecha_terminacion'
  //'id_mantenimiento_vial'
  ];

  // Datos para la lista
  dataSource!: MatTableDataSource<any>;
  // MatPaginator Inputs
  //filterColumns: string[] = ['ch', 'search2', 'search3', 'search4', 'search5', 'search6'] ;
    //'ch','search1', 'search2', 'search3', 'search4', 'search5', 'search6', 'search7', 'search8',
    //'search9', 'search10'] ;
  filterColumns: string[] = [];
  searchkey = '';
  registros:any[] = [];
  // Campos de filtro en el formulario
  // search0 = new FormControl('');
  public formControls:FormControl[] = [];

  filterValues = {
    pk_id_calzada: '',
    civ: '',
    id_mantenimiento_vial: '',
    fecha_visita_tecnica: '',
    seguimientos: '',
    mes_ultima_fecha_seguimiento_masanio: '',
    dias_desde_ultima_visita: '',
    fecha_terminacion: '',
    descripcion_localidad: '',
    descripcion_zona: '',
    descripcion_barrio: '',
    descripcion_upz: '',
    tipo_malla: '',
    seccion_vial: '',
    indice_priorizacion: '',
    km_carril_impacto: '',
    codigo_actividad_agrupada: '',
    posible_danio_redes: ''
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
  @Output() filterPKs: EventEmitter<any> = new EventEmitter();
  selectedList:any = {} as any;

  masterCheck:boolean = false;

  loadingData:boolean = false;
  products: any;
  file: any;
  @ViewChild('inputXls') inputXls: any;

  constructor(
    private revisioVisitasService: ConsultaListaRevisionVisitaService,
    private router: Router,
    public dialog: MatDialog,
    private gestionService: VincularRadicadoService,
    private activatedroute: ActivatedRoute) {
       //this.dataSource =  new MatTableDataSource();
   }

    ngOnChanges(e:any){
        console.log('taa: ', e);
        if(!e){return;}
        let selectedFeatures = e.selectedFeatures ? e.selectedFeatures.currentValue : null;
        if(selectedFeatures && this.dataSource && this.dataSource.filteredData){
          console.log('tabla: ', e.selectedFeatures);
          this.registros = [];
          this.dataSource.filteredData.forEach((v:any)=>{
            if(selectedFeatures.includes(v.pk_id_calzada)){
              v.checked = true;
              this.selectedList[v.pk_id_calzada] = v;
              this.registros.push(v);
            }else{
              v.checked = false;
            }
          });
          this.registroSeleccionado.emit(this.registros);
          //this.selecteDataSourceEmiter.emit(this.registros);
          }
    }

    ngOnInit() {
      this.consultarData();
    }

    creaFiltro(){
      this.dataSource.filterPredicate = ((data, filter) => {
        // console.log('Filtro: ', filter);
        const searchTerms = JSON.parse(filter);
        // console.log('searchTerms: ', searchTerms);
        return (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada) !== -1
        && (data.civ || '').toString().toLowerCase().indexOf(searchTerms.civ) !== -1
        && (data.fecha_visita_tecnica || '').toString().toLowerCase().indexOf(searchTerms.fecha_visita_tecnica) !== -1
        && (data.seguimientos || '').toString().toLowerCase().indexOf(searchTerms.seguimientos) !== -1
        && (data.mes_ultima_fecha_seguimiento_masanio || '').toString().toLowerCase().indexOf(searchTerms.mes_ultima_fecha_seguimiento_masanio) !== -1
        && (data.dias_desde_ultima_visita || '').toString().toLowerCase().indexOf(searchTerms.dias_desde_ultima_visita) !== -1
        && (data.fecha_terminacion || '').toString().toLowerCase().indexOf(searchTerms.fecha_terminacion) !== -1
        && (data.descripcion_localidad || '').toString().toLowerCase().indexOf(searchTerms.descripcion_localidad) !== -1
        && (data.descripcion_zona || '').toString().toLowerCase().indexOf(searchTerms.descripcion_zona) !== -1
        && (data.descripcion_barrio || '').toString().toLowerCase().indexOf(searchTerms.descripcion_barrio) !== -1
        && (data.descripcion_upz || '').toString().toLowerCase().indexOf(searchTerms.descripcion_upz) !== -1
        && (data.km_carril_impacto || '').toString().toLowerCase().indexOf(searchTerms.km_carril_impacto) !== -1
        && (data.tipo_malla || '').toString().toLowerCase().indexOf(searchTerms.tipo_malla) !== -1
        && (data.seccion_vial || '').toString().toLowerCase().indexOf(searchTerms.seccion_vial) !== -1
        && (data.indice_priorizacion || '').toString().toLowerCase().indexOf(searchTerms.indice_priorizacion) !== -1
        && (data.codigo_actividad_agrupada || '').toString().toLowerCase().indexOf(searchTerms.codigo_actividad_agrupada) !== -1
        && (data.posible_danio_redes || '').toString().toLowerCase().indexOf(searchTerms.posible_danio_redes) !== -1
      });
      setTimeout(() => {
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort      = this.sort;
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
      for (let c of this.formControls){
        c.setValue('');
      }
    }
    cargarColumnas(){
      this.filterColumns = [];
      this.formControls = [];

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
                //this.inArr = [];
                console.log(this.dataSource.filteredData);
                //this.registros = this.dataSource.filteredData;
                this.filterPKs.emit(this.dataSource.filteredData);//.forEach((value: { pk_id_calzada: any; }) => {
                  //this.inArr.push(value.pk_id_calzada);
                //});
                //this.cargaMapa(true);
              }
            );
          this.formControls.push(formControl);
        }
      }

    }
    // tslint:disable-next-line: typedef
    updateCheckedList(event: any, index: any){
      if ( event.checked ){
        this.selectedList[index.pk_id_calzada] = index;
      }else{
        delete this.selectedList[index.pk_id_calzada];
      }
      let arrayChecked = [];
      for(let key in this.selectedList){
        arrayChecked.push(this.selectedList[key]);
      }
      console.log(arrayChecked);
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
            this.selectedList[this.dataSource.filteredData[i].pk_id_calzada] = this.dataSource.filteredData[i];
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
        this.selecteDataSourceEmiter.emit(arrayChecked);
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
    public sortData(): void {
        switch (this.sort.direction) {
          case 'asc':
            this.sort.direction = 'asc';
            break;
          case 'desc':
            this.sort.direction = 'desc';
            break;
          default:
            this.sort.direction = 'asc';
        }
    }
    eliminarPk(pk:any) {
      const index = this.dataSource.data.indexOf(pk);
      this.dataSource.data.splice(index, 1);
      //this.dataSourceSolicitudes = this.dataSourceSolicitudes.filter((item, index) => index !== pk);
      this.dataSource._updateChangeSubscription();
    }
    agregarPKs(pks:any[]) {
      let scope = this;
      pks.forEach((v:any)=>{
        let pkFilter = this.dataSource.data.filter((data)=>{
          return data.PK_ID_ELEMENTO == v.attributes.PK_ID_ELEMENTO;
        });
        //if(pkFilter.length==0)
          this.dataSource.data.push(v.attributes);
        /*else {
          const dialogRef = this.dialog.open(SimpleDialogComponent,{
            data: {
              titulo: 'Vincular Pks a peticionario',
              contenido: 'Este PK ya fué vinculado.',
              acepytar: false,
              cancelar: true
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            return;
          });
        }*/
      });
      this.dataSource._updateChangeSubscription();
    }
    agregarPk(pk:any) {
      let scope = this;
      let pkFilter = this.dataSource.data.filter((data)=>{
        return data.PK_ID_ELEMENTO == pk.PK_ID_ELEMENTO;
      });
      if(pkFilter.length==0)
        this.dataSource.data.push(pk);
      else {
        const dialogRef = this.dialog.open(SimpleDialogComponent,{
          data: {
            titulo: 'Asignar Pks a Seguimiento',
            contenido: 'Este PK ya fué vinculado.',
            cerrar: true,
            cancelar: false,
            aceptar: false
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          return;
        });
      }

      this.dataSource._updateChangeSubscription();
    }
    async consultarData (){

      if(!this.loadingData){
        this.dataSource = new MatTableDataSource();
        this.loadingData = true;
        try{
          let respServ = await this.gestionService.getSegs();
          if(respServ.codError == 0){
            this.dataSource = new MatTableDataSource(respServ.respuesta);
            this.dataSource.sortingDataAccessor = (item, property) => {
              if(property == "checks")
                return item.checked ? 1 : 0;
              else
                return item[property];
            };
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.creaFiltro();
            this.onClearFilters();
            this.loadingData = false;
            this.cargarColumnas();
            //this.filterColumns = [];
            //await this.setFilterColoumns();
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

    exportexcel() {
      if (this.registros.length > 0) {
        let headers = {header:[
          'CIV',
          'PK ID',
          'FECHA_VISITA_TECNICA',
          'SEGUIMIENTOS',
          'ULTIMA_FECHA_SEGUIMIENTO',
          'DIAS_DESDE_ULTIMA_VISITA',
          'FECHA_TERMINACION',
          'TIPO_MALLA',
          'SECCION_VIAL',
          'INDICE_PRIORIZACION',
          'KM_CARRIL_IMPACTO',
          'ACTIVIDAD_AGRUPADA',
          'POSIBLE_DANIO_REDES'
        ]};

        let datos = [];
        for (let registro of this.registros) {
          datos.push({
            'CIV': registro.civ,
            'PK ID': registro.pk_id_calzada,
            'FECHA_VISITA_TECNICA': registro.fecha_visita_tecnica,
            'SEGUIMIENTOS': registro.seguimientos,
            'ULTIMA_FECHA_SEGUIMIENTO': registro.mes_ultima_fecha_seguimiento_masanio,
            'DIAS_DESDE_ULTIMA_VISITA': registro.dias_desde_ultima_visita,
            'FECHA_TERMINACION': registro.fecha_terminacion,
            'TIPO_MALLA': registro.tipo_malla,
            'SECCION_VIAL': registro.seccion_vial,
            'INDICE_PRIORIZACION': registro.indice_priorizacion,
            'KM_CARRIL_IMPACTO': registro.km_carril_impacto,
            'ACTIVIDAD_AGRUPADA': registro.codigo_actividad_agrupada,
            'POSIBLE_DANIO_REDES': registro.posible_danio_redes
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
    changeExcel(){
        this.inputXls.nativeElement.click()
    }
    uploadExcel(event: any) {
      this.file = event.target.files[0];
      let fileReader = new FileReader();
      let arrBuffer:any=null;
      let fileList:any[];
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = (e) => {
          arrBuffer = fileReader.result;
          var data = new Uint8Array(arrBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          //console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
          var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});
          arraylist.forEach((item:any)=>{
            console.log("fromXls: ", item);
            let pkFilter = this.dataSource.data.filter((data)=>{
              return data.pk_id_calzada == item["PK ID"];
            });
            if(pkFilter.length>0)
              this.updateCheckedList({checked:true}, {pk_id_calzada:item["PK ID"]});
          });
      }
    }
}
interface LooseObject {
  [key: string]: any
}
