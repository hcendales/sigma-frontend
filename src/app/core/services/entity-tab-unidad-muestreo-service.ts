import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEntityService } from './i-entity-service';
import { SecurityService } from '../security/services/security.service';
import { UnidadMuestreo } from '../models/unidad-muestreo';

@Injectable({
  providedIn: 'root'
})
export class EntityTabUnidadMuestreoService implements IEntityService<UnidadMuestreo> {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  //consulta por idEvento
  async get(idEntity: number): Promise<any> {
    let url = '/SIGMA-backend-desa/api/unidadmuestreo/consultarIdMantenimiento';
    let body = {
      usuario: this.securityService.userSession.login,
      unidadMuestreo:{idMantenimientoVialEvento:idEntity}
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  update(entity: UnidadMuestreo) {
    let url = '/SIGMA-backend-desa/api/unidadmuestreo/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      unidadMuestreo:{
        idUnidadMuestreo:entity.idUnidadMuestreo,
        abscisaInicial:entity.abscisaInicial,
        abscisaFinal:entity.abscisaFinal,
        area:entity.area,
        ancho:entity.ancho,
        pci:entity.pci,
        idMantenimientoVialEvento:{idMantenimientoVialEvento: entity.idMantenimientoVialEvento}
      }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  create(entity: UnidadMuestreo) {
    let url = '/SIGMA-backend-desa/api/unidadmuestreo/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      unidadMuestreo:{
        //idUnidadMuestreo:entity.idUnidadMuestreo,
        abscisaInicial:entity.abscisaInicial,
        abscisaFinal:entity.abscisaFinal,
        area:entity.area,
        ancho:entity.ancho,
        idMantenimientoVialEvento:{idMantenimientoVialEvento: entity['idMantenimientoVialEvento']}
      }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  delete(idEntity: number) {
    let url = '/SIGMA-backend-desa/api/unidadmuestreo/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      unidadMuestreo:{
        idUnidadMuestreo:idEntity,
      }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  list(condition: string): UnidadMuestreo[] {
    throw new Error('Method not implemented.');
  }
}
