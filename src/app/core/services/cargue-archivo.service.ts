import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class CargueArchivoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(public securityService:SecurityService, private http: HttpClient) { }

  procesarCargue(idTipoCargue:number,idCargue:number){
    let url = '/SIGMA-backend-desa/api/cargue/procesar';
    let body = {
      usuario: this.securityService.userSession.login,
      idTipoCargue:idTipoCargue,
      idCargue:idCargue,
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  validarCargue(idTipoCargue:number,idCargue:number){
    let url = '/SIGMA-backend-desa/api/cargue/validar';
    let body = {
      usuario: this.securityService.userSession.login,
      idTipoCargue:idTipoCargue,
      idCargue:idCargue,
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  realizarCargue(idTipoCargue:string, nombreArchivo:string, file:any){

    const formData: FormData = new FormData();

    formData.append('idTipoCargue', idTipoCargue);
    formData.append('nombreArchivo', nombreArchivo);
    formData.append('usuario', this.securityService.userSession.login);
    formData.append('file', file);

    let url = '/SIGMA-backend-desa/api/cargue/insertar';

    return this.http.post<any>(url, formData).toPromise();
  }


}
