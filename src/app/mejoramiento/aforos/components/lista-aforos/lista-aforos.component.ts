import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AforoCalzada } from '../../models/AforoCalzada';
import { GestionService } from '../../../../core/services/gestion.service';

@Component({
  selector: 'app-lista-aforos',
  templateUrl: './lista-aforos.component.html',
  styleUrls: ['./lista-aforos.component.scss']
})
export class ListaAforosComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa',{static:false}) mapElement: any;
  @Output() seleccionFila = new EventEmitter();

  public dataSourceSolicitudes:MatTableDataSource<any>;
  public displayedColumns:string[];

  public solicitudesAforos:any[] = [];

  public queryMapa:string = '';

  public mostrarMapa:boolean = true;

  constructor(private gestionService:GestionService) {
    this.dataSourceSolicitudes = new MatTableDataSource<any>();
    this.displayedColumns = ['pk_id_calzada', 'chkAledano', 'civ','eje_vial', 'desde', 'hasta', 'descripcion_localidad', 'descripcionTipoSuperficie', 'btnEliminar'];
  }

  async ngOnInit() {

    try{
      this.dataSourceSolicitudes.data = [];
      let resp = await this.gestionService.listarBandejaGestionPendiente(1602);

      if(resp.codError == 0){
        this.solicitudesAforos = resp.respuesta.filter((x:any) => x.requiere_aforo == 'SI' && x.respuesta_aforo!='SI');
        this.queryMapa = 'PK_ID_ELEMENTO in ('+this.solicitudesAforos.map((x:any) => x.pk_id_calzada).join()+')';
        console.log('Query mapa', this.queryMapa);
      }else{

      }
    }
    catch(e){
      console.log('Error:',e);
    }
  }

  ngAfterViewInit(){
    setTimeout(() => { this.coso(); }, 20000);
  }

  async coso(){
    await this.mapElement.PksFL.load();
    this.mapElement.queryFeatures(this.queryMapa);
  }

  hayPkPrincipal():boolean{
    return true;
  }

  quitarPK(pkIdCalzada:number){
    let indexEliminar = this.dataSourceSolicitudes.data.findIndex(x => x.pk_id_calzada == pkIdCalzada)
    this.dataSourceSolicitudes.data.splice(indexEliminar, 1);
    if(this.dataSourceSolicitudes.data.length >0){
      this.dataSourceSolicitudes.data[0].aledanio = false;
    }
    this.dataSourceSolicitudes.data = this.dataSourceSolicitudes.data;

  }

  filaSelectedEvt(e:any){
    this.seleccionFila.emit(e);
  }

  getSeleccion(){
    return this.dataSourceSolicitudes.data;
  }

  cargaMapa(e:any){
    console.log('*****CARGA MAPA******',e);
  }

  pkSelectedEvt(e:any){
    console.log('UN PK SELECCIONADO',e);
  }

  pkClickedEvt(e:any){
    console.log(e);
    let pkIncluido = this.dataSourceSolicitudes.data.findIndex(x => x.pk_id_calzada == e['PK_ID_ELEMENTO']) != -1;
    if(pkIncluido){
      return;
    }
    let mentenimiento = this.solicitudesAforos.find(x => x.pk_id_calzada == e['PK_ID_ELEMENTO']);

    mentenimiento['aledanio'] = this.dataSourceSolicitudes.data.length != 0;
    console.log('El mantenimiento es', mentenimiento);
    this.dataSourceSolicitudes.data.push(mentenimiento);
    this.dataSourceSolicitudes.data = this.dataSourceSolicitudes.data;

  }

}
