import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class IntervencionService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  queryFiltroActividad(codActividad: string){
    const url = "/SIGMA-backend-desa/api/actividadAgTipoIntervencion/consultarXFiltro";
    let body = {
      usuario: this.securityService.userSession.login,
      filtro:"CODIGO_ACTIVIDAD_AGRUPADA='" + codActividad + "'"
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  setAreaIntervencion(entity: any) {
    const url = '/SIGMA-backend-desa/api/areaIntervencion/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      areaIntervencion: {
        area: entity.area,
        longitud: entity.longitud,
        elemento: entity.elemento,
        idTipoIntervencion: entity.idTipoIntervencion,
        idTipoSuperficie: entity.idTipoSuperficie,
        ancho: entity.ancho,
        idMantenimientoVialEvento: entity.idMantenimientoVialEvento
      }
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  updateAreaIntervencion(entity: any) {
    const url = '/SIGMA-backend-desa/api/areaIntervencion/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      areaIntervencion: {
        idAreaIntervencion: entity.idAreaIntervencion,
        area: entity.area,
        longitud: entity.longitud,
        elemento: entity.elemento,
        idTipoIntervencion: entity.idTipoIntervencion,
        idTipoSuperficie: entity.idTipoSuperficie,
        ancho: entity.ancho,
        idMantenimientoVialEvento:entity.idMantenimientoVialEvento
      }
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  deleteAreaIntervencion(idAreaIntervencion: number) {
    const url = '/SIGMA-backend-desa/api/areaIntervencion/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      areaIntervencion: {
        idAreaIntervencion:idAreaIntervencion
      }
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  parentQueryAreaIntervencion(idMantenimientoVialEvento: number) {
    const url = '/SIGMA-backend-desa/api/areaIntervencion/consultarIdMantenimientoVialEvento';
    let body = {
      usuario: this.securityService.userSession.login,
      areaIntervencion: {
        idMantenimientoVialEvento :idMantenimientoVialEvento
      }
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  queryAreaIntervencion(idAreaIntervencion: number) {
    const url = 'api/areaIntervencion/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro: "id_area_intervencion=" + idAreaIntervencion
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  setIntervencionNovedad(entity: any) {
    console.log(entity);
    const url = '/SIGMA-backend-desa/api/intervencionNovedad/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      intervencionNovedad: {
        idTipoNovedad: entity.id_tipo,
        idMantenimientoVialEvento: entity.idMantenimientoVialEvento
      }
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  updateIntervencionNovedad(entity: any) {
    const url = 'api/intervencionNovedad/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      intervencionNovedad: {
        idTipoNovedad: entity.idTipoNovedad,
        idMantenimientoVialEvento: entity.idMantenimientoVialEvento
      }
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  deleteIntervencionNovedad(idIntervencionNovedad: number) {
    const url = '/SIGMA-backend-desa/api/intervencionNovedad/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      intervencionNovedad: {
        idIntervencionNovedad:idIntervencionNovedad
      }
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  parentQueryIntervencionNovedad(idMantenimientoVialEvento: number) {
    const url = '/SIGMA-backend-desa/api/intervencionNovedad/consultarIdMantenimientoVialEvento';
    let body = {
      usuario: this.securityService.userSession.login,
      intervencionNovedad: {
        idMantenimientoVialEvento: idMantenimientoVialEvento
      }
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  queryIntervencionNovedad(idIntervencionNovedad: number) {
    const url = 'api/intervencionNovedad/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro: "id_intervencion_novedad=" + idIntervencionNovedad
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
}
