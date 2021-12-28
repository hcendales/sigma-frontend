export interface Transicion {
    id_mantenimiento_vial_evento?: string;
    pk_id_calzada?: string;
    descripcion_localidad?: string;
    descripcion_zona?: string;
    descripcion_barrio?: string;
    descripcion_upz?: string;
    solicitud_radicado_entrada?: string;
    descripcion_origen?: string;
    descripcion_estado_pk?: string;
    fecha_asignacion?: string;
    fecha_vencimiento?: string;
    nombre_responsable_visita?: string;
    civ?: string;
    descripcion_actividad_agrupada?: string;
    priorizacion_trimestre?: string;
    eje_vial?: string;
    id_localidad?: number;
    valor_localidad?: string;
    desde?: string;
    hasta?: string;
    tipo_elemento?: string;
    descripcion_tipo_superficie?: string;
    descripcion_tipo_malla?: string;
    km_carril_impacto?: string;
    descripcion_tipo_programa?: string;
    descripcion_tipo_estrategia?: string;
}
