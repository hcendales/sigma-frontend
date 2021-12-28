import { Relacion } from "./realcion";

export interface Asignacion {
    fecha:number;
    relaciones?:Relacion[];
    id_recurso_disponibilidad_relacion?:number;
}
