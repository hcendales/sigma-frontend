import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AforoAnalisis } from '../../models/AforoAnalisis';
import { AforoCalzada } from '../../models/AforoCalzada';
import { EntityTabAforoService } from '../../../../core/services/entity-tab-aforo.service';
import { UtilitariosService } from '../../../../core/services/utilitarios.service';
import { SolicitudEnsayoLaboratorioService } from '../../../../core/services/solicitud-ensayo-laboratorio.service';
import { MantenimientoVialEventoService } from '../../../../core/services/mantenimiento-vial-evento.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-analisis-transito',
  templateUrl: './analisis-transito.component.html',
  styleUrls: ['./analisis-transito.component.scss']
})
export class AnalisisTransitoComponent implements OnInit {

 // @ViewChild('paginatorAnalisis') paginator: MatPaginator;

  @Input() aforo:any = {} as any;

  @Input() listaMant:any[] = [];

  @Output() cerrar = new EventEmitter<boolean>();
  @Output() finProceso = new EventEmitter<boolean>();

  @ViewChild('paginatorAnalisis') paginatorAnalisis: any;

  desplegarInfo: boolean = false;
  textoModalInfo: String = '';

  dataSourceAnalisis: MatTableDataSource<any> = new MatTableDataSource<any>();
  
  displayedColumnsRegistroAforos = ['periodo_disenio', 'anio','tpd','buses_van', 'buses_buseta', 'buses_sitp_alimentadores', 'camiones_c2p', 'camiones_c2g', 'camiones_c3_c4', 'camiones_c5_c5', 'vc_acumulados', 'nee_anios', 'nee_acumulados'];

  observaciones:String = '';
  enEspera:boolean = false;
  error:any = {};
  analisisReferencias:string = '';
  analisisObservaciones:string = '';
  generandoEstudios:boolean = false;

  

  constructor(private entityTabAforoService:EntityTabAforoService, private utilitariosService:UtilitariosService, private mantenimientoVialEventoService:MantenimientoVialEventoService, private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    console.log('elAforo', this.aforo);
    this.dataSourceAnalisis.paginator = this.paginatorAnalisis;
    this.analisisReferencias = this.aforo.analisis_referencias;
  }

  async generarEstudio(){
    this.generandoEstudios = true;
    this.aforo.analisis_referencias = this.analisisReferencias;
    this.aforo.analisis_nee_8_2 = this.dataSourceAnalisis.data[this.aforo.anios_8_2].nee_acumulados;
    this.aforo.analisis2_nee_8_2 = this.dataSourceAnalisis.data[this.aforo.anios2_8_2].nee_acumulados;
    this.aforo.analisis_tpd_v_comerciales_3_5 = this.dataSourceAnalisis.data[this.aforo.anios_3_5].vc_acumulados;
    //actualiza el aforo
    this.entityTabAforoService.actualizar(this.transformAforoObj(this.aforo));
    //crea los documentos que tendrán los pdf del aforo y del estudio
    let peticiones = [this.entityTabAforoService.crearDocumento(8038),this.entityTabAforoService.crearDocumento(252)];
    let respServ = await forkJoin(peticiones).toPromise();
    console.log('la resp Serv', respServ);
    for(let r of respServ){
      if(r.codError != 0){
        console.error(r.msgError);
        this.generandoEstudios = false;
        return;
      }
    }
    console.log('Documentos creados');
    
    let idsDocumentos = respServ.map((x:any) =>{ return x.respuesta[0].id_documento});
    let peticionesMantDocu = idsDocumentos.map((x:any) => {return this.utilitariosService.asociarDocumentoAMantenimiento(x,this.listaMant[0].id_mantenimiento_vial)})
    let respAsociaciones = await forkJoin(peticionesMantDocu).toPromise();
    for(let r of respAsociaciones){
      if(r.codError != 0){
        console.error(r.msgError);
        this.generandoEstudios = false;
        return;
      }
    }
    console.log('Documentos asociados');
    let idDocuAforo = respServ[0].respuesta[0].id_documento;
    let idDocuAnalisis = respServ[1].respuesta[0].id_documento;
    
    //genera los PDF y los asocia al documento y mantenimiento vial
    let peticionesPDFAforo = this.listaMant.map((x:any) => {return this.utilitariosService.generarFichaAforo(this.aforo.id_aforo,idDocuAforo,x.id_mantenimiento_vial)});
    let peticionesPDFAnalisis = this.listaMant.map((x:any) => {return this.utilitariosService.generarFichaAnalisis(this.aforo.id_aforo,idDocuAnalisis,x.id_mantenimiento_vial)});

    try{
      let respPdf = await forkJoin([...peticionesPDFAforo,...peticionesPDFAnalisis]).toPromise();
      this.generandoEstudios = false;
      //abre los PDF resultantes
      const blobAforo = new Blob([respPdf[0].body as BlobPart], { type: 'application/PDF' });
      const blobAnalisis = new Blob([respPdf[respPdf.length-1].body as BlobPart], { type: 'application/PDF' });
      const urlAforo= window.URL.createObjectURL(blobAforo);
      const urlAnalisis= window.URL.createObjectURL(blobAnalisis);
      window.open(urlAforo);
      window.open(urlAnalisis); 
      console.log('DocsFisicos generados'); 
      let peticionesActualizacion = this.listaMant.map((x:any) => {return this.mantenimientoVialEventoService.actualizarCampo(x.id_mantenimiento_vial_evento,'respuesta_aforo;','SI;')});
      forkJoin(peticionesActualizacion).toPromise().then(
        (x:any[]) => {
          for(let r of x){
            if(r.codError != 0){
              this.snackBar.open('Hubo un error al actualizar el mentenimiento', 'X', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }
          }
        }
      );
      this.finProceso.emit();
      this.snackBar.open('Aforo y análisis generados correctamente', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }catch(e){
      this.snackBar.open('Hubo un error al completar el proceso', 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  async realizarAnalisis(){
    console.log('AFOROO',this.aforo);
    this.entityTabAforoService.actualizar(this.transformAforoObj(this.aforo));
    let res = await this.entityTabAforoService.calcularAnalisisTransito(this.aforo.id_aforo);
    if(res.codError == 0){
      this.dataSourceAnalisis.data = [...res.respuesta];
    }else{
      this.snackBar.open(res.msgError, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  //transforma el objeto de respuesta de aforos a objeto de salida, ya que los atributos son diferentes
  transformAforoObj(aforo:any){
    let res = {
               idAforo: aforo.id_aforo,
               idCargue: aforo.id_cargue,
               fechaAforo: aforo.fecha_aforo,
               digital: aforo.digital,
               tpdTotal: aforo.tpd_total,
               analisisNee82: aforo.analisis_nee_8_2,
               anios82: aforo.anios_8_2,
               analisis2Nee82: aforo.analisis2_nee_8_2,
               anios282: aforo.anios2_8_2,
               analisisTpdVComerciales35: aforo.analisis_tpd_v_comerciales_3_5,
               anios35: aforo.anios_3_5,
               automoviles: aforo.t_automoviles,
               busesVan: aforo.t_buses_van,
               busesBuseta: aforo.t_buses_buseta,
               busesSitpAlimentadores: aforo.t_buses_sitp_alimentadores,
               camionesC2p: aforo.t_camiones_c2p,
               camionesC2g: aforo.t_camiones_c2g,
               camionesC3C4: aforo.t_camiones_c3_c4,
               camionesC5C5: aforo.t_camiones_c5_c5,
               vcAcumulados: aforo.t_vc_acumulados,
               fdBusesBusetas: aforo.fd_buses_busetas,
               fdC2g: aforo.fd_c2g,
               fdC2p: aforo.fd_c2p,
               fdC3C4: aforo.fd_c3_c4,
               fdC5C5: aforo.fd_c5_c5,
               fdSitpAlimentadores: aforo.fd_sitp_alimentadores,
               fdVan:aforo.fd_van,
               tasaCrecimientoR:aforo.tasa_crecimiento_r,
               factorDireccionalFd:aforo.factor_direccional_fd,
               factorDistribucionCarrilFdc:aforo.factor_distribucion_carril_fdc,
               analisisReferencias:aforo.analisis_referencias,
               analisisObservaciones:this.analisisObservaciones,
     };
     return res;
  }

}
