import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, forkJoin, from, defer, OperatorFunction } from 'rxjs'
import { SecurityService } from '../security/services/security.service'
import { maquinariaCrud, materialCrud, personalCrud, progDiariaCrud } from '../models/registro-programacion-diaria'
import { switchMap } from 'rxjs/operators'
import { Persona } from '../models/persona'


@Injectable({
  providedIn: 'root'
})
export class RegistroProgramacionDiariaService {

  body : {} = {};
  idPersona: number = 0;
  url :string =""

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  
  constructor(
    private securityService: SecurityService,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string) { }

  /** idPersona asociado al idUsuario */
  async buscarPersona(filtro: string ) {
    let body: any = {};
    let url = '/SIGMA-backend-desa/api/persona/consultarXFiltro';
    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }
   
    return await this.http.post<Persona>(url, body, this.httpOptions).toPromise();
  }

  /** idPersona asociado al idUsuario */
  async tipoClaseMaterial(filtro: string) {
    let body: any = {};
    let url = '/SIGMA-backend-desa/api/intervencion/tipoClaseMaterial/consultarXFiltro';
    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return await this.http.post<Persona>(url, body, this.httpOptions).toPromise();
  }

  /** idPersona asociado al idUsuario */
  async equipoConsultarXFiltro(filtro: string) {
    let body: any = {};
    let url = '/SIGMA-backend-desa/api/equipo/consultarXFiltro';
    body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return await this.http.post<Persona>(url, body, this.httpOptions).toPromise();
  }

  /**Busca registros de la programacion diaria */
  getProgDiaria(filtro: string = ""): Observable<any> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.id_usuario,
      filtro
    }
    return  this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Busca registros de la programacion diaria */
  async listarBandejaGestionPendiente(idActividad: string = "") {
    this.url = '/SIGMA-backend-desa/api/gestion/listarBandejaGestionPendiente';
    this.body = {
      usuario: this.securityService.userSession.usuario,
      idusuario: this.securityService.userSession.id_usuario,
      idActividad
    }
    const response = await this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions).toPromise();
    return response.respuesta
  }

  /**######################################################################################################################*/
  /**#######################  SECCION DE PROGRAMACION DIARIA #########################################################################*/

  /**Agrega nuevos registros programacion diaria */
  addProgDiaria(progDiaria: progDiariaCrud): Observable<progDiariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/insertar';
    this.body = {
      usuario: this.securityService.userSession.login,
      progDiaria: {
        fecha: progDiaria.fecha,
        horaTrabajoDesde: progDiaria.hora_trabajo_desde,
        horaTrabajoHasta: progDiaria.hora_trabajo_hasta,
        idMantenimientoVial: progDiaria.id_mantenimiento_vial,
        idPersonaAprueba: null,
        idPersonaElabora: progDiaria.id_persona_elabora,
        idPersonaRevisa: null,
        idTipoEstadoProgramacion: progDiaria.id_tipo_estado_programacion,
        idTipoJornada: progDiaria.id_tipo_jornada,
        observaciones: progDiaria.observaciones,
      }
    }
    
    return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Agrega nuevos registros programacion diaria COPIAR */
  copyProgDiaria(progDiaria: progDiariaCrud): Observable<progDiariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/copiar';
    this.body = {
      usuario: this.securityService.userSession.login,
      progDiaria: {
        idMantenimientoVial: progDiaria.id_mantenimiento_vial,
        fecha: progDiaria.fecha,
        idTipoJornada: progDiaria.id_tipo_jornada,
        horaTrabajoDesde: progDiaria.hora_trabajo_desde,
        horaTrabajoHasta: progDiaria.hora_trabajo_hasta,
        idPersonaElabora: this.idPersona,
        observaciones: progDiaria.observaciones,
      },
      idUsuario: this.securityService.userSession.idUsuario,
    }
    return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Actualizar registros de la programacion diaria */
  updateProgDiaria(progDiaria: progDiariaCrud): Observable<progDiariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/actualizar';
    
    this.body = {
      usuario: this.securityService.userSession.login,
      progDiaria: { 
        fecha: progDiaria.fecha,
        horaTrabajoDesde: progDiaria.hora_trabajo_desde,
        horaTrabajoHasta: progDiaria.hora_trabajo_hasta,
        idMantenimientoVial: progDiaria.id_mantenimiento_vial,
        idPersonaAprueba: null,
        idPersonaElabora: this.idPersona,
        idPersonaRevisa: null,
        idProgramacionDiaria: progDiaria.id_programacion_diaria,
        idTipoEstadoProgramacion: progDiaria.id_tipo_estado_programacion,
        idTipoJornada: progDiaria.id_tipo_jornada,
        observaciones: progDiaria.observaciones,
       }
    }
    return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina un registro a la vez en programacion Diaria */
  deleteRow(id: number): Observable<progDiariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      progDiaria: { idProgramacionDiaria : id }
    }
    return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina varios registros a la vez en programacion diaria */
  deleteRows(progDiaria: progDiariaCrud[]): Observable<progDiariaCrud[]> {
    
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/eliminar';
    return forkJoin(progDiaria.map((progDiaria: progDiariaCrud) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        progDiaria: { idProgramacionDiaria: progDiaria.id_programacion_diaria }
      }
      return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }

  /**######################################################################################################################*/
  /**#######################  SECCION DE PERSONAL #########################################################################*/

  getPersonal(filtro: string): Observable < any > {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/personal/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.id_usuario,
      filtro
    }
    return  this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Agrega nuevos registros personal */
  addPersonal(personal: personalCrud): Observable<progDiariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/personal/insertar';
    this.body = {
      usuario: this.securityService.userSession.login,
      personal: {
        idProgramacionDiaria: personal.id_programacion_diaria,
        idTipoRol: personal.id_tipo_rol,
        idTipoOrigen: personal.id_tipo_origen,
        cantidad: personal.cantidad,
        idPersona: personal.id_persona,      
      }
    }
    return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Actualizar registros personal */
  updatePersonal(personal: personalCrud): Observable<personalCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/personal/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      personal: {
        idProgdiariaPersonal: personal.id_progdiaria_personal,
        idProgramacionDiaria: personal.id_programacion_diaria,
        idTipoRol: personal.id_tipo_rol,
        idTipoOrigen: personal.id_tipo_origen,
        cantidad: personal.cantidad,
        idPersona: personal.id_persona,
      }
    }
    
    return this.http.post<personalCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina un registro a la vez en personal */
  deleteRowPersonal(id: number): Observable<personalCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/personal/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      personal: { idProgdiariaPersonal: id }
    }
    return this.http.post<personalCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina varios registros a la vez en personal */
  deleteRowsPersonal(personal: personalCrud[]): Observable<personalCrud[]> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/personal/eliminar';
    return forkJoin(personal.map((personal: personalCrud) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        personal: { idProgdiariaPersonal: personal.id_progdiaria_personal }
      }
      return this.http.post<personalCrud>(this.url, JSON.stringify(this.body), this.httpOptions)
    }));
  }

  /**######################################################################################################################*/
  /**#######################  SECCION DE MATERIAL #########################################################################*/

  getMaterial(filtro: string): Observable<any> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/material/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.id_usuario,
      filtro
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Agrega nuevos registros personal */
  addMaterial(material: materialCrud): Observable<progDiariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/material/insertar';
    this.body = {
      usuario: this.securityService.userSession.login,
      material: {
        idProgramacionDiaria: material.id_programacion_diaria,
        idTipoMaterial: material.id_tipo_material,
        idTipoClaseMaterial: material.id_tipo_clase_material,
        idTipoOrigen: material.id_tipo_origen,
        cantidad: material.cantidad,
        idTipoUnidadMedida: material.id_tipo_unidad_medida,
        hora: material.hora,
        idTipoUnidadEjecutora: material.id_tipo_unidadejecutora,
      }
    }
    return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Actualizar registros material */
  updateMaterial(material: materialCrud): Observable<materialCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/material/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      material: {
        idProgdiariaMaterial: material.id_progdiaria_material,
        idProgramacionDiaria: material.id_programacion_diaria,
        idTipoMaterial: material.id_tipo_material,
        idTipoClaseMaterial: material.id_tipo_clase_material,
        idTipoOrigen: material.id_tipo_origen,
        cantidad: material.cantidad,
        idTipoUnidadMedida: material.id_tipo_unidad_medida,
        hora: material.hora,
        idTipoUnidadEjecutora: material.id_tipo_unidadejecutora,
      }
    }

    return this.http.post<materialCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina un registro a la vez en material */
  deleteRowMaterial(id: number): Observable<materialCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/material/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      material: { idProgdiariaMaterial: id }
    }
    return this.http.post<materialCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina varios registros a la vez en material */
  deleteRowsMaterial(material: materialCrud[]): Observable<materialCrud[]> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/material/eliminar';
    return forkJoin(material.map((material: materialCrud) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        material: { idProgdiariaMaterial: material.id_programacion_diaria }
      }
      return this.http.post<materialCrud>(this.url, JSON.stringify(this.body), this.httpOptions)
    }));
  }

  /**######################################################################################################################*/
  /**#######################  SECCION DE MAQUINARIA #########################################################################*/

  getMaquinaria(filtro: string): Observable<any> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/maquinaria/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.id_usuario,
      filtro
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Agrega nuevos registros personal */
  addMaquinaria(maquinaria: maquinariaCrud): Observable<progDiariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/maquinaria/insertar';
    this.body = {
      usuario: this.securityService.userSession.login,
      maquinaria: {
        idProgramacionDiaria: maquinaria.id_programacion_diaria,
        idTipoClaseEquipo: maquinaria.id_tipo_clase_equipo,
        idTipoEquipo: maquinaria.id_tipo_equipo,
        idTipoOrigen: maquinaria.id_tipo_origen,
        cantidad: maquinaria.cantidad,
        hora: maquinaria.hora,
        movil: maquinaria.movil,
        idTipoUnidadEjecutora: maquinaria.id_tipo_unidadejecutora,
      }
    }
    return this.http.post<progDiariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Actualizar registros material */
  updateMaquinaria(maquinaria: maquinariaCrud): Observable<maquinariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/maquinaria/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      maquinaria: {
        idProgdiariaMaquinaria: maquinaria.id_progdiaria_maquinaria,
        idProgramacionDiaria: maquinaria.id_programacion_diaria,
        idTipoClaseEquipo: maquinaria.id_tipo_clase_equipo,
        idTipoEquipo: maquinaria.id_tipo_equipo,
        idTipoOrigen: maquinaria.id_tipo_origen,
        cantidad: maquinaria.cantidad,
        hora: maquinaria.hora,
        movil: maquinaria.movil,
        idTipoUnidadEjecutora: maquinaria.id_tipo_unidadejecutora,
      }
    }

    return this.http.post<maquinariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina un registro a la vez en material */
  deleteRowMaquinaria(id: number): Observable<maquinariaCrud> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/maquinaria/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      maquinaria: { idProgdiariaMaquinaria: id }
    }
    return this.http.post<maquinariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina varios registros a la vez en material */
  deleteRowsMaquinaria(maquinaria: maquinariaCrud[]): Observable<maquinariaCrud[]> {
    this.url = '/SIGMA-backend-desa/api/programacionDiaria/maquinaria/eliminar';
    return forkJoin(maquinaria.map((maquinaria: maquinariaCrud) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        maquinaria: { idProgdiariaMaquinaria: maquinaria.id_progdiaria_maquinaria }
      }
      return this.http.post<maquinariaCrud>(this.url, JSON.stringify(this.body), this.httpOptions)
    }));
  }


}