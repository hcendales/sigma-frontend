import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEntityService } from './i-entity-service';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoVialEventoService {


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  async get(idEntity: number): Promise<any> {
    let url = '/SIGMA-backend-desa/api/mantenimientovialevento/consultarId';
    let body = {
      usuario: this.securityService.userSession.login,
      mantenimientoVialEvento:{idMantenimientoVialEvento:idEntity}
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  actualizarCampo(idEntity: number, keyField: string, valueField: string) {
   let url = '/SIGMA-backend-desa/api/mantenimientovialevento/actualizarCampo';
   let body = {
     usuario: this.securityService.userSession.login,
     mantenimientoVialEvento:{idMantenimientoVialEvento:idEntity},
     nombreCampo: keyField.substring(0,keyField.length-1),
     valorCampo: valueField.substring(0,valueField.length-1)
   }
   console.log('Body: ', body);
   return this.http.post<any>(url, body , this.httpOptions).toPromise();
 }

 update (mantenimientoVialEvento:any){
    let url = '/SIGMA-backend-desa/api/mantenimientovialevento/actualizar';
    let evento = {} as any;
    let body = {
      usuario: this.securityService.userSession.login,
      mantenimientoVialEvento:evento
    }
    if(mantenimientoVialEvento.idMantenimientoVialEvento!=null){evento['idMantenimientoVialEvento'] = mantenimientoVialEvento.idMantenimientoVialEvento;}
    if(mantenimientoVialEvento.evento!=null){evento['evento'] =mantenimientoVialEvento.evento;}
    if(mantenimientoVialEvento.fechaCreacionEvento!=null){evento['fechaCreacionEvento'] =mantenimientoVialEvento.fechaCreacionEvento;}
    if(mantenimientoVialEvento.fechaVisita!=null){evento['fechaVisita'] =mantenimientoVialEvento.fechaVisita;}
    if(mantenimientoVialEvento.idResponsableVisita!=null){evento['idResponsableVisita'] =mantenimientoVialEvento.idResponsableVisita;}
    if(mantenimientoVialEvento.idDocumentoVisita!=null){evento['idDocumentoVisita'] =mantenimientoVialEvento.idDocumentoVisita;}
    if(mantenimientoVialEvento.observaciones!=null){evento['observaciones'] =mantenimientoVialEvento.observaciones;}
    if(mantenimientoVialEvento.anchoPk!=null){evento['anchoPk'] =mantenimientoVialEvento.anchoPk;}
    if(mantenimientoVialEvento.areaPk!=null){evento['areaPk'] =mantenimientoVialEvento.areaPk;}
    if(mantenimientoVialEvento.longitudHorizontalPk!=null){evento['longitudHorizontalPk'] =mantenimientoVialEvento.longitudHorizontalPk;}
    if(mantenimientoVialEvento.idTipoUsoVia!=null){evento['idTipoUsoVia'] =mantenimientoVialEvento.idTipoUsoVia;}
    if(mantenimientoVialEvento.idTipoMalla!=null){evento['idTipoMalla'] =mantenimientoVialEvento.idTipoMalla;}
    if(mantenimientoVialEvento.idTipoSuperficie!=null){evento['idTipoSuperficie'] =mantenimientoVialEvento.idTipoSuperficie;}
    if(mantenimientoVialEvento.ejeVial!=null){evento['ejeVial'] =mantenimientoVialEvento.ejeVial;}
    if(mantenimientoVialEvento.desde!=null){evento['desde'] =mantenimientoVialEvento.desde;}
    if(mantenimientoVialEvento.hasta!=null){evento['hasta'] =mantenimientoVialEvento.hasta;}
    if(mantenimientoVialEvento.rutasTransporte!=null){evento['rutasTransporte'] =mantenimientoVialEvento.rutasTransporte;}
    if(mantenimientoVialEvento.posibleDanioRedes!=null){evento['posibleDanioRedes'] =mantenimientoVialEvento.posibleDanioRedes;}
    if(mantenimientoVialEvento.idTipoTransitabilidad!=null){evento['idTipoTransitabilidad'] =mantenimientoVialEvento.idTipoTransitabilidad;}
    if(mantenimientoVialEvento.idTipoImpactoSocial!=null){evento['idTipoImpactoSocial'] =mantenimientoVialEvento.idTipoImpactoSocial;}
    if(mantenimientoVialEvento.idTipoDeterminacionInterv!=null){evento['idTipoDeterminacionInterv'] =mantenimientoVialEvento.idTipoDeterminacionInterv;}
    if(mantenimientoVialEvento.idTipoCoordinacionInterinst!=null){evento['idTipoCoordinacionInterinst'] =mantenimientoVialEvento.idTipoCoordinacionInterinst;}
    if(mantenimientoVialEvento.idTipoAporteMetas!=null){evento['idTipoAporteMetas'] =mantenimientoVialEvento.idTipoAporteMetas;}
    if(mantenimientoVialEvento.pci!=null){evento['pci'] =mantenimientoVialEvento.pci;}
    if(mantenimientoVialEvento.kmCarrilImpacto!=null){evento['kmCarrilImpacto'] =mantenimientoVialEvento.kmCarrilImpacto;}
    if(mantenimientoVialEvento.kmCarrilObra!=null){evento['kmCarrilObra'] =mantenimientoVialEvento.kmCarrilObra;}
    if(mantenimientoVialEvento.kmCarril!=null){evento['kmCarril'] =mantenimientoVialEvento.kmCarril;}
    if(mantenimientoVialEvento.kmLineal!=null){evento['kmLineal'] =mantenimientoVialEvento.kmLineal;}
    if(mantenimientoVialEvento.requiereAforo!=null){evento['requiereAforo'] =mantenimientoVialEvento.requiereAforo;}
    if(mantenimientoVialEvento.requiereApiques!=null){evento['requiereApiques'] =mantenimientoVialEvento.requiereApiques;}
    if(mantenimientoVialEvento.solicitudesAdicionales!=null){evento['solicitudesAdicionales'] =mantenimientoVialEvento.solicitudesAdicionales;}
    if(mantenimientoVialEvento.observacionAdicionales!=null){evento['observacionAdicionales'] =mantenimientoVialEvento.observacionAdicionales;}
    if(mantenimientoVialEvento.viableIntervencion!=null){evento['viableIntervencion'] =mantenimientoVialEvento.viableIntervencion;}
    if(mantenimientoVialEvento.idTipoClasificacionSubrasant!=null){evento['idTipoClasificacionSubrasant'] =mantenimientoVialEvento.idTipoClasificacionSubrasant;}
    if(mantenimientoVialEvento.idTipoSuperficieDisenio!=null){evento['idTipoSuperficieDisenio'] =mantenimientoVialEvento.idTipoSuperficieDisenio;}
    if(mantenimientoVialEvento.idTipoIntervencionFinalDisenio!=null){evento['idTipoIntervencionFinalDisenio'] =mantenimientoVialEvento.idTipoIntervencionFinalDisenio;}
    if(mantenimientoVialEvento.idTipoMetodologiaDisenio!=null){evento['idTipoMetodologiaDisenio'] =mantenimientoVialEvento.idTipoMetodologiaDisenio;}
    if(mantenimientoVialEvento.idTipoMaterialGranular!=null){evento['idTipoMaterialGranular'] =mantenimientoVialEvento.idTipoMaterialGranular;}
    if(mantenimientoVialEvento.espesorDisenio!=null){evento['espesorDisenio'] =mantenimientoVialEvento.espesorDisenio;}
    if(mantenimientoVialEvento.cbrInicialPct!=null){evento['cbrInicialPct'] =mantenimientoVialEvento.cbrInicialPct;}
    if(mantenimientoVialEvento.cbrDisenioPct!=null){evento['cbrDisenioPct'] =mantenimientoVialEvento.cbrDisenioPct;}
    if(mantenimientoVialEvento.ksDisenio!=null){evento['ksDisenio'] =mantenimientoVialEvento.ksDisenio;}
    if(mantenimientoVialEvento.neeDisenio!=null){evento['neeDisenio'] =mantenimientoVialEvento.neeDisenio;}
    if(mantenimientoVialEvento.tpdvcDisenio!=null){evento['tpdvcDisenio'] =mantenimientoVialEvento.tpdvcDisenio;}
    if(mantenimientoVialEvento.numeroEstructuralEfectivoDisenio!=null){evento['numeroEstructuralEfectivoDisenio'] =mantenimientoVialEvento.numeroEstructuralEfectivoDisenio;}
    if(mantenimientoVialEvento.idTipoGeosinteticos!=null){evento['idTipoGeosinteticos'] =mantenimientoVialEvento.idTipoGeosinteticos;}
    if(mantenimientoVialEvento.idTipoSistemaDrenaje!=null){evento['idTipoSistemaDrenaje'] =mantenimientoVialEvento.idTipoSistemaDrenaje;}
    if(mantenimientoVialEvento.idTipoPrograma!=null){evento['idTipoPrograma'] =mantenimientoVialEvento.idTipoPrograma;}
    if(mantenimientoVialEvento.idTipoEstrategia!=null){evento['idTipoEstrategia'] =mantenimientoVialEvento.idTipoEstrategia;}
    if(mantenimientoVialEvento.idTipoAdministracion!=null){evento['idTipoAdministracion'] =mantenimientoVialEvento.idTipoAdministracion;}
    if(mantenimientoVialEvento.idTipoRequerimiento!=null){evento['idTipoRequerimiento'] =mantenimientoVialEvento.idTipoRequerimiento;}
    if(mantenimientoVialEvento.idTipoActividadDetallada!=null){evento['idTipoActividadDetallada'] =mantenimientoVialEvento.idTipoActividadDetallada;}
    if(mantenimientoVialEvento.idTipoIntervencionTotal!=null){evento['idTipoIntervencionTotal'] =mantenimientoVialEvento.idTipoIntervencionTotal;}
    if(mantenimientoVialEvento.codigoActividadAgrupada!=null){evento['codigoActividadAgrupada'] =mantenimientoVialEvento.codigoActividadAgrupada;}
    if(mantenimientoVialEvento.indicePriorizacion!=null){evento['indicePriorizacion'] =mantenimientoVialEvento.indicePriorizacion;}
    if(mantenimientoVialEvento.priorizacionTrimestre!=null){evento['priorizacionTrimestre'] =mantenimientoVialEvento.priorizacionTrimestre;}
    if(mantenimientoVialEvento.idTipoIntervencion!=null){evento['idTipoIntervencion'] =mantenimientoVialEvento.idTipoIntervencion;}
    if(mantenimientoVialEvento.intervencionHuecos!=null){evento['intervencionHuecos'] =mantenimientoVialEvento.intervencionHuecos;}
    if(mantenimientoVialEvento.fechaInicio!=null){evento['fechaInicio'] =mantenimientoVialEvento.fechaInicio;}
    if(mantenimientoVialEvento.fechaEjecucion!=null){evento['fechaEjecucion'] =mantenimientoVialEvento.fechaEjecucion;}
    if(mantenimientoVialEvento.fechaSuspension!=null){evento['fechaSuspension'] =mantenimientoVialEvento.fechaSuspension;}
    if(mantenimientoVialEvento.fechaTerminacion!=null){evento['fechaTerminacion'] =mantenimientoVialEvento.fechaTerminacion;}
    if(mantenimientoVialEvento.fechaSeguimiento!=null){evento['fechaSeguimiento'] =mantenimientoVialEvento.fechaSeguimiento;}
    if(mantenimientoVialEvento.idDirectorObra!=null){evento['idDirectorObra'] =mantenimientoVialEvento.idDirectorObra;}
    if(mantenimientoVialEvento.idResidenteObra!=null){evento['idResidenteObra'] =mantenimientoVialEvento.idResidenteObra;}
    if(mantenimientoVialEvento.idResidenteSocial!=null){evento['idResidenteSocial'] =mantenimientoVialEvento.idResidenteSocial;}
    if(mantenimientoVialEvento.idResidenteSst!=null){evento['idResidenteSst'] =mantenimientoVialEvento.idResidenteSst;}
    if(mantenimientoVialEvento.idResidenteAmbiental!=null){evento['idResidenteAmbiental'] =mantenimientoVialEvento.idResidenteAmbiental;}
    if(mantenimientoVialEvento.idIngenieroDisenio!=null){evento['idIngenieroDisenio'] =mantenimientoVialEvento.idIngenieroDisenio;}
    if(mantenimientoVialEvento.idIngenieroApoyo!=null){evento['idIngenieroApoyo'] =mantenimientoVialEvento.idIngenieroApoyo;}
    if(mantenimientoVialEvento.requiereActualizacionDiag!=null){evento['requiereActualizacionDiag'] =mantenimientoVialEvento.requiereActualizacionDiag;}
    if(mantenimientoVialEvento.numeroRadicadoIntervencion!=null){evento['numeroRadicadoIntervencion'] =mantenimientoVialEvento.numeroRadicadoIntervencion;}
    if(mantenimientoVialEvento.fechaRadicadoIntervencion!=null){evento['fechaRadicadoIntervencion'] =mantenimientoVialEvento.fechaRadicadoIntervencion;}
    if(mantenimientoVialEvento.numeroRadicadoSolReserva!=null){evento['numeroRadicadoSolReserva'] =mantenimientoVialEvento.numeroRadicadoSolReserva;}
    if(mantenimientoVialEvento.fechaRadicadoSolReserva!=null){evento['fechaRadicadoSolReserva'] =mantenimientoVialEvento.fechaRadicadoSolReserva;}
    if(mantenimientoVialEvento.numeroRadicadoResReserva!=null){evento['numeroRadicadoResReserva'] =mantenimientoVialEvento.numeroRadicadoResReserva;}
    if(mantenimientoVialEvento.fechaRadicadoResReserva!=null){evento['fechaRadicadoResReserva'] =mantenimientoVialEvento.fechaRadicadoResReserva;}
    if(mantenimientoVialEvento.enSeguimiento!=null){evento['enSeguimiento'] =mantenimientoVialEvento.enSeguimiento;}

    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // List: Lista según condición enviada
  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/mantenimientovialevento/consultarxfiltro';
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  crearMantenimientoVialEvento(idMantenimientoVial:number,tipoevento:string){
    const url = '/SIGMA-backend-desa/api/mantenimientovialevento/crearMantenimientoVialEvento';
    const body = {
      usuario: this.securityService.userSession.login,
      mantenimientoVialEvento: {
        idMantenimientoVialEvento:idMantenimientoVial,
        evento: tipoevento,
      },

    };
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }


}
