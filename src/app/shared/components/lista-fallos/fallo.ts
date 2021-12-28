export interface Fallo {
    numero_interno?:string;
    fecha_reporto_fallo?:string;
    descripcion_fallo?: string;
    variable_control_fallo?: string;
    valor_var_fallo?: string;
    ubicacion?: string;
    id_usuario?: number;
}
