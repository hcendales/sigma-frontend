import { Injectable } from '@angular/core';
import { SecurityService } from '../security/services/security.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesoMantenimientoService {

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
  listarMaquinariaEquipos(filtro?:any) {
    let body = null;
    let url = '/SIGMA-backend-desa/api/produccion/listarEquiposActivosMtto';
    if (filtro) {
      body = {
        usuario: this.securityService.userSession.login,
        numeroInterno: filtro.no_interno,
        marca: filtro.marca,
        tipo: filtro.tipo,
        clase_de_equipo: filtro.clase_de_equipo,
        placa: filtro.placa,
        taller: filtro.tall,
        estado: filtro.estado
      }
    } else {
      body = {
        usuario: this.securityService.userSession.login
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite obtener resultados de mantenimientos por 
   * filtro.
   * 
   * @param filtro Filtro de la consulta 
   * @returns Registro.
   */
   consultarMantenimiento(filtro?:any){
    let url = '/SIGMA-backend-desa/api/produccion/mantenimientoEquipo/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro: filtro
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite insertar un registro de mantenimiento.
   * 
   * @param mantenimiento Nuevo registro de mantenimiento. 
   * @returns Respuesta de la operacion.
   */
   insertarMantenimientoEquipo(mantenimiento:any) {
    let url = '/SIGMA-backend-desa/api/produccion/mantenimientoEquipo/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      mantenimiento: {
        idEquipo: mantenimiento.id_equipo,
        fecha: mantenimiento.fecha,
        sigla: mantenimiento.sigla,
        idPersonaReporto: mantenimiento.idPersonaReporto,
        tipo: mantenimiento.tipo,
        descripcionMtto: mantenimiento.descripcion,
        idVarControlMtto: mantenimiento.variable_control,
        valorVarMtto: mantenimiento.valor_control,
        contrato: mantenimiento.contrato,
        cargo: mantenimiento.cargo,
        idTipoMantenimiento: mantenimiento.id_tipo_mantenimiento
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite actualizar un registro de mantenimiento.
   * 
   * @param mantenimiento Registro de mantenimiento. 
   * @returns Respuesta de la operacion.
   */
  actualizarMantenimientoEquipo(mantenimiento:any) {
    let url = '/SIGMA-backend-desa/api/produccion/mantenimientoEquipo/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      mantenimiento: {
        idMantenimientoEquipo: mantenimiento.id_mantenimiento_equipo,
        fecha: mantenimiento.fecha,
        sigla: mantenimiento.sigla,
        idPersonaReporto: mantenimiento.idPersonaReporto,
        tipo: mantenimiento.tipo,
        descripcionMtto: mantenimiento.descripcion,
        idVarControlMtto: mantenimiento.variable_control,
        valorVarMtto: mantenimiento.valor_control,
        contrato: mantenimiento.contrato,
        cargo: mantenimiento.cargo,
        idTipoMantenimiento: mantenimiento.id_tipo_mantenimiento
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite cancelar un registro de mantenimiento.
   * 
   * @param mantenimiento Registro de cancelacion. 
   * @returns Respuesta de la operacion.
   */
  cancelarMantenimientoEquipo(mantenimiento:any) {
    let url = '/SIGMA-backend-desa/api/produccion/mantenimientoEquipo/cancelar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      mantenimiento: {
        idMantenimientoEquipo: mantenimiento.id_mantenimiento_equipo,
        motivoCancelacion: mantenimiento.descripcion
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite finalizar un registro de mantenimiento.
   * 
   * @param mantenimiento Registro de finalizacion. 
   * @returns Respuesta de la operacion.
   */
   finalizarMantenimientoEquipo(mantenimiento:any) {
    let url = '/SIGMA-backend-desa/api/produccion/mantenimientoEquipo/finalizar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      mantenimiento: {
        idMantenimientoEquipo: mantenimiento.id_mantenimiento_equipo
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Consulta los datos de mantenimiento de un equipo.
   * @param mantenimiento Datos de filtro.
   * @returns Datos de mantenmiento.
   */
  consultarMantenimientoEquipo(mantenimiento:any) {
    let url = '/SIGMA-backend-desa/api/produccion/consulta/mantenimientosEquipos';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      mantenimiento: {
        tipo: mantenimiento.tipo,
        idEquipo: mantenimiento.id_equipo,
        idTipoMantenimiento: mantenimiento.id_tipo_mantenimiento
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Consulta el contrato a traves de la vigencia.
   * @param vigencia Datos de filtro.
   * @returns Datos de contrato.
   */
   consultaContrato(vigencia:number) {
    let url = '/SIGMA-backend-desa/api/produccion/consultaContrato';
    let body = {
      usuario: this.securityService.userSession.login,
      vigencia: vigencia
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
   listarEquiposVigentesActividad(filtro?:any){
    let url = '/SIGMA-backend-desa/api/produccion/listarEquiposVigentesActividad';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      numeroInterno:null,
      marca:null,
      tipo:null,
      clase:null,
      placa:null
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite insertar un registro de fallo de maquinario o equipo.
   * 
   * @param fallo Modelo del compoenente. 
   * @returns Respuesta de backend a la peticion.
   */
  insertarFallo(fallo:any){
    let url = '/SIGMA-backend-desa/api/produccion/fallo/insertar';
    let body = {
      usuario: this.securityService.userSession.login,
      mantenimiento:{
        idEquipo: fallo.id,
        descripcionFallo: fallo.descripcion,
        idVarControlFallo: fallo.variable_control, 
        valorVarFallo: fallo.valor_control,
        ubicacion: fallo.ubicacion,
        idUsuarioReportoFallo: fallo.id_usuario
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite actualizar un registro de fallo de maquinario o equipo.
   * 
   * @param fallo Modelo del compoenente. 
   * @returns Respuesta de backend a la peticion.
   */
  actualizarFallo(fallo:any){
    let url = '/SIGMA-backend-desa/api/produccion/fallo/actualizar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      descripcion: fallo.descripcion,
      variable_control: fallo.variable_control,
      valor_control: fallo.valor_control,
      ubicacion: fallo.ubicacion,

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
  listarFallos(filtro?:any){
    let url = '/SIGMA-backend-desa/api/produccion/fallo/consultarXFiltro';
    let body = {
      usuario: this.securityService.userSession.login,
      filtro: filtro
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Envia la notificacion.
   */
  enviarNotificacion() {
    let url = '/SIGMA-backend-desa/api/externo/consume';
    let body = {
      usuario: this.securityService.userSession.login,
      json: `{\"usuario\":\"${this.securityService.userSession.login}\",\"idPlantilla\":\"2\",\"roles\":\"361\"}`,
      url: environment.URL_CALIOPE_BACK + "api/correo/enviarNotificacionCorreo"
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite obtener la lista de maquinaria y 
   * equipos disponibles.
   * 
   * @param filtro Filtro de la consulta 
   * @returns Lista de maquinaria y equipos disponibles.
   */
  listarEquiposDisponibles(filtro?:any){
    let url = '/SIGMA-backend-desa/api/gestionRecurso/listarEquiposDisponibles';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      filtro: filtro
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite la lista de conductores.
   * 
   * @param asignacion Modelo del compoenente. 
   * @returns Retorna la lista de conductores.
   */
  listarConductores(idEquipo:number, tiposAsignacion:string){
    let url = '/SIGMA-backend-desa/api/gestionRecurso/listarRecursosRelacionadosParaAsignacion';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idEquipo: idEquipo,
      tiposAsignacion: tiposAsignacion
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite obtener las franjas de un recurso en un periodo dado.
   * @param idRecurso ID del recurso.
   * @param fechaDesde Fecha desde del periodo.
   * @param fechaHasta Fecha hasta del periodo.
   * @param horaInicio Hora de inicio.
   * @param horaFin Hora fin.
   * @returns Lista de franjas.
   */
   consultarFranjas(idRecurso:number, fechaDesde:number, fechaHasta:number, horaInicio:string, horaFin:string){
    let url = '/SIGMA-backend-desa/api/recurso/programacion/franjas/consultar';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idRecurso: idRecurso,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
      horaInicio: horaInicio,
      horaFin: horaFin
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite asignar un nuevo recurso.
   * @param relacion Datos de la nueva realcion.
   * @returns Resultado de la operacion.
   */
  asignarRecurso(relacion:any) {
    let url = '/SIGMA-backend-desa/api/gestionRecurso/asignarRecurso';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      relacion: relacion
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Consulta las relaciones de un equipo.
   * @param placa Placa del equipo.
   * @returns Relaciones de un equipo dado.
   */
  consultarRelaciones(filtro:string) {
    let url = '/SIGMA-backend-desa/api/gestionRecurso/listarRelacionEquipos';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      filtro: filtro
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Elimina una relacion.
   * @param realacion Relacion a eliminar.
   * @returns Resultado de la operacion.
   */
  eliminarRelacion(realacion:any) {
    let url = '/SIGMA-backend-desa/api/gestionRecurso/desasociarRecurso';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      relacion: {
        idRecursoDisponibilidad: realacion.id_recurso_disponibilidad,
        idRecursoDisponibilidadRelacionado: realacion.id_recurso_disponibilidad_relacionado,
        idTipoAsignacion: realacion.id_tipo_asignacion
      }
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }

  /**
   * Permite crear franjas a un recurso dado.
   * @param idRecurso ID del recurso.
   * @param fechaDesde Fecha de inicio de la franja.
   * @param fechaHasta Fecha de terminacion de la franja.
   * @param horaInicio Hora de inicio de la franja.
   * @param horaFin Hora fin de la franja.
   * @param intervalo Duracion de la franja.
   * @returns 
   */
  crearFranja(idRecurso:number, fechaDesde:number, fechaHasta:number, horaInicio:string, horaFin:string, intervalo:number) {
    let url = '/SIGMA-backend-desa/api/recurso/programacion/franjas';
    let body = {
      usuario: this.securityService.userSession.login,
      idUsuario: this.securityService.userSession.idUsuario,
      idRecurso: idRecurso,  
      fechaDesde: fechaDesde,  
      fechaHasta: fechaHasta,  
      horaInicio: horaInicio,  
      horaFin: horaFin,  
      intervalo: intervalo    
    }
    return this.http.post<any>(url, body , this.httpOptions).toPromise();  
  }

}
