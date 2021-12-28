import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Archivo } from '../models/archivo';
import { SecurityService } from '../security/services/security.service';
import { IEntityService } from './i-entity-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntityTabArchivoServiceService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private securityService: SecurityService, private http: HttpClient) { }

  //consulta por el idDeArchivo
  async get(idEntity: number):Promise<Archivo> {
    let url = '/SIGMA-backend-desa/api/archivo/consultar';
    let body = {
      usuario: this.securityService.userSession.login,
      idDocumento:idEntity
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  update(entity: any,idTipoArchivo:string) {
    const formData: FormData = new FormData();
    formData.append('file', entity.selectedFile!, entity.selectedFile!.name);
    formData.append('idDocumento', entity.idDocumento!.toString());
    formData.append('idMantenimientoVial', entity.idMantenimientoVial!.toString());
    formData.append('Usuario', this.securityService.userSession.login);
    formData.append('idArchivos', entity.idArchivo);
    formData.append('idTiposArchivos', idTipoArchivo.toString());

    let url = '/SIGMA-backend-desa/api/archivo/actualizar';

    return this.http.post<any>(url, formData);
    /*
    let url = '/SIGMA-backend-desa/api/archivo/actualizar';
    let flInfo = {
      usuario: this.securityService.userSession.login,
      file: entity.selectedFile,
      idDocumento: entity.idDocumento,
      idMantenimientoVial: entity.idMantenimientoVial,
      idArchivos: [entity.idArchivo]
    };
    return this.http.post<any>(url, JSON.stringify(flInfo), this.httpOptions);
    */
  }

  create(entity:Archivo,idTipoArchivo:string): any{
    console.log('COSO',entity);
    console.log('idTipoArchivo',idTipoArchivo);
    const formData: FormData = new FormData();

    formData.append('file', entity.selectedFile!, entity.selectedFile!.name);
    formData.append('idDocumento', entity.idDocumento!.toString());
    formData.append('idMantenimientoVial', entity.idMantenimientoVial!.toString());
    formData.append('Usuario', this.securityService.userSession.login);
    formData.append('idTiposArchivos', idTipoArchivo.toString());
    // console.log('FormData', formData);
    let url = '/SIGMA-backend-desa/api/archivo/insertar';

    return this.http.post<any>(url, formData);
  }

  delete(idEntity: number) {
    let url = '/SIGMA-backend-desa/api/archivo/eliminar';
    let body = {
      usuario: this.securityService.userSession.login,
      idArchivo:idEntity,
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions);
  }

  list(condition: string) {
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      usuario: this.securityService.userSession.login,
      json:JSON.stringify({
        "idUsuario": this.securityService.userSession.idUsuario,
        "usuario": this.securityService.userSession.login,
        "filtro": condition
      }),
      //#Esquema2021#
      url: environment.URL_CALIOPE_BACK + "api/archivo/consultarXFiltro"
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  async listArchivos(condition: string) {
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      usuario: this.securityService.userSession.login,
      json: JSON.stringify({usuario: this.securityService.userSession.login,filtro:condition}),
      url: environment.URL_CALIOPE_BACK + "api/archivo/consultarXFiltro"
    }
    let response:any = await this.http.post<any>(url, body , this.httpOptions).toPromise();
    let listaArchivos = JSON.parse(response.respuesta[0].json);
    return listaArchivos;
  }

  async consultarDocumentoAdjunto(idDocumento:number){
    let url = '/SIGMA-backend-desa/api/archivo/consultarDocumentoAdjunto';
    let body = {
      usuario: this.securityService.userSession.login,
      idDocumento:idDocumento
    }
    return this.http.post(url, body , {observe: 'response' ,responseType: 'blob' }).toPromise();
  }
 
}
