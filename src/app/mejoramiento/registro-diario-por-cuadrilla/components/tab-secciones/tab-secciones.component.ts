import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Personas } from 'src/app/core/models/registro-diario-por-cuadrilla';
import { SecurityService } from 'src/app/core/security/services/security.service';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { RegistroProgramacionDiariaService } from 'src/app/core/services/registro-programacion-diaria.service';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';

@Component({
  selector: 'app-tab-secciones',
  templateUrl: './tab-secciones.component.html',
  styleUrls: ['./tab-secciones.component.scss']
})
export class TabSeccionesComponent implements OnInit {
  /**
   * Controla los tabs
   */
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  /**Consolidado de todas las listas */
  listas : any

  /**Lista Clase Material dependiente de Tipo Material */
  listaClaseMaterial :any

  /**carga los tab cuando las listas fueron cargadas */
  ready : Boolean = false
  persona: any;
  idMantenimientoVial : number = 0;
  errorPersona: boolean = false;
  datosMapa: any 
  pk_id_calzada : number = 0
  idInforme: number = 0;

  formControls: FormControl[] = [];
  displayedColumns: string[] = [
    'descripcion_zona',
    'descripcion_localidad',
    'descripcion_upz',
    'descripcion_barrio',
    'descripcion_actividad',
    'desde',
    'pk_id_calzada',
    'civ',
    'nombre_responsable_visita',
    '_CTRL_ACCION_TRABAJAR'];

  @ViewChild('mapa') mapElement!: MapaUmvComponent;
  mapCenter = [-74.113, 4.667];
  mapZoomLevel = 12;
  basemapType = 'gray';
  inArr: Array<any> = [];
  searchkey = '';


  /**
   * Controla el spinner al ejecutar el crud
   */
  loading: boolean = false;


  /**Exparse el id a los demas tabs */
  reCargar: any;

  constructor(
    private consultaListasService: ConsultaListasService,
    private progDiariaService: RegistroProgramacionDiariaService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router, 
    private securityService: SecurityService,
  ) { }


  async ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimientoVial = +params['id']; this.pk_id_calzada = +params['pk']; });
    try {
      
      await this.consultaListasService.consultarListas([119, 120, 121, 122, 123, 124, 125, 126, 127, 129, 130, 131, 132, 133, 14, 3480, 3480, 3481, 4, 82,]).then((lista: any) => { this.listas = lista; });
      ////id_tipo_rol = 4786 or 
      await this.progDiariaService.buscarPersona("").then((lista: any) => { this.listas[1] = lista.respuesta })
      await this.progDiariaService.equipoConsultarXFiltro("").then((lista: any) => { this.listas[2] = lista.respuesta })
      await this.progDiariaService.tipoClaseMaterial("").then((lista: any) => { this.listas[3] = lista.respuesta; });

      /**Cruza el idUsuario con el IdPersona deja el dato en el servicio */
      this.persona = this.listas[1].find((e: Personas) => e.id_usuario === this.securityService.userSession.idUsuario);
      this.listas[1] = this.listas[1].filter((e: Personas) => e.id_usuario !== this.securityService.userSession.idUsuario)

      this.ready = true
      this.loading = false;

      /**RN PARA ACCEDER */
      const acceso = [4781, 4785, 4769, 4770];

      if (this.persona === undefined) {
        this.errorPersona = true;
        console.error("Error en cruzar el usuario con el IdPersona");
        this.router.navigate(['dashboard/mejoramiento-registro-diario-cuadrilla/1775']);
        this.snackBar.open("Error, el usuario no tiene ID persona asociada, valide con el administrador de la aplicacion ", 'X', { duration: 7000, panelClass: ['error-snackbar'] });
      }

      if (!acceso.includes(this.persona.id_tipo_rol)) {
        this.errorPersona = true;
        console.error("Error rol Incorrecto");
        this.router.navigate(['dashboard/mejoramiento-registro-diario-cuadrilla/1775']);
        this.snackBar.open("Error, solo pueden acceder las personas con Rol RESIDENTE DE OBRA o INGENIERO DE APOYO", 'X', { duration: 7000, panelClass: ['error-snackbar'] });
      }

    } catch (e) {
      this.errorPersona = true;
      console.error("Ocurrio algo al consultar las listas :" + e);
      this.router.navigate(['dashboard/mejoramiento-registro-diario-cuadrilla/1775']);
      this.snackBar.open("Error, error al obtener las listas, valide con el administrador ", 'X', { duration: 7000, panelClass: ['error-snackbar'] });
    }

    try {
      this.mapElement.PksFL.load();
      this.mapElement.queryFeatures('PK_ID_ELEMENTO in (' + this.pk_id_calzada + ")");
    } catch (error) {
      console.warn("No cargo el Mapa de forma apropiada, no se posiciono en el PK solicitado - Error: " + error);
      this.loading = false;
    }
  }

  multiplexor(row:any){
    this.reCargar = row;
  }

  irAPk(pk: number) {
    this.mapElement.goTo("PK_ID_ELEMENTO = " + pk.toString());
  }

  regresar(){
    this.router.navigate(['dashboard/mejoramiento-registro-diario-cuadrilla/1775']);
  }

  getIdInforme(e:number){
    this.idInforme = e;
  }

}

