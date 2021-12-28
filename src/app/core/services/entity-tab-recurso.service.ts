import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recurso } from '../models/recurso';
import { SecurityService } from '../security/services/security.service';


@Injectable({
  providedIn: 'root'
})
export class EntityTabRecursoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private securityService: SecurityService,
    private http: HttpClient
  ) { }
    // Metodo  para consultar recursos
  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/recurso/consultarXFiltro';
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // Metodo para insertar un recurso de tipo Persona
  insertarRecursoPersona( entity: Recurso){
    const url = '/SIGMA-backend-desa/api/recurso/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      recurso: {
        idTipoRecurso: entity.idTipoRecurso,
        intervaloProgramacion: entity.intervaloProgramacion,
        persona: {idPersona: entity.idPersona},
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        horaInicioProgramacion: entity.horaInicioProgramacion,
        horaFinProgramacion: entity.horaFinProgramacion,
        descripcion: entity.descripcion
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  // Metodo para insertar un recurso de tipo Equipo
  insertarRecursoEquipo( entity: Recurso){
    const url = '/SIGMA-backend-desa/api/recurso/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      recurso: {
        idTipoRecurso: entity.idTipoRecurso,
        intervaloProgramacion: entity.intervaloProgramacion,
        equipo: {idEquipo: entity.idEquipo},
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        horaInicioProgramacion: entity.horaInicioProgramacion,
        horaFinProgramacion: entity.horaFinProgramacion,
        descripcion: entity.descripcion
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  // Metodo para insertar un recurso de tipo Lugar
  insertarRecursoLugar( entity: Recurso){
    const url = '/SIGMA-backend-desa/api/recurso/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      recurso: {
        idTipoRecurso: entity.idTipoRecurso,
        intervaloProgramacion: entity.intervaloProgramacion,
        lugar: {idLugar: entity.idLugar},
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        horaInicioProgramacion: entity.horaInicioProgramacion,
        horaFinProgramacion: entity.horaFinProgramacion,
        descripcion: entity.descripcion
      },
    };
    console.log('el body Lugar', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // Metodo para Actualizar una persona
  actualizarRecursoPersona( entity: Recurso){
    const url = '/SIGMA-backend-desa/api/recurso/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      recurso: {
        idRecurso: entity.idRecurso,
        idTipoRecurso: entity.idTipoRecurso,
        intervaloProgramacion: entity.intervaloProgramacion,
        persona: {idPersona: entity.idPersona},
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        horaInicioProgramacion: entity.horaInicioProgramacion,
        horaFinProgramacion: entity.horaFinProgramacion,
        descripcion: entity.descripcion
      },
    };
    // console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  // Metodo para Actualizar una persona
  actualizarRecursoEquipo( entity: Recurso){
    const url = '/SIGMA-backend-desa/api/recurso/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      recurso: {
        idRecurso: entity.idRecurso,
        idTipoRecurso: entity.idTipoRecurso,
        intervaloProgramacion: entity.intervaloProgramacion,
        equipo: {idEquipo: entity.idEquipo},
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        horaInicioProgramacion: entity.horaInicioProgramacion,
        horaFinProgramacion: entity.horaFinProgramacion,
        descripcion: entity.descripcion
      },
    };
    console.log('el body equipo: ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  // Metodo para Actualizar una persona
  actualizarRecursoLugar( entity: Recurso){
    const url = '/SIGMA-backend-desa/api/recurso/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      recurso: {
        idRecurso: entity.idRecurso,
        idTipoRecurso: entity.idTipoRecurso,
        intervaloProgramacion: entity.intervaloProgramacion,
        lugar: {idLugar: entity.idLugar},
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        horaInicioProgramacion: entity.horaInicioProgramacion,
        horaFinProgramacion: entity.horaFinProgramacion,
        descripcion: entity.descripcion
      },
    };
    console.log('el body lugar: ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // Metodo para Eliminar un recurso
  eliminar( identity: number){
    const url = '/SIGMA-backend-desa/api/recurso/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      recurso: {
        idRecurso: identity
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
