export interface Recurso{
  idRecurso: number;
  idTipoRecurso: number;
  intervaloProgramacion: number;
  idPersona: number;
  idEquipo: number;
  idLugar: number;
  fechaInicio: number;
  fechaFin: number;
  horaInicioProgramacion: string;
  horaFinProgramacion: string;
  descripcion: string;
}
