import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Archivo } from '../models/archivo';
import { informeDetalle, SolicitudEnsayoLaboratorio } from '../models/solicitud-ensayo-laboratorio';
import { SecurityService } from '../security/services/security.service';
import { SolicitudEnsayoLaboratorioService } from './solicitud-ensayo-laboratorio.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargueResultadoEnsayoService {

  public listas: any = {};
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private securityService: SecurityService,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,
    private solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService) { }

    /**
     * obtiene las versiones de ensayos asociadas por el codigo_ensayo
     */
  public buscarVersiones(codigo_ensayo: string) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/consultarXFiltro';

    body = {
      usuario: this.securityService.userSession.login,
      filtro: "codigo_ensayo = '" + codigo_ensayo + "'"
    }
    const response = this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();

    return response;
  }

  public buscarSolcitudesPriorizadas(filtro: string = "") {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/consultarOrdenPrioridad';

    body = {
      usuario: this.securityService.userSession.login,
      filtro: filtro
    }
    const response = this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();

    return response;
  }

  /*Lista las solicitudes de ensayos de acuerdo a un filtro*/
  public listarSolicitudesEnsayos(filtro: string) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/consultarXFiltro';

    body = {
      usuario: this.securityService.userSession.login,
      filtro: filtro
    }
    const response = this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();

    return response;
  }

  /** Actualiza la solicitud de ensayo laboratorio 
   * @param idTipoServicio : 53 D.N - 54 A.P - 55 N.U - 56 F.T - 109 OTROS
   * @param fechaSolicitud : Date.now()
   * @param idUsuarioSolicitud : Id del usuario login
   */
  public async actualizarSolicitudEnsayo(itm: SolicitudEnsayoLaboratorio) {
                            
    const url = '/SIGMA-backend-desa/api/laboratorio/ensayo/actualizar';
    const body:any =  { 
              usuario: this.securityService.userSession.login, 
              ensayo: 
              {
                codigoEnsayo                       : itm.codigo_ensayo,
                fechaProgramada                    : formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
                fechaSolicitud                     : formatDate(itm.fecha_solicitud,  'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
                fechaToma                          : formatDate(itm.fecha_toma, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
                idDocumento                        : itm.id_documento,
                idEnsayo                           : itm.id_ensayo,
                idResponsableToma                  : itm.id_responsable_toma,  
                idTipoServicio                     : itm.id_tipo_servicio,
                idUsuarioSolicitud                 : this.securityService.userSession.idUsuario,
                novedades                          : itm.novedades,
              }
            }

    const response: any = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }            

  /***
   * Buscar Informes asociados a la solicitud 
   */
  public async buscarInforme(filtro: string) {

      let body: any = {};
      let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/informe/consultarXFiltro';
      body =  { 
                usuario: this.securityService.userSession.login,
                filtro
              }
      return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }  

  /**
   * Actualiza la solicitud agregando solo varios campos del ensayo
   */
  public async guardarGestion(itm: SolicitudEnsayoLaboratorio) {
    
    let body: any = {};
    const url = '/SIGMA-backend-desa/api/laboratorio/ensayo/actualizarCampo';
    body =  { usuario: this.securityService.userSession.login, 
      "nombreCampo": "fecha_toma;fecha_programada;id_responsable_toma;novedades;situacion;id_usuario_recibe_muestra;id_tipo_observacion",
      "valorCampo": formatDate(itm.fecha_toma, 'dd-MMM-yyyy', this.locale) + ";" + 
                    formatDate(itm.fecha_programada, 'dd-MMM-yyyy', this.locale) + ";" + 
                    itm.id_responsable_toma + ";" + 
                    itm.novedades + ";GESTION" + ";" + 
                    itm.id_usuario_recibe_muestra + ";" + 
                    itm.id_tipo_observacion,
              ensayo: {
                          "idEnsayo" : itm.id_ensayo
                      }
            }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /**
   * Actualiza la solicitud agregando solo varios campos del ensayo
   */
  public async guardarInforme(itm: informeDetalle, idTipoServicio: number) {

    let body: any = {};
    const url = '/SIGMA-backend-desa/api/laboratorio/ensayo/informe/insertar';
    //const id_documento : number = await this.solicitudEnsayoLaboratorioService.obtenerIdDocumento(17)
    body =  { usuario: this.securityService.userSession.login, 
              informe:
              {
                asunto                              : itm.asunto,
                fechaRadicado                       : formatDate(itm.fecha_radicado, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
                fechaResultado                      : formatDate(itm.fecha_resultado, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
                //idDocumentoInforme                  : id_documento,
                idEnsayo                            : itm.id_ensayo,
                idTipoResultado                     : itm.id_tipo_resultado,
                idUsuarioLaboratorio                : this.securityService.userSession.idUsuario,
                numeroRadicado                      : itm.numero_radicado,
                observaciones                       : itm.observaciones,
              }
            }

    if (idTipoServicio === 54) body.informe['idTipoDocumento'] = 251;
    return await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();

    
  }  
    
  /**
   * Actualiza la solicitud agregando solo varios campos del ensayo
   */
  public async actualizarInforme(itm: informeDetalle) {

    let body: any = {};
    const url = '/SIGMA-backend-desa/api/laboratorio/ensayo/informe/actualizar';
    body =  { usuario: this.securityService.userSession.login, 
              informe:
              {
                asunto                              : itm.asunto,
                fechaRadicado                       : formatDate(itm.fecha_radicado, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
                fechaResultado                      : formatDate(itm.fecha_resultado, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
                //idDocumentoInforme                  : await this.solicitudEnsayoLaboratorioService.obtenerIdDocumento(17),
                idEnsayo                            : itm.id_ensayo,
                idEnsayoinforme                     : itm.id_ensayo_informe,
                idTipoResultado                     : itm.id_tipo_resultado,
                idUsuarioLaboratorio                : this.securityService.userSession.idUsuario,
                numeroRadicado                      : itm.numero_radicado,
                observaciones                       : itm.observaciones,
              }
            }

    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }  



  public async crearEnsayoApique(idMantenimientoVial:number,pkIdCalzada:number, numeroApiques:number, prioridad:number ){
    const url = '/SIGMA-backend-desa/api/gestionEnsayo/crearEnsayoApique';
    let body = {usuario:this.securityService.userSession.login, 
                idMantenimientoVial:idMantenimientoVial,
                pkIdCalzada:pkIdCalzada,
                apiques:numeroApiques,
                prioridad:prioridad,
                direccion: environment.URL_CALIOPE_BACK +"api/correo/enviarNotificacionCorreo"
   }
   return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /**
   * Actualizar Estado del documento CALIOPE
   * 
   * ESTADOS DEL DOCUMENTO:
   * @var 1040 MIGRADO
   * @var 1041 BORRADOR    (desbloqueo)
   * @var 1042 REGISTRADO
   * @var 1043 APROBADO
   * @var 1044 EN FIRME    (bloqueado)
   * @var 1045 RECHAZADO
   * @var 1046 ANULADO
   * @var 1047 REEMPLAZADO
   * @var 1048 REVISADO
   * 
   * @param idDocumento, 
   * @param estado [Desbloqueo: 1041 => true, Bloqueado: 1044 => false | todos los demas]
   * @returns id_documento;
   */
  public async bloqueoDocumentoCaliope(idDocumento: number, estado: boolean) {
    
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
                  url: environment.URL_CALIOPE_BACK + "api/documento/insertar",
                  usuario: this.securityService.userSession.login,
                  json: JSON.stringify({ 
                                        
                                        usuario: this.securityService.userSession.login, 
                                        documento : {
                                                    idDocumento           : idDocumento,
                                                    registroActivo        : "SI",
                                                    idTipoDocumento       : 16,
                                                    idTipoEstadoDocumento : estado ? 1041 : 1044,
                                                    fecha                 : Date.now(),
                                                    }
                                      }),
              }

    let response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    let jsonRespuesta = JSON.parse(response.respuesta[0].json).respuesta;
    return jsonRespuesta[0].id_documento;
  }


  /**
   * Consulta Estado del documento CALIOPE
   *
   * ESTADOS DEL DOCUMENTO:
   * @var 1040 MIGRADO
   * @var 1041 BORRADOR    (desbloqueo)
   * @var 1042 REGISTRADO
   * @var 1043 APROBADO
   * @var 1044 EN FIRME    (bloqueado)
   * @var 1045 RECHAZADO
   * @var 1046 ANULADO
   * @var 1047 REEMPLAZADO
   * @var 1048 REVISADO
   *
   * @param estado [Desbloqueo: 1041 => true, Bloqueado: 1044 => false | todos los demas]
   * @returns boolean true / false;
   */
  public async buscarEstadoBloqueoDocumentoCaliope(idDocumento: number) {
    
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
                  url: environment.URL_CALIOPE_BACK + "api/documento/consultarXFiltro",
                  usuario: this.securityService.userSession.login,
                  json: JSON.stringify({ 
                    usuario: this.securityService.userSession.login, 
                    filtro : " id_documento = " + idDocumento 
                  }),
              }

    let response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    let jsonRespuesta = JSON.parse(response.respuesta[0].json).respuesta;

    return jsonRespuesta[0].id_tipo_estado_documento === 1044 ? true : false;
  }  


   /**
   * Permite enviar una notificacion al usuario por medio del correo,
   * el Formulario envia el ID_USUARIO_SOLICITUD toca buscar el correo de ese usuario
   * debido al cruce de libreria se crea NUEVAMENTE la funcion de Notificar


   * @param id_plantilla = ( 4 ) Notifica nueva Solicitud / ( 5 ) Notifica la gestion de la solicitud
   * @param id_roles = ( 11121 ) SIGMA_SOLICITUD_LAB / ( 11122 ) SIGMA_REG_LAB
   * @param codigoEnsayo = ZZ-9,99-AA-MM-XXX.
   * @param prioridad = 10 - 1 donde 1 es max Prioridad y solo la maneja Apiques ( 10 ) default otros servicios
   * @param observacion = Campo Novedades
   * @returns 
   */

  public async notificarSolicitud(id_plantilla: string, id_roles: string, codigoEnsayo: string, observacion: string, id_ensayo: number) {
    
    await this.cambiarEstadoSolicitud(id_ensayo, "NOTIFICADA");
    
    const url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
                  url: environment.URL_CALIOPE_BACK + "api/correo/enviarNotificacionCorreo",
                  usuario: this.securityService.userSession.login,
                  json: JSON.stringify({ 
                    usuario: this.securityService.userSession.login, 
                    idPlantilla: id_plantilla,
                    roles: id_roles,
                    concopia: this.securityService.userSession.login + "@umv.gov.co",
                    destinatario: this.securityService.userSession.login + "@umv.gov.co",
                    reemplazarVariables: "@codigoEnsayo; @observacion",
                    reemplazarValores: codigoEnsayo + ";" + observacion
                  }),
              }

    let response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    return JSON.parse(response.respuesta[0].json).respuesta;
  }

    public async notificarInforme(id_plantilla: string, id_roles: string, codigoEnsayo: string, observacion: string) {
    
    const url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
                  url: environment.URL_CALIOPE_BACK + "api/correo/enviarNotificacionCorreo",
                  usuario: this.securityService.userSession.login,
                  json: JSON.stringify({ 
                    usuario: this.securityService.userSession.login, 
                    idPlantilla: id_plantilla,
                    roles: id_roles,
                    concopia: this.securityService.userSession.login + "@umv.gov.co",
                    destinatario: this.securityService.userSession.login + "@umv.gov.co",
                    reemplazarVariables: "@codigoEnsayo; @observacion",
                    reemplazarValores: codigoEnsayo + ";" + observacion
                  }),
              }

    let response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    return JSON.parse(response.respuesta[0].json).respuesta;
  }

  /**
   * Metodo que actualiza el estado de la solicitud
   * 
      1. NUEVO   = (default) Al crear la solicitud
      2. EDITADA = Al clonar y ser modificada
      3. GESTION = Registran los resultados (en la gestion)
      4. NOTIFICADA = Cuando al registrar los resultados quieren notificar alguna observacion (aqui puede regresar a EDITADA)
      5. FINALIZADO = Finaliza la solicitud no se puede editar

   * @param id_ensayo 
   * @param situacion 
   * @returns 
   */
  public async cambiarEstadoSolicitud(id_ensayo: number, situacion: string ) {

    let body: any = {};
    const url = '/SIGMA-backend-desa/api/laboratorio/ensayo/actualizarCampo';
    body = {
      usuario: this.securityService.userSession.login,
      "nombreCampo": "situacion",
      "valorCampo": situacion,
      ensayo: {
        "idEnsayo": id_ensayo
      }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();

  }
}
