import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { Lugar } from '../models/lugar';

@Injectable({
  providedIn: 'root'
})
export class EntityTabLugarService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/lugar/consultarXFiltro';
    // console.log('Url ', url);
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    // console.log('Body Lugar ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  insertar( entity: Lugar){
    const url = '/SIGMA-backend-desa/api/lugar/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      lugar: {
        idTipoLugar: entity.idTipoLugar,
        idTipoOrigen: entity.idTipoOrigen,
        contactoNombre: entity.contactoNombre,
        contactoCorreoElectronico: entity.contactoCorreoElectronico,
        contactoTelefono: entity.contactoTelefono,
        direccion: entity.direccion,
        idTipoEstadoLugar: entity.idTipoEstadoLugar,
        nombre: entity.nombre,
        descripcion: entity.descripcion
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  actualizar( entity: Lugar){
    const url = '/SIGMA-backend-desa/api/lugar/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      lugar: {
        idLugar: entity.idLugar,
        idTipoLugar: entity.idTipoLugar,
        idTipoOrigen: entity.idTipoOrigen,
        contactoNombre: entity.contactoNombre,
        contactoCorreoElectronico: entity.contactoCorreoElectronico,
        contactoTelefono: entity.contactoTelefono,
        direccion: entity.direccion,
        idTipoEstadoLugar: entity.idTipoEstadoLugar,
        nombre: entity.nombre,
        descripcion: entity.descripcion
      },
    };
    // console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  eliminar( identity: number){
    const url = '/SIGMA-backend-desa/api/lugar/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      lugar: {
        idLugar: identity
      },
    };
    // console.log('el body eliminar', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
