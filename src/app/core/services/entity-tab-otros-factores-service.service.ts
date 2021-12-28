import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OtroFactor } from '../models/otro-factor';
import { SecurityService } from '../security/services/security.service';
import { IEntityService } from './i-entity-service';

@Injectable({
  providedIn: 'root'
})
export class EntityTabOtrosFactoresServiceService implements IEntityService<OtroFactor> {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  //consulta por el idDeArchivo
  async get(idEntity: number):Promise<OtroFactor> {
    let url = '/SIGMA-backend-desa/api/otrofactor/consultarIdMantenimiento';
    let body = {
      usuario: this.securityService.userSession.login,
      otroFactor: {idMantenimientoVialEvento:idEntity}
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  update(entity: any) {
    let url = '/SIGMA-backend-desa/api/otrofactor/actualizar';
    let ofInfo = {
        usuario: this.securityService.userSession.login,
        otroFactor: {
          idOtroFactor: entity.idOtroFactor,
          idTipoOtroFactor: entity.idTipoOtroFactor,
          idMantenimientoVialEvento: {
            idMantenimientoVialEvento: entity.idMantenimientoVialEvento
          }
        }
    };
    return this.http.post<any>(url, JSON.stringify(ofInfo), this.httpOptions);
  }

  create(entity:OtroFactor): any{
    let url = '/SIGMA-backend-desa/api/otrofactor/insertar';
    let ofInfo = {
      usuario: this.securityService.userSession.login,
      otroFactor: {
        idTipoOtroFactor: entity.idTipoOtroFactor,
        idMantenimientoVialEvento: {
          idMantenimientoVialEvento: entity.idMantenimientoVialEvento
        }
      }
    };
    return this.http.post<any>(url, ofInfo);
  }

  delete(idEntity: number) {
    let url = '/SIGMA-backend-desa/api/otrofactor/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      otroFactor:{
        idOtroFactor:idEntity,
      }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  list(condition: string): any[] {
    throw new Error('Method not implemented.');
  }
}
