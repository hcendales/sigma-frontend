export interface RevisionVisitas {
  idUsuario: null;
  codError: number;
  msgError: null;
  nombrePlantilla: null;
  respuesta: Respuesta[];
}

export interface Respuesta {
  id_proceso_gestion: number;
  id_proceso: number;
  nombre_proceso: null | string;
  id_mantenimiento_vial: number;
  pk_id_calzada: number;
  civ: number;
  descripcion_origen: null | string;
  descripcion_estado_pk: string;
  solicitud_radicado_entrada: null | string;
  numero_radicado_intervencion: null | number;
  descripcion_tipo_programa: null | string;
  descripcion_tipo_estrategia: null | string;
  descripcion_zona: string;
  descripcion_localidad: string;
  descripcion_barrio: string;
  descripcion_cuadrante: string;
  descripcion_upz: string;
  eje_vial: null | string;
  desde: null | string;
  hasta: null | string;
  descripcion_tipo_malla: string;
  km_carril_impacto: number;
  fecha_visita_tecnica: string;
  nombre_responsable_visita: string;
  id_actividad: number;
  nombre_actividad: string;
  url: string;
  masiva: string;
  fecha_asignacion: string;
  fecha_inicio: null | string;
  fecha_fin: null | string;
  fecha_vencimiento: string;
  dias_retraso: number;
  id_usuario: null | string;
  nombre_usuario: null | string;
  observaciones: null | string;
  id_proceso_gestion_anterior: number;
  estado_gestion: string;
  usuario_anterior: string;
  gestion_anterior: string;
  usuario_inicial: string;
}
