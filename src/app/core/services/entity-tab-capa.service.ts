import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { Capa } from '../models/capa';

@Injectable({
  providedIn: 'root'
})
export class EntityTabCapaService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  insert( capa: Capa){
    const url = '/SIGMA-backend-desa/api/alternativa/capa/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      capa: {
        alternativaDisenio: {idAlternativaDisenio: capa.idAlternativaDisenio},
        idTipoCapa: capa.idTipoCapa,
        espesor: capa.espesor
      },
    };
    console.log('el body capa', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  actualizar( capa: Capa){
    const url = '/SIGMA-backend-desa/api/alternativa/capa/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      capa: {
        idDisenioCapa: capa.idDisenioCapa,
        alternativaDisenio: {idAlternativaDisenio: capa.idAlternativaDisenio},
        idTipoCapa: capa.idTipoCapa,
        espesor: capa.espesor
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  eliminar(idDisenioCapa: number){
    const url = '/SIGMA-backend-desa/api/alternativa/capa/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      capa: {
        idDisenioCapa: idDisenioCapa
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/alternativa/capa/consultarXFiltro';
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    console.log('Body capa', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
