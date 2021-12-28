import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class EntityTabEventoService {

  /**
   * Adicion el encabezado de tipo de contenido 
   * a las peticiones.
   */
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /**
   * Constructor del objeto.
   * 
   * @param securityService Referencia al servicio de seguridad. 
   * @param http Referencia al cliente HTTP.
   */
  constructor(private securityService: SecurityService, private http: HttpClient) { }

  /**
   * Permite obtener los datos del evento solicitado en 
   * el filtro.
   * 
   * @param filtro Filtro de la consulta 
   * @returns Datos del evento.
   */
  obtenerEvento(filtro?:any){
    let url = '/SIGMA-backend-desa/api/mantenimientovialevento/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro: filtro
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

}
