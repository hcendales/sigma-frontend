import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Falla } from '../models/falla';
import { SecurityService } from '../security/services/security.service';
import { IEntityService } from './i-entity-service';

@Injectable({
  providedIn: 'root'
})
export class EntityTabFallasServiceService implements IEntityService<Falla> {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  async get(idEntity: number):Promise<any> {
    let url = '/SIGMA-backend-desa/api/falla/consultarIdUnidadMuestreo';
    let body = {
      idUsuario:this.securityService.userSession.idUsuario,
      usuario: this.securityService.userSession.login,
      falla:{
        idUnidadMuestreo:{idUnidadMuestreo:idEntity}
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  update(entity: Falla) {
    let url = '/SIGMA-backend-desa/api/falla/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      falla:{
        idFalla:entity.idFalla,
        distancia:entity.distancia,
        idTipoSuperficie:entity.idTipoSuperficie,
        idTipoFalla:entity.idTipoFalla,
        idTipoSeveridad:entity.idTipoSeveridad,
        longitud:entity.longitud,
        ancho:entity.ancho,
        area:entity.area,
        idTipoIntervencion:entity.idTipoIntervencion,
        numeroLosas:entity.numeroLosas,
        idUnidadMuestreo:{idUnidadMuestreo: entity.idUnidadMuestreo}
      }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  create(entity:Falla): any{
    let url = '/SIGMA-backend-desa/api/falla/insertar';
    let mvInfo = {
      usuario: this.securityService.userSession.login,
      falla:{
        //idFalla:entity.idFalla,
        distancia:entity.distancia,
        idTipoSuperficie:entity.idTipoSuperficie,
        idTipoFalla:entity.idTipoFalla,
        idTipoSeveridad:entity.idTipoSeveridad,
        longitud:entity.longitud,
        ancho:entity.ancho,
        area:entity.area,
        idTipoIntervencion:entity.idTipoIntervencion,
        numeroLosas:entity.numeroLosas,
        idUnidadMuestreo:{idUnidadMuestreo: entity.idUnidadMuestreo}
      }
    };
    return this.http.post<any>(url, JSON.stringify(mvInfo), this.httpOptions);
  }

  delete(idEntity: number) {
    let url = '/SIGMA-backend-desa/api/falla/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      falla:{
        idFalla:idEntity,
      }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  list(condition: string): any[] {
    throw new Error('Method not implemented.');
  }
}
