import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GestionService } from 'src/app/core/services/gestion.service';

@Component({
  selector: 'app-tabla-gestion-pendiente',
  templateUrl: './tabla-gestion-pendiente.component.html',
  styleUrls: ['./tabla-gestion-pendiente.component.scss']
})
export class TablaGestionPendienteComponent implements OnInit {

  displayedColumns = ['id',  'idMant', 'pkId', 'civ','radSalida', 'actividadAgrupada'];
  dataSourceSolicitudes: MatTableDataSource<any> = new MatTableDataSource();
  filterStr!: string;
  selection = new SelectionModel<number>(true, []);
  numEnabled!: number;
  checkKey: string = 'numero_radicado_sol_reserva';
  checkVal: any = true;
  disabledChecks: boolean;
  filter!: string;
  textoTablaGenerado!: string;
  private _dataSourceSolicitiudes: MatTableDataSource<any> = new MatTableDataSource();
  @Input()
  set data(data: any[]) {
    this._dataSourceSolicitiudes =  new MatTableDataSource(data);
  }
  get data(): any[] {
    return this._dataSourceSolicitiudes.data;
  }
  @ViewChild(MatSort)
  sort!: any;
  @Output() regLoaded = new EventEmitter();
  @Output() solicitudGestionSeleccionada = new EventEmitter();
  @Output() desSeleccionSolicitud = new EventEmitter();
  @Output() desSeleccionTotal = new EventEmitter();

  constructor(private gestionService: GestionService, private route: ActivatedRoute,
    private router: Router) {
      this.disabledChecks = false;
      // this.cargarListaSolicitudesPorActividad ();

    }
  ngOnInit() {
    //this.dataSourceSolicitudes = this._dataSourceSolicitiudes;
    //this.dataSourceSolicitudes._updateChangeSubscription();
    console.log('listasx: ',this.dataSourceSolicitudes.data);
    this.cargarListaSolicitudesPorActividad ();
  }
  /*ngOnChanges(e:any){
      console.log('taa: ', e);
      if(!e){return;}
      if(this.dataSourceSolicitudes && this.dataSourceSolicitudes.filteredData){
        console.log('tabla: ', e.selectedFeatures);

        this.dataSourceSolicitudes.filteredData.forEach((v:any)=>{
          if(this.selection.isSelected(v.id_mantenimiento_vial)){
            this.selection.select(v.id_mantenimiento_vial);
          }else{
            this.selection.deselect(v.id_mantenimiento_vial);
          }
        });
        //this.selecteDataSourceEmiter.emit(this.registros);
        }
  }*/
  verificarRegHabilitados(){
    let data = this.dataSourceSolicitudes.data;
    this.numEnabled = 0;
    let scope = this;
    if (data) {
      data.forEach(value => {
        //console.log('res Id',value['id_mantenimiento_vial']);
        if(!scope.rowDisabled(value))
          scope.numEnabled ++;
        });
      console.log ("Numero de registros habilitados: " + this.numEnabled.toString());
    }
  }

  cargarListaSolicitudesPorActividad () {
    const inArr: Array<any> = [];
    this.textoTablaGenerado = 'ID MANT;PK ID;CIV;RAD SALIDA;RAD ENTRADA;ACT AGRUPADA \n';
    let id, pkId, civ,sal,ent,act: string;
    this.dataSourceSolicitudes.sort = this.sort;
    this.dataSourceSolicitudes.data.forEach((value: { [x: string]: string; }) => {
      id = value['id_mantenimiento_vial'] ? value['id_mantenimiento_vial'] : '';
      pkId = value['pk_id_calzada'] ? value['pk_id_calzada'] : '';
      civ = value['civ'] ? value['civ'] : '';
      sal = value['numero_radicado_sol_reserva'] ? value['numero_radicado_sol_reserva'].toString() : '';
      ent = value['numero_radicado_intervencion'] ? value['numero_radicado_intervencion'].toString() : '';
      act = value['codigo_actividad_agrupada'] ? value['codigo_actividad_agrupada'] : '';
      this.textoTablaGenerado += id + ';' + pkId + ';' + civ + ';' + sal + ';' + ent + ';' + act  + '\n';
    });
    //console.log(this.textoTablaGenerado);
    this.verificarRegHabilitados();
    this.crearFiltro();
    //this.regLoaded.emit();
  }
  alternarSeleccion () {
    if (!this.dataSourceSolicitudes) { return; }
    if (this.isAllSelected()) {
      this.selection.clear();
      this.desSeleccionTotal.emit();
    } else {
      let enabledRow: boolean, nulledCheck: boolean;
      if (typeof this.checkVal === "boolean")
        nulledCheck = true;
      this.dataSourceSolicitudes.filteredData.forEach(data => {
        if (nulledCheck){
          if(data[this.checkKey])
            enabledRow = true;
          else
            enabledRow = false;
          enabledRow = enabledRow == this.checkVal ? true : false;
        } else {
          enabledRow = data[this.checkKey] == this.checkVal ? true : false;
        }
        if(enabledRow && !this.selection.isSelected(data.id_mantenimiento_vial)){
          this.selection.select(data.id_mantenimiento_vial);
          this.clickSelectedMantenimiento(data);
        }
      });
    }
  }
  crearFiltro() {
    this.dataSourceSolicitudes.filterPredicate =
      (data: any, filters: string) => {
        const matchFilter = [];
        const filterArray = filters.split(',');
        const columns = [data.id_mantenimiento_vial,data.pk_id_calzada,data.civ,data.numero_radicado_sol_reserva,data.codigo_actividad_agrupada];
        if(filterArray.length > 1){
          filterArray.forEach(filter => {
            const customFilter = [];
            customFilter.push(String(data['pk_id_calzada']).includes(filter));
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
        } else {
          const customFilter:any[] = [];

          columns.forEach(column => {
            customFilter.push(String(column).toLowerCase().includes(String(filters)));
          });
          matchFilter.push(customFilter.some(Boolean)); // OR
        }
        return matchFilter.some(Boolean); // AND
    }
  }
  isAllSelected(): boolean {
    if (!this.dataSourceSolicitudes || this.selection.isEmpty()) { return false; }
    else {
      return this.selection.selected.length == this.numEnabled;
    }
  }
  rowDisabled(row: { [x: string]: any; }): boolean {
    let disableRow: boolean;
    if (typeof this.checkVal === "boolean"){
      if(row[this.checkKey])
        disableRow = true;
      else
        disableRow = false;
      disableRow = disableRow != this.checkVal;
    } else {
      disableRow = row[this.checkKey] != this.checkVal;
    }
    return disableRow;
  }
  trabajarActividad () {

    // Param: solSeleccionada
    // idMantenimientoVialGestion

    //this.userControllerService.setIdMantenivientoVialGestionSeleccionado (solMantenimientoVialSelected.idMantenimientoVialGestion);
    this.selection.clear();
    //this.router.navigate([ 'main-dashboard/' + this.userControllerService.getActividadActual().url + '' ,solMantenimientoVialSelected.idMantenimientoVial ]);
  }

  applyFilter(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (target) {
      let filterValue:string = target.value;
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSourceSolicitudes.filter = filterValue;
      let prevSelected = this.selection.selected;
      let enabledRow: Boolean;
      this.selection.clear();
      this.dataSourceSolicitudes.filteredData.forEach(data => {
        if(data[this.checkKey])
          enabledRow = true;
        else
          enabledRow = false;
        enabledRow = enabledRow == this.checkVal ? true : false;
        if(enabledRow && prevSelected.indexOf(data.id_mantenimiento_vial) != -1){
          this.selection.select(data.id_mantenimiento_vial);
          this.clickSelectedMantenimiento(data);
        }
      });
    }
  }

  generarExportLista() {

  }

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
    // tslint:disable-next-line:max-line-length

  }

}
