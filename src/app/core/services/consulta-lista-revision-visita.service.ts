import { Respuesta } from './../models/revision-visitas';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaListaRevisionVisitaService {
  private url = '/SIGMA-backend-desa/api/gestion/listarParaRevisarVisitaDiagnostico/';
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  public consultarListaRevision(): any{
    // Headers
    const token = this.securityService.getToken() ;
    // console.log(token);
    const httpOptions = {
      headers: new HttpHeaders(
        { 'content-type': 'application/json'}
        ),
        json: true,
    };
   // console.log('httoptioins', httpOptions);
    // Body
    const body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
    };
    return this.http.post<any[]>(this.url, body, httpOptions);
  }
}
