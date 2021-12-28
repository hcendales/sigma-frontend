import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Calidad, CantidadObra, Maquinaria, Materiales, Mezcla, Personal, RegistroDiarioPorCuadrilla, SalidaMaterial, Observaciones } from '../models/registro-diario-por-cuadrilla';
import { SecurityService } from '../security/services/security.service';


@Injectable({
  providedIn: 'root'
})
export class ProgramacionDiariaCuadrillaService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  body: any;
  url: string = ""

  constructor(
    private securityService: SecurityService,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,) { }



  /**##########################################################################################################################################*/
  /**#######################  SECCION DE INFORME DIARIO POR CUADRILLA #########################################################################*/


  /** CONSULTAR POR FILTRO informeDiarioCuadrilla*/
  async informeDiarioCuadrilla_consultarXFiltro(filtro: string) {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.id_usuario,
      filtro
    }
    return await this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions).toPromise();
  }

  /** INSERTAR informeDiarioCuadrillainformeDiarioCuadrilla  */
  async informeDiarioCuadrilla_insertar(campos: RegistroDiarioPorCuadrilla) {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/insertar';
    this.body = {
      usuario: this.securityService.userSession.login,
      informeDiarioCuadrilla: {
        actividadDiaSiguiente: campos.actividad_dia_siguiente,
        areaTotalIntervenida: campos.area_total_intervenida,
        cantidadDelineadores: campos.cantidad_delineadores,
        cantidadSeniales: campos.cantidad_seniales,
        fecha: campos.fecha,
        horaInicioActividades: campos.hora_inicio_actividades,
        horarioFinActividades: campos.horario_fin_actividades,
        //idArchivoEsquema:campos.id_archivo_esquema,
        idMantenimientoVial: campos.id_mantenimiento_vial,
        idPersonaAprueba: campos.id_persona_aprueba.id_persona,
        idPersonaElabora: campos.id_persona_elabora.id_persona,
        idPersonaRevisa: campos.id_persona_revisa.id_persona,
        idTipoClimaManana: campos.id_tipo_clima_manana,
        idTipoClimaNoche: campos.id_tipo_clima_noche,
        idTipoClimaTarde: campos.id_tipo_clima_tarde,
        idTipoEstadoInforme: campos.id_tipo_estado_informe,
        idTipoEstadoObra: campos.id_tipo_estado_obra,
        idTipoJornada: campos.id_tipo_jornada,
        longitudTotalIntervenida: campos.longitud_total_intervenida,
        observaciones: campos.observaciones,
        porcentajeAvanceAcumObra: campos.porcentaje_avance_acum_obra,
        porcentajeAvanceDiarioObra: campos.porcentaje_avance_diario_obra,
        servicioBanio: campos.servicio_banio,
        servicioBanioHoras: campos.servicio_banio_horas,
        servicioVigilancia: campos.servicio_vigilancia_horas,
        servicioVigilanciaHoras: campos.servicio_vigilancia_horas,
      }
    }

    return await this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions).toPromise();
  }

  /** ACTUALIZAR informeDiarioCuadrilla */
  async informeDiarioCuadrilla_actualizar(campos: RegistroDiarioPorCuadrilla) {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/actualizar';
    this.body = {
      usuario: this.securityService.userSession.login,
      informeDiarioCuadrilla: {
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
        actividadDiaSiguiente: campos.actividad_dia_siguiente,
        areaTotalIntervenida: campos.area_total_intervenida,
        cantidadDelineadores: campos.cantidad_delineadores,
        cantidadSeniales: campos.cantidad_seniales,
        fecha: campos.fecha,
        horaInicioActividades: campos.hora_inicio_actividades,
        horarioFinActividades: campos.horario_fin_actividades,
        //idArchivoEsquema:campos.id_archivo_esquema,
        idMantenimientoVial: campos.id_mantenimiento_vial,
        idPersonaAprueba: campos.id_persona_aprueba,
        idPersonaElabora: campos.id_persona_elabora,
        idPersonaRevisa: campos.id_persona_revisa,
        idTipoClimaManana: campos.id_tipo_clima_manana,
        idTipoClimaNoche: campos.id_tipo_clima_noche,
        idTipoClimaTarde: campos.id_tipo_clima_tarde,
        idTipoEstadoInforme: campos.id_tipo_estado_informe,
        idTipoEstadoObra: campos.id_tipo_estado_obra,
        idTipoJornada: campos.id_tipo_jornada,
        longitudTotalIntervenida: campos.longitud_total_intervenida,
        observaciones: campos.observaciones,
        porcentajeAvanceAcumObra: campos.porcentaje_avance_acum_obra,
        porcentajeAvanceDiarioObra: campos.porcentaje_avance_diario_obra,
        servicioBanio: campos.servicio_banio,
        servicioBanioHoras: campos.servicio_banio_horas,
        servicioVigilancia: campos.servicio_vigilancia_horas,
        servicioVigilanciaHoras: campos.servicio_vigilancia_horas,
      }
    }

    return await this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions).toPromise();
  }


  /** ELIMINAR informeDiarioCuadrilla */
  async informeDiarioCuadrilla_eliminar(campos: RegistroDiarioPorCuadrilla) {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      informeDiarioCuadrilla: {
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      }
    }

    return await this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions).toPromise();
  }

  /**##################################################################################################################################*/
  /**#######################  SECCION DE INFORME DEL PERSONAL #########################################################################*/


  /** CONSULTAR POR FILTRO PERSONAL*/
  personal_consultarXFiltro(filtro: string): Observable<Personal> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/personal/consultarXFiltro';

    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);

  }

  /** INSERTAR personal_insertar  */
  personal_insertar(campos: Personal): Observable<Personal> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/personal/insertar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaPersonal: {
        horarioLlegada: campos.horario_llegada,
        horarioSalida: campos.horario_salida,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
        idPersona: campos.id_persona,
        idTipoCargo: campos.id_tipo_cargo,
        idTipoCategoriaPersona: campos.id_tipo_categoria_persona,
        idTipoHorario: campos.id_tipo_horario,
        idTipoRol: campos.id_tipo_rol,
        observaciones: campos.observaciones
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** INSERTAR personal_actualizar  */
  personal_actualizar(campos: Personal): Observable<Personal> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/personal/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaPersonal: {
        horarioLlegada: campos.horario_llegada,
        horarioSalida: campos.horario_salida,
        idInfdiacuaPersonal: campos.id_infdiacua_personal,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
        idPersona: campos.id_persona,
        idTipoCargo: campos.id_tipo_cargo,
        idTipoCategoriaPersona: campos.id_tipo_categoria_persona,
        idTipoHorario: campos.id_tipo_horario,
        idTipoRol: campos.id_tipo_rol,
        observaciones: campos.observaciones
      }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }


  /** ELIMINAR personal_eliminar */
  personal_eliminar(idInfdiacuaPersonal: number): Observable<Personal> {

    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/personal/eliminar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaPersonal: {
        idInfdiacuaPersonal
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /**Elimina varios registros a la vez en programacion diaria */
  personal_eliminar_varios(progDiaria: Personal[]): Observable<Personal[]> {

    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/personal/eliminar';
    return forkJoin(progDiaria.map((progDiaria: Personal) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        infDiacuaPersonal: {
          idInfdiacuaPersonal: { idInfdiacuaPersonal: progDiaria.id_infdiacua_personal }
        }
      }
      return this.http.post<Personal>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }

  /**###########################################################################################################################*/
  /**#######################  SECCION DE CANTIDAD OBRA #########################################################################*/

  /** CONSULTAR POR FILTRO CantidadObra_consultarXFiltro*/
  CantidadObra_consultarXFiltro(filtro: string): Observable<CantidadObra> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/cantidadObra/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** INSERTAR CantidadObra_insertar  */
  CantidadObra_insertar(campos: CantidadObra): Observable<CantidadObra> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/cantidadObra/insertar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaCantObra: {
        ancho: campos.ancho,
        cantidad: campos.cantidad,
        espesor: campos.espesor,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
        idTipoActividad: campos.id_tipo_actividad,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        idTipoMaterial: campos.id_tipo_material,
        idTipoUnidadMedida: campos.id_tipo_unidad_medida,
        largo: campos.largo,
        manual: campos.manual,
        mecanica: campos.mecanica,
        porcentajeCompactacion: campos.porcentaje_compactacion,
        volumenMaterialCompacto: campos.volumen_material_compacto
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ACTUALIZAR CantidadObra_insertar  */
  CantidadObra_actualizar(campos: CantidadObra): Observable<CantidadObra> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/cantidadObra/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaCantObra: {
        idInfdiacuaCantObra: campos.id_infdiacua_cant_obra,
        ancho: campos.ancho,
        cantidad: campos.cantidad,
        espesor: campos.espesor,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
        idTipoActividad: campos.id_tipo_actividad,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        idTipoMaterial: campos.id_tipo_material,
        idTipoUnidadMedida: campos.id_tipo_unidad_medida,
        largo: campos.largo,
        manual: campos.manual,
        mecanica: campos.mecanica,
        porcentajeCompactacion: campos.porcentaje_compactacion,
        volumenMaterialCompacto: campos.volumen_material_compacto
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR CantidadObra_eliminar */
  CantidadObra_eliminar(campos: number): Observable<CantidadObra> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/cantidadObra/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaCantObra: { idInfdiacuaCantObra: campos }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }


  /** ELIMINAR CantidadObra_eliminar */
  CantidadObra_eliminar_varios(progDiaria: CantidadObra[]): Observable<CantidadObra[]> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/cantidadObra/eliminar';
    return forkJoin(progDiaria.map((progDiaria: CantidadObra) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        infDiacuaCantObra: { idInfdiacuaCantObra: progDiaria.id_infdiacua_cant_obra }
      }
      return this.http.post<CantidadObra>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }

  /**#####################################################################################################################*/
  /**#######################  SECCION DE CALIDAD #########################################################################*/


  /** CONSULTAR POR FILTRO calidad_consultarXFiltro*/
  calidad_consultarXFiltro(filtro: string): Observable<Calidad> {

    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/calidad/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);


  }

  /** INSERTAR calidad_insertar  */
  calidad_insertar(campos: Calidad): Observable<Calidad> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/calidad/insertar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaCalidad: {
        numeroMuestrasTomadas: campos.numero_muestras_tomadas,
        idTipoMaterial: campos.id_tipo_material,
        idTipoEnsayo: campos.id_tipo_ensayo,
        resultado: campos.resultado,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ACTUALIZAR calidad_insertar  */
  calidad_actualizar(campos: Calidad): Observable<Calidad> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/calidad/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaCalidad: {
        numeroMuestrasTomadas: campos.numero_muestras_tomadas,
        idTipoMaterial: campos.id_tipo_material,
        idTipoEnsayo: campos.id_tipo_ensayo,
        resultado: campos.resultado,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
        infDiacuaCalidad: campos.id_infdiacua_calidad
      }
    }


    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR calidad_eliminar */
  calidad_eliminar(campo: number): Observable<Calidad> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/calidad/eliminar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaCalidad: { idInfdiacuaCalidad: campo }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR calidad_eliminar */
  calidad_eliminar_varios(progDiaria: Calidad[]): Observable<Calidad[]> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/calidad/eliminar';
    return forkJoin(progDiaria.map((progDiaria: Calidad) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        infDiacuaCalidad: { idInfdiacuaCalidad: progDiaria.id_infdiacua_calidad }
      }
      return this.http.post<Calidad>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }

  /**#####################################################################################################################*/
  /**#######################  SECCION DE MATERIAL #########################################################################*/

  /** CONSULTAR POR FILTRO entradaMaterial_consultarXFiltro*/
  entradaMaterial_consultarXFiltro(filtro: string): Observable<Materiales> {

    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/entradaMaterial/consultarXFiltro';

    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);

  }

  /** INSERTAR entradaMaterial_insertar  */
  entradaMaterial_insertar(campos: Materiales): Observable<Materiales> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/entradaMaterial/insertar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaEntrMaterial: {
        idTipoMaterial: campos.id_tipo_material,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        placa: campos.placa,
        movil: campos.movil,
        volumen: campos.volumen,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        horaEntrada: campos.hora_entrada,
        horaSalida: campos.hora_salida,
        actividadObservacion: campos.actividad_observacion,
        observaciones: campos.observaciones,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      }
    }


    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ACTUALIZAR entradaMaterial_insertar  */
  entradaMaterial_actualizar(campos: Materiales): Observable<Materiales> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/entradaMaterial/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaEntrMaterial: {
        idTipoMaterial: campos.id_tipo_material,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        placa: campos.placa,
        movil: campos.movil,
        volumen: campos.volumen,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        horaEntrada: campos.hora_entrada,
        horaSalida: campos.hora_salida,
        actividadObservacion: campos.actividad_observacion,
        observaciones: campos.observaciones,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
        idInfdiacuaEntrMaterial: campos.id_infdiacua_entr_material
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR entradaMaterial_eliminar */
  entradaMaterial_eliminar(campo: number): Observable<Materiales> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/entradaMaterial/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaEntrMaterial: { idInfdiacuaEntrMaterial: campo }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR entradaMaterial_eliminar */
  entradaMaterial_eliminar_varios(progDiaria: Materiales[]): Observable<Materiales[]> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/entradaMaterial/eliminar';
    return forkJoin(progDiaria.map((progDiaria: Materiales) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        infDiacuaEntrMaterial: { idInfdiacuaEntrMaterial: progDiaria.id_infdiacua_entr_material },
      }
      return this.http.post<Materiales>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }

  /**####################################################################################################################*/
  /**#######################  SECCION DE MEZCLA #########################################################################*/

  /** CONSULTAR POR FILTRO mezcla_consultarXFiltro*/
  mezcla_consultarXFiltro(filtro: string): Observable<Mezcla> {

    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/mezcla/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** INSERTAR mezcla_insertar  */
  mezcla_insertar(campos: Mezcla): Observable<Mezcla> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/mezcla/insertar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaMezclaConc: {
        idTipoMaterial: campos.id_tipo_material,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        movil: campos.movil,
        placa: campos.placa,
        volumen: campos.volumen,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        horaEntrada: campos.hora_entrada,
        horaInstalacion: campos.hora_instalacion,
        horaSalida: campos.hora_salida,
        abcsisaInicio: campos.abcsisa_inicio,
        abcsisaFinal: campos.abcsisa_final,
        abcsisaCarril: campos.abcsisa_carril,
        temperaturaRecibo: campos.temperatura_recibo,
        temperaturaLlegada: campos.temperatura_llegada,
        temperaturaExtendido: campos.temperatura_extendido,
        temperaturaCompactacion: campos.temperatura_extendido,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      }
    }


    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ACTUALIZAR mezcla_insertar  */
  mezcla_actualizar(campos: Mezcla): Observable<Mezcla> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/mezcla/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaMezclaConc: {
        idInfdiacuaMezclaConc: campos.id_infdiacua_mezcla_conc,
        idTipoMaterial: campos.id_tipo_material,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        movil: campos.movil,
        placa: campos.placa,
        volumen: campos.volumen,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        horaEntrada: campos.hora_entrada,
        horaInstalacion: campos.hora_instalacion,
        horaSalida: campos.hora_salida,
        abcsisaInicio: campos.abcsisa_inicio,
        abcsisaFinal: campos.abcsisa_final,
        abcsisaCarril: campos.abcsisa_carril,
        temperaturaRecibo: campos.temperatura_recibo,
        temperaturaLlegada: campos.temperatura_llegada,
        temperaturaExtendido: campos.temperatura_extendido,
        temperaturaCompactacion: campos.temperatura_extendido,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR mezcla_eliminar */
  mezcla_eliminar(campo: number): Observable<Mezcla> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/mezcla/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaMezclaConc: { idInfdiacuaMezclaConc: campo }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR mezcla_eliminar */
  mezcla_eliminar_varios(progDiaria: Mezcla[]): Observable<Mezcla[]> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/mezcla/eliminar';
    return forkJoin(progDiaria.map((progDiaria: Mezcla) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        infDiacuaMezclaConc: { idInfdiacuaMezclaConc: progDiaria.id_infdiacua_mezcla_conc },
      }
      return this.http.post<Mezcla>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }

  /**########################################################################################################################*/
  /**#######################  SECCION DE MAQUINARIA #########################################################################*/

  /** CONSULTAR POR FILTRO maquinaria_consultarXFiltro*/
  maquinaria_consultarXFiltro(filtro: string): Observable<Maquinaria> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/maquinaria/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** INSERTAR maquinaria_insertar  */
  maquinaria_insertar(campos: Maquinaria): Observable<Maquinaria> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/maquinaria/insertar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaMaquinaria: {
        idEquipo: campos.id_equipo,
        descripcion: campos.descripcion,
        movil: campos.movil,
        placa: campos.placa,
        horaInicial: campos.hora_inicial,
        horaFinal: campos.hora_final,
        horasTrabajadas: campos.horas_trabajadas,
        standBy: campos.stand_by,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        viajes: campos.viajes,
        actividadObservacion: campos.actividad_observacion,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ACTUALIZAR maquinaria_insertar  */
  maquinaria_actualizar(campos: Maquinaria): Observable<Maquinaria> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/maquinaria/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaMaquinaria: {
        idInfdiacuaMaquinaria: campos.id_infdiacua_maquinaria,
        idEquipo: campos.id_equipo,
        descripcion: campos.descripcion,
        movil: campos.movil,
        placa: campos.placa,
        horaInicial: campos.hora_inicial,
        horaFinal: campos.hora_final,
        horasTrabajadas: campos.horas_trabajadas,
        standBy: campos.stand_by,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        viajes: campos.viajes,
        actividadObservacion: campos.actividad_observacion,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR maquinaria_eliminar */
  maquinaria_eliminar(campo: number): Observable<Maquinaria> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/maquinaria/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaMaquinaria: { idInfdiacuaMaquinaria: campo }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR maquinaria_eliminar */
  maquinaria_eliminar_varios(progDiaria: Maquinaria[]): Observable<Maquinaria[]> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/maquinaria/eliminar';
    return forkJoin(progDiaria.map((progDiaria: Maquinaria) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        infDiacuaMaquinaria: { idInfdiacuaMaquinaria: progDiaria.id_infdiacua_maquinaria },
      }
      return this.http.post<Maquinaria>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }

  /**########################################################################################################################*/
  /**#######################  SECCION DE SALIDA MATERIAL / RETIRO DE MATERIALES Y ESCOMBROS #################################*/

  /** CONSULTAR POR FILTRO salidaMaterial_consultarXFiltro*/
  salidaMaterial_consultarXFiltro(filtro: string): Observable<SalidaMaterial> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/salidaMaterial/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** INSERTAR salidaMaterial_insertar  */
  salidaMaterial_insertar(campos: SalidaMaterial): Observable<SalidaMaterial> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/salidaMaterial/insertar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaSaliMaterial: {
        idTipoMaterial: campos.id_tipo_material,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        placa: campos.placa,
        movil: campos.movil,
        volumen: campos.volumen,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        horaEntrada: campos.hora_entrada,
        horaSalida: campos.hora_salida,
        idTipoDestino: campos.id_tipo_destino,
        numeroVale: campos.numero_vale,
        observaciones: campos.observaciones,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      },
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ACTUALIZAR salidaMaterial_insertar  */
  salidaMaterial_actualizar(campos: SalidaMaterial): Observable<SalidaMaterial> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/salidaMaterial/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaSaliMaterial: {
        idInfdiacuaSaliMaterial: campos.id_infdiacua_sali_material,
        idTipoMaterial: campos.id_tipo_material,
        idTipoClaseMaterial: campos.id_tipo_clase_material,
        placa: campos.placa,
        movil: campos.movil,
        volumen: campos.volumen,
        numeroRecibo: campos.numero_recibo,
        idArchivoRecibo: campos.id_archivo_recibo,
        horaEntrada: campos.hora_entrada,
        horaSalida: campos.hora_salida,
        idTipoDestino: campos.id_tipo_destino,
        numeroVale: campos.numero_vale,
        observaciones: campos.observaciones,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla,
      },
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR salidaMaterial_eliminar */
  salidaMaterial_eliminar(campo: number): Observable<SalidaMaterial> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/salidaMaterial/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaSaliMaterial: { idInformeDiarioCuadrilla: campo }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** ELIMINAR salidaMaterial_eliminar */
  salidaMaterial_eliminar_varios(progDiaria: SalidaMaterial[]): Observable<SalidaMaterial[]> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/salidaMaterial/eliminar';
    return forkJoin(progDiaria.map((progDiaria: SalidaMaterial) => {
      this.body = {
        usuario: this.securityService.userSession.login,
        infDiacuaSaliMaterial: { idInformeDiarioCuadrilla: progDiaria.id_infdiacua_sali_material },
      }
      return this.http.post<SalidaMaterial>(this.url, JSON.stringify(this.body), this.httpOptions);
    }));
  }


  /**########################################################################################################################*/
  /**#######################  SECCION DE OBSERVACIONES ######################################################################*/

  /** CONSULTAR POR FILTRO observacion_consultarXFiltro*/
  observacion_consultarXFiltro(filtro: string): Observable<Observaciones> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/observacion/consultarXFiltro';
    this.body = {
      usuario: this.securityService.userSession.login,
      filtro
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

  /** INSERTAR observacion_insertar  */
  observacion_insertar(campos: Observaciones) {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/observacion/insertar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaObservacion: {
        observaciones: campos.observaciones,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla
      }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions).toPromise();
  }

  /** ACTUALIZAR observacion_insertar  */
  observacion_actualizar(campos: Observaciones){
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/observacion/actualizar';

    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaObservacion: {
        idInfdiacuaObservacion: campos.id_infdiacua_observacion,
        observaciones: campos.observaciones,
        idInformeDiarioCuadrilla: campos.id_informe_diario_cuadrilla
      }
    }

    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions).toPromise();
  }

  /** ELIMINAR observacion_eliminar */
  observacion_eliminar(campo: number): Observable<Observaciones> {
    this.url = '/SIGMA-backend-desa/api/informeDiarioCuadrilla/observacion/eliminar';
    this.body = {
      usuario: this.securityService.userSession.login,
      infDiacuaSaliMaterial: { idInformeDiarioCuadrilla: campo }
    }
    return this.http.post<any>(this.url, JSON.stringify(this.body), this.httpOptions);
  }

}