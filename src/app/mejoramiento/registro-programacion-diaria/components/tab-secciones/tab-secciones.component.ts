import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Personas } from 'src/app/core/models/registro-diario-por-cuadrilla';
import { SecurityService } from 'src/app/core/security/services/security.service';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { RegistroProgramacionDiariaService } from 'src/app/core/services/registro-programacion-diaria.service';

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
  listas: any[] = [];

  /**Lista Clase Material dependiente de Tipo Material */
  listaClaseMaterial :any

  /**carga los tab cuando las listas fueron cargadas */
  ready : Boolean = false
  panelOpenState = false;
  
  persona: any;
  idMantenimientoVial : number = 0;
  errorPersona: boolean = false;
  datosMapa: any 
  pk_id_calzada : number = 0
  unidadEjecutora : any[] = [];


  /**
   * Controla el spinner al ejecutar el crud
   */
  loading: boolean = false;


  /**Exparse el id a los demas tabs */
  reCargar: any = false;

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

    /**
     * 82 :TAB_PERSONA_ID_TIPO_ROL
     * 130 :TAB_INFDIACUA_CANT_OBRA_ID_TIPO_UNIDAD_MEDIDA
     * 124 :TAB_PROGRAMACION_DIARIA_ID_TIPO_ESTADO_PROGRAMACION
     * 123 :TAB_PROGDIARIA_MATERIAL_ID_CLASE_MATERIAL (NO USAR / CAMBIO)
     * 122 :TAB_PROGDIARIA_MATERIAL_ID_TIPO_MATERIAL
     * 121 :TAB_PROGDIARIA_PERSONAL_ID_TIPO_ORIGEN
     * 120 :TAB_PROGRAMACION_DIARIA_ID_TIPO_JORNADA
     * 3481 :TAB_EQUIPO_ID_TIPO_CLASE_EQUIPO
     * 3480 :TAB_EQUIPO_ID_TIPO_EQUIPO
     * 
     */

    try {
      await this.consultaListasService.consultarListas([82, 130, 124, 123, 122, 121, 120, 3481, 3480]).then((lista:any) => { this.listas = lista; });
      await this.progDiariaService.buscarPersona("id_tipo_rol = 4786 or id_usuario = " + this.securityService.userSession.idUsuario).then((lista: any) => { this.listas[1] = lista.respuesta })
      await this.progDiariaService.equipoConsultarXFiltro("").then((lista: any) => { this.listas[2] = lista.respuesta})
      await this.progDiariaService.tipoClaseMaterial("").then((lista: any) => { this.listas[3] = lista.respuesta; });

      /**Cruza el idUsuario con el IdPersona deja el dato en el servicio */
      this.persona = this.listas[1].find((e: Personas) => e.id_usuario === this.securityService.userSession.idUsuario);
      this.listas[1] = this.listas[1].filter((e: Personas) => e.id_usuario !== this.securityService.userSession.idUsuario)
      
      this.ready = true
      this.loading = false;

      /**RN PARA ACCEDER */
      const acceso = [ 4769,4785 ];

      if (this.persona === undefined) {
        this.errorPersona = true;
        console.error("Error en cruzar el usuario con el IdPersona");
        this.router.navigate(['dashboard/mejoramiento-registro-programacion-diaria/1775']);
        this.snackBar.open("Error, el usuario no tiene ID persona asociada, valide con el administrador de la aplicacion ", 'X', { duration: 7000, panelClass: ['error-snackbar'] });
      }

      if (!acceso.includes(this.persona.id_tipo_rol)){
        this.errorPersona = true;
        console.error("Error rol Incorrecto");
        this.router.navigate(['dashboard/mejoramiento-registro-programacion-diaria/1775']);
        this.snackBar.open("Error, solo pueden acceder las personas con Rol RESIDENTE DE OBRA o INGENIERO DE APOYO", 'X', { duration: 7000, panelClass: ['error-snackbar'] });
      }

    } catch (e) {
        this.errorPersona = true;
        console.error("Ocurrio algo al consultar las listas :" + e);
        this.router.navigate(['dashboard/mejoramiento-registro-programacion-diaria/1775']);
        this.snackBar.open("Error, error al obtener las listas, valide con el administrador ", 'X', { duration: 7000, panelClass: ['error-snackbar'] });
    }

  }

  multiplexor(row:any){
    console.log(row)
    this.reCargar = row;
  }

  getUnidadEjecutora(ids:any){
    //console.log(ids)
    this.unidadEjecutora = ids;
  }



  regresar(){
    this.router.navigate(['dashboard/mejoramiento-registro-programacion-diaria/1775']);
  }


}
