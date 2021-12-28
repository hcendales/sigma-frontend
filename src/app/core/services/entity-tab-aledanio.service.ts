import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class EntityTabAledanioService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService:SecurityService, private http: HttpClient) { }

  public insertar(idMantenimientoVialEvento:number,pkIdCalzada:number,idMvEvento:number){
    let url = '/SIGMA-backend-desa/api/aledanio/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      aledanio:{
        idMantenimientoVialEvento:idMantenimientoVialEvento,
        pkIdCalzada:pkIdCalzada,
        idMvEvento:idMvEvento
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public actualizar(idPredisenioAledanio:number, idMantenimientoVialEvento:number,pkIdCalzada:number,idMvEvento:number){
    let url = '/SIGMA-backend-desa/api/aledanio/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      aledanio:{
        idPredisenioAledanio:idPredisenioAledanio,
        idMantenimientoVialEvento:idMantenimientoVialEvento,
        pkIdCalzada:pkIdCalzada,
        idMvEvento:idMvEvento
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public eliminar(idPredisenioAledanio:number){
    let url = '/SIGMA-backend-desa/api/aledanio/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      aledanio:{
        idPredisenioAledanio:idPredisenioAledanio,
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public consultarXFiltro(filtro:string){
    let url = '/SIGMA-backend-desa/api/aledanio/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro:filtro,
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public registrar(pkIdCalzada:number,idMvEvento:number){
    let url = '/SIGMA-backend-desa/api/aledanio/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      aledanio:{
        pkIdCalzada:pkIdCalzada,
        idMvEvento:idMvEvento
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

}
