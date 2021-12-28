import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultasMejoramientoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(public securityService:SecurityService, private http: HttpClient) { }

  consultaGeneralGestion(pkIdCalzada:string|null,
    idZona:number|null, idLocalidad:string|null, idBarrio:number|null, idUPZ:string|null,
    idTipoPrograma:number|null, idResponsableVisita:number|null, idActividad:number|null, fechaDesde:any|null,
    fechaHasta:any|null) {
    let url = '/SIGMA-backend-desa/api/consulta/consultarGeneralGestion';
    let body:any = {};
    body = {
      usuario: this.securityService.userSession.login,
    }

    if(pkIdCalzada){
      body['pkIdCalzada'] = pkIdCalzada;
    }
    if(idLocalidad){
      body['idLocalidad'] = idLocalidad;
    }
    if(idZona){
      body['idZona'] = idZona;
    }
    if(idBarrio){
      body['idBarrio'] = idBarrio;
    }if(idUPZ){
      body['idUPZ'] = idUPZ;
    }if(idTipoPrograma){
      body['idTipoPrograma'] = idTipoPrograma;
    }
    if(idResponsableVisita){
      body['idResponsableVisita'] = idResponsableVisita;
    }
    if(idActividad){
      body['idActividad'] = idActividad;
    }

    if(fechaDesde && fechaHasta){
      body['fechaFinGestionDesde'] = fechaDesde;
      body['fechaFinGestionHasta'] = fechaHasta;
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  consultaUltimoSeguimiento(pkIdCalzada:string|null,
    idZona:number|null, idLocalidad:number|null, idBarrio:number|null, idUPZ:string|null,
    idTipoPrograma:number|null, idResponsableVisita:number|null, idActividad:number|null, fechaDesde:any|null,
    fechaHasta:any|null) {
    let url = '/SIGMA-backend-desa/api/consulta/consultarSeguimientoUTL';
    let body:any = {};
    body = {
      usuario: this.securityService.userSession.login,
      pkIdCalzada: pkIdCalzada,
      idZona:idZona,
      idLocalidad:idLocalidad,
      idBarrio:idBarrio,
      idUPZ:idUPZ,
      idTipoPrograma:idTipoPrograma,
      idResponsableVisita:idResponsableVisita,
      idActividad:idActividad
    }
    if(fechaDesde && fechaHasta){
      body['fechaFinGestionDesde'] = fechaDesde;
      body['fechaFinGestionHasta'] = fechaHasta;
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  consultaSeguimiento(pkIdCalzada:string|null,
    idZona:number|null, idLocalidad:number|null, idBarrio:number|null, idUPZ:string|null,
    idTipoPrograma:number|null, idResponsableVisita:number|null, idActividad:number|null, fechaDesde:any|null,
    fechaHasta:any|null) {
    let url = '/SIGMA-backend-desa/api/consulta/consultarSeguimientos';
    let body:any = {};
    body = {
      usuario: this.securityService.userSession.login,
      pkIdCalzada: pkIdCalzada,
      idZona:idZona,
      idLocalidad:idLocalidad,
      idBarrio:idBarrio,
      idUPZ:idUPZ,
      idTipoPrograma:idTipoPrograma,
      idResponsableVisita:idResponsableVisita,
      idActividad:idActividad,
    }
    if(fechaDesde && fechaHasta){
      body['fechaFinGestionDesde'] = fechaDesde;
      body['fechaFinGestionHasta'] = fechaHasta;
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  consultaHistorialMejoramiento(pkIdCalzada:string|null,
    idZona:number|null, idLocalidad:string|null, idBarrio:number|null, codUPL:string|null,
    idTipoPrograma:number|null, idResponsableVisita:number|null, idActividad:number|null, fechaDesde:any|null,
    fechaHasta:any|null) {
    let url = '/SIGMA-backend-desa/api/consulta/consultarMantenimientoVial';
    let body:any = {};
    body = {
      usuario: this.securityService.userSession.login,
    }

    if(pkIdCalzada){
      body['pkIdCalzada'] = pkIdCalzada;
    }
    if(idLocalidad){
      body['idLocalidad'] = idLocalidad;
    }
    if(idZona){
      body['idZona'] = idZona;
    }
    if(idBarrio){
      body['idBarrio'] = idBarrio;
    }if(codUPL){
      body['idUPLA'] = codUPL;
    }if(idTipoPrograma){
      body['idTipoPrograma'] = idTipoPrograma;
    }
    if(idResponsableVisita){
      body['idResponsableVisita'] = idResponsableVisita;
    }
    if(idActividad){
      body['idTipoActividad'] = idActividad;
    }

    if(fechaDesde && fechaHasta){
      body['fechaVisitaTecnicaDesde'] = fechaDesde;
      body['fechaVisitaTecnicaHasta'] = fechaHasta;
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }
  getMantenimientoEventos(idMantenimiento:number){
    let url = '/SIGMA-backend-desa/api/consulta/mantenimientoVialEventos';

    let body = {
      usuario: this.securityService.userSession.login,
      idMantenimientoVial: idMantenimiento
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  getDocumentosMantenimiento(idMantenimiento:number){
    let url = '/SIGMA-backend-desa/api/consulta/mantenimientoVialDocumento';

    let body = {
      usuario: this.securityService.userSession.login,
      idMantenimientoVial: idMantenimiento
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  getArchivosMantenimiento(idMantenimiento:number){
    let url = '/SIGMA-backend-desa/api/consulta/archivosMantenimientoVial';
    let body = {
      usuario: this.securityService.userSession.login,
      idMantenimientoVial: idMantenimiento
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  getGestionesMantenimiento(idMantenimiento:number){
    let url = '/SIGMA-backend-desa/api/consulta/mantenimientoVialGestion';

    let body = {
      usuario: this.securityService.userSession.login,
      idMantenimientoVial: idMantenimiento
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  getActividadesMejoramiento(){
    let url = '/SIGMA-backend-desa/api/externo/consume';

    let body = {
      usuario: this.securityService.userSession.login,
      json: JSON.stringify({usuario: this.securityService.userSession.login,filtro:"id_tipo_proceso = 11"}),
      url: environment.URL_CALIOPE_BACK + "api/actividad/consultarXFiltro"
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }


}
