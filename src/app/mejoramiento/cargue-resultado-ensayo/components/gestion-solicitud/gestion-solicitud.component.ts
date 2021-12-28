import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { informeDetalle, SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalConfirmarComponent } from '../modal-confirmar/modal-confirmar.component';


@Component({
  selector: 'app-gestion-solicitud',
  templateUrl: './gestion-solicitud.component.html',
  styleUrls: ['./gestion-solicitud.component.scss'],
  providers: [DatePipe]
})
export class GestionSolicitudComponent implements OnInit {
/**
 * Controla el spinner al ejecutar el crud
 */
  loading: boolean = false;

  /**
   * captura el objeto que trae del consultarXfiltro tabla ensayo 
   */
  @Input() rowUpdate: any;

  /**
   * Si la situacion de la solicitud es Finalizado debe quedar todo bloqueado
   */
  @Input() bloquear: boolean = false;
  /**
   * se activiva atrue cuando cargan los servicios
   */
  ready                   : boolean = false;

  /**
   * listado de usuarios
   */
  listaPersonas           : any;

  /**
   * Solo se usa cuando (true el bloqueo = situacion Finalizada)
   */
  listaResponsableToma    : string = "";

  lista: any;
  listaUsuarios: any;
  listaObservacion: string = "";
  listaRecibeMuestra      : any;

  /**
   * codigo de ensayos asocidos a las solicitudes
   */
  codigo_ensayo           : string = "";

  /**Tamanio del modal Confirmacion */
  wDialog: string = '25%';
  hDialog: string = '22%';

  /**
   * "I": Guardar 
   * "U": Actualizar
   * "D": Eliminar
   */
  action: string | undefined;

  /**
   * muestra el estado de la solicitud
   */
  botonBloqueo : boolean =  false;

  formGestion: FormGroup = this.fb.group({
    id_ensayo                  : [ , Validators.required],
    fecha_solicitud            : [ , Validators.required],
    codigo_ensayo              : [ , Validators.required],     
    novedades                  : [ , Validators.required],
    id_responsable_toma        : [ , Validators.required],
    fecha_toma                 : [ , Validators.required],
    fecha_programada           : [ , Validators.required],
    id_documento               : [ , Validators.required],
    id_estado_bloqueo          : [ , ],
    id_tipo_servicio           : [ , Validators.required],
    id_usuario_solicitud       : [ , ],
    id_tipo_observacion        : [ , ],
    id_usuario_recibe_muestra  : [ , ],

  });


  constructor(
            public fb: FormBuilder, 
            public datePipe: DatePipe, 
            public cargueResultadoEnsayoService: CargueResultadoEnsayoService,
            public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
            public consultaListasService: ConsultaListasService,
            private snackBar: MatSnackBar,
            private dialog: MatDialog,
            private router: Router,
    public entityTabPersonaService: EntityTabPersonaService,) { }

  ngOnInit(): void {
    this.cargarDatos(this.rowUpdate);

    
  }
  
  async cargarDatos(itm: SolicitudEnsayoLaboratorio){
    /**
     * Envia el id_ensayo a la tabla de versiones o historicos
     */
    this.codigo_ensayo = itm.codigo_ensayo;

    /** Consulta la lista de usuarios a mostrar en los id_persona_residente_social */
    await this.solicitudEnsayoLaboratorioService.buscarPersona('id_tipo_rol in (3157)').then((lista) => {
      this.listaPersonas = lista.respuesta;
    }).catch(error => {
      this.snackBar.open("Error, no se lograron obtener los datos del formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    })

    await this.consultaListasService.consultarListas([107]).then((lista) => { this.lista = lista; this.ready = true; });
    await this.entityTabPersonaService.listUsuarios("").then((listaUsuarios) => { this.listaUsuarios = listaUsuarios.respuesta; this.ready = true; });

    this.formGestion.patchValue(itm);
    this.formGestion.get('fecha_solicitud')?.setValue(itm.fecha_solicitud === undefined || itm.fecha_solicitud === null ? null : this.datePipe.transform(itm.fecha_solicitud, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formGestion.get('fecha_programada')?.setValue(itm.fecha_programada === undefined || itm.fecha_programada === null ? null : this.datePipe.transform(itm.fecha_programada, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formGestion.get('fecha_toma')?.setValue(itm.fecha_toma === undefined || itm.fecha_toma === null ? null : this.datePipe.transform(itm.fecha_toma, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formGestion.get('id_responsable_toma')?.setValue(parseInt(itm.id_responsable_toma)); 
    this.formGestion.get('id_tipo_observacion')?.setValue(parseInt(itm.id_tipo_observacion));
    this.formGestion.get('id_usuario_recibe_muestra')?.setValue(parseInt(itm.id_usuario_recibe_muestra));

    this.buscarEstadoSolicitud(itm.id_documento);
    this.ready = true;

    if (this.bloquear){
      this.lista[107].forEach((element: any) => {
        if (element.id_tipo === parseInt(itm.id_tipo_observacion))
          return this.listaObservacion = element.descripcion
      });
      this.listaUsuarios.forEach((element: any) => {
        if (element.id_usuario === parseInt(itm.id_usuario_recibe_muestra)) {
          return this.listaRecibeMuestra = element.nombre;
        }
      });
      this.listaPersonas.forEach((element:any) => {
        if (element.id_persona === parseInt(itm.id_responsable_toma))
          return this.listaResponsableToma = element.nombre;
      });
    }
  }

  /** 
   *  cada solicitud puede tener varios informes por lo que se guarda en una tabla aparte asociando el id_ensayo
   */
  async guardarGestion() {

    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "I", itm: 0 }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        await this.cargueResultadoEnsayoService.guardarGestion(this.formGestion.value).then( rest =>{
          this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.loading = false;
        }).catch(error => {
          this.snackBar.open("Error, no se logro guardar correctamente. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        });
      }
    });
  }

  /**
   * Bloqueo del Documento en Caliope
   */
  async bloquearSolicitud(){

    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "U", itm: 0 }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {

        const idDocumento: number = this.formGestion.get("id_documento")?.value;
        this.botonBloqueo = this.formGestion.get("id_estado_bloqueo")?.value;

        this.loading = true;
        await this.cargueResultadoEnsayoService.bloqueoDocumentoCaliope(idDocumento, this.botonBloqueo ).then(async rest => {

          await this.buscarEstadoSolicitud(idDocumento).then( r => {
            this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
            this.botonBloqueo = r;
            this.loading = false;

          }).catch(e => {
            this.snackBar.open("Error, no se logro confirmar los datos guardados. por favor salga y vuelva a intentar: " + e, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
            this.loading = false;
          });

        }).catch(error => {
          this.snackBar.open("Error, no se logro guardar correctamente. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        });

      }
    });
  }


  /***
   * Metodo para buscar en Caliope el estado de la Solicitud. 
   * consulte los estados en el Servicio usado.
   */
  async buscarEstadoSolicitud(id_documento : number){

    /**Carga el estado del documento en Caliope */
    this.cargueResultadoEnsayoService.buscarEstadoBloqueoDocumentoCaliope(id_documento).then(resp => {
      this.botonBloqueo = resp;
      this.formGestion.get('id_estado_bloqueo')?.setValue(resp)
    }).catch(error => {
      this.snackBar.open("Error, no se lograron obtener algunos datos del formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    });
    return this.botonBloqueo
  }

  notificarSolicitud(){

    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "P", itm: 0 }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        await this.cargueResultadoEnsayoService.notificarSolicitud("5", "11121", this.formGestion.get('codigo_ensayo')?.value, this.formGestion.get('novedades')?.value, this.formGestion.get('id_ensayo')?.value).then(async rest => {
          this.snackBar.open('Notificacion Realizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.loading = false;
        }).catch(error => {
          this.snackBar.open("Error, no se logro enviar la notificacion. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        });
      }
    });

  }

}
