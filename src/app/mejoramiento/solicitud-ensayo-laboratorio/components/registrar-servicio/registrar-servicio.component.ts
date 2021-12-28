import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConfirmarComponent } from '../modal-confirmar/modal-confirmar.component';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';


@Component({
  selector: 'app-registrar-servicio',
  templateUrl: './registrar-servicio.component.html',
  styleUrls: ['./registrar-servicio.component.scss'],
  providers: [DatePipe]
})
export class RegistrarServicioComponent implements OnInit{
  
  /**
   * Indica que desea salir al formulario principal
   */
  @Output() cancelar = new EventEmitter();

  /**
   * Recibe los campos y valores de SolicitudEnsayoLaboratorio
   */
  @Input() rowUpdate: SolicitudEnsayoLaboratorio = {} as SolicitudEnsayoLaboratorio;

  /**
   * Recibe los campos y valores del insertar y actualizar que envia los servicios [apique,nucleo,formula,otros,desidad]
   */
  ensayoLaboratorio  : SolicitudEnsayoLaboratorio = {} as SolicitudEnsayoLaboratorio;

  /**
   * Cuando la solicitud fue bloqueada se bloquea el boton
   */
  buttonEliminar : boolean = false;
  
  /**
   * Si Recibe el parametro true debe bloquea todos los campos
   */
  @Input() bloquear : boolean = false

  tabServiciosDensidad : boolean = true;
  tabServiciosApique   : boolean = true;
  tabServiciosNucleo   : boolean = true;
  tabServiciosFormula  : boolean = true;
  tabServiciosOtros    : boolean = true;
  datosRegistrar       : any

  /**
   * El formulario ya esta validado y disponible para guardar
   * Habilita el boton Guardar
   */
  oKguardar            : boolean = false;
  loading              : boolean = false;

  /**
   * Desbloquea el boton de Eliminar siempre y cuando exista un id_ensayo
   */
  eliminar             : boolean = false;

  /**
   * usado en el Dialogo
   * action "I" usa el servicio de insertar
   * action "U" usa el servicio de actualizar
   */
  action               : string | undefined;
  wDialog              : string = '25%';
  hDialog              : string = '22%';

  constructor(private solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService, 
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private cargueResultadoEnsayoService: CargueResultadoEnsayoService,
              ) { }

  async ngOnInit(): Promise<void> {

    this.ensayoLaboratorio = this.rowUpdate;
    
    /**
     * Se ocultan los Tabs que no corresponden al id_tipo_servicio al Actualizar.
     */
    if (this.rowUpdate.id_tipo_servicio){
      this.tabServiciosDensidad = this.rowUpdate.id_tipo_servicio === 53  ? true : false;
      this.tabServiciosApique   = this.rowUpdate.id_tipo_servicio === 54  ? true : false;
      this.tabServiciosFormula  = this.rowUpdate.id_tipo_servicio === 56  ? true : false;
      this.tabServiciosNucleo   = this.rowUpdate.id_tipo_servicio === 55  ? true : false;
      this.tabServiciosOtros    = this.rowUpdate.id_tipo_servicio === 109 ? true : false;
    }


    this.eliminar = this.rowUpdate.id_ensayo > 0 ? true : false;
    if (this.ensayoLaboratorio.id_documento > 0)
      this.buttonEliminar = await this.cargueResultadoEnsayoService.buscarEstadoBloqueoDocumentoCaliope(this.ensayoLaboratorio.id_documento);
  }

  /** Emite el cancelar para mostrar el formulario principal */
  handleCancelar(): void {
    this.cancelar.emit(true);
  }

  /** Llega datos del formulario y habilita el boton Guardar */
  handleGuardar(itm: SolicitudEnsayoLaboratorio){
    this.oKguardar = itm ? true : false;
    this.ensayoLaboratorio = itm;
    //console.log("1~>",this.ensayoLaboratorio)
  }


  /**
   * Modal para Crea y/o Actualiza las solicitudes
   * action "I" usa el servicio de insertar
   * action "U" usa el servicio de actualizar
   * @param this.wDialog width
   * @param this.hDialog height
   * @param panelClass Clase generica en styles.scss solo para el modal e impedir el scrollbar
   * @data: { action[I,U,D] itm[id_ensayo]  }
   * @returns confirmacion boolean en [true | false]
   */
  async guardarSolicitud(){
    this.action = this.ensayoLaboratorio.id_ensayo === 0 ? "I" : "U";
    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: this.action, itm: this.ensayoLaboratorio.id_ensayo }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        
        try {
          this.loading = true;
          switch (this.action) {
            case "I":
              await this.solicitudEnsayoLaboratorioService.guardarSolicitudEnsayo(this.ensayoLaboratorio).then((resp: any) => {
                if (resp.codError === 0) this.loading = false; this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
              });
              break;
            case "U":
              await this.solicitudEnsayoLaboratorioService.actualizarSolicitudEnsayo(this.ensayoLaboratorio).then((resp: any) => {
                if (resp.codError === 0) this.loading = false; this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
              });
              break;
          }
          this.handleCancelar();
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        } finally{ 
          this.loading = false;
        }

        this.handleCancelar();
        this.loading = false;
        }
    });
  }


  /**
   * Modal para Eliminar la solicitud y los registros de tablas asociados
   * action "I" usa el servicio de insertar
   * action "U" usa el servicio de actualizar
   * @param this.wDialog width
   * @param this.hDialog height
   * @param panelClass Clase generica en styles.scss solo para el modal e impedir el scrollbar
   * @data: { action[I,U,D] itm[id_ensayo]  }
   * @returns confirmacion boolean en [true | false]
   */
async eliminarSolicitud() {



    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "D", itm: this.ensayoLaboratorio.id_ensayo }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        
        this.loading = true;
        if (this.ensayoLaboratorio.codigo_ensayo === null){
          await this.solicitudEnsayoLaboratorioService.eliminarSolicitud(this.ensayoLaboratorio.id_ensayo);
        }
        await this.solicitudEnsayoLaboratorioService.eliminarXCodigoSolicitud(this.ensayoLaboratorio.codigo_ensayo).then(resp => {
          this.loading = false;
          this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.handleCancelar();
        });
      }
    });
  }
}