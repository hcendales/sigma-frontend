export interface SolicitudEnsayoLaboratorio {

  actividad                        : string | null        ;
  anio                             : number               ;
  apiques                          : number               ;
  cantidad_frecuencia              : string | null        ;
  codigo_ensayo                    : string               ;
  consecutivo                      : string | null        ;
  desc_cantidad                    : string               ;
  desc_capas                       : string               ;
  desc_frecuencia                  : string               ;
  desc_jornada                     : string               ;
  desc_lote                        : string               ;
  desc_obra                        : string               ;
  desc_observaciones               : string               ;
  desc_perfil                      : string               ;
  desc_planta                      : string               ;
  desc_servicio                    : string               ;
  desc_tipo_grupo                  : string               ;
  desc_tipo_material_ensayo        : string               ;
  descripcion                      : string | null        ;
  descripcion_tipo_servicio        : string | null        ;
  direccion                        : string | null        ;
  espesor                          : string | null        ;
  fecha_instalacion_mezcla         : Date                 ;
  fecha_programada                 : Date                 ;
  fecha_recepcion                  : Date                 ;
  fecha_solicitud                  : Date                 ;
  fecha_toma                       : Date                 ;
  hora                             : string               ;
  id_capas                         : string               ;
  id_documento                     : number               ;
  id_documento_informe             : number | null        ;
  id_ensayo                        : number               ; 
  id_frecuencia                    : number | null        ;
  id_jornada                       : string               ;
  id_lote                          : number | null        ;
  id_obra                          : number | null        ;
  id_perfil                        : string               ;
  id_persona_director_obra         : number               ;
  id_persona_residente_social      : number               ;
  id_planta                        : number | null        ;
  id_responsable_toma              : string               ;
  id_tipo_cantidad                 : number               ;
  id_tipo_grupo                    : number | null        ;
  id_tipo_intervencion             : number | null        ;
  id_tipo_material_ensayo          : number               ; 
  id_tipo_observacion              : string               ;
  id_tipo_servicio                 : number               ;
  id_usuario_recibe_muestra        : string               ;
  id_usuario_solicitud             : string               ;
  mes                              : number               ;
  mezcla_formula                   : string               ;
  nombre_persona_director_obra     : string               ;
  nombre_persona_residente_social  : string | null        ;
  nombre_usuario_recibe_muestra    : string               ;
  nombre_usuario_solicitud         : string               ;
  novedades                        : string | null        ;
  observacion                      : string               ;
  origen                           : string | null        ;
  placa                            : string | null        ;
  prioridad                        : number               ;
  procedencia_muestra              : string | null        ;
  subgrupo                         : string | null        ;
  telefono_director_obra           : number               ;
  telefono_residente_social        : number               ;
  version                          : number               ;
  situacion                        : string               ;
  
  listaPKMantActivos               : listaPKMantActivos[] ;
  listaEnsayo                      : listaEnsayo[]        ;
  listaMateriales                  : listaMateriales[]    ;
  informeDetalle                   : informeDetalle[]     ;
}

export interface listaPKMantActivos {

  civ                              : string | undefined   ;
  descripcion_estado_pk            : string | undefined   ;
  desde                            : string | undefined   ;
  eje_vial                         : string | undefined   ;
  hasta                            : string | undefined   ;
  id_ensayo                        : number               ;
  id_ensayo_pk                     : number | undefined   ;
  id_barrio                        : number | undefined   ;
  id_cuadrante                     : number | undefined   ;
  id_localidad                     : number | undefined   ;
  id_mantenimiento_vial            : number | undefined   ;
  id_upla                          : number | undefined   ;
  id_upz                           : number | undefined   ;
  id_zona                          : number | undefined   ;
  pk_id_calzada                    : number | undefined   ;

}

export interface listaEnsayo {

  desc_tipo_ensayo                 : string | undefined   ;
  descripcion_tipo_ensayo          : string | undefined   ;
  codigo_tipo_ensayo               : string | undefined   ; 
  id_ensayo                        : number               ;            
  id_ensayo_detalle                : number | undefined   ; 
  id_tipo_servicio_ensayo          : number               ;            
  programado                       : number               ;
  ejecutado                        : number               ;
}

export interface listaMateriales {
  descripcion_tipo_grupo           : string | undefined   ;
  descripcion_tipo_servicio        : string | undefined   ;
  id_ensayo                        : number               ;
  id_tipo_grupo                    : number | undefined   ;
  id_tipo_material_ensayo          : number               ;
  id_tipo_servicio                 : number | undefined   ;
  subgrupo                         : string | undefined   ;
  subgrupo_padre                   : string | undefined   ;
  fuente_material                  : string | undefined   ;
}

/** Campos para ser usardos En la Pestania de Gestion */
export interface informeDetalle {
  asunto                           : string               ;
  fecha_ejecucion                  : Date                 ;
  fecha_programacion               : Date                 ;
  fecha_radicado                   : Date                 ;
  fecha_resultado                  : Date                 ;
  fecha_toma                       : Date                 ;  
  id_documento_informe             : number               ;
  id_ensayo                        : number               ;  
  id_ensayo_informe                : number               ;  
  id_responsable_toma              : number               ;  
  id_tipo_resultado                : string               ;
  id_usuario_laboratorio           : number               ;
  nombre_ensayo                    : string               ;  
  novedades                        : string               ;  
  numero_radicado                  : string               ;
  observaciones                    : string               ;
  

}

