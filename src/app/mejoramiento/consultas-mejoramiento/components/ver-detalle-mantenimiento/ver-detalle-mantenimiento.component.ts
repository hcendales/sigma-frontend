import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultasMejoramientoService } from 'src/app/core/services/consultas-mejoramiento.service';
import {Location} from '@angular/common';
import { EntityTabArchivoServiceService } from 'src/app/core/services/entity-tab-archivo-service.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ver-detalle-mantenimiento',
  templateUrl: './ver-detalle-mantenimiento.component.html',
  styleUrls: ['./ver-detalle-mantenimiento.component.scss']
})
export class VerDetalleMantenimientoComponent implements OnInit {
  active = 0;
  docsColumns: string[] = [
    'id_documento', 'descripcion_tipo_documento', 'descripcion_estado_documento', 'fecha_documento', 'descripcion', 'url_archivo'
  ];
  gestionColumns: string[] = [
    'id_proceso_gestion', 'nombre_actividad', 'fecha_asignacion', 'fecha_vencimiento', 'nombre_usuario', 'estado_gestion'
  ];
  objEventos: any[];
  idMantenimiento:number;
  idMantenimientoEvento:number;
  ready:boolean;
  urlFileStorage:string = environment.URL_DOCUMENTOS;
  docsDataSource!: MatTableDataSource<any>;
  readyDocs: boolean;
  readyGestion: boolean;
  gestionDataSource!: MatTableDataSource<any>;
  currentTabIndex: any;
  listaGestiones: any[];
  idDocumento:number = -1;

  constructor(private activatedroute:ActivatedRoute,
    private router: Router,
    private consultasMejoramientoService:ConsultasMejoramientoService,
    private archivosService: EntityTabArchivoServiceService,
    private _location: Location) {
    this.objEventos = [];
    this.listaGestiones = [];
    this.idMantenimiento = 0;
    this.idMantenimientoEvento = 0;
    this.currentTabIndex = 0;
    this.ready = false;
    this.readyDocs = false;
    this.readyGestion = false;
  }

  ngOnInit(): void {

    this.ready = false;
    this.activatedroute.paramMap.subscribe(params => {
      this.idMantenimiento =  Number(params.get('idMantenimiento'));
      if(!this.idMantenimiento){
        console.error('No hay ningún id de mantenimiento definido');
      }
      this.ready = true;
      this.consultasMejoramientoService.getMantenimientoEventos(this.idMantenimiento).then((resp: any) => {
        
        this.objEventos = resp.respuesta;
        let diagEvt = resp.respuesta.filter((evt:any)=>{
          return evt.evento == 'DIAGNOSTICO';
        });
        console.log('de ', diagEvt);
        console.log('cd ', this.objEventos);
        this.idMantenimientoEvento = diagEvt[this.currentTabIndex]['id_mantenimiento_vial_evento'];
        this.idDocumento = diagEvt[this.currentTabIndex]['id_documento_visita'];
      });
    });

  }
  async onTabChange(e: any){
    if(e == -1){
      return;
    }
    //this.tipoRad = 'Salida'
    this.currentTabIndex = e;
    this.idMantenimientoEvento = this.objEventos[this.currentTabIndex]['id_mantenimiento_vial_evento'];
    this.idDocumento = this.objEventos[this.currentTabIndex]['id_documento_visita'];
    console.log('ic ', this.idMantenimientoEvento);
    console.log('tabIdx: ',this.currentTabIndex);
    console.log('tabObj: ',this.objEventos[e]);
    this.listaGestiones = [];
    //let resp = await this.consultasMejoramientoService.listarBandejaGestionTransicion(11,Number(this.transiciones[this.currentTabIndex]["id_actividad_transicion"]));
    this.consultasMejoramientoService.getDocumentosMantenimiento(this.idMantenimientoEvento).then((resp: any) => {
      this.docsDataSource = new MatTableDataSource(resp.respuesta);
      console.log('docObj: ',resp.respuesta);
      this.readyDocs = true;
    });
    this.consultasMejoramientoService.getArchivosMantenimiento(this.idMantenimientoEvento).then((resp: any) => {
      this.docsDataSource = new MatTableDataSource(resp.respuesta);
      console.log('docFile: ',resp.respuesta);
      this.readyDocs = true;
    });
    this.consultasMejoramientoService.getGestionesMantenimiento(this.idMantenimientoEvento).then((resp: any) => {
      this.gestionDataSource = new MatTableDataSource(resp.respuesta);
      this.readyGestion = true;
    });
  }
  async docClick(docu:any){
    let res = await this.archivosService.consultarDocumentoAdjunto(docu.id_documento);
    const blob = new Blob([res.body as BlobPart], { type: 'application/PDF' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
  backClicked() {
    this._location.back();
  }

}
