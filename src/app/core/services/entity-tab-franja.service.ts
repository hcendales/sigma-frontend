import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { Franja } from '../models/franjas';

@Injectable({
  providedIn: 'root'
})
export class EntityTabFranjaService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient){}
  consultar(entity: Franja) {
    const url = '/SIGMA-backend-desa/api/recurso/programacion/franjas/consultar';
    // console.log('Url ', url);
    const body = {
      usuario: this.securityService.userSession.login,
      idRecurso: entity.idRecurso,
      fechaDesde: entity.fechaDesde,
      fechaHasta: entity.fechaHasta,
      horaInicio: entity.horaInicio,
      horaFin: entity.horaFin,
      intervalo: entity.intervalo,
    };
    // console.log('Body Lugar ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  insertar( entity: Franja){
    const url = '/SIGMA-backend-desa/api/recurso/programacion/franjas';
    const body = {
      usuario: this.securityService.userSession.login,
      idRecurso: entity.idRecurso,
      fechaDesde: entity.fechaDesde,
      fechaHasta: entity.fechaHasta,
      horaInicio: entity.horaInicio,
      horaFin: entity.horaFin,
      intervalo: entity.intervalo,
    };
    console.log('el body Franjas', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  eliminar( identity: number, fechaDesde: number, fechaHasta: number){
    const url = '/SIGMA-backend-desa/api/recurso/programacion/franjas/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      idRecurso: identity,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
    };
    // console.log('el body eliminar', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
