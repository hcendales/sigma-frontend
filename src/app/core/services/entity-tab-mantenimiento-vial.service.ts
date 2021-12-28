import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEntityService } from './i-entity-service';
import { SecurityService } from '../security/services/security.service';
import { MantenimientoVial } from '../models/mantenimiento-vial';

@Injectable({
  providedIn: 'root'
})
export class EntityTabMantenimientoVialService implements IEntityService<MantenimientoVial> {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  async get(idEntity: number):Promise<MantenimientoVial> {
    let url = '/SIGMA-backend-desa/api/mantenimientovial/consultarId';
    let body = {
      idUsuario:this.securityService.userSession.idUsuario,
      usuario: this.securityService.userSession.login,
      mantenimientovial:{idMantenimientoVial:idEntity}
    }
    let res = await this.http.post<any>(url, body , this.httpOptions).toPromise();
    return res.respuesta[0];
  }

  update(mantenimientovial: MantenimientoVial) {
    let url = '/SIGMA-backend-desa/api/mantenimientovial/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      mantenimientovial
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  create(entity:MantenimientoVial): any{
    console.log(this.securityService.userSession);
    let url = '/SIGMA-backend-desa/api/mantenimientovial/crearMantenimiento';
    let mvInfo = {
      usuario: this.securityService.userSession.login,
      mantenimientovial: {
                          idTipoOrigen: entity.idTipoOrigen,
                          pkIdCalzada: entity.pkIdCalzada,
                          idTipoPrograma: entity.idTipoPrograma
                        },
      idUsuario: this.securityService.userSession.idUsuario,
      observacion: '',
      solicitudRadicado: null
    };
    return this.http.post<any>(url, JSON.stringify(mvInfo), this.httpOptions).toPromise();
  }

  insert(entity:any): any{
    console.log(this.securityService.userSession);
    let url = '/SIGMA-backend-desa/api/mantenimientovial/crearMantenimiento';
    let mvInfo = {
      usuario: this.securityService.userSession.login,
      mantenimientovial: {
                          idTipoOrigen: entity.idTipoOrigen,
                          pkIdCalzada: entity.pkIdCalzada,
                        },
      observacion: '',
      solicitudRadicado: null
    };
    return this.http.post<any>(url, JSON.stringify(mvInfo), this.httpOptions);
  }

  delete(idEntity: number) {
    throw new Error('Method not implemented.');
  }

  list(condition: string): any[] {
    throw new Error('Method not implemented.');
  }

  async searchDocumento(condition: string) {
    let url = '/SIGMA-backend-desa/api/mantenimientovialdocu/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro: condition,
    }
    return await this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  async actualizarCampo(idEntity: number,nombresCampos:string,ValoresCampos:string) {
    let url = '/SIGMA-backend-desa/api/mantenimientovial/actualizarCampo';
    let body = {
      usuario: this.securityService.userSession.login,
      mantenimientovial:{idMantenimientoVial:idEntity},
      nombreCampo: nombresCampos,
      valorCampo: ValoresCampos,
    }
    console.log('Body: ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

}
