import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { Novedad } from '../models/novedad';

@Injectable({
  providedIn: 'root'
})
export class EntityTabNovedadService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }
  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/recurso/novedad/consultarXFiltro';
    // console.log('Url ', url);
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    // console.log('Body Lugar ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // metodo para insertar una novedad
  insertar( entity: Novedad){
    const url = '/SIGMA-backend-desa/api/recurso/novedad/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      novedad: {
        idTipoNovedad: entity.idTipoNovedad,
        recurso: {idRecurso: entity.idRecurso},
        horaDesde: entity.horaDesde,
        horaHasta: entity.horaHasta,
        observaciones: entity.observaciones,
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  // Metodo para Actualizar una novedad
  actualizar( entity: Novedad){
    const url = '/SIGMA-backend-desa/api/recurso/novedad/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      novedad: {
        idRecursoNovedad: entity.idRecursoNovedad,
        idTipoNovedad: entity.idTipoNovedad,
        recurso: { idRecurso: entity.idRecurso},
        horaDesde: entity.horaDesde,
        horaHasta: entity.horaHasta,
        observaciones: entity.observaciones,
      },
    };
    // console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // metodo para eliminar una novedad
  eliminar( identity: number){
    const url = '/SIGMA-backend-desa/api/recurso/novedad/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      novedad: { idRecursoNovedad: identity},
    };
    // console.log('el body eliminar', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
