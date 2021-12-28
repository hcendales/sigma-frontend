import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitariosService } from '../../../core/services/utilitarios.service';
import { GestionService } from '../../../core/services/gestion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-tabla-filtros',
  templateUrl: './tabla-filtros.component.html',
  styleUrls: ['./tabla-filtros.component.scss']
})
export class TablaFiltrosComponent implements OnInit {

  ready:boolean = false;

  @Input() idActividad:string|null = '';
  //opciones para la columna de acciones
  @Input() opciones: {nombre:string, label?:string, icon?:string, tooltip?:string}[] = [];
  //datos de la tabla
  @Input() data:any[] = [];
  //Si es true obtiene la configuración del la variable configColumnas, de lo contraraio la obtiene del archivo de configuración en función del id de actividad.
  @Input() configManualColumnas:boolean = false;
  //variable para cuando se necesite cargar de manera manual la configuración de columnas.
  @Input() configColumnas:{attr:string,label:string,ancho?:string,tipo?:string}[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  formControlsFiltro:any[] = [];
  filterValues:any = {} as any;
  displayedColumns:string[] = [];
  filterColumns:string[] = [];

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private utilitariosService:UtilitariosService) {
  }

  async ngOnInit() {
    this.ready = false;
    if(!this.configManualColumnas){
      this.configColumnas = await this.utilitariosService.obtenerColumnasListaPendientes(this.idActividad as string);
    }
    for(let col of this.configColumnas){
      if(col.tipo != 'Accion'){
        this.formControlsFiltro.push(this.crearFormControlFiltro(col));
      }
      this.displayedColumns.push(col.attr);
      this.filterColumns.push(col.attr + '_');
    }
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter: string) => {
      let res = true;
      for(let i = 0 ;i<this.configColumnas.length;i++){
        if(this.configColumnas[i].tipo == 'Accion'){
          continue
        }
        let valor = data[this.configColumnas[i].attr];
        if(this.configColumnas[i].tipo == 'Fecha'){
          let valorDesde = this.formControlsFiltro[i].get('start').value;
          valorDesde = valorDesde?valorDesde.getTime():null;
          let valorHasta = this.formControlsFiltro[i].get('end').value
          valorHasta = valorHasta?valorHasta.setHours(23,59,59,999):null; 
          let cumpleDesde = (valorDesde <= valor) && valorDesde != null;
          let cumpleHasta = (valorHasta >= valor) && valorHasta != null;
          if(!valorDesde && valorHasta){
            res = res && cumpleHasta;
          }else
          if (valorDesde && !valorHasta){
            res = res && cumpleDesde;
          }else
          if (!valorDesde && !valorHasta){
            res = res && true;
          }else{
            res = res && cumpleDesde && cumpleHasta;
          }
        }else{
          let valorFiltro = this.formControlsFiltro[i].value;
          if(valorFiltro == null || valorFiltro.length == 0){
            res = res && true;
          }else{
            res = res && String(valor).toLowerCase().trim().indexOf(valorFiltro.toLowerCase()) !== -1;
          }
        }
      }
      return res;
    };
    this.ready = true;
  }

  crearFormControlFiltro(col:any){
    
    if(col.tipo == 'Fecha'){
      let formControl = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      });
      formControl.get('start')?.valueChanges
        .subscribe(
          (valor) => {
            this.dataSource.filter = JSON.stringify(new Date());
          }
        );
        formControl.get('end')?.valueChanges
        .subscribe(
          (valor) => {
            this.dataSource.filter = JSON.stringify(new Date());
          }
        );
      return formControl;
    }else{
      let formControl = new FormControl('');
      formControl.valueChanges
        .subscribe(
          valor => {
            this.dataSource.filter = JSON.stringify(new Date());
          }
        );
      return formControl;
    }
     
  }

  onClearFilters(){
    for( let i = 0;i< this.configColumnas.length;i++){
      if(this.configColumnas[i].tipo == 'Accion'){
        continue;
      }
      if(this.configColumnas[i].tipo == 'Fecha'){
        this.formControlsFiltro[i].get('start').setValue(null);
        this.formControlsFiltro[i].get('end').setValue('');
      }else{
        this.formControlsFiltro[i].setValue('');
      }
      
    }
    
  }

  onOpcionSelected(e:any){

  }

}