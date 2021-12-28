import { Injectable } from '@angular/core';
import { SecurityService } from '../security/services/security.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilitariosService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient){}

  calcularPCI (idMantenimentoVial: number, idTipoSuperficie: number, idTipoOrigen:number, pkIdCalzada: number) {

    let url = '/SIGMA-backend-desa/api/mantenimientovialevento/calcularPCI';
    let body = {
      usuario: this.securityService.userSession.login,
      mantenimientoVialEvento:{
        idMantenimientoVialEvento:idMantenimentoVial,
        idTipoSuperficie:idTipoSuperficie,
        idTipoOrigen:idTipoOrigen,
        pkIdCalzada:pkIdCalzada,
      },
      idUsuario: this.securityService.userSession.idUsuario,
      //observacion:"Prueba",
      //solicitudRadicado:102020
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  consultarDivTerritorial (codLocalidad: string|null, codSector: string|null, codUPL:string|null, idCuadrante: number|null) {
    let url = '/SIGMA-backend-desa/api/consulta/divisionTerritorial';
    let body = {usuario:this.securityService.userSession.idUsuario,
                codLocalidad:codLocalidad,
                codSector:codSector,
                codUPL:codUPL,
                idCuadrante: idCuadrante
    }

    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  calcularKMCarrilImpacto(idsGestion:number[],idActividad:number){
    let url = '/SIGMA-backend-desa/api/gestion/acumularKmCarrilImpactoPorGestion';
    let body = {idUsuario:this.securityService.userSession.idUsuario,
                ids:idsGestion,
                idActividad: idActividad,
                usuario: this.securityService.userSession.login,
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  async obtenerColumnasListaPendientes(idActividad:string){

    //let data = (await this.http.get('/sigma2-frontend/assets/config/columnasPendiente.json').toPromise()) as any;
    let data = (await this.http.get(environment.urlConfig + 'columnasPendiente.json').toPromise()) as any;
    return data[idActividad];
  }

  async generarActaDianostico(idDocumento:number, idMantenimientoVial:number, idMantenimientoVialEvento:number, extent:string, bboxSR:string, idActividad:number, guardar:boolean){
    console.log('llama al servicio');
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 're',
      responseType: 'blob',
    };
    let url = '/SIGMA-backend-desa/api/reporte/generarFicha';
    let body = {
                usuario: this.securityService.userSession.login,
                idDocumento:idDocumento,
                idMantenimientoVial: idMantenimientoVial,
                idMantenimientoVialEvento: idMantenimientoVialEvento,
                idActividad: idActividad,
                extent: extent,
                bboxSR: bboxSR,
                guardar:guardar,
    }
    return this.http.post(url, body , {observe: 'response' ,responseType: 'blob' }).toPromise();
  }
  async generarActaVerificacion(idDocumento:number, idMantenimientoVial:number, idMantenimientoVialEvento:number, extent:string, bboxSR:string, guardar:boolean){
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 're',
      responseType: 'blob',
    };
    let url = '/SIGMA-backend-desa/api/reporte/generarFichaIntervencion';
    let body = {
                usuario: this.securityService.userSession.login,
                idDocumento:idDocumento,
                idMantenimientoVial: idMantenimientoVial,
                idMantenimientoVialEvento: idMantenimientoVialEvento,
                extent: extent,
                bboxSR: bboxSR
    }
    console.log('llama al servicio',body);
    return this.http.post(url, body , {observe: 'response' ,responseType: 'blob' }).toPromise();
  }

  async generarFichaAforo(idAforo:number, idDocumento:number, idMantenimientoVial:number, guardar:boolean = true){
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 're',
      responseType: 'blob',
    };
    let url = '/SIGMA-backend-desa/api/reporte/generarFichaAforo';
    let body = {
                usuario: this.securityService.userSession.login,
                idDocumento:idDocumento,
                idMantenimientoVial: idMantenimientoVial,
                idAforo: idAforo,
                guardar:guardar
    }
    return this.http.post(url, body , {observe: 'response' ,responseType: 'blob' }).toPromise();
  }

  async generarFichaAnalisis(idAforo:number, idDocumento:number, idMantenimientoVial:number, guardar:boolean = true){
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 're',
      responseType: 'blob',
    };
    let url = '/SIGMA-backend-desa/api/reporte/generarFichaAnalisis';
    let body = {
                usuario: this.securityService.userSession.login,
                idDocumento:idDocumento,
                idMantenimientoVial: idMantenimientoVial,
                idAforo: idAforo,
                guardar:guardar
    }
    return this.http.post(url, body , {observe: 'response' ,responseType: 'blob' }).toPromise();
  }

  asociarDocumentoAMantenimiento(idDocumento:number,idMantenimientoVial:number){
    const url = '/SIGMA-backend-desa/api/mantenimientovialdocu/insertar';
    let body = {
                  usuario: this.securityService.userSession.login,
                  mantenimientoVialDocu:{
                    idDocumento:idDocumento,
                    idMantenimientoVial:{idMantenimientoVial:idMantenimientoVial},
                    registroActivo:'SI'
                  }
                }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }

  calculadoMantenimientoVial(idMantenimientoVial:number){
    const url = '/SIGMA-backend-desa/api/consulta/calculadoMantenimientoVial';
    let body = {
                  usuario: this.securityService.userSession.login,
                  idMantenimientoVial:idMantenimientoVial
                }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }

}
