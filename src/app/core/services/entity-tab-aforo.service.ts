import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntityTabAforoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService:SecurityService, private http: HttpClient) {
    
  }

  public consultarXFiltro(filtro:string){
    let url = '/SIGMA-backend-desa/api/aforo/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro:filtro
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  
  public nuevoAforo(aforo:any){
    let url = '/SIGMA-backend-desa/api/aforo/nuevoAforo';
    let body = {
      usuario: this.securityService.userSession.login,
      aforo:aforo
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public insertar(aforo:any){
    let url = '/SIGMA-backend-desa/api/aforo/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      aforo:aforo
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public actualizar(aforo:any){
    let url = '/SIGMA-backend-desa/api/aforo/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      aforo:aforo
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public eliminar(idAforo:number){
    let url = '/SIGMA-backend-desa/api/aforo/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      aforo:{idAforo:idAforo}
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public calcularAnalisisTransito(idAforo:number){
    let url = '/SIGMA-backend-desa/api/aforo/calcularAnalisisTransito';
    let body = {
      usuario: this.securityService.userSession.login,
      aforo:{idAforo:idAforo}
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  public async crearDocumento(idTipoDocumento: number) {

    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      url: environment.URL_CALIOPE_BACK + "api/documento/insertar",
      usuario: this.securityService.userSession.login,
      json: JSON.stringify({

        usuario: this.securityService.userSession.login,
        documento: {
          registroActivo: "SI",
          idTipoDocumento: idTipoDocumento,
          idTipoEstadoDocumento: 1041,
          fecha: Date.now(),
        }
      }),
    }

    const response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    return JSON.parse(response.respuesta[0].json);
    
  }

  insertarAforoCalzada(aforoCalzada:any){
    let url = '/SIGMA-backend-desa/api/aforo/aforocalzada/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      aforocalzada:{
        idAforo:{idAforo:aforoCalzada.idAforo},
        pkIdCalzada:aforoCalzada.pkIdCalzada,
        aledanio:aforoCalzada.aledanio,
        civ:aforoCalzada.civ,
        ejeVial:aforoCalzada.ejeVial,
        desde: aforoCalzada.desde,
        hasta: aforoCalzada.hasta,
        idLocalidad: aforoCalzada.idLocalidad,
        descripcionLocalidad: aforoCalzada.descripcionLocalidad,
        idTipoSuperficie: aforoCalzada.idTipoSuperficie,
        descripcionTipoSuperficie: aforoCalzada.descripcionTipoSuperficie
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }


}
