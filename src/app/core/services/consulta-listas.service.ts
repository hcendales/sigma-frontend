import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultaListasService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  public listas: any = {};
  constructor(private securityService: SecurityService, private http: HttpClient) {

  }

  public async consultarListas(idsLista:number[]){

    let res:any = {};
    let idsPorConsultar = [];
    for(let idLista of idsLista){
      let lista = this.listas[idLista];
      if(lista){
        lista.sort((a:any,b:any) => (a.descripcion > b.descripcion) ? 1 : ((b.descripcion > a.descripcion) ? -1 : 0));
        res[idLista] = lista;
      }
      else{
        idsPorConsultar.push(idLista);
      }
    }

    if(idsPorConsultar.length === 0){
      return res;
    }

    //si la lista no ha sido consultada, ejecuta el servicio de consulta de listas
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      usuario: this.securityService.userSession.login,
      json: JSON.stringify({usuario: this.securityService.userSession.login,filtro:"id_lista in ("+idsPorConsultar.join()+")"}),
      url: environment.URL_CALIOPE_BACK + "api/tipo/consultarXFiltro"
    }
    let response:any = await this.http.post<any>(url, body , this.httpOptions).toPromise();
    let lista = JSON.parse(response.respuesta[0].json).respuesta;

    //agrega la lista consultada al objeto de listas
    for(let tipo of lista){
      let nuevoTipo = {id_tipo:tipo.id_tipo, valor:tipo.valor, descripcion:tipo.descripcion};
      if(res[tipo.id_lista]){
        this.listas[tipo.id_lista].push(nuevoTipo);
        res[tipo.id_lista].push(nuevoTipo);
      }else{
        this.listas[tipo.id_lista] = [nuevoTipo];
        res[tipo.id_lista] = [nuevoTipo];
      }
    }
    for(let idLista in res){
      res[idLista].sort((a:any,b:any) => (a.descripcion > b.descripcion) ? 1 : ((b.descripcion > a.descripcion) ? -1 : 0));
    }
    return res;
  }

  public async consultarTipos(idsTipo:number[]){
      console.log('los idsTipos', idsTipo);
        let res:any = {};
        let url = '/SIGMA-backend-desa/api/externo/consume';
        this.securityService.userSession.login;
        let body = {
          usuario: this.securityService.userSession.login,
          json: JSON.stringify({usuario: this.securityService.userSession.login,filtro:"id_tipo in ("+idsTipo.join()+")"}),
          url: environment.URL_CALIOPE_BACK + "api/tipo/consultarXFiltro"
        }
        let response:any = await this.http.post<any>(url, body , this.httpOptions).toPromise();
        
        let listaTipos = JSON.parse(response.respuesta[0].json).respuesta;
        
        for(let tipo of listaTipos ){
          res[tipo.id_tipo] = {valor:tipo.valor,descripcion:tipo.descripcion}
        }
        return res;
  }

}
