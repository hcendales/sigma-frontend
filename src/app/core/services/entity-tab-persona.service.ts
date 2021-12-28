import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Persona } from '../models/persona';
import { SecurityService } from '../security/services/security.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntityTabPersonaService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/persona/consultarXFiltro';
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // Metodo para insertar una persona
  insertar( entity: Persona){
    const url = '/SIGMA-backend-desa/api/persona/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      persona: {
        idTipoRegimen: entity.idTipoRegimen,
        idTipoCategoriaPersona: entity.idTipoCategoriaPersona,
        identificacion: entity.identificacion,
        idUsuario: entity.idUsuario,
        nombre: entity.nombre,
        telefono: entity.telefono,
        email: entity.email,
        idTipoEstadoPersona: entity.idTipoEstadoPersona,
        idTipoArea: entity.idTipoArea,
        idTipoCargo: entity.idTipoCargo,
        idTipoRol: entity.idTipoRol
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // Metodo para Actualizar una persona
  actualizar( entity: Persona){
    const url = '/SIGMA-backend-desa/api/persona/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      persona: {
        idPersona: entity.idPersona,
        idTipoRegimen: entity.idTipoRegimen,
        idTipoCategoriaPersona: entity.idTipoCategoriaPersona,
        identificacion: entity.identificacion,
        idUsuario: entity.idUsuario,
        nombre: entity.nombre,
        telefono: entity.telefono,
        email: entity.email,
        idTipoEstadoPersona: entity.idTipoEstadoPersona,
        idTipoArea: entity.idTipoArea,
        idTipoRol: entity.idTipoRol,
        idTipoCargo: entity.idTipoCargo
      },
    };
    // console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  // Metodo para Actualizar una persona
  eliminar( identity: number){
    const url = '/SIGMA-backend-desa/api/persona/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      persona: {
        idPersona: identity
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  async listUsuarios(condition: string) {
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      usuario: this.securityService.userSession.login,
      json: JSON.stringify({usuario: this.securityService.userSession.login,filtro:condition}),
      url: environment.URL_CALIOPE_BACK + "api/usuario/consultarXFiltro"
    }
    let response:any = await this.http.post<any>(url, body , this.httpOptions).toPromise();
    let listaUsuarios = JSON.parse(response.respuesta[0].json);
    return listaUsuarios;
  }

}
