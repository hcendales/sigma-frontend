import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UtilitariosService } from '../../../../core/services/utilitarios.service';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MapaUmvComponent } from '../../../../shared/components/mapa-umv/mapa-umv.component';


@Component({
  selector: 'app-tabla-pendientes-apiques',
  templateUrl: './tabla-pendientes-apiques.component.html',
  styleUrls: ['./tabla-pendientes-apiques.component.scss']
})
export class TablaPendientesApiquesComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @Input() set datos(datos:any[]){
    
    this.dataSource.data = [...datos];
    //this.dataSource.data = 
  }
  @ViewChild('tableSort') sort: any;
  //@ViewChild(MatPaginator) paginator: any;

  @Input() configColumnas:{attr:string,label:string,ancho?:string,tipo?:string}[] = [];
  @Input() enEspera:boolean = false;

  @Output() verApiques = new EventEmitter();
  @Output() verAforo = new EventEmitter();
  @Output() checkPk = new EventEmitter();
  @Output() Allchecked = new EventEmitter();
  @Output() rowClicked = new EventEmitter();
  
  
  public formControlsFiltro:any[] = [];

  displayedColumns:string[] = [];
  filterColumns:string[] = [];
  opciones:any[]  = [];

  predefinedColoumns:string[] = ['orden','requiere_apiques','requiere_aforo','trabajar','check','respuesta_apiques','respuesta_aforo'];

  public ready = false;
  public allSelected:boolean = false;

  constructor(private dateAdapter:DateAdapter<Date>) { 
    this.dateAdapter.setLocale('es-CO');
  }

  async ngOnInit() {
  
    this.configDatasource();
    this.configFiltros();
    this.ready = true;
  }

  private configDatasource(){
    
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter: string) => {
      let res = true;
      for(let i = 0 ;i<this.configColumnas.length;i++){
        if( this.configColumnas[i].tipo == 'Accion'){
          continue
        }
        let valor = data[this.configColumnas[i].attr];
        if(this.configColumnas[i].tipo == 'Fecha'){
          let valorDesde = this.formControlsFiltro[i].get('start').value;
          valorDesde = valorDesde?valorDesde.toDate().getTime():null;
          let valorHasta = this.formControlsFiltro[i].get('end').value
          valorHasta = valorHasta?valorHasta.toDate().setHours(23,59,59,999):null; 
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
        }else if(this.formControlsFiltro[i]){
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

    this.dataSource.data = this.dataSource.data.map((x) => { x['checked'] = false; return x} );
    
  }

  configFiltros(){
    for(let col of this.configColumnas){
      if(col.tipo != 'Accion' && col.tipo != 'check'){
        this.formControlsFiltro.push(this.crearFormControlFiltro(col));
      }else{
        this.formControlsFiltro.push(null);
      }
      this.displayedColumns.push(col.attr);
      this.filterColumns.push(col.attr + '_');
    }
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
            this.deselectAll();
            this.dataSource.filter = JSON.stringify(new Date());
          }
        );
        formControl.get('end')?.valueChanges
        .subscribe(
          (valor) => {
            this.deselectAll();
            this.dataSource.filter = JSON.stringify(new Date());
          }
        );
      return formControl;
    }else{
      let formControl = new FormControl('');
      formControl.valueChanges
        .subscribe(
          valor => {
            this.deselectAll();
            this.dataSource.filter = JSON.stringify(new Date());
          }
        );
      return formControl;
    }
     
  }

  esColumnaPredefinida(attr:string){
    return this.predefinedColoumns.indexOf(attr) != -1;
  }

  onClearFilters(){
    for(let control of this.formControlsFiltro){
      if(control){
        control.reset();
      }
    }
  }

  masterCheck(e:any){
      for(let pk of this.dataSource.data){
        pk['checked'] = e.checked;
      }
      this.allSelected = e.checked;
      console.log('se emite');
      this.Allchecked.emit(e.checked?this.dataSource.filteredData:[]);
  }

  isIndeterminate(){
    
    if(this.dataSource.data.length == 0){
      return false;
    }

    for(let i=1;i<this.dataSource.data.length;i++){
      if(this.dataSource.data[i]['checked'] != this.dataSource.data[0]['checked']){
        return true;
      }
    }
    return false;
  }

  deselectAll(){
    this.dataSource.data = this.dataSource.data.map((x) => { x['checked'] = false; return x} );
            this.allSelected = false;
  }

  public getChecked(){
    return this.dataSource.filteredData.reduce((res:any[],pk:any) => {
      if(pk.checked){
        res.push(pk)
      }
      return res;
    },[]);
  }

  public checkRow(rows:any[]){
    console.log('rows', rows);
    let selRows = this.dataSource.filteredData.filter((x:any) =>{return rows.find((y:any)=>{return y.pk_id_calzada == x.pk_id_calzada})});
    console.log('SELROWS', selRows);
    for(let selRow of selRows){
      if(selRow){
        selRow['checked'] = true;
      }
    }
  }

  public verDocumento(e:any){
    this.verApiques.emit(e);
  }
  public verResAforo(e:any){
    this.verAforo.emit(e);
  }

  public checkPK(e:any,row:any){
    
    this.checkPk.emit({checked:e.checked,data:row});
  }

  irAPk (pk: number) {
    console.log(pk)
    if(!pk){
      return;
    }
    this.rowClicked.emit(pk);
  }

}
