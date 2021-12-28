
/** RegistroDiarioPorCuadrilla*/
export interface RegistroDiarioPorCuadrilla {
    actividad_dia_siguiente:       string;
    area_total_intervenida:        number;
    cantidad_delineadores:         number;
    cantidad_seniales:             number;
    descripcion_clima_manana:      string;
    descripcion_clima_noche:       string;
    descripcion_clima_tarde:       string;
    descripcion_estado_informe:    string;
    descripcion_estado_obra:       string;
    descripcion_jornada:           string;
    fecha:                         number;
    hora_inicio_actividades:       string;
    horario_fin_actividades:       string;
    id_archivo_esquema:            null;
    id_informe_diario_cuadrilla:   number;
    id_mantenimiento_vial:         number;
    id_persona_aprueba:            Personas;          // LISTA TAB_PERSONA ROL??? Director de Obra
    id_persona_elabora:            Personas;          // LISTA TAB_PERSONA ROL??? Inspector de Obra
    id_persona_revisa:             Personas;          // LISTA TAB_PERSONA ROL??? Ingeniero de Apoyo / Residente de Obra
    id_tipo_clima_manana:          number;          // LISTA 126 TAB_INFORME_DIARIO_CUADRILLA_ID_TIPO_CLIMA
    id_tipo_clima_noche:           number;          // LISTA 126 TAB_INFORME_DIARIO_CUADRILLA_ID_TIPO_CLIMA
    id_tipo_clima_tarde:           number;          // LISTA 126 TAB_INFORME_DIARIO_CUADRILLA_ID_TIPO_CLIMA
    id_tipo_estado_informe:        number;          // LISTA 125? item repetido TAB_INFORME_DIARIO_CUADRILLA_ID_TIPO_ESTADO_INFORME
    id_tipo_estado_obra:           number;          // LISTA 119 TAB_MANTENIMIENTO_VIAL_ID_TIPO_ESTADO_OBRA
    id_tipo_jornada:               number;          // LISTA 120 TAB_PROGRAMACION_DIARIA_ID_TIPO_JORNADA
    longitud_total_intervenida:    number;
    nombre_persona_aprueba:        string;
    nombre_persona_elabora:        string;
    nombre_persona_revisa:         string;
    observaciones:                 string;
    porcentaje_avance_acum_obra:   number;
    porcentaje_avance_diario_obra: number;
    servicio_banio:                string;
    servicio_banio_horas:          number;
    servicio_vigilancia:           string;
    servicio_vigilancia_horas:     number;    
}
/**Interface Personas 
 * manejo de listas en la grilla de datos*/
export interface Personas {
    id_persona:                    number;
    id_tipo_regimen:               number;
    descripcion_tipo_regimen:      string;
    id_tipo_categoria_persona:     number;
    descripcion_categoria_persona: string;
    identificacion:                string;
    nombre:                        string;
    telefono:                      string;
    email:                         string;
    id_tipo_area:                  number;
    descripcion_area:              string;
    id_tipo_cargo:                 number;
    descripcion_cargo:             string;
    id_tipo_rol:                   number;
    descripcion_rol:               string;
    id_tipo_estado_persona:        number;
    descripcion_estado_persona:    string;
    auditoria_usuario:             string;
    auditoria_fecha:               number;
    id_usuario:                    number;
}
/** Seccion Interface Personal
 * Manejo CRUD */
export interface Personal {
    id_infdiacua_personal:         number;
    id_informe_diario_cuadrilla:   number;
    id_tipo_horario:               number;
    descripcion_tipo_horario:      string;
    id_persona:                    number;
    identificacion:                string;
    nombre:                        string;
    id_tipo_cargo:                 number;
    descripcion_cargo:             string;
    id_tipo_rol:                   number;
    descripcion_rol:               string;
    telefono:                      null | string;
    email:                         null | string;
    id_tipo_categoria_persona:     number;
    descripcion_categoria_persona: string;
    horario_llegada:               number;
    horario_salida:                number;
    observaciones:                 string;
    isEdit:                        boolean;
    isSelected:                    boolean;
}

/**Seccion equema Personal
 * Columnas y Orden que se mostraran en la tabla */
export const PersonalSchema = {
    isSelected:                    "isSelected",
    id_tipo_horario:               "id_tipo_horario",                // LISTA : 127 TAB_INFDIACUA_PERSONAL_ID_TIPO_HORARIO
    identificacion:                "identificacion",
    id_tipo_cargo:                 "id_tipo_cargo",                  // LISTA : 4 CARGO
    id_tipo_rol:                   "id_tipo_rol",                    // LISTA : 82 TAB_PERSONA_ID_TIPO_ROL
    id_persona:                    "id_persona",
    telefono:                      "telefono",                       // null?
    email:                         "email",                          // null?
    id_tipo_categoria_persona:     "id_tipo_categoria_persona",      // LISTA : 14 TAB_PERSONA_ID_TIPO_CATEGORIA_PERSONA
    horario_llegada:               "horario_llegada",                // formato time o date?
    horario_salida:                "horario_salida",                 // formato time o date?
    observaciones:                 "observaciones",
    isEdit:                        "isEdit"
}

/**Seccion Interface Calidad 
 * manejo CRUD */
export interface CantidadObra {
    id_infdiacua_cant_obra:      number;
    id_informe_diario_cuadrilla: number;
    id_tipo_actividad:           number;
    descripcion_tipo_actividad:  string;
    id_tipo_material:            number;
    descripcion_tipo_material:   string;
    id_tipo_clase_material:      number;
    descripcion_clase_material:  string;
    id_tipo_unidad_medida:       number;
    descripcion_unidad_medida:   string;
    cantidad:                    number;
    largo:                       number;
    ancho:                       number;
    espesor:                     number;
    volumen_material_compacto:   number;
    porcentaje_compactacion:     number;
    manual:                      string;
    mecanica:                    string;
    isEdit:                      boolean;
    isSelected:                  boolean;
}

/** Seccion equema Cantidad 
 * Columnas y Orden que se mostraran en la tabla */
export const CantidadObraSchema = {
    isSelected:                    "isSelected",
    id_tipo_actividad:             "id_tipo_actividad",             // LISTA: 131:TAB_INFDIACUA_CANT_OBRA_ID_TIPO_ACTIVIDAD
    id_tipo_material:              "id_tipo_material",              // LISTA: 122:TAB_PROGDIARIA_MATERIAL_ID_TIPO_MATERIAL
    id_tipo_clase_material:        "id_tipo_clase_material",        // LISTA: 123:TAB_PROGDIARIA_MATERIAL_ID_CLASE_MATERIAL
    id_tipo_unidad_medida:         "id_tipo_unidad_medida",         // LISTA: 130:TAB_INFDIACUA_CANT_OBRA_ID_TIPO_UNIDAD_MEDIDA
    cantidad:                      "cantidad",
    largo:                         "largo",
    ancho:                         "ancho",
    espesor:                       "espesor",
    volumen_material_compacto:     "volumen_material_compacto",
    porcentaje_compactacion:       "porcentaje_compactacion",
    manual:                        "manual",
    mecanica:                      "mecanica",
    isEdit:                        "isEdit"    
}

/** Seccion Interface Calidad 
 * manejo CRUD */
export interface Calidad {
    id_infdiacua_calidad:        number;
    id_informe_diario_cuadrilla: number;
    numero_muestras_tomadas:     number;
    id_tipo_material:            number;
    descripcion_tipo_material:   string;
    id_tipo_ensayo:              number;
    descripcion_tipo_ensayo:     string;
    resultado:                   string;
    isEdit:                      boolean;
    isSelected:                  boolean;
}

/**Seccion esquema Calidad 
 * Columnas y Orden que se mostraran en la tabla */
export const CalidadSchema = {
    isSelected:                    "isSelected",
    numero_muestras_tomadas:       "numero_muestras_tomadas",
    id_tipo_material:              "id_tipo_material",              // LISTA: 122:TAB_PROGDIARIA_MATERIAL_ID_TIPO_MATERIAL
    id_tipo_ensayo:                "id_tipo_ensayo",                // LISTA: 132:TAB_INFDIACUA_CANT_OBRA_ID_TIPO_ACTIVIDAD
    resultado:                     "resultado",
    isEdit:                        "isEdit"        
}

/**Seccion interface Materiales 
 * manejo CRUD */
export interface Materiales {
    id_infdiacua_entr_material:  number;
    id_informe_diario_cuadrilla: number;
    id_tipo_material:            number;                            
    descripcion_tipo_material:   string;
    id_tipo_clase_material:      number;                            
    descripcion_clase_material:  string;
    placa:                       string;
    movil:                       string;
    volumen:                     number;
    numero_recibo:               string;
    id_archivo_recibo:           null;
    hora_entrada:                string;
    hora_salida:                 string;
    actividad_observacion:       string;
    observaciones:               string;
    isEdit:                      boolean;
    isSelected:                  boolean;    
}

/**Seccion esquema Material 
 * * Columnas y Orden que se mostraran en la tabla */
export const MaterialSchema = {
    isSelected:                  "isSelected",
    id_tipo_material:            "id_tipo_material",                // LISTA: 122:TAB_PROGDIARIA_MATERIAL_ID_TIPO_MATERIAL
    id_tipo_clase_material:      "id_tipo_clase_material",          // LISTA: 123:TAB_PROGDIARIA_MATERIAL_ID_CLASE_MATERIAL
    placa:                       "placa",
    movil:                       "movil",
    volumen:                     "volumen",
    numero_recibo:               "numero_recibo",
    id_archivo_recibo:           "id_archivo_recibo",
    hora_entrada:                "hora_entrada",
    hora_salida:                 "hora_salida",
    actividad_observacion:       "actividad_observacion",
    observaciones:               "observaciones",
    isEdit:                      "isEdit", 
}

/**Seccion Interface Mezcla 
 * manejo CRUD */
export interface Mezcla {
    id_infdiacua_mezcla_conc:    number;
    id_informe_diario_cuadrilla: number;
    id_tipo_material:            number;
    descripcion_tipo_material:   string;
    id_tipo_clase_material:      number;
    descripcion_clase_material:  string;
    movil:                       string;
    placa:                       string;
    volumen:                     number;
    numero_recibo:               string;
    id_archivo_recibo:           null;
    hora_entrada:                string;
    hora_instalacion:            string;
    hora_salida:                 string;
    abcsisa_inicio:              number;
    abcsisa_final:               number;
    abcsisa_carril:              number;
    temperatura_recibo:          number;
    temperatura_llegada:         number;
    temperatura_extendido:       number;
    temperatura_compactacion:    number;
    isEdit:                      boolean;
    isSelected:                  boolean;    
}

/**Seccion equema Mezcla  
 * * Columnas y Orden que se mostraran en la tabla */
export const MezclaSchema = {
    isSelected:                  "isSelected",
    id_tipo_material:            "id_tipo_material",            // LISTA: 122:TAB_PROGDIARIA_MATERIAL_ID_TIPO_MATERIAL
    id_tipo_clase_material:      "id_tipo_clase_material",      // LISTA: 123:TAB_PROGDIARIA_MATERIAL_ID_CLASE_MATERIAL
    movil:                       "movil",
    placa:                       "placa",
    volumen:                     "volumen",
    numero_recibo:               "numero_recibo",
    id_archivo_recibo:           "id_archivo_recibo",           //?
    hora_entrada:                "hora_entrada",
    hora_instalacion:            "hora_instalacion",
    hora_salida:                 "hora_salida",
    abcsisa_inicio:              "abcsisa_inicio",
    abcsisa_final:               "abcsisa_final",
    abcsisa_carril:              "abcsisa_carril",
    temperatura_recibo:          "temperatura_recibo",
    temperatura_llegada:         "temperatura_llegada",
    temperatura_extendido:       "temperatura_extendido",
    temperatura_compactacion:    "temperatura_compactacion",
    isEdit:                      "isEdit",
}

/**Seccion Interface Maquinaria 
 * manejo CRUD */
export interface Maquinaria {
    id_infdiacua_maquinaria:     number;
    id_informe_diario_cuadrilla: number;
    id_equipo:                   number;
    descripcion:                 string;
    movil:                       string;
    placa:                       string;
    hora_inicial:                string;
    hora_final:                  string;
    horas_trabajadas:            number;
    stand_by:                    number;
    numero_recibo:               string;
    id_archivo_recibo:           null;
    viajes:                      number;
    actividad_observacion:       string;
    // placa_equipo:                string;
    // movil_equipo:                null;
    // placa_inventario:            null;
    // id_tipo_clase_equipo:        number;
    // descripcion_clase_equipo:    string;
    // id_tipo_equipo:              number;
    // descripcion_tipo_equipo:     string;
    // id_tipo_origen_equipo:       number;
    // descripcion_origen_equipo:   string;
    isEdit:                      boolean;
    isSelected:                  boolean;       
}

/**Seccion esquema Maquinaria 
 * * Columnas y Orden que se mostraran en la tabla */
export const MaquinariaSchema = {
    isSelected:                  "isSelected",
    id_equipo:                   "id_equipo",                     //LISTA 3480 : TAB_EQUIPO_ID_TIPO_EQUIPO 
    descripcion:                 "descripcion",                   //de qie? TAB_EQUIPO
    movil:                       "movil",
    placa:                       "placa",
    hora_inicial:                "hora_inicial",
    hora_final:                  "hora_final",
    horas_trabajadas:            "horas_trabajadas",
    stand_by:                    "stand_by",
    numero_recibo:               "numero_recibo",
    id_archivo_recibo:           "id_archivo_recibo",               //???
    viajes:                      "viajes",
    actividad_observacion:       "actividad_observacion",
    // placa_equipo:                "placa_equipo",
    // movil_equipo:                "movil_equipo",
    // placa_inventario:            "placa_inventario",
    // id_tipo_clase_equipo:        "id_tipo_clase_equipo",            //?LISTA 3481 : TAB_EQUIPO_ID_TIPO_CLASE_EQUIPO
    // id_tipo_equipo:              "id_tipo_equipo",                  //?LISTA 3480 : TAB_EQUIPO_ID_TIPO_EQUIPO
    // id_tipo_origen_equipo:       "id_tipo_origen_equipo",           //?Lista 3482 : 
    isEdit:                      "isEdit",
}

/**Seccion Interface Retiro de Materiales y Escombros
 * manejo CRUD */
export interface SalidaMaterial {
    id_infdiacua_sali_material:  number;
    id_informe_diario_cuadrilla: number;
    id_tipo_material:            number;
    descripcion_tipo_material:   string;
    id_tipo_clase_material:      number;
    descripcion_clase_material:  string;
    placa:                       string;
    movil:                       string;
    volumen:                     number;
    numero_recibo:               string;
    id_archivo_recibo:           null;
    hora_entrada:                string;
    hora_salida:                 string;
    id_tipo_destino:             number;
    descripcion_destino:         string;
    numero_vale:                 string;
    observaciones:               string;
    isEdit:                      boolean;
    isSelected:                  boolean;
}

/**Seccion Esquema Retiro de Materiales y Escombros 
 * * Columnas y Orden que se mostraran en la tabla */
export const SalidaMaterialSchema = {
    isSelected:                  "isSelected",
    id_tipo_material:            "id_tipo_material",        //122 : TAB_PROGDIARIA_MATERIAL_ID_TIPO_MATERIAL
    id_tipo_clase_material:      "id_tipo_clase_material",  //123 : TAB_PROGDIARIA_MATERIAL_ID_CLASE_MATERIAL (NO USAR / CAMBIO)
    placa:                       "placa",
    movil:                       "movil",
    volumen:                     "volumen",
    numero_recibo:               "numero_recibo",
    id_archivo_recibo:           "id_archivo_recibo",
    hora_entrada:                "hora_entrada",
    hora_salida:                 "hora_salida",
    id_tipo_destino:             "id_tipo_destino",         //129 : TAB_INFDIACUA_SALI_MATERIAL_ID_TIPO_DESTINO
    numero_vale:                 "numero_vale",
    observaciones:               "observaciones",
    isEdit:                      "isEdit",
}
/**Seccion Observaciones Generales 
 * manejo CRUD */
export interface Observaciones {
    id_infdiacua_observacion:    number;
    id_informe_diario_cuadrilla: number;
    observaciones:               string;
}
