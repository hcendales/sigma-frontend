import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private KEY_LENGTH = 10;
  userSession: any;
  userMenus: any;
  // urls del objeto de usarmenus para facilitar la busqueda de urls
  private urlList:string[] = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'events'
  };

  constructor(private http: HttpClient) {

  }

  async login(loginData:any){

    try{
      let bodyLogin = {
        usuario: loginData.username,
        username: loginData.username,
        password: loginData.password
      }

      const urlLogin = '/SIGMA-backend-desa/api/usuario/login';

      const response: any = await this.http.post<any>(urlLogin, bodyLogin , this.httpOptions).toPromise();
      console.log('loge',response.body.respuesta);
      this.userSession = {
        login: response.body.respuesta[0].login,
        idUsuario: response.body.respuesta[0].id_usuario,
        nombre: response.body.respuesta[0].nombre,
        id_entidad: response.body.respuesta[0].id_entidad,
        id_localidad: response.body.respuesta[0].codigo_localidad,
        token: response.headers.get('token')
      }

      console.log(this.userSession.id_usuario);

      this.saveSession(this.userSession);

      await this.getUserMenus();

      return {sucess:true};
    }
    catch(error){
      if(error.status!==401){
        console.error(error);
      }
      const msj = error.status===401?'Credenciales de acceso inválidas':'Error interno';
      return {sucess:false,msj:msj};
    }

  }

  private saveSession(authResult:any){
    const validCharacters = '+!@#$%&/=1234567890AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    const vCLength = validCharacters.length;
    let key = '';
    for ( let i = 0; i < this.KEY_LENGTH; i++ ) {
      key += validCharacters.charAt(Math.floor(Math.random() * vCLength));
    }
    let enc = CryptoJS.AES.encrypt(JSON.stringify(authResult), key).toString();
    for(let i = 0; i<key.length;i++){
      if(i%2){
        enc = key[i]+enc;
      }else{
        enc += key[i];
      }
    }
    localStorage.setItem('localData',enc);
  }

  loadSession(){
    let data = localStorage.getItem("localData");
    if(!data){
      return false;
    }
    let key = '';
    for ( let i = 0; i < this.KEY_LENGTH; i++ ) {
      if(i%2){
        key = data.slice(data.length-1)+key;
        data = data.slice(0,-1);
      }else{
        key = data[0]+key;
        data = data.slice(1,data.length);
      }
    }
    try {
    this.userSession = JSON.parse(CryptoJS.AES.decrypt(data.trim(), key.trim()).toString(CryptoJS.enc.Utf8));
    }
    catch(error){
      console.error(error);
      this.logout();
      return false;
    }
    return true;
  }

  logout(){
    localStorage.removeItem("localData");
    this.userSession = null;
    this.userMenus = null;
    //localStorage.clear();
  }

  getToken(){
    return this.userSession?.token;
  }

  getExpiration() {

    const expiration = this.userSession?.expiresAt;
    if(!expiration){
      return null;
    }
    const expiresAt = expiration !== null ?JSON.parse(expiration):null;
    return expiresAt;

  }

  isLoggedIn(){
    if(!this.userSession || this.userSession.token === null){
      return this.loadSession();
    }
    return true;
  }

  async getUserMenus(){
      let userInfo = {
        usuario:this.userSession.login,
        json:JSON.stringify({
          "idUsuario": this.userSession.idUsuario,
          "usuario": this.userSession.login,
          "menu":{"idMenu":1},
          "sistema": 10001
        }),
        //#Esquema2021#

        url: environment.URL_CALIOPE_BACK + "api/menu/listarMenuUsuarioT"
        //#Esquema2020#
        //url: environment.URL_CALIOPE_BACK + "api/menu/listarMenuUsuarioT"
      }

      let urlMenus = '/SIGMA-backend-desa/api/externo/consume';

      let responseMenus:any = await this.http.post<any>(urlMenus, userInfo, this.httpOptions).toPromise();
      this.userMenus = JSON.parse(responseMenus.body.respuesta[0].json)?.menulist;

      while(this.userMenus?.length===1){
        this.userMenus = this.userMenus[0].tabMenuList;
      }
  }

  //verifica si el usuario tiene permiso para acceder a la url
  async validUrl(path:string){

    if(!this.userMenus){
      await this.getUserMenus();
    }
    if(path.indexOf('revisar-visita') !=-1 || path.indexOf('registro') !=-1){
      return true;
    }
    if(this.urlList?.length == 0 ){
      for(let tm of this.userMenus){
        this.urlList = [...this.urlList,...this.visitMenu(tm)];
      }
    }
    for(let url of this.urlList){
      //verifica si alguna ruta autorizada está contenida en el path
      if(path.length > 0 && path.indexOf(url) === 0){
        return true;
      }
    }
    return false;
  }
  //método recurrente para obtener las url de los enlaces
  private visitMenu(tabMenu:any):string[]{
    let res:string[] = [];
    if(tabMenu.tabMenuList.length === 0){
      res.push(tabMenu.url);
    }else{
      for(let tm of tabMenu.tabMenuList){
        res = [...res,...this.visitMenu(tm)] as string[];
      }
    }
    return res;
  }

}
