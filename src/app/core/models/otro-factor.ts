export class OtroFactor {
  idOtroFactor: number | undefined;
  idTipoOtroFactor: number | undefined;
  auditoriaUsuario: string | undefined;
  auditoriaFecha: number | undefined;
  idMantenimientoVial: number | undefined;
  idMantenimientoVialEvento: number | undefined;
  constructor (tabMantenimientoVialIn: number | undefined) {
      this.idMantenimientoVialEvento = tabMantenimientoVialIn;
  }
}
