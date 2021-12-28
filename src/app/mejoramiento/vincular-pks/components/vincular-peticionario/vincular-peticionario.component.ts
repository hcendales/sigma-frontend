import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SecurityService } from 'src/app/core/security/services/security.service';
import { EntityTabMantenimientoVialService } from 'src/app/core/services/entity-tab-mantenimiento-vial.service';
import { VincularRadicadoService } from 'src/app/core/services/vincular-radicado.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { BuscarRadicadoComponent } from 'src/app/mejoramiento/gestion-reserva/components/buscar-radicado/buscar-radicado.component';
import { TablaVincularComponent } from '../tabla-vincular/tabla-vincular.component';
import { WebMapaUmvComponent } from '../web-mapa-umv/web-mapa-umv.component';
@Component({
  selector: 'app-vincular-peticionario',
  templateUrl: './vincular-peticionario.component.html',
  styleUrls: ['./vincular-peticionario.component.scss']
})
export class VincularPeticionarioComponent implements OnInit {
  mapCenter = [-74.113, 4.667];
  mapZoomLevel = 12;
  tipoRad = 'Entrada';
  public dataVinc:any[] = [];
  public routeReady :boolean = false;
  @ViewChild('buscarRadicado')
  buscarRadicado!: BuscarRadicadoComponent;
  @ViewChild('tablaPks')
  tablaVincular!: TablaVincularComponent;
  @ViewChild('mapa')
  mapa!: WebMapaUmvComponent;
  constructor(public entityMantenimientoService: EntityTabMantenimientoVialService,
    public vincularService: VincularRadicadoService,
    public tokenService: SecurityService,
    public router: Router,
    public dialog: MatDialog) { }


  ngOnInit(): void {
  }
  goToPk(event:any){
    console.log('mVin',event);
    this.mapa.goTo(event);
  }
  addMantenimientoPk(event:any){
    console.log("Mant: ",event);
    event.forEach((v:any)=>{
      this.tablaVincular.agregarPk(v,'Vincular Pks a peticionario');
      this.dataVinc = this.tablaVincular.dataSourceSolicitudes.data;
    });
  }
  vincular(){}
  processData(){
    this.routeReady = true;
    let dataD = {
      titulo: 'Vincular Pks a peticionario',
      cancelar: true,
      aceptar: false
    } as any;
    let requestArray: any[] = [];
    let peticionarioArray: any[] = [];
    let data = this.tablaVincular.dataSourceSolicitudes.data;
    //solicitud_radicado_entrada
    data.forEach(value => {
      console.log(value);
      let radicadoVinculado = {
              pkIdCalzada:value['PK_ID'],
              idTipoDestinoRadicado:11,
              numeroRadicado:this.buscarRadicado.radicadoStr,
              fechaRadicado:this.buscarRadicado.radicado.radi_fech_radi?this.buscarRadicado.radicado.radi_fech_radi:Date.now(),
              remitente:this.buscarRadicado.radicado.nombre_firmante?this.buscarRadicado.radicado.nombre_firmante:'',
              entidad:this.buscarRadicado.radicado.radi_nomb?this.buscarRadicado.radicado.radi_nomb:'',
              dirigidoA:"Julio",
              fechaVencimiento:this.buscarRadicado.radicado.fech_vcmto?this.buscarRadicado.radicado.fech_vcmto:Date.now(),
              fechaVinculacion:Date.now(),
              registroActivo:"SI"
              //idMantenimientoVial:{"idMantenimientoVial":idMantenimiento}
            }
           peticionarioArray.push(this.vincularService.insert(radicadoVinculado));
           //requestArray.push(this.entityMantenimientoService.insert({pkIdCalzada:value['pkId'],idTipoOrigen:value['origen']}));
    });
    forkJoin(peticionarioArray).toPromise().then((lista: any[]) => {
      console.log('Vinculated: ',lista);
      let strCont = '';
      lista.forEach((val:any, i:number)=>{
        strCont += 'pkId: ' + data[i]['PK_ID'] + ' * idRadicadoVinculado: ' + val.respuesta[0][':b1'] + ' \n ';
      });
      dataD['contenido'] = strCont;
      const dialogRef = this.dialog.open(SimpleDialogComponent,{
        data: dataD
      });
      dialogRef.afterClosed().subscribe(result => {
       //if (result.action=='cancelar')
        this.tablaVincular.dataSourceSolicitudes.data = [];
        this.dataVinc = [];
        this.routeReady = false;

      });
    });
  }
}
