import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SecurityService } from 'src/app/core/security/services/security.service';
import { EntityTabMantenimientoVialService } from 'src/app/core/services/entity-tab-mantenimiento-vial.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { TablaVincularComponent } from '../tabla-vincular/tabla-vincular.component';

@Component({
  selector: 'app-asignar-misionalidad',
  templateUrl: './asignar-misionalidad.component.html',
  styleUrls: ['./asignar-misionalidad.component.scss']
})
export class AsignarMisionalidadComponent implements OnInit {
    mapCenter = [-74.113, 4.667];
    mapZoomLevel = 12;
    strStep:string = '';
    public dataVinc:any[] = [];
    public routeReady :boolean = false;

    @ViewChild('tablaPks')
    tablaVincular!: TablaVincularComponent;
    tipoOrigen: string | undefined;
    strActividad: string | undefined;

    constructor(public entityMantenimientoService: EntityTabMantenimientoVialService,
      public tokenService: SecurityService,
      public router: Router,
      public dialog: MatDialog) { }


    ngOnInit(): void {
      this.tipoOrigen = "373";
     }

    addMantenimientoPk(event:any){
      console.log("Mant: ",event);
     event.forEach((v:any)=>{
       this.tablaVincular.agregarPk(v,'Asignar Pks a Misionalidad');
       this.dataVinc = this.tablaVincular.dataSourceSolicitudes.data;
     });
    }
    selTipoOrigen() {
      if(this.tipoOrigen == "373")
        this.strActividad = "Programar visita técnica";
      else
        this.strActividad = "Vincular salida";
    }
    processData(){
      this.routeReady = true;
      let dataD = {
        titulo: 'Asignar Pks a Misionalidad',
        cerrar:true,
        cancelar: false,
        aceptar: false
      } as any;
      let requestArray: any[] = [];
      let peticionarioArray: any[] = [];
      let data = this.tablaVincular.dataSourceSolicitudes.data;
      data.forEach(value => {
        console.log('sel pk:', value);
          this.strStep = "Creando gestión de mantenimiento (Solicitar Programación)";
          requestArray.push(this.entityMantenimientoService.insert({pkIdCalzada:value['PK_ID'],idTipoOrigen:Number(this.tipoOrigen)}));
      });
      forkJoin(requestArray).toPromise().then((lista: any[]) => {
        console.log('Vinculated: ',lista);
        let strCont = '';
        console.log('Created: ',lista);
        this.strStep = "Actualizando peticionario (Vinculando salida)";
        requestArray = [];
        lista.forEach((val:any, i:number)=>{
          //let idMantenimiento = val.respuesta[0].id_mantenimiento_vial_evento;
          //let idGestion = val.respuesta[0].id_proceso_gestion;
          //let idDocumento = val.respuesta[0].id_documento;
          strCont += 'pkId: ' + data[i]['PK_ID'] + ' * idMant: ' + val.respuesta[0].id_mantenimiento_vial_evento + ' \n ';
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
