import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Radicado } from '../models/radicado';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class BuscarRadicadoOrfeoService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  get(radicado: string) {
    const url = '/SIGMA-backend-desa/api/servicio/consultarRadicadoOrfeo';
    let body = {
      usuario: this.securityService.userSession.login,
      radicado: radicado
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
}
