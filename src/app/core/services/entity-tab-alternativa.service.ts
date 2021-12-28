import { Alternativa } from './../models/alternativa';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class EntityTabAlternativaService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  insertar( alternativa: Alternativa){
    const url = '/SIGMA-backend-desa/api/alternativa/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      alternativa: {
        mantenimientoVialEvento: {idMantenimientoVialEvento: alternativa.idMantenimientoVialEvento},
        alternativa: alternativa.alternativa,
        idTipoSuperficieDisenio: alternativa.idTipoSuperficieDisenio,
        idTipoIntervencionFinalDisenio: alternativa.idTipoIntervencionFinalDisenio,
        idTipoMetodologiaDisenio: alternativa.idTipoMetodologiaDisenio,
        idTipoMaterialGranular: alternativa.idTipoMaterialGranular,
        espesorDisenio: alternativa.espesorDisenio,
        cbrInicialPct: alternativa.cbrInicialPct,
        idTipoGeosinteticos: alternativa.idTipoGeosinteticos,
        idTipoSistemaDrenaje: alternativa.idTipoSistemaDrenaje,
        observaciones: alternativa.observaciones,
        seleccionada: alternativa.seleccionada
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  actualizar( alternativa: Alternativa){
    const url = '/SIGMA-backend-desa/api/alternativa/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      alternativa: {
        idAlternativaDisenio: alternativa.idAlternativaDisenio,
        mantenimientoVialEvento: {idMantenimientoVialEvento: alternativa.idMantenimientoVialEvento},
        alternativa: alternativa.alternativa,
        idTipoSuperficieDisenio: alternativa.idTipoSuperficieDisenio,
        idTipoIntervencionFinalDisenio: alternativa.idTipoIntervencionFinalDisenio,
        idTipoMetodologiaDisenio: alternativa.idTipoMetodologiaDisenio,
        idTipoMaterialGranular: alternativa.idTipoMaterialGranular,
        espesorDisenio: alternativa.espesorDisenio,
        cbrInicialPct: alternativa.cbrInicialPct,
        idTipoGeosinteticos: alternativa.idTipoGeosinteticos,
        idTipoSistemaDrenaje: alternativa.idTipoSistemaDrenaje,
        observaciones: alternativa.observaciones,
        seleccionada: alternativa.seleccionada
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  eliminar(idAlternativaDisenio: number){
    const url = '/SIGMA-backend-desa/api/alternativa/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      alternativa: {
        idAlternativaDisenio: idAlternativaDisenio
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/alternativa/consultarXFiltro';
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
