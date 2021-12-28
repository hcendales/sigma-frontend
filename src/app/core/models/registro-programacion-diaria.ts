export interface BandejaGestionPendiente {
    anotaciones:                       null;
    civ:                               string;
    codigo_actividad_agrupada:         string;
    coi:                               null;
    descripcion_actividad_agrupada:    string;
    descripcion_barrio:                string;
    descripcion_cuadrante:             string;
    descripcion_estado_infdiacua:      null;
    descripcion_estado_obra:           null;
    descripcion_estado_pk:             string;
    descripcion_estado_pmt:            null;
    descripcion_estado_progdiaria:     string;
    descripcion_jornada_infdiacua:     null;
    descripcion_jornada_progdiaria:    string;
    descripcion_localidad:             string;
    descripcion_origen:                string;
    descripcion_periodicidad:          null;
    descripcion_pmt:                   null;
    descripcion_tipo_estrategia:       null;
    descripcion_tipo_malla:            string;
    descripcion_tipo_programa:         string;
    descripcion_upz:                   string;
    descripcion_zona:                  string;
    desde:                             string;
    dias_ejecucion_infdiacua:          null;
    dias_ejecucion_progdiaria:         number;
    dias_laborales:                    null;
    dias_retraso:                      number;
    eje_vial:                          string;
    estado_gestion:                    string;
    fecha_asignacion:                  number;
    fecha_fin:                         null;
    fecha_inicio:                      null;
    fecha_radicado_pmt:                null;
    fecha_vencimiento:                 number;
    fecha_visita_tecnica:              number;
    gestion_anterior:                  null;
    hasta:                             string;
    id_actividad:                      number;
    id_archivo_coi_pmt:                null;
    id_documento:                      number;
    id_mantenimiento_vial:             number;
    id_mantenimiento_vial_evento:      number;
    id_persona_aprueba_infdiacua:      null;
    id_persona_aprueba_progdiaria:     null;
    id_persona_director_obra:          null;
    id_persona_elabora_infdiacua:      null;
    id_persona_elabora_progdiaria:     number;
    id_persona_residente_obra:         null;
    id_persona_revisa_infdiacua:       null;
    id_persona_revisa_progdiaria:      null;
    id_proceso:                        number;
    id_proceso_gestion:                number;
    id_proceso_gestion_anterior:       number;
    id_programacion_periodica:         null;
    id_tipo_documento:                 null;
    id_tipo_estado_obra:               null;
    id_tipo_estado_pmt:                null;
    id_tipo_periodicidad:              null;
    id_tipo_periodo_programacion:      null;
    id_tipo_pmt:                       null;
    id_unidad_ejecutora:               null;
    id_usuario:                        null;
    km_carril:                         number;
    km_carril_impacto:                 number;
    km_carril_obra:                    number;
    km_lineal:                         number;
    masiva:                            string;
    max_fecha_infdiacua:               null;
    max_fecha_progdiaria:              number;
    min_fecha_infdiacua:               null;
    min_fecha_progdiaria:              number;
    nombre_actividad:                  string;
    nombre_director_obra:              null;
    nombre_periodo:                    null;
    nombre_persona_aprueba_infdiacua:  null;
    nombre_persona_aprueba_prodiaria:  null;
    nombre_persona_elabora_infdiacua:  null;
    nombre_persona_elabora_progdiaria: string;
    nombre_persona_revisa_infdiacua:   null;
    nombre_persona_revisa_progdiaria:  null;
    nombre_proceso:                    string;
    nombre_residente_obra:             null;
    nombre_responsable_disenio:        null;
    nombre_responsable_predise:        null;
    nombre_responsable_visita:         string;
    nombre_tipo_documento:             null;
    nombre_usuario:                    null;
    numero_dias_duracion_planeada:     null;
    numero_radicado_intervencion:      null;
    numero_radicado_pmt:               null;
    numero_radicado_res_reserva:       null;
    numero_radicado_sdm_pmt:           null;
    numero_radicado_sol_reserva:       null;
    observaciones:                     null;
    observaciones_pmt:                 null;
    periodo_fecha_desde:               null;
    periodo_fecha_hasta:               null;
    pk_id_calzada:                     number;
    priorizacion_trimestre:            null;
    requiere_aforo:                    null;
    requiere_apiques:                  null;
    respuesta_aforo:                   null;
    respuesta_apiques:                 null;
    solicitud_radicado_entrada:        null;
    url:                               string;
    usuario_anterior:                  null;
    usuario_inicial:                   null;
    valor_estado_pmt:                  null;
    valor_pmt:                         null;
    vigencia_programacion_periodica:   null;
}


export interface EquipoConsultarXFiltro {
    id_persona?: number;
    id_tipo_regimen?: number;
    descripcion_tipo_regimen?: DescripcionTipoRegimen;
    id_tipo_categoria_persona?: number;
    descripcion_categoria_persona?: DescripcionCategoriaPersona;
    identificacion?: string;
    nombre?: string;
    telefono?: null;
    email?: null;
    id_tipo_area?: number | null;
    descripcion_area?: null | string;
    id_tipo_cargo?: null;
    descripcion_cargo?: null;
    id_tipo_rol?: number;
    descripcion_rol?: DescripcionRol;
    id_tipo_estado_persona?: null;
    descripcion_estado_persona?: null;
    auditoria_usuario?: AuditoriaUsuario;
    auditoria_fecha?: number;
    id_usuario?: null;
    id_equipo?: number;
    numero_interno?: string;
    placa_inventario?: null | string;
    placa?: null | string;
    movil?: null | string;
    id_tipo_clase_equipo?: number;
    descripcion_clase_equipo?: DescripcionClaseEquipo | null;
    id_tipo_equipo?: number | null;
    descripcion_tipo_equipo?: null | string;
    pico_y_placa?: PicoYPlaca;
    id_tipo_origen_equipo?: number | null;
    descripcion_origen_equipo?: DescripcionOrigenEquipo | null;
    plazo_dias_mantenimiento?: number;
    horas_mantenimiento?: number;
    kilometros_mantenimiento?: number;
    fecha_ultimo_mantenimiento?: number;
    fecha_siguiente_mantenimiento?: number | null;
    id_tipo_estado_equipo?: number;
    descripcion_estado_equipo?: DescripcionEstadoEquipo;
    id_tipo_marca_equipo?: number | null;
    descripcion_marca_equipo?: null | string;
    linea?: null | string;
    cilindraje?: number | null;
    numero_motor?: null | string;
    numero_chasis?: null | string;
    id_tipo_combustible?: number | null;
    descripcion_combustible?: DescripcionCombustible | null;
    modelo?: number | null;
    color?: null | string;
    fecha_inicio?: number | null;
    fecha_fin?: number | null;
    toneladas?: number | null;
    pasajeros?: number | null;
    numero_serial?: null | string;
    referencia?: null | string;
    descripcion?: null | string;
    volumen_m3?: number | null;
    id_tipo_unidad_uso?: number | null;
    descripcion_unidad_uso?: DescripcionUnidadUso | null;
    id_tipo?: number;
    valor?: string;
}

export enum AuditoriaUsuario {
    APLSigma2021 = "APL_SIGMA_2021",
    ClaudiaGomez = "claudia.gomez",
    JavierGarcia = "javier.garcia",
    RocioGuio = "rocio.guio",
    RodrigoAcosta = "rodrigo.acosta",
}

export enum DescripcionCategoriaPersona {
    Funcionario = "FUNCIONARIO",
}

export enum DescripcionClaseEquipo {
    Maquinaria = "Maquinaria",
    VehículoLiviano = "Vehículo Liviano",
    VehículoPesado = "Vehículo Pesado",
}

export enum DescripcionCombustible {
    Acpm = "ACPM",
    Gas = "GAS",
    Gasolina = "GASOLINA",
    IntervenciónDeLaMallaVialLocal = "Intervención de la malla vial local",
    PlanificaciónDelDesarrolloVialLocal = "Planificación del desarrollo vial local",
}

export enum DescripcionEstadoEquipo {
    Activo = "ACTIVO",
    DeBaja = "DE BAJA",
    EnUso = "EN USO",
    Inactivo = "INACTIVO",
}

export enum DescripcionOrigenEquipo {
    Contrato = "CONTRATO",
    Entidad = "ENTIDAD",
}

export enum DescripcionRol {
    UnidadEjecutora = "UNIDAD EJECUTORA",
}

export enum DescripcionTipoRegimen {
    Natural = "NATURAL",
}

export enum DescripcionUnidadUso {
    Dia = "DIA",
    Hora = "HORA",
    KM = "KM",
    M2 = "M2",
    M3 = "M3",
    Ml = "ML",
    Viaje = "VIAJE",
}

export enum PicoYPlaca {
    No = "NO",
    Si = "SI",
}




/**Campos que se usaran en el CRUD */
export interface progDiariaCrud {
    id_programacion_diaria:          number;
    id_mantenimiento_vial:           number;
    fecha:                           number;
    id_tipo_jornada:                 number;
    descripcion_jornada:             string;
    id_tipo_estado_programacion:     number;
    descripcion_estado_programacion: string;
    hora_trabajo_desde:              string;
    hora_trabajo_hasta:              string;
    observaciones:                   string;
    id_persona_elabora:              number;
    isEdit:                          boolean;
    isSelected:                      boolean;
    viewElement:                     boolean;
}

/**Columnas y Orden que se mostraran en la tabla */
export const progDiariaCrudSchema = {
    //isSelected:                      "isSelected",
    viewElement:                     "isViewElement",
    fecha:                           "fecha",
    id_tipo_jornada:                 "listaJornada",                // LISTA 120:TAB_PROGRAMACION_DIARIA_ID_TIPO_JORNADA
    id_tipo_estado_programacion:     "listaEstadoProgramacion",     // LISTA 124:TAB_PROGRAMACION_DIARIA_ID_TIPO_ESTADO_PROGRAMACION
    hora_trabajo_desde:              "horaDesde",
    hora_trabajo_hasta:              "horaHasta",
    observaciones:                   "observaciones",
    isEdit:                          "isEdit"
}

/**Campos que se usaran en el CRUD */
export interface personalCrud {
    id_progdiaria_personal:          number;
    id_programacion_diaria:          number;
    id_tipo_rol:                     number;
    descripcion_rol:                 string;
    id_tipo_origen:                  number;
    descripcion_origen:              string;
    cantidad:                        number;
    id_persona:                      number;
    identificacion:                  string;
    isEdit:                          boolean;
    isSelected:                      boolean;    
}

/**Columnas y Orden que se mostraran en la tabla */
export const personalCrudSchema = {
    isSelected:                      "isSelected",
    id_tipo_origen:                  "id_tipo_origen", // LISTA 121:TAB_PROGDIARIA_PERSONAL_ID_TIPO_ORIGEN
    id_tipo_rol:                     "id_tipo_rol",    // LISTA 82:TAB_PERSONA_ID_TIPO_ROL
    id_persona:                      "id_persona",
    isEdit:                          "isEdit"
}

/**Campos que se usaran en el CRUD */
export interface materialCrud {
    id_progdiaria_material:          number;
    id_programacion_diaria:          number;
    id_tipo_material:                number;
    descripcion_tipo_material:       string;
    id_tipo_clase_material:          number;
    descripcion_clase_material:      string;
    id_tipo_origen:                  number;
    descripcion_origen:              string;
    cantidad:                        number;
    id_tipo_unidad_medida:           number;
    descripcion_unidad_medida:       string;
    id_tipo_unidadejecutora:         number;
    nombre_unidadejecutora:          string;
    hora:                            string;
    isEdit:                          boolean;
    isSelected:                      boolean;    
}

/**Columnas y Orden que se mostraran en la tabla */
export const materialCrudSchema = {
    isSelected:                      "isSelected",
    id_tipo_origen:                  "listaTipoOrigen",         // LISTA: 121:TAB_PROGDIARIA_PERSONAL_ID_TIPO_ORIGEN
    id_tipo_material:                "listaTipoMaterial",       // LISTA: 122:TAB_PROGDIARIA_MATERIAL_ID_TIPO_MATERIAL
    id_tipo_clase_material:          "listaTipoClaseMaterial",  // LISTA: 123:TAB_PROGDIARIA_MATERIAL_ID_CLASE_MATERIAL
    cantidad:                        "cantidad",
    id_tipo_unidad_medida:           "listaTipoUnidadMedida",   // LISTA: 130:TAB_INFDIACUA_CANT_OBRA_ID_TIPO_UNIDAD_MEDIDA
    hora:                            "hora",
    id_tipo_unidadejecutora:         "listaUnidadEjecutora",    //????
    isEdit:                          "isEdit"
}

/**Campos que se usaran en el CRUD */
export interface maquinariaCrud {
    id_progdiaria_maquinaria:        number;
    id_programacion_diaria:          number;
    id_tipo_clase_equipo:            number;
    descripcion_clase_equipo:        string;
    id_tipo_equipo:                  number;
    descripcion_tipo_equipo:         string;
    id_tipo_origen:                  number;
    descripcion_tipo_origen:         string;
    cantidad:                        number;
    hora:                            string;
    movil:                           string;
    id_tipo_unidadejecutora:         number;
    nombre_unidadejecutora:          string;
    descripcion_maquina:             string;
    isEdit:                          boolean;
    isSelected:                      boolean;    
}

/**Columnas y Orden que se mostraran en la tabla */
export const maquinariaCrudSchema = {
    isSelected:                      "isSelected",
    id_tipo_origen:                  "listaTipoOrigen",         //LISTA: 121 :  TAB_PROGDIARIA_PERSONAL_ID_TIPO_ORIGEN
    id_tipo_clase_equipo:            "listaTipoClaseEquipo",    //LISTA: 3481:  TAB_EQUIPO_ID_TIPO_CLASE_EQUIPO
    id_tipo_equipo:                  "listaTipoEquipo",         //LISTA: 3480:  TAB_EQUIPO_ID_TIPO_EQUIPO
    //cantidad:                        "cantidad",
    movil:                           "movil",
    descripcion_maquina:             "descripcion_maquina",    //????
    hora:                            "hora",
    id_tipo_unidadejecutora:         "listaUnidadEjecutora",    //????
    isEdit:                          "isEdit"
}

