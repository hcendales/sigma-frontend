import { Injectable } from '@angular/core';
import { SecurityService } from '../security/services/security.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transiciones } from '../models/transiciones';

@Injectable({
  providedIn: 'root'
})
export class GestionService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  obtenerActividadesDestino (idProcesoGestion: number) {
    let url = '/SIGMA-backend-desa/api/gestion/obtenerActividadesDestino';
    let body = {
      usuario: this.securityService.userSession.login,
      idProcesoGestion: idProcesoGestion
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  avanzarMantenimientoVial (idProcesoGestion: number,
                                  idActividadTransicion:number,
                                  idUsuarioDestino:number,
                                  observacion:string,
                                  enviarCorreo:boolean) {
    let url = '/SIGMA-backend-desa/api/gestion/avanzarMantenimientoVial';
    let body = {
      usuario: this.securityService.userSession.login,
      idProcesoGestion: idProcesoGestion,
      idActividadTransicion: idActividadTransicion,
      idUsuario:idUsuarioDestino,
      observacion: observacion,
      enviarCorreo:enviarCorreo?'SI':'NO'
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  avanzarMantenimientoMasivo(idsProcesoGestion: number[],idActividadTransicion:number,observacion:string,enviarCorreo:boolean, idUsuarioDestino:number){
    let url = '/SIGMA-backend-desa/api/gestion/avanzarMantenimientoVialMasivo';
    let body = {
      usuario: this.securityService.userSession.login,
      ids: idsProcesoGestion,
      idActividadTransicion: idActividadTransicion,
      observacion: observacion,
      enviarCorreo:enviarCorreo?'SI':'NO'
    } as any;
    if(idUsuarioDestino){
      body['idUsuario'] = idUsuarioDestino;
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  obtenerUsuariosParaAsignarPorActividad (idProcesoGestion: number,
                                  idActividadTransicion:number) {
    let url = '/SIGMA-backend-desa/api/gestion/obtenerUsuariosParaAsignarPorActividad';
    let body = {
      usuario: this.securityService.userSession.login,
      idProcesoGestion: idProcesoGestion,
      idActividadTransicion: idActividadTransicion
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  listarBandejaGestionPendiente(idActividad:number){
    let url = '/SIGMA-backend-desa/api/gestion/listarBandejaGestionPendiente';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idActividad: idActividad,
    }
    console.log('el body',body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  listarBandejaGestionTransicion(idActividad:number, idActividadTransicion: number, filtro?:any){
    let url = '/SIGMA-backend-desa/api/gestion/obtenerGestionPendientePorTransicion';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idActividad: idActividad,
      idActividadTransicion: idActividadTransicion,
      pkIdCalzada: filtro?.pkIdCalzada,
      idLocalidad: filtro?.idLocalidad,
      idBarrio: filtro?.idBarrio,
      idOrigen: filtro?.idOrigen,
      codigoActividadAgrupada:filtro?.codigoActividadAgrupada,
    }
    // console.log('el body',body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  listarTransicionesPorActividad(idActividad: number){
    let url = '/SIGMA-backend-desa/api/gestion/obtenerTransicionesPorActividad';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idActividad: idActividad,
    }
    // console.log('el body',body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

}
