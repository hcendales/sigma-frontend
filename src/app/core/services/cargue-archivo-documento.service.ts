import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class CargueArchivoDocumentoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(public securityService:SecurityService, private http: HttpClient) { }


  /** Carga los archivos que seran asociados al documento. */
  async realizarCargue(id_documento: number = 0, id_mantenimiento_vial: string = "", file : any){
    
    const url = '/SIGMA-backend-desa/api/archivo/insertarArchivoDocumento';
    const formData: FormData = new FormData();
    
    formData.append('idDocumento', id_documento.toString());
    formData.append('idTiposArchivos', '2055');
    formData.append('idMantenimientoVial', id_mantenimiento_vial);
    formData.append('Usuario', this.securityService.userSession.login);
    formData.append('file', file);
    
    const response : any = await this.http.post(url, formData ).toPromise();
    return response.respuesta[0].idArchivo
  }

  /** Consulta los archivos cargados por el IdDocumento */
  public async buscarArchivos(idDocumento: string = "") {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/archivo/consultar';

    body = {
      usuario: this.securityService.userSession.login,
      idDocumento: idDocumento
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /**
   * Servicio de descarga del Archivo
   * 
   * @param idDocumento 
   * @param idArchivo 
   * @returns 
   */
  public async descargarArchivo(idDocumento: number, nombre : string, idArchivo: number) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/archivo/consultarArchivoFisico';

    body = {
      usuario: this.securityService.userSession.login,
      idDocumento: idDocumento,
      idMantenimientoVial: nombre.split("_")[0],
      idArchivo: idArchivo
    }

    return this.http.post(url, body, { observe: 'response', responseType: 'blob' } ).toPromise();
  }
}
