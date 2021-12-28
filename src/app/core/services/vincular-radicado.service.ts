import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class VincularRadicadoService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  get(radicado: string) {
    const url = '/SIGMA-backend-desa/api/radicadovinculado/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      radicadoVinculado: radicado
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  getAll() {
    const url = '/SIGMA-backend-desa/api/radicadovinculado/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro: "NUMERO_RADICADO_SALIDA IS NULL"
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  getSegs() {
    const url = '/SIGMA-backend-desa/api/consulta/seguimientosProximos';
    let body = {
      usuario: this.securityService.userSession.login
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }
  insert(radicadoVin:any){
    const url = '/SIGMA-backend-desa/api/radicadovinculado/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      radicadoVinculado: radicadoVin
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }
  update(radicadoVin:any){
    const url = '/SIGMA-backend-desa/api/radicadovinculado/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      radicadoVinculado: radicadoVin
    }
    return this.http.post<any>(url, body, this.httpOptions);
  }

}
