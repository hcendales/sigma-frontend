export interface CargarDocumento {
    id_mantenimiento_vial_docu:     number; ///
    id_documento:                   number; 
    id_mantenimiento_vial:          number;
    registro_activo:                string;
    id_tipo_documento:              number;
    valor_tipo_documento:           string;
    descripcion_tipo_documento:     string;
    id_tipo_estado_documento:       number;
    valor_estado_documento:         string;
    descripcion_estado_documento:   string;
    numero:                         null;
    numero_version:                 number;
    fecha_documento:                number;
    descripcion:                    null;
    url_archivo:                    null;
    id_tipo_origen:                 number;
    valor_tipo_origen:              string;
    descripcion_tipo_origen:        string;
    fecha_mantenimiento:            number;
    pk_id_calzada:                  number; ///
    id_tipo_estado_pk:              number;
    valor_estado_pk:                string;
    descripcion_estado_pk:          string;
    civ:                            number; ///
    numero_radicado_entrada:        null;
    fecha_visita_tecnica:           number;
    id_persona_responsable_visita:  number;
    nombre_responsable_visita:      string;
    observaciones_diagnostico:      string;
    numero_radicado_salida:         null;
    numero_radicado_intervencion:   null;
    fecha_radicado_intervencion:    null;
    fecha_terminacion:              null;
    fecha_visita_verificacion:      null;
    id_persona_responsable_verif:   null;
    nombre_responsable_verif:       null;
    id_persona_director_obra:       null;
    nombre_director_obra:           null;
    id_persona_residente_social:    null;
    nombre_residente_social:        null;
    id_persona_residente_sst:       null;
    nombre_residente_sst:           null;
    id_persona_residente_ambiental: null;
    nombre_residente_ambiental:     null;
    observaciones_intervencion:     null;
    requiere_actualizacion_diag:    null;
    id_tipo_estado_pmt:             null;
    valor_estado_pmt:               null;
    descripcion_estado_pmt:         null;
    numero_radicado_pmt:            null;
    fecha_radicado_pmt:             null;
    id_persona_residente_obra:      null;
    nombre_residente_obra:          null;
    numero_radicado_sol_reserva:    null;
    numero_radicado_res_reserva:    null;
}


export interface TipoDocumentos {
    id_tipo_documento:       number;
    nombre:                  string;
    id_tipo_proceso:         number | null;
    descripcion_tipoproceso: null | string;
    registro_activo:         RegistroActivo;
    auditoria_fecha:         number;
}

export enum RegistroActivo {
    No = "NO",
    Si = "SI",
}
