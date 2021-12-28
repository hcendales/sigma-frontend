import { Injectable } from '@angular/core';
import { SecurityService } from '../security/services/security.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesoIntervencionService {

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
   * Permite obtener la lista de maquinaria y 
   * equipos para el registro de mantenimiento.
   * 
   * @param filtro Filtro de la consulta 
   * @returns Lista de maquinaria y equipos.
   */
  listarProgramacionPeriocidad(filtro?:any){
    const url = '/SIGMA-backend-desa/api/intervencion/programacionPeriodica/consultarActivas';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  
  /**
   * Permite insertar un registro de programacion periodica.
   * 
   * @param programacion-periodica Modelo del compoenente. 
   * @returns Respuesta de backend a la peticion.
   */
  insertarProgramacionPeriodica(programacion_periodica:any){
    const url = '/SIGMA-backend-desa/api/intervencion/programacionPeriodica/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      progPeriodica: {
        idTipoPeriodoProgramacion: programacion_periodica.idTipoPeriodoProgramacion,
        idArchivo: programacion_periodica.idArchivo,
        observaciones: programacion_periodica.observaciones,
        totalNumeroCuadrillas: programacion_periodica.totalNumeroCuadrillas
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite actualizar un registro de programacion periodica.
   * 
   * @param programacion-periodica Modelo del compoenente. 
   * @returns Respuesta de backend a la peticion.
   */
  actualizarProgramacionPeriodica(programacion_periodica:any){
    const url = '/SIGMA-backend-desa/api/intervencion/programacionPeriodica/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      progPeriodica: {
        idTipoPeriodoProgramacion: programacion_periodica.idTipoPeriodoProgramacion,
        idArchivo: programacion_periodica.idArchivo,
        observaciones: programacion_periodica.observaciones,
        totalNumeroCuadrillas: programacion_periodica.totalNumeroCuadrillas
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Optiene la lista de vigencias.
   * @returns Lista de vigencias.
   */
  obtenerVigencias(): any {
    const url = '/SIGMA-backend-desa/api/intervencion/periodoProgramacion/filtrarVigencias';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Consultar los periodos.
   * @param vigencia Vigencia del periodo.
   * @param idPeriodicidad ID de la periocidad.
   * @returns Lista de periodos
   */
  consultarPeriodos(vigencia: number, idPeriodicidad: number): any {
    const url = '/SIGMA-backend-desa/api/intervencion/periodoProgramacion/consultar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      vigencia: vigencia,
      idPeriodicidad: idPeriodicidad
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Inserta un arcivo en caliope.
   * @param file Contenido del archivo.
   * @param idTiposArchivos Tipo de achivo.
   * @returns ID del archivo
   */
   async insertarArcivoCaliope(file:any, idTiposArchivos:string) {
    const url = '/SIGMA-backend-desa/api/archivo/insertarArchivoCal';
    const formData: FormData = new FormData();
    formData.append('idTiposArchivos', idTiposArchivos);
    formData.append('Usuario', this.securityService.userSession.login);
    formData.append('file', file, file.name);
    const response : any = await this.http.post(url, formData ).toPromise();
    return response.respuesta[0].idArchivo
  }

  async consultarArchivoCal(idArchivo:number) {
    const url = '/SIGMA-backend-desa/api/archivo/consultarArchivoCal';
    let body = {
      usuario: this.securityService.userSession.login,
      idArchivo,
    }
    return this.http.post(url, body, { observe: 'response', responseType: 'blob' }).toPromise();
  }

  /**
   * Adiciona un PK a un grupo de periodo.
   * @param idProgramacionPeriodica ID del grupo.
   * @param idMantenimientoVial ID del PK.
   * @returns Resultado de la operacion.
   */
  adicionarPKGrupo(idProgramacionPeriodica: number, idMantenimientoVial: number){    
    const url = '/SIGMA-backend-desa/api/intervencion/programacionPeriodica/adicionarPK';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      detalle: {
        idProgramacionPeriodica: idProgramacionPeriodica,
        idMantenimientoVial: idMantenimientoVial
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Remueve un PK a un grupo de periodo.
   * @param idProgramacionPeriodicaMV ID de la asignacion.
   * @returns Resultado de la operacion.
   */
   remuevePKGrupo(idProgramacionPeriodicaMV: number){    
    const url = '/SIGMA-backend-desa/api/intervencion/programacionPeriodica/removerPK';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      detalle: {
        idProgramacionPeriodicaMV: idProgramacionPeriodicaMV
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite obtener la lista PKs para asociar a un grupo 
   * de programacion periodica.
   * 
   * @param filtro Filtro de la consulta 
   * @returns Lista de PKs.
   */
   listarPKsAsociar(filtro?:any){
    let url = '/SIGMA-backend-desa/api/intervencion/programacionPeriodica/listarPkAsociar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idActividad: filtro.idActividad, 
      progPeriodica:
      {
        idProgramacionPeriodica: filtro.idProgramacionPeriodica
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite obtener la lista de maquinaria y 
   * equipos para el registro de mantenimiento.
   * 
   * @param filtro Filtro de la consulta 
   * @returns Lista de maquinaria y equipos.
   */
  listaRProgramacionSinPMT(filtro?:any){
    let url = '/SIGMA-backend-desa/api/produccion/listarFallos';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      pk_id_calzada: filtro.pk_id_calzada,
      civ: filtro.civ,
      descripcion_localidad: filtro.descripcion_localidad,
      descripcion_upz: filtro.descripcion_upz,
      tipo_intervencion: filtro.tipo_intervencion,
      descripcion_tipo_estrategia: filtro.descripcion_tipo_estrategia,
      director: filtro.director,
      km_carril_impacto: filtro.km_carril_impacto,
      km_carril_lineal: filtro.km_carril_lineal,
      km_carril_obra: filtro.km_carril_obra,
      vigencia_programacion_periodica: filtro.vigencia_programacion_periodica,
      descripcion_periodicidad: filtro.descripcion_periodicidad,
      periodo: filtro.periodo,
      duracion: filtro.duracion,
      nombre_responsable_visita: filtro.nombre_responsable_visi
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }


  /**
   * Permite insertar un registro de asiciacion.
   * 
   * @param solicitud-pmt Modelo del compoenente. 
   * @returns Respuesta de backend a la peticion.
   */
  insertarSolicitud(solicitud:any){
    let url = '/SIGMA-backend-desa/api/PMT/asociarSolicitud';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idMantenimientoVial: solicitud.idMantenimientoVial,
      idTipoPMT: 911,
      numeroRadicadoUMV: solicitud.radicado,
      fechaRadicadoUMV: solicitud.fechaRadicadoUMV,
      idDocumento: solicitud.idDocumento
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
    * Permite actualizar un registro de asociacion.
    * 
    * @param solicitud-pmt Modelo del compoenente. 
    * @returns Respuesta de backend a la peticion.
    */
  actualizarSolicitud(solicitud: any) {
    let url = '/SIGMA-backend-desa/api/PMT/asociarSolicitud';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      radicado: solicitud.radicado,
      coi: solicitud.coi,
      radicado_sdm: solicitud.radicado_sdm,
      tipo_respuesta: solicitud.tipo_respuesta,
      observaciones: solicitud.observaciones,
      reporte_coi_ver: solicitud.reporte_coi_ver,
      actividad_destino: solicitud.actividad_destino,

    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }

  /**
    * Permite desAsociar un registro de asociacion.
    * 
    * @param solicitud-pmt Modelo del compoenente. 
    * @returns Respuesta de backend a la peticion.
    */
  desasociarRadicado(solicitud: any) {
    let url = '/SIGMA-backend-desa/api/PMT/desasociarRadicado';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idMantenimientoVial: solicitud.id_mantenimiento_vial,
      idRadicado: solicitud.id_radicado,
      tipoRadicado: solicitud.tipo,
      radicado: solicitud.id_radicado
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }

  /**
   * Permite obtener el ID del nuevo documento.
   * @param idTipoDocumento ID del nuevo documento.
   * @returns 
   */
  async obtenerIdDocumento(idTipoDocumento: number) {  
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      url: environment.URL_CALIOPE_BACK + "api/documento/insertar",
      usuario: this.securityService.userSession.login,
      json: JSON.stringify({
        usuario: this.securityService.userSession.login,
        documento: {
          registroActivo: "SI",
          idTipoDocumento: idTipoDocumento,
          idTipoEstadoDocumento: 1041,
          fecha: Date.now(),
        }
      }),
    }
    const response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    const result = JSON.parse(response.respuesta[0].json);
    const _val = result.codError !== 0 ? result.msgError : result.respuesta[0].id_documento;
    return _val;
  }

  /**
   * Permite insertar un registro de asiciacion.
   * 
   * @param solicitud-pmt Modelo del compoenente. 
   * @returns Respuesta de backend a la peticion.
   */
  insertarCOI(solicitud:any){
    let url = '/SIGMA-backend-desa/api/PMT/registrarRespuesta';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idMantenimientoVial: solicitud.idMantenimientoVial,
      coi: solicitud.coi,
      idTipoEstadoPMT: solicitud.idTipoEstadoPMT,
      numeroRadicadoRta: solicitud.radicado_sdm,
      fechaRadicadoRta: solicitud.fechaRadicadoRta,
      idArchivoCoi: solicitud.idArchivoCoi,
      observaciones: solicitud.observaciones,
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
 * Permite consultar un registro de asociacion.
 * 
 * @param coi opcional dato del campo COI en el formulario
 * @param numeroRadicadoRta opcional dato del campo numeroRadicadoRta en el formulario
 * @returns Respuesta de backend a la peticion.
 */
  consultaArchivoCOI(coi?: string, numeroRadicadoRta?: number) {
    let url = '/SIGMA-backend-desa/api/PMT/consultaArchivoCOI';
    let body = {
      usuario: this.securityService.userSession.login,
      coi,
      numeroRadicadoRta,
    }
    return this.http.post<any>(url, body, this.httpOptions).toPromise();
  }

  /**
   * Permite actualizar un registro de asociacion.
   * 
   * @param solicitud-pmt Modelo del compoenente. 
   * @returns Respuesta de backend a la peticion.
   */
  actualizarCOI(solicitud:any){
    let url = '/SIGMA-backend-desa/api/produccion/fallo/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      coi: solicitud.coi,
      radicado_sdm: solicitud.radicado_sdm,
      tipo_respuesta: solicitud.tipo_respuesta,
      observaciones: solicitud.observaciones,
      reporte_coi_ver: solicitud.reporte_coi_ver,
      actividad_destino: solicitud.actividad_destino,

    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  consultarRadicados(filtro: any): any {
    let url = '/SIGMA-backend-desa/api/PMT/consultarRadicados';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idMantenimientoVial: filtro,
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

}
