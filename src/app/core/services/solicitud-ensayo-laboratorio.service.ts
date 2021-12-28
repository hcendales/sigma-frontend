
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { SolicitudEnsayoLaboratorio, listaPKMantActivos, listaEnsayo } from '../models/solicitud-ensayo-laboratorio';
import { SecurityService } from '../security/services/security.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEnsayoLaboratorioService {
  public listas: any = {};
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private securityService: SecurityService,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string) { }

  /**
   * CUS 12 [RN11]: Cada solicitud es codificada de la siguiente forma:
           Grupo: DN, AP, UN, DM, CA, EM, MP, MG, MA, CH (ZZ)
           Sub grupo: valor entre 1 y 11, dependiendo del material a ensayar que se reporte
           Año: AA
           Mes: MM
           Consecutivo: XXX <- todos las solicitudes cargados
           version: +1      <- versiones generadas de la misma solicitud
           codigo_ensayo:  ZZ-9,99-AA-MM-XXX.
   */
  public async generarVersion(id_tipo_servicio: number, id_tipo_material_ensayo: number, fecha_solicitud: string) {

    // let codRegistro       : any = [];
    let fechaSolicitud: string = fecha_solicitud.split("-")[0] + "-" + fecha_solicitud.split("-")[1];

    const servicio = [
      { descripcion_tipo_servicio: 'DN', id_tipo_servicio: 53 },
      { descripcion_tipo_servicio: 'AP', id_tipo_servicio: 54 },
      { descripcion_tipo_servicio: 'NU', id_tipo_servicio: 55 },
      { descripcion_tipo_servicio: 'FT', id_tipo_servicio: 56 },
      { descripcion_tipo_servicio: 'OTROS', id_tipo_servicio: 109 }
    ];

    const codServicio = servicio.find(servicio => servicio.id_tipo_servicio === id_tipo_servicio);
    const buscarSubGrupo = await this.buscarTipoMateriales("", id_tipo_material_ensayo);
    const preCod_ensayo = codServicio?.descripcion_tipo_servicio + "-" + buscarSubGrupo.respuesta[0].subgrupo + "-" + fechaSolicitud;
    // const buscarCod_ensayo       = await this.buscarSolicitudes("codigo_ensayo like '%" + preCod_ensayo + "%'");
    // const consecutivo            = buscarCod_ensayo.respuesta.length + 1;
    // codRegistro['consecutivo']   = ( "000" + consecutivo ).slice(-3);
    // codRegistro['codigo_ensayo'] = preCod_ensayo +"-"+ codRegistro.consecutivo

    return preCod_ensayo
  }

  /** Realiza Busqueda de los PKs Mantenimientos Activos  */
  public async buscarMantenimientoActivo(
    pkIdCalzada: string | "",
    civ: string | "",
    idZona: number | null,
    idLocalidad: number | null,
    idBarrio: number | null,
    idUPZ: number | null,
    idsMantenimientoVial: string = "",
  ) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/consulta/pkMantenimientosActivos';
    body = { usuario: this.securityService.userSession.login, }

    if (pkIdCalzada) body['pkIdCalzada'] = pkIdCalzada;
    if (civ) body['civ'] = civ;
    if (idZona) body['idZona'] = idZona;
    if (idLocalidad) body['idLocalidad'] = idLocalidad;
    if (idBarrio) body['idBarrio'] = idBarrio;
    if (idUPZ) body['idUPZ'] = idUPZ;
    if (idsMantenimientoVial) body['idsMantenimientoVial'] = idsMantenimientoVial;

    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  buscarIdMantenimientoVialEvento(idsMantenimientoVialEvento: string = "") {
    const url = '/SIGMA-backend-desa/api/apique/consultarXFiltro';
    let body : any = {usuario: this.securityService.userSession.login};
    if (idsMantenimientoVialEvento) body["filtro"] = "id_mantenimiento_vial_evento IN (" + idsMantenimientoVialEvento +")";

    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }  

  /** Obtiene las solicitudes con las descripciones */
  public async buscarSolicitudes(filtro: string = "") {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/consultarXFiltro';

    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }
    const response = this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();

    return response;
  }

  /**
   * Obtiene las personas en Caliope
   * @param filtro 
   * @returns 
   */
  public async buscarPersona(filtro: string,) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/persona/consultarXFiltro';
    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }


  /** Obtiene la lista de ensayos tipo de servicio
      * @param 53 D.N Densidades de campo
      * @param 54 A.P Apiques
      * @param 55 N.U Nucleos
      * @param 56 F.T Formula de Trabajo
      * @param 57 C.A Cemento Asfaltico
      * @param 58 E.M Emulsión Asfáltica
      * @param 59 M.P Materiales pétreos
      * @param 60 M.G Materiales granulares
      * @param 107 M.A Mezcla Asfáltica
      * @param 108 C.H Concreto hidráulico
      * @param 109 OTROS Otros
      */
  public async buscarTipoEnsayoXServicio(idtipoServicio: number) {

    let body: any = {};
    let cod = "id_tipo_servicio = '" + idtipoServicio + "'";
    let url = '/SIGMA-backend-desa/api/laboratorio/tipoServicioEnsayo/consultarXFiltro';

    body = {
      usuario: this.securityService.userSession.login,
      filtro: cod
    }

    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /** Obtiene la lista Materiales de tipo de material
   *  fue creado id_tipo_material_ensayo para obtener el subgrupo y agregar al codigo del ensayo.
      * @param 53 D.N Densidades de campo
      * @param 54 A.P Apiques
      * @param 55 N.U Nucleos
      * @param 56 F.T Formula de Trabajo
      * @param 57 C.A Cemento Asfaltico
      * @param 58 E.M Emulsión Asfáltica
      * @param 59 M.P Materiales pétreos
      * @param 60 M.G Materiales granulares
      * @param 107 M.A Mezcla Asfáltica
      * @param 108 C.H Concreto hidráulico
      * @param 109 OTROS Otros
      */
  public async buscarTipoMateriales(descripcion_tipo_servicio: string, id_tipo_material_ensayo: number = 0) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/tipoMaterialEnsayo/consultarXFiltro';
    let cod = descripcion_tipo_servicio === 'FTMODAL' ? "subgrupo is null" : "descripcion_tipo_servicio = '" + descripcion_tipo_servicio + "' and subgrupo is not null";

    body = {
      usuario: this.securityService.userSession.login,
      filtro: cod
    }


    if (id_tipo_material_ensayo > 0) {
      body = {
        usuario: this.securityService.userSession.login,
        filtro: "id_tipo_material_ensayo = " + id_tipo_material_ensayo
      }
    }

    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }
  /** Obtiene el IdDocumento de Caliope, 
   * ESTADOS DEL DOCUMENTO:
   * @var 1040 MIGRADO
   * @var 1041 BORRADOR    (desbloqueo)
   * @var 1042 REGISTRADO
   * @var 1043 APROBADO
   * @var 1044 EN FIRME    (bloqueado)
   * @var 1045 RECHAZADO
   * @var 1046 ANULADO
   * @var 1047 REEMPLAZADO
   * @var 1048 REVISADO*
   * 
   * @param Tabla_Solicitud : id_ensayo = idTipoDocumento(16)
   * @param Tabla_Informe   : id_ensayo = idTipoDocumento(17)
   * */
  public async obtenerIdDocumento(idTipoDocumento: number = 16) {

    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      url: environment.URL_CALIOPE_BACK +"api/documento/insertar",
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

  /** registra la solicitud de ensayo laboratorio 
   * @param idTipoServicio : 53 D.N - 54 A.P - 55 N.U - 56 F.T - 109 OTROS
   * @param fechaSolicitud : Date.now()
   * @param idUsuarioSolicitud : Id del usuario login
   */
  public async guardarSolicitudEnsayo(itm: SolicitudEnsayoLaboratorio) {

    let body: any = {};
    const url = '/SIGMA-backend-desa/api/laboratorio/ensayo/insertar';
    const idDocumento : number = await this.obtenerIdDocumento(); //// Obtiene el ID de documento Caliope
    if (idDocumento === null) {
      return false;
    }
    const fecha_solicitud = formatDate(Date.now(), 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z'
    const codigoEnsayo = await this.generarVersion(itm.id_tipo_servicio, itm.id_tipo_material_ensayo, fecha_solicitud);
    const prioridad = itm.id_tipo_servicio === 54 ? itm.prioridad : 10;
    body = {
      usuario: this.securityService.userSession.login,
      ensayo:
      {
        idDocumento: idDocumento,
        fechaSolicitud: fecha_solicitud,
        idUsuarioSolicitud: this.securityService.userSession.idUsuario,
        idTipoServicio: itm.id_tipo_servicio,
        fechaRecepcion: itm.fecha_recepcion === undefined || itm.fecha_recepcion === null || itm.fecha_recepcion.toString() === "" ? "" : formatDate(itm.fecha_recepcion, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
        idTipoObservacion: itm.id_tipo_observacion,
        idUsuarioRecibeMuestra: itm.id_usuario_recibe_muestra,
        codigoEnsayo: codigoEnsayo,
        version: 1,
        prioridad: prioridad ? 10 : 1,
      }
    }

    switch (itm.id_tipo_servicio) {
      case 53: { ////> DENSIDAD DE CAMPO
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        body['ensayo']['hora'] = itm.hora;
        body['ensayo']['idPersonaDirectorObra'] = itm.id_persona_director_obra;
        body['ensayo']['idPersonaResidenteSocial'] = itm.id_persona_residente_social;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['telefonoDirectorObra'] = itm.telefono_director_obra;
        body['ensayo']['telefonoResidenteSocial'] = itm.telefono_residente_social;
        body['ensayo']['idJornada'] = itm.id_jornada;
        break;
      }
      case 54: { ////> APIQUE        
        body['ensayo']['apiques'] = itm.apiques;
        body['ensayo']['descripcion'] = itm.descripcion;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['idPerfil'] = itm.id_perfil;
        body['ensayo']['fechaProgramada'] = itm.fecha_programada === null || itm.fecha_programada.toString() === "" || itm.fecha_programada === undefined ? "" : formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
      case 55: { ////> NUCLEO
        body['ensayo']['actividad'] = itm.actividad;
        body['ensayo']['anio'] = itm.anio;
        body['ensayo']['espesor'] = itm.espesor;
        body['ensayo']['fechaInstalacionMezcla'] = formatDate(itm.fecha_instalacion_mezcla, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        body['ensayo']['idPersonaDirectorObra'] = itm.id_persona_director_obra;
        body['ensayo']['idPersonaResidenteSocial'] = itm.id_persona_residente_social;
        body['ensayo']['idTipoIntervencion'] = itm.id_tipo_intervencion;
        body['ensayo']['mes'] = itm.mes;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['origen'] = itm.origen;
        body['ensayo']['idCapas'] = itm.id_capas;
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
      case 56: { ////> FORMULA DE TRABAJO
        body['ensayo']['descripcion'] = itm.descripcion;
        body['ensayo']['mezclaFormula'] = itm.mezcla_formula;
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
      case 109: { ////> OTROS
        body['ensayo']['descripcion'] = itm.descripcion;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['idJornada'] = itm.id_jornada; 
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
    }

    let response: any = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();

    /// inserta los PK matenimientos activos asociados al ensayo
    if (itm.id_tipo_servicio !== 56 && itm.listaPKMantActivos !== null) {
      for (const campos of itm.listaPKMantActivos) {
        await this.guardarMantenimientosActivos(response.respuesta[0][":b1"], campos);
      }
    }

    /// inserta los ensayos a realizar 
    for (let campo of itm.listaEnsayo) {
      await this.guardarEnsayos(response.respuesta[0][":b1"], campo);
    }

    /// guarda el material asociado al Formulario
    await this.guardarMateriales(response.respuesta[0][":b1"], itm);


    /// inserta los Tipo de Materiales
    if (itm.id_tipo_servicio === 56) {
      for (let campos of itm.listaMateriales) {
        await this.guardarMateriales(response.respuesta[0][":b1"], campos);
      }
    }


    await this.notificarSolicitud("4", "11122", codigoEnsayo, prioridad.toString() );

    return response;
  }
  /** Actualiza la solicitud de ensayo laboratorio 
   * @param idTipoServicio : 53 D.N - 54 A.P - 55 N.U - 56 F.T - 109 OTROS
   * @param fechaSolicitud : Date.now()
   * @param idUsuarioSolicitud : Id del usuario login
   */
  public async actualizarSolicitudEnsayo(itm: SolicitudEnsayoLaboratorio) {

    let body: any = {};
    const url = '/SIGMA-backend-desa/api/laboratorio/ensayo/actualizar';
    const fechaSolicitud = formatDate(itm.fecha_solicitud, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z'
    const codigoEnsayo = itm.codigo_ensayo === null ? await this.generarVersion(itm.id_tipo_servicio, itm.id_tipo_material_ensayo, fechaSolicitud) : itm.codigo_ensayo
    const datos = await this.buscarSolicitudes("id_ensayo = " + itm.id_ensayo);
    const prioridad = itm.id_tipo_servicio === 54 ? itm.prioridad : 10;
    body = {
      usuario: this.securityService.userSession.login,
      ensayo:
      {
        codigoEnsayo: codigoEnsayo,
        consecutivo: datos.respuesta[0].consecutivo,
        fechaRecepcion: itm.fecha_recepcion === null || itm.fecha_recepcion.toString() === "" || itm.fecha_recepcion === undefined ? "" : formatDate(itm.fecha_recepcion, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z',
        fechaSolicitud: fechaSolicitud,
        fechaToma: datos.respuesta[0].fecha_toma,
        idDocumento: itm.id_documento,
        idEnsayo: itm.id_ensayo,
        idResponsableToma: datos.respuesta[0].id_responsable_toma,
        idTipoObservacion: itm.id_tipo_observacion,
        idTipoServicio: itm.id_tipo_servicio,
        idUsuarioRecibeMuestra: itm.id_usuario_recibe_muestra,
        idUsuarioSolicitud: this.securityService.userSession.idUsuario,
        novedades: datos.respuesta[0].novedades,
        prioridad: prioridad ? 10 : 1,
        situacion: "EDITADA",
        version: datos.respuesta[0].version
      }
    }

  

    switch (itm.id_tipo_servicio) {
      case 53: { ////> DENSIDAD DE CAMPO
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        body['ensayo']['hora'] = itm.hora;
        body['ensayo']['idPersonaDirectorObra'] = itm.id_persona_director_obra;
        body['ensayo']['idPersonaResidenteSocial'] = itm.id_persona_residente_social;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['telefonoDirectorObra'] = itm.telefono_director_obra;
        body['ensayo']['telefonoResidenteSocial'] = itm.telefono_residente_social;
        body['ensayo']['idJornada'] = itm.id_jornada;
        break;
      }
      case 54: { ////> APIQUE        
        body['ensayo']['apiques'] = itm.apiques;
        body['ensayo']['descripcion'] = itm.descripcion;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['idPerfil'] = itm.id_perfil;
        body['ensayo']['fechaProgramada'] = itm.fecha_programada === null || itm.fecha_programada.toString() === "" || itm.fecha_programada === undefined ? "" : formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
      case 55: { ////> NUCLEO
        body['ensayo']['actividad'] = itm.actividad;
        body['ensayo']['anio'] = itm.anio;
        body['ensayo']['espesor'] = itm.espesor;
        body['ensayo']['fechaInstalacionMezcla'] = formatDate(itm.fecha_instalacion_mezcla, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        body['ensayo']['idPersonaDirectorObra'] = itm.id_persona_director_obra;
        body['ensayo']['idPersonaResidenteSocial'] = itm.id_persona_residente_social;
        body['ensayo']['idTipoIntervencion'] = itm.id_tipo_intervencion;
        body['ensayo']['mes'] = itm.mes;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['origen'] = itm.origen;
        body['ensayo']['idCapas'] = itm.id_capas;
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
      case 56: { ////> FORMULA DE TRABAJO
        body['ensayo']['descripcion'] = itm.descripcion;
        body['ensayo']['mezclaFormula'] = itm.mezcla_formula;
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
      case 109: { ////> OTROS
        body['ensayo']['descripcion'] = itm.descripcion;
        body['ensayo']['observacion'] = itm.observacion;
        body['ensayo']['idJornada'] = itm.id_jornada;
        body['ensayo']['fechaProgramada'] = formatDate(itm.fecha_programada, 'yyyy-MM-dd', this.locale) + 'T05:00:00.000Z';
        break;
      }
    }

    let response: any = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();


    if (itm.id_tipo_servicio !== 56) {

      //// confirma que el idEnsayo tenga mas de 1 registro para eliminar todos los PKs
      await this.eliminarMantenimientosActivos(itm.id_ensayo);

      for (const campo of itm.listaPKMantActivos) {
        await this.guardarMantenimientosActivos(itm.id_ensayo, campo);
      }
    }

    //// confirma que el idEnsayo tenga mas de 1 registro para eliminar todos los Ensayos
    await this.eliminarEnsayos(itm.id_ensayo);

    for (let campo of itm.listaEnsayo) {
      await this.guardarEnsayos(itm.id_ensayo, campo);
    }

    //// Actualizar los Tipo de Materiales
    await this.eliminarMateriales(itm.id_ensayo);

    /// guarda el material asociado al F
    await this.guardarMateriales(itm.id_ensayo, itm);

    /// inserta los Tipo de Materiales
    if (itm.id_tipo_servicio === 56) {
      for (let campo of itm.listaMateriales) {
        await this.guardarMateriales(itm.id_ensayo, campo);
      }
    }

    await this.notificarSolicitud("4", "11122", codigoEnsayo, prioridad.toString());

    return response;
  }

  /**
   * si el usuario desea actualizar la solicitud se usa este servicio para mantener el historial
   * se envia ID_ENSAYO lo recibe un procedimiento en la BD que clona toda la solicitud y devuelve el nuevo ID_ENSAYO
   
   */
  public async clonarEnsayo(idEnsayo: number) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/clonar';
    body = {
      usuario: this.securityService.userSession.login,
      "ensayo": { "idEnsayo": idEnsayo }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /** Inserta los PKs de Matenimiento Activo */
  public async guardarMantenimientosActivos(idEnsayo: number, itm: listaPKMantActivos) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/pk/insertar';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayoPk': {
        idEnsayo: idEnsayo,
        idMantenimientoVial: itm.id_mantenimiento_vial,
        pkIdCalzada: itm.pk_id_calzada,
        estadoPk: itm.descripcion_estado_pk,
        civ: itm.civ,
        ejeVial: itm.eje_vial,
        desde: itm.desde,
        hasta: itm.hasta,
        idLocalidad: itm.id_localidad,
        idZona: itm.id_zona,
        idBarrio: itm.id_barrio,
        idCuadrante: itm.id_cuadrante,
        idUpz: itm.id_upz,
      }
    }


    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }


  /** Para buscar los PKs de matenimiento activo */
  public async buscarMantenimientosActivos(filtro: string) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/pk/consultarXFiltro';
    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }


    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /** Inserta los Ensayos asociados a la Solicitud  */
  public async guardarEnsayos(idEnsayo: number, campos : any ) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/detalle/insertar';
    body = {
      usuario: this.securityService.userSession.login,
      'detalle': {
        idEnsayo: idEnsayo,
        idTipoServicioEnsayo: campos.id_tipo_servicio_ensayo,
        programado: campos.programado
      }
    }

    console.log(body)
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /** Inserta los Ensayos asociados a la Solicitud  */
  public async actualizarEnsayos(itm: listaEnsayo) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/detalle/actualizar';
    body = {
      usuario: this.securityService.userSession.login,
      'detalle': {
        idEnsayo: itm.id_ensayo,
        idEnsayoDetalle: itm.id_ensayo_detalle,
        idTipoServicioEnsayo: itm.id_tipo_servicio_ensayo,
        ejecutado: itm.ejecutado,
        programado: itm.programado,
      }
    }


    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /** Obtiene los ensayos guardados y que estan asociados a la solicitud */
  public async buscarEnsayos(filtro: string) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/detalle/consultarXFiltro';
    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    //
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  public async guardarMateriales(idEnsayo: number, itm: any) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayoMaterial/insertar';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayoMaterial': {
        idEnsayo: idEnsayo,
        idTipoMaterialEnsayo: itm.id_tipo_material_ensayo,
        fuenteMaterial: itm.fuente_material,
      }
    }


    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /** Obtiene solo los materiales que fueron guardados y asociados a una solicitud  */
  public async buscarMaterial(filtro: string) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayoMaterial/consultarXFiltro';
    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }


  /**INICIO*************************************************ELIMINAR POR SOLICITUD */


  public async eliminarEnsayos(idEnsayo: number) {

    let body: any = {};
    let url = "";
    url = '/SIGMA-backend-desa/api/laboratorio/ensayo/detalle/eliminarPorEnsayo';
    body = {
      usuario: this.securityService.userSession.login,
      'detalle': { idEnsayo: idEnsayo, }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  public async eliminarMantenimientosActivos(idEnsayo: number) {

    let body: any = {};
    let url: string = "";

    url = '/SIGMA-backend-desa/api/laboratorio/ensayo/pk/eliminarPorEnsayo';
    body = {
      usuario: this.securityService.userSession.login,
      ensayoPk: { idEnsayo: idEnsayo }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  public async eliminarMateriales(idEnsayo: number) {

    let body: any = {};
    let url = '';

    url = '/SIGMA-backend-desa/api/laboratorio/ensayoMaterial/eliminarPorEnsayo';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayoMaterial': { idEnsayo: idEnsayo, }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }


  public async eliminarInforme(idEnsayo: number) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/informe/eliminarPorEnsayo';
    body = {
      usuario: this.securityService.userSession.login,
      'informe': { idEnsayo: idEnsayo, }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  public async eliminarIDInforme(idEnsayoinforme: number) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/informe/eliminar';
    body = {
      usuario: this.securityService.userSession.login,
      'informe': { idEnsayoinforme: idEnsayoinforme }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /***Metodo principal que invoca todos los demas metodos de Eliminar  */
  public async eliminarSolicitud(idEnsayo: number) {

    let body: any = {};
    let url = '';

    await this.eliminarMantenimientosActivos(idEnsayo);
    await this.eliminarEnsayos(idEnsayo);
    await this.eliminarMateriales(idEnsayo);
    await this.eliminarInforme(idEnsayo);

    url = '/SIGMA-backend-desa/api/laboratorio/ensayo/eliminar';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayo': { idEnsayo: idEnsayo, }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  
  

  /**INICIO*************************************************ELIMINAR POR CODIGO */

  public async eliminarXCodigoEnsayos(codigoEnsayo: string) {

    let body: any = {};
    let url = "";
    url = '/SIGMA-backend-desa/api/laboratorio/ensayo/detalle/eliminarXCodigo';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayo': { codigoEnsayo: codigoEnsayo }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  public async eliminarXCodigoMantenimientosActivos(codigoEnsayo: string) {

    let body: any = {};
    let url: string = "";

    url = '/SIGMA-backend-desa/api/laboratorio/ensayo/pk/eliminarXCodigo';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayo': { codigoEnsayo: codigoEnsayo }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  public async eliminarXCodigoMateriales(codigoEnsayo: string) {

    let body: any = {};
    let url = '';

    url = '/SIGMA-backend-desa/api/laboratorio/ensayo/material/eliminarXCodigo';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayo': { codigoEnsayo: codigoEnsayo }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }


  public async eliminarXCodigoInforme(codigoEnsayo: string) {

    let body: any = {};
    let url = '/SIGMA-backend-desa/api/laboratorio/ensayo/informe/eliminarXCodigo';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayo': { codigoEnsayo: codigoEnsayo }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }

  /***Metodo principal que invoca todos los demas metodos de Eliminar  */
  public async eliminarXCodigoSolicitud(codigoEnsayo: string) {

    let body: any = {};
    let url = '';

    await this.eliminarXCodigoMantenimientosActivos(codigoEnsayo);
    await this.eliminarXCodigoEnsayos(codigoEnsayo);
    await this.eliminarXCodigoMateriales(codigoEnsayo);
    await this.eliminarXCodigoInforme(codigoEnsayo);

    url = '/SIGMA-backend-desa/api/laboratorio/ensayo/eliminarXCodigo';
    body = {
      usuario: this.securityService.userSession.login,
      'ensayo': { codigoEnsayo: codigoEnsayo }
    }
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
  }


   /**
   * Permite enviar una notificacion al usuario por medio del correo, 
   * el Formulario envia el ID_USUARIO_SOLICITUD toca buscar el correo de ese usuario
   * debido al cruce de libreria se crea NUEVAMENTE la funcion de Notificar 


   * @param id_plantilla = ( 4 ) Notifica nueva Solicitud / ( 5 ) Notifica la gestion de la solicitud
   * @param id_roles = ( 11121 ) SIGMA_SOLICITUD_LAB / ( 11122 ) SIGMA_REG_LAB
   * @param codigoEnsayo = ZZ-9,99-AA-MM-XXX.
   * @param prioridad = 10 - 1 donde 1 es max Prioridad y solo la maneja Apiques ( 10 ) default otros servicios
   * @returns 
   */

  public async notificarSolicitud(id_plantilla: string, id_roles: string, codigoEnsayo : string, prioridad : string) {
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
                    reemplazarVariables: "@codigoEnsayo; @nombreUsuarioSolicitud; @fechaSolicitud; @prioridad",
                    reemplazarValores: codigoEnsayo + ";" + this.securityService.userSession.nombre + ";" + formatDate(Date.now(), 'dd-MM-yyyy', this.locale) + ";" + prioridad
                  }),
                }

    let response: any = await this.http.post<any>(url, body, this.httpOptions).toPromise();
    return JSON.parse(response.respuesta[0].json).respuesta;
  }


}