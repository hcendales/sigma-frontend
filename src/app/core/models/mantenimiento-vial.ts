import { OtroFactor } from "./otro-factor";
import { UnidadMuestreo } from "./unidad-muestreo";

export class MantenimientoVial {
  idMantenimientoVial: number | undefined;

  // Se deberia tener el nombre del origen
  // Se deberia tener el nombre del origen
  idTipoOrigen: number | undefined;
  fecha: string | undefined;
  solicitudNombre: string | undefined;
  solicitudFecha: string | undefined;
  solicitudVencimiento: string | undefined;
  solicitudRadicadoEntrada: string | undefined;
  solicitudDireccion: string | undefined;
  solicitudRadicadoSalida: String | undefined;
  solicitudFechaSalida: number | undefined;

  pkIdCalzada: number | undefined;

  // SE DEBERIA TRAER NOMBRE CORRESPONDIENTE A CADA ID
  idLocalidad: number | undefined;
  idZona: number | undefined;
  idUpla: number | undefined;
  idBarrio: number | undefined;
  idCuadrante: number | undefined;
  idUpz: number | undefined;
  anchoPk: number | undefined;
  areaPk: number | undefined;
  longitudHorizontalPk: number | undefined;

  idTipoEstadoPk: number | undefined;
  idTipoUsoVia: number | undefined;
  idTipoMalla: number | undefined;

  civ: string | undefined;
  ejeVial: string | undefined;
  desde: string | undefined;
  hasta: string | undefined;
  numeroRadicadoEntrada: string | undefined;

  idTipoEstadoProgVisita: number | undefined;
  fechaVisitaTecnica: number | undefined;
  rutasTransporte: string | undefined;

  idTipoTransitabilidad: number | undefined;
  idTipoImpactoSocial: number | undefined;
  idTipoDeterminacionInterv: number | undefined;

  idTipoCoordinacionInterinst: number | undefined;
  idTipoAporteMetas: number | undefined;
  observacionesDiagnostico: string | undefined;
  pci: number | undefined;
  idTipoCalificacionPci: number | undefined;

  numeroRadicadoSalida: string | undefined;
  numeroRadicadoIntervencion: string | undefined;

  idZonaEabEsp: number | undefined;
  idTipoSeccionVial: number | undefined;
  kmCarrilImpacto: number | undefined;

  idTipoPrograma: number | undefined;
  idTipoEstrategia: number | undefined;
  idTipoActividad: number | undefined;
  indicePriorizacion: number | undefined;
  fechaRadicadoIntervencion: number | undefined;
  intervencionLongitud: number | undefined;
  intervencionAncho: number | undefined;
  intervencionArea: number | undefined;
  intervencionKmCarril: number | undefined;
  intervencionTipo: string | undefined;
  intervencionRespuestaIdu: number | undefined;
  intervencionPlacaReferencia: string | undefined;
  intervencionFechaEjecucion: number | undefined;
  idTipoRutasTransporte: number | undefined;
  idTipoSuperficie: number | undefined;

  posibleDanioRedes: string | undefined;
  idTipoEjecucion: number | undefined | undefined;
  idTipoClase: number | undefined;
  fechaTerminacion: number | undefined;
  fechaSeguimiento: number | undefined;
  fechaVisitaVerificacion: number | undefined;
  observacionesIntervencion: string | undefined;
  requiereActualizacionDiag: string | undefined;
  idTipoPmt: number | undefined;
  coi: number | undefined;
  idTipoEstadoPmt: number | undefined;
  numeroRadicadoPmt: string | undefined;
  fechaRadicadoPmt: number | undefined;
  idProgramacionPeriodica: number | undefined;
  numeroRadicadoSolReserva: string | undefined;
  numeroRadicadoResReserva: string | undefined;
  enSeguimiento: string | undefined;
  auditoriaUsuario: string | undefined;
  auditoriaFecha: number | undefined;
  tabOtroFactors: OtroFactor[] | undefined;
  tabUnidadMuestreos: UnidadMuestreo[] | undefined;
  idTipoIntervencionTotal: number | undefined;
  idTipoRequerimiento: number | undefined;
  idTipoAdministracion: number | undefined;
  idTipoGrupo: number | undefined;
  priorizacionTrimestre: string | undefined;
  observacionesPriorizacion: string | undefined;
  tabPersonaByIdPersonaResponsableVerif: any;

  idResponsableVisita: number | undefined;
  descripcionOrigen:string | undefined;

/*

	private TabPersona tabPersonaByIdPersonaResidenteObra;
	private TabPersona tabPersonaByIdPersonaResidenteSst;
	private TabPersona tabPersonaByIdPersonaResidenteAmbiental;
	private TabPersona tabPersonaByIdPersonaResidenteSocial;
	private TabPersona tabPersonaByIdPersonaDirectorObra;
	private TabPersona tabPersonaByIdPersonaResponsableVerif;
	private TabPersona tabPersonaByIdPersonaResponsableVisita;

	private Set tabProgramacions = new HashSet(0);
	private Set tabOtroFactors = new HashSet(0);
	private Set tabRadicadoVinculados = new HashSet(0);
	private Set tabUnidadMuestreos = new HashSet(0);
	private Set tabMantenimientoVialDocus = new HashSet(0);
	private Set tabMantenimientoVialGestions = new HashSet(0);




  constructor() {
    this.tabOtroFactors = new Array<OtroFactor>();
    this.tabUnidadMuestreos = new Array<UnidadMuestreo> ();
  }
*/
  constructor(pkId?: number,
      ancho?: number,
      areaPk?: number,
      longPk?: number,
      civ?: string,
      idLocalidad?: number,
      idZona?: number,
      idUpla?: number,
      idBarrio?: number,
      idCuadrante?: number,
      idTipoMalla?: number,
      idTipoSeccionVial?: number,
      idZonaEabEsp?: number,
      kmCarrilImpacto?: number,
      ejeVial?: string,
      desde?: string,
      hasta?: string,
      
      tipoSuperficie?: number) {
        if (pkId) {
          this.pkIdCalzada = pkId;
          this.anchoPk = ancho;
          this.areaPk = areaPk;
          this.longitudHorizontalPk = longPk;
          this.civ = civ;
          this.idLocalidad = idLocalidad;
          this.idZona = idZona;
          this.idUpla = idUpla;
          this.idBarrio = idBarrio;
          this.idCuadrante = idCuadrante;
          this.idUpz = idUpla;
          this.idTipoMalla = idTipoMalla;
          this.idTipoSeccionVial = idTipoSeccionVial;
          this.idZonaEabEsp = idZonaEabEsp;
          this.kmCarrilImpacto = kmCarrilImpacto;
          this.ejeVial = ejeVial;
          this.desde = desde;
          this.hasta = hasta;
          this.idTipoSuperficie = tipoSuperficie;
        }
        //this.tabOtroFactors = new Array<OtroFactor>();
        //this.tabUnidadMuestreos = new Array<UnidadMuestreo> ();
  }

  get solicitud_fecha(){
    return this.solicitudFecha;
  }
}
