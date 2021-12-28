
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { SecurityService } from '../security/services/security.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargarDocumentoService {

  public listas: any = {};
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private securityService: SecurityService,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string) { }


  /** Realiza Busqueda de los PKs Mantenimientos Activos  */
  public async consultarXFiltro(filtro: string) {
    let body: any = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return this.http.post<any>('/SIGMA-backend-desa/api/mantenimientovialdocu/consultarXFiltro', JSON.stringify(body), this.httpOptions).toPromise();
  }

  public async tipoDocumento(filtro : string) {
    const url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
                  url: "api/tipodocumento/consultarXFiltro",
                  usuario: this.securityService.userSession.login,
                  json: JSON.stringify({ 
                    usuario: this.securityService.userSession.login, 
                    filtro
                  }),
                }

    const response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    const datos = JSON.parse(response.respuesta[0].json).respuesta
    return datos;
  }  

  /** Insertar documentos  */
  public async insertarDocumento(idMantenimientoVial: string, idTipoDocumento: string, idTipoEstadoDocumento: string = "1044", descripcion: string, file: any) {

    const formData: FormData = new FormData();

    formData.append('usuario', this.securityService.userSession.login);
    formData.append('idMantenimientoVial', idMantenimientoVial);
    formData.append('idTipoDocumento', idTipoDocumento);
    formData.append('idTipoEstadoDocumento', idTipoEstadoDocumento);
    formData.append('descripcion', descripcion);
    formData.append('file', file);

    return this.http.post<any>('/SIGMA-backend-desa/api/archivo/insertarDocumento', formData).toPromise()
  }

  /** Actualizar documentos  */
  public async actualizarDocumento(idDocumento: string, idMantenimientoVial: string, idTipoDocumento: string, idTipoEstadoDocumento: string, descripcion: string, file: any) {

    const formData: FormData = new FormData();

    formData.append('idDocumento', idDocumento);

    formData.append('usuario', this.securityService.userSession.login);
    formData.append('idMantenimientoVial', idMantenimientoVial);
    formData.append('idTipoDocumento', idTipoDocumento);
    formData.append('idTipoEstadoDocumento', idTipoEstadoDocumento);
    formData.append('descripcion', descripcion);
    formData.append('file', file);

    return this.http.post<any>('/SIGMA-backend-desa/api/archivo/actualizarDocumento', formData).toPromise()
  }

  //crea un registro en tab_documento
  public crearDocumento(documento:any){
    const url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      url: environment.URL_CALIOPE_BACK + "api/documento/insertar",
      usuario: this.securityService.userSession.login,
      json: JSON.stringify({ 
        usuario: this.securityService.userSession.login,
        documento:{
          idTipoDocumento:documento.idTipoDocumento,
          idTipoEstadoDocumento:documento.idTipoEstadoDocumento,
          fecha:documento.fecha,
          registroActivo:documento.registroActivo
        }
      }),
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

}
