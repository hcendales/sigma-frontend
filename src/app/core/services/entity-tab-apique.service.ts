import { MantenimientoVial } from './../models/mantenimiento-vial';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { Apique } from '../models/apique';

@Injectable({
  providedIn: 'root'
})
export class EntityTabApiqueService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  insertar(apiqueInsertar: Apique){
    const url = '/SIGMA-backend-desa/api/apique/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      apique: {
        mantenimientoVialEvento: {idMantenimientoVialEvento: apiqueInsertar.idMantenimientoVialEvento},
        nomenclatura: apiqueInsertar.nomenclatura,
        observacion: apiqueInsertar.observacion
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/apique/consultarXFiltro';
    // console.log('Url ', url);
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    // console.log('Body Lugar ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  list1(idEvento: number) {
    const url = '/SIGMA-backend-desa/api/apique/consultarXFiltro';
    // console.log('Url ', url);
    const body = {
      usuario: this.securityService.userSession.login,
      apique:{
        mantenimientoVialEvento:{idMantenimientoVialEvento: idEvento},
      },
      filtro: "id_mantenimiento_vial_evento = " + idEvento
    };
    // console.log('Body apique ', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  actualizar( apique: Apique){
    const url = '/SIGMA-backend-desa/api/apique/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      apique: {
        idPredisenioApique: apique.idPredisenioApique,
        mantenimientoVialEvento: {idMantenimientoVialEvento: apique.idMantenimientoVialEvento},
        nomenclatura: apique.nomenclatura,
        observacion: apique.observacion
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  eliminar(idPredisenioApique: number){
    const url = '/SIGMA-backend-desa/api/apique/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      apique: {
        idPredisenioApique: idPredisenioApique
      },
    };
    // console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
