import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  getAll() {
    const url = '/SIGMA-backend-desa/api/visita/vehiculo/consultar';
    let body = {
      usuario: this.securityService.userSession.login
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  getDisponibilidad(tipoRecurso: number, fechaDesde: Date, fechaHasta: Date) {
    const url = '/SIGMA-backend-desa/api/recurso/listarDisponibilidadXTipo';
    let body = {
      usuario: this.securityService.userSession.login,
      tipoRecurso: tipoRecurso,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  getDisponibilidadTotal(tipoRecurso: number, fechaDesde: Date, fechaHasta: Date) {
    const url = '/SIGMA-backend-desa/api/recurso/listarDisponibilidadTotalXTipo';
    let body = {
      usuario: this.securityService.userSession.login,
      tipoRecurso: tipoRecurso,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  getDisponibilidadAsignada(idRecursoDisponibilidad: number) {
    const url = '/SIGMA-backend-desa/api/visita/vehiculo/consultarDisponibilidadAsignada';
    let body = {
      usuario: this.securityService.userSession.login,
      idRecursoDisponibilidad: idRecursoDisponibilidad
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }

  getListaDisponibilidadPorId(id:number,fechaDesde:Date,fechaHasta:Date){
    const url = '/SIGMA-backend-desa/api/recurso/listarDisponibilidad';
    let body =  {"usuario":"remy.galan",
          "recurso":{"equipo":{"idEquipo":id}},
          "fechaDesde":fechaDesde,
          "fechaHasta":fechaHasta
     };
     return this.http.post<any>(url, body, this.httpOptions);
  }


  asignarVisita(idPersona:number, idRecursoDisponibilidad:number){
    const url = '/SIGMA-backend-desa/api/visita/vehiculo/asignar';
    let body = {
      usuario: this.securityService.userSession.login,
      idPersona: idPersona,
      idRecursoDisponibilidad: idRecursoDisponibilidad

    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  desasignarVisita(idPersona:number, idRecursoDisponibilidad:number){
    const url = '/SIGMA-backend-desa/api/visita/vehiculo/desasignar';
    let body = {
      usuario: this.securityService.userSession.login,
      idPersona: idPersona,
      idRecursoDisponibilidad: idRecursoDisponibilidad

    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  consultarFranjas(idRecurso: number, fechaDesde: Date, fechaHasta: Date) {
    const url = '/SIGMA-backend-desa/api/recurso/programacion/franjas';
    let body = {
      usuario: this.securityService.userSession.login,
      recurso:{ "idRecurso":idRecurso},
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  eliminarFranja(tipoRecurso: number, fechaDesde: Date, fechaHasta: Date) {
    const url = '/SIGMA-backend-desa/api/recurso/programacion/franjas/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      recurso:{ "idRecurso":44},
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }



}
