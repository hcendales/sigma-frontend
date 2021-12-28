import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionService } from 'src/app/core/services/gestion.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tabla-vincular',
  templateUrl: './tabla-vincular.component.html',
  styleUrls: ['./tabla-vincular.component.scss']
})
export class TablaVincularComponent implements OnInit {

  displayedColumns: any[];
  dataSourceSolicitudes: MatTableDataSource<any>;
  filterStr!: string;
  selection = new SelectionModel<number>(true, []);
  filter!: string;
  textoTablaGenerado!: string;

  @ViewChild(MatPaginator)
  paginator!: any;
  @ViewChild(MatSort)
  sort!: any;
  file: any;
  @ViewChild('inputXls') inputXls: any;
  @Input() dataSource:any;
  @Output() regLoaded = new EventEmitter();
  @Output() solicitudGestionSeleccionada = new EventEmitter();
  @Output() desSeleccionSolicitud = new EventEmitter();
  @Output() irAPkEmiter = new EventEmitter();
  @Output() filterPKs = new EventEmitter();
  filterColumns: any[] = [];
  public formControls:FormControl[] = [];
  searchkey!: string;
  filterValues = {
    civ: '',
    pkId: '',
    tipoElemento: '',
    tipoMalla: '',
    tipoSuperficie: '',
    ejeVial: '',
    desde: '',
    hasta: '',
    tipOrigen: '',
    localidad: '',
    sector: '',
    upl: '',
    zona: ''
  };
  constructor(private gestionService: GestionService, private route: ActivatedRoute,
    private router: Router, public dialog: MatDialog) {
      this.displayedColumns = ['civ', 'pkId', 'tipoElemento', 'tipoMalla', 'tipoSuperficie',
       'ejeVial', 'desde', 'hasta', 'localidad', 'sector', 'upl', 'zona', '_CTRL_ACCION_borrar'];
      this.dataSourceSolicitudes =  new MatTableDataSource();
  }
  ngOnChanges(e:any){
      console.log('taa: ', e);
      if(!e){return;}
      let dataS = e.dataSource ? e.dataSource.currentValue : null;
      if(dataS && this.dataSource && this.dataSource.filteredData){
        console.log('tabla: ', e.dataSource);
      }
  }
  ngOnInit() {
    this.creaFiltro();
  }

  cargarListaSolicitudesPorActividad () {
    const inArr: Array<any> = [];
    this.textoTablaGenerado = 'ID MANT;PK ID;CIV;RAD SALIDA;RAD ENTRADA;ACT AGRUPADA \n';
    let id, pkId, civ,sal,ent,act: string;

  }

  creaFiltro(){
    this.dataSourceSolicitudes.filterPredicate = ((data, filter) => {
      // console.log('FiltroVinc: ', filter);
      const searchTerms = JSON.parse(filter);
      // console.log('searchTerms: ', searchTerms);
      return (data.PK_ID || '').toString().toLowerCase().indexOf(searchTerms.pkId) !== -1
      && (data.DESCRIPCION_ELEMENTO || '').toString().toLowerCase().indexOf(searchTerms.tipoElemento) !== -1
      && (data.TIPOMALLA || '').toString().toLowerCase().indexOf(searchTerms.tipoMalla) !== -1
      && (data.TIPOSUPERFICIE || '').toString().toLowerCase().indexOf(searchTerms.tipoSuperficie) !== -1
      && (data.EJE_VIAL || '').toString().toLowerCase().indexOf(searchTerms.ejeVial) !== -1
      && (data.DESDE || '').toString().toLowerCase().indexOf(searchTerms.desde) !== -1
      && (data.HASTA || '').toString().toLowerCase().indexOf(searchTerms.hasta) !== -1
      && (data.TIPOORIGEN || '').toString().toLowerCase().indexOf(searchTerms.tipOrigen) !== -1
      && (data.NOM_LOCALIDAD || '').toString().toLowerCase().indexOf(searchTerms.localidad) !== -1
      && (data.NOM_SECTOR || '').toString().toLowerCase().indexOf(searchTerms.sector) !== -1
      && (data.NOM_UPL || '').toString().toLowerCase().indexOf(searchTerms.upl) !== -1
      && (data.NOM_ZONA || '').toString().toLowerCase().indexOf(searchTerms.zona) !== -1
    });
    setTimeout(() => {
      this.dataSourceSolicitudes.paginator = this.paginator;
      this.dataSourceSolicitudes.sort      = this.sort;
      this.cargarColumnas();
    });
  }
  irAPk (pk: number) {
    let w = "PK_ID_ELEMENTO = " + pk.toString();
    console.log(w);
    this.irAPkEmiter.emit(w);
  }
  applyFilter(valor: string): void {
    this.dataSourceSolicitudes.filter = valor.trim().toLowerCase();
    if (this.dataSourceSolicitudes.paginator) {
      this.dataSourceSolicitudes.paginator.firstPage();
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
              this.dataSourceSolicitudes.filter = JSON.stringify(this.filterValues);
              //this.inArr = [];
              console.log(this.dataSourceSolicitudes.filteredData);
              this.filterPKs.emit(this.dataSourceSolicitudes.filteredData);//.forEach((value: { pk_id_calzada: any; }) => {
                //this.inArr.push(value.pk_id_calzada);
              //});
              //this.cargaMapa(true);
            }
          );
        this.formControls.push(formControl);
      }
    }

  }

  eliminarPk(pk:any) {
    const index = this.dataSourceSolicitudes.data.indexOf(pk);
    this.dataSourceSolicitudes.data.splice(index, 1);
    //this.dataSourceSolicitudes = this.dataSourceSolicitudes.filter((item, index) => index !== pk);
    this.dataSourceSolicitudes._updateChangeSubscription();
  }

  agregarPk(pk:any,origen:string) {
    let scope = this;
    console.log('pk',pk);
    let pkFilter = this.dataSourceSolicitudes.data.filter((data)=>{
      //console.log('agPk',data);
      return data.PK_ID == pk.PK_ID;
    });
    if(pkFilter.length==0)
      this.dataSourceSolicitudes.data.push(pk);
  /*  else {
      const dialogRef = this.dialog.open(SimpleDialogComponent,{
        data: {
          titulo: origen,
          contenido: 'Este PK ya fué vinculado.',
          aceptar: false,
          cancelar: false,
          cerrar: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        return;
      });
    }*/
    this.dataSourceSolicitudes._updateChangeSubscription();
  }

  /*applyFilter(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (target) {
      let filterValue:string = target.value;
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSourceSolicitudes.filter = filterValue;
      this.selection.clear();
    }
  }*/

  clickSelectedMantenimiento (solicitudGestionPendienteSeleccionada:any) {
    solicitudGestionPendienteSeleccionada.seleccionado = this.selection.isSelected(solicitudGestionPendienteSeleccionada.id_mantenimiento_vial);//solicitudGestionPendienteSeleccionada.seleccionado;
    //console.log(solicitudGestionPendienteSeleccionada.seleccionado);
    if( solicitudGestionPendienteSeleccionada.seleccionado ) {
      //console.log('selecciona');
      this.solicitudGestionSeleccionada.emit(solicitudGestionPendienteSeleccionada);
    }else{
      //console.log('DESselecciona');
      this.desSeleccionSolicitud.emit(solicitudGestionPendienteSeleccionada);
    }
  }
  exportexcel() {
    if (this.dataSourceSolicitudes.data.length > 0) {
      let headers = {header:[
        'CIV',
        'PK_ID',
        'DESCRIPCION_ELEMENTO',
        'TIPOMALLA',
        'TIPOSUPERFICIE',
        'EJE_VIAL',
        'DESDE',
        'HASTA',
        'NOM_LOCALIDAD',
        'NOM_SECTOR',
        'NOM_UPL',
        'NOM_ZONA'
      ]};
      this.displayedColumns = ['civ', 'pkId', 'tipoElemento', 'tipoMalla', 'tipoSuperficie',
       'ejeVial', 'desde', 'hasta', 'localidad', 'sector', 'upl', 'zona'];
      let datos = [];
      for (let registro of this.dataSourceSolicitudes.data) {
        datos.push({
          'CIV': registro.CIV,
          'PK_ID': registro.PK_ID,
          'DESCRIPCION_ELEMENTO': registro.DESCRIPCION_ELEMENTO,
          'TIPOMALLA': registro.TIPOMALLA,
          'TIPOSUPERFICIE': registro.TIPOSUPERFICIE,
          'EJE_VIAL': registro.EJE_VIAL,
          'DESDE': registro.DESDE,
          'HASTA': registro.HASTA,
          'NOM_LOCALIDAD': registro.NOM_LOCALIDAD,
          'NOM_SECTOR': registro.NOM_SECTOR,
          'NOM_UPL': registro.NOM_UPL,
          'NOM_ZONA': registro.NOM_ZONA,
        });
      }
      const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(datos, headers);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();
      XLSX.writeFile(wb, `Lista_PKs_Misionalidad_${dd}${mm}${yyyy}.xlsx`);
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
          //console.log("fromXls: ", item);
          this.agregarPk(item,'');
          /*let pkFilter = this.dataSourceSolicitudes.data.filter((data)=>{
            return data.pkId == item["PK ID"];
          });
          if(pkFilter.length>0)*/
        });
        this.regLoaded.emit(this.dataSourceSolicitudes.data);
    }
  }
}
interface LooseObject {
  [key: string]: any
}
