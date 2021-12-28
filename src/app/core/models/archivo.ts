export class Archivo {
  idArchivo: number | undefined;
  file: string | undefined;
  urlArchivo: string | undefined;
  auditoriaUsuario: string | undefined;
  auditoriaFecha: number | undefined;
  idDocumento: number | undefined;
  idMantenimientoVial: number | undefined;
  idTiposArchivos: string | undefined;
  nuevoOCambio: boolean;
  // ATRIBUTO TEMPORAL PARA ALMACENAR EL ARCHIVO QUE SE CARGA
   selectedFile: File | undefined;
  // Atributo temporal para almacenar la url del archivo a cargar
  urlTmp: string | undefined;
  /*
  tabFormatos;
  */
 constructor ( nombre?: string) {
  this.nuevoOCambio = false;
    if (nombre) {
      this.file = nombre;
    }
  }
}
