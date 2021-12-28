import { DatePipe } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { listaEnsayo, SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { BuscarRadicadoOrfeoService } from 'src/app/core/services/buscar-radicado-orfeo.service';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalConfirmarComponent } from '../modal-confirmar/modal-confirmar.component';
import { informeDetalle } from '../../../../core/models/solicitud-ensayo-laboratorio';
import { ModalCargueArchivoComponent } from '../modal-cargue-archivo/modal-cargue-archivo.component';
import { ModalDescargaArchivoComponent } from '../modal-descarga-archivo/modal-descarga-archivo.component';

@Component({
  selector: 'app-informe-solicitud',
  templateUrl: './informe-solicitud.component.html',
  styleUrls: ['./informe-solicitud.component.scss'],
  providers: [DatePipe]
})
export class InformeSolicitudComponent implements OnInit {
  

  /**
   * carptura el objeto que trae del consultarXfiltro tabla ensayo 
   */
  @Input() rowUpdate: SolicitudEnsayoLaboratorio = {} as SolicitudEnsayoLaboratorio;

  /**
   * Si la situacion de la solicitud es Finalizado debe quedar todo bloqueado
   */
  @Input() bloquear: boolean = false;
  
  /**
   * Value del campo numero_radicado
   */
  radicado = '';

  /**
   * Emite la confirmacion que se debe eliminar el informe
   * Transporta toda la fila selecionada
   */
  borrarInforme: informeDetalle = {} as informeDetalle;

  /**
   * Controla el spinner al ejecutar el crud
   */
  loading: boolean = false;

  /**
   * Activa los botones y campos de Guardar
   
   * AddInforme = boton informe
   * okListaDocumento = campo Lista Documento
   */
  addInforme: boolean = false;
  okListaDocumento: boolean = false;


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
   * Habilita el boton de busqueda de Numero Radicado Orfeo
   */
  validNumeroRadicado : boolean = false;

  /**
   * Listado de los informes asociados a la solicitud
   */
  listaInformes: any;

  /**
   * Id de la solicitud ensayo
   */
  idEnsayo : number = 0

  /**
   * Alacena la lista de Persona Responsable 
   */
  listaPersonas: any;

  /**
   * Almacena la lista de tipo Documento
   */
  listaDocumento: any;

  /**
   * Activa el boton de actualizar y Oculta el boton de Guardar Informe
   */
  actualizar : boolean = false;

  /**
   * Campos y valores INFORMES asociados al ENSAYO
   */
  formInforme: FormGroup = this.fb.group({
    asunto                          : [,Validators.required],
    fecha_radicado                  : [,Validators.required],
    fecha_resultado                 : [,Validators.required],
    id_documento_informe            : [0,],
    id_ensayo                       : [0,],
    id_ensayo_informe               : [0,Validators.required],
    id_tipo_resultado               : [,Validators.required],
    numero_radicado                 : [,Validators.required],
    observaciones                   : [,],
    id_archivo                      : [,],
    codigo_ensayo                   : [,],
  });
  
  constructor(
    private fb: FormBuilder, 
    public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
    public cargueResultadoEnsayoService: CargueResultadoEnsayoService,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    private buscarRadicadoService: BuscarRadicadoOrfeoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public consultaListasService: ConsultaListasService,) { }

  async ngOnInit() {

    console.log("~~>>>",this.rowUpdate)

    /**
     * Lista Tipo Informe
     */
    await this.consultaListasService.consultarListas([69]).then((lista) => { this.listaDocumento = lista; this.okListaDocumento = true; }).catch(error => {
      this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    });

    /**
     * Activa el boton de Guardar Informe
     */
    this.formInforme.valueChanges.subscribe(element => {
      this.addInforme = true; 
    })

    await this.solicitudEnsayoLaboratorioService.buscarPersona('id_tipo_rol in (3157)').then((lista) => {
      this.listaPersonas = lista.respuesta;
    }).catch(error => {
      this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    });

    /**
     * controla el value en el campo numero_radicado
     */
    this.formInforme.get("numero_radicado")?.valueChanges.subscribe( element => {


      this.radicado = element;

      /**
       * validador de numero para el campo de numero de radicado
       */
      this.validNumeroRadicado = (!isNaN(parseInt(element))) ? true : false;

    });

    /**
     * Carga valores que obtiene del consultarXFiltro de ensayo
     * id_ensayo y otros IDs encenciales 
     */
    this.formInforme.patchValue(this.rowUpdate);
    //this.formInforme.get("id_documento_informe")?.setValue(this.rowUpdate.id_documento)


    /**
     * Lista de Informes asociados a la solicitud
     * para ser usado en la tabla Adjunto
     */
    this.buscarInformes(this.rowUpdate.id_ensayo);


    /**
     * campo para ser enviado a la tabla de Ensayos a Realizar
     */
    this.idEnsayo = this.rowUpdate.id_ensayo


    if (this.bloquear) this.formInforme.disable()
    
  }

  

  /**
   * Metodo para limpiar el campo en el html
   */
  LimpiarNumeroRadicado(){
    this.formInforme.get("numero_radicado")?.setValue("");
    this.formInforme.get("fecha_radicado")?.setValue("");
    this.formInforme.get("asunto")?.setValue("");
    this.formInforme.get("observaciones")?.setValue(null);
    this.formInforme.get("id_tipo_resultado")?.setValue(0);
    this.formInforme.get("id_ensayo_informe")?.setValue(0);
    this.formInforme.get("id_documento_informe")?.setValue(0);
    this.formInforme.get("fecha_resultado")?.setValue(null);
  }

  /**
   * Obtiene datos consultados en Orfeo con el campo numero_radicado
   */
  buscarRadicadoOrfeo() {
    this.buscarRadicadoService.get(this.radicado).then((resp: any) => {
      if (resp.respuesta) {
        this.actualizar = false;
        this.formInforme.get("asunto")?.setValue(resp.respuesta[0].ra_asun);
        this.formInforme.get("fecha_radicado")?.setValue(this.datePipe.transform(resp.respuesta[0].radi_fech_radi, 'yyyy-MM-dd') + 'T05:00:00.000Z');
        this.formInforme.get("numero_radicado")?.setValue(resp.respuesta[0].radi_nume_radi);
        this.formInforme.get("id_documento_informe")?.setValue(0);
      } else {
        this.radicado = "";
      }
    });
  }


  /** Registra el nuevo informe y lo muestra en la tabla */
  guardarInforme (){
    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "I", itm: this.formInforme.get("id_ensayo")?.value }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        await this.cargueResultadoEnsayoService.guardarInforme(this.formInforme.value, this.rowUpdate.id_tipo_servicio).then(async resp => {
          this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.formInforme.get("id_documento_informe")?.setValue(resp.respuesta[0].id_documento);
          this.buscarInformes(this.rowUpdate.id_ensayo);

          await this.cargueResultadoEnsayoService.notificarInforme("5", "11121", this.formInforme.get('codigo_ensayo')?.value, this.formInforme.get('observaciones')?.value).then(async rest => {
            this.snackBar.open('Notificacion Realizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          }).catch(error => {
            this.snackBar.open("Error, no se logro enviar la notificacion. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          });
          
          this.actualizar = true;
          this.loading = false;
        }).catch(error => {
          this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        });
      }
    });
  }

  /**Obtiene los Informes de Orfeo de la solicitud y los imprime en la tabla Adjunto */
  buscarInformes( idEnsayo:number ) {
    this.cargueResultadoEnsayoService.buscarInforme("id_ensayo = " + idEnsayo).then( r =>{
      this.listaInformes = r.respuesta;
    }).catch( error => {
      this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    })
  }

  /** El usuario quiere ver todos los datos de una fila en la tabla y posiblemente quiera actualzar */
  cargarInforme(row : informeDetalle){
    this.actualizar = true;

    this.formInforme.get("asunto")?.setValue(row.asunto);
    this.formInforme.get("fecha_radicado")?.setValue(this.datePipe.transform(row.fecha_radicado, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formInforme.get("fecha_resultado")?.setValue(this.datePipe.transform(row.fecha_resultado, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formInforme.get("id_ensayo_informe")?.setValue(row.id_ensayo_informe);
    this.formInforme.get("id_tipo_resultado")?.setValue(parseInt(row.id_tipo_resultado));
    this.formInforme.get("numero_radicado")?.setValue(row.numero_radicado);
    this.formInforme.get("observaciones")?.setValue(row.observaciones);
    this.formInforme.get("id_documento_informe")?.setValue(row.id_documento_informe);
    
  }

  actualizarInforme(){

    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "U", itm: this.formInforme.get("id_ensayo")?.value }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        await this.cargueResultadoEnsayoService.actualizarInforme(this.formInforme.value).then(resp => {
          this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.buscarInformes(this.rowUpdate.id_ensayo);

          this.actualizar =  false;
          this.loading = false;
        }).catch(error => {
          this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        });
      }
    });

  }


  /**Sube los archivos asociados al documento */
  cargarArchivo(){

    const dialogRef = this.dialog.open(ModalCargueArchivoComponent, {
      width: '500px',
      data: {
        itm: this.formInforme.value, idEnsayo: this.formInforme.get("id_ensayo")?.value, idTipoServicio: this.rowUpdate.id_tipo_servicio
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open("Carga exitosa realizada " , 'X', { duration: 3500, panelClass: ['success-snackbar'] });
        this.formInforme.get("id_archivo")?.setValue(result.response);
      }
    });

  }

  /**Sube los archivos asociados al documento */
  verArchivo() {

    const dialogRef = this.dialog.open(ModalDescargaArchivoComponent, {
      width: '35%',
      height: '60%',
      data: {
        itm: this.formInforme.value,
        locked: this.bloquear
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open("Carga exitosa realizada ", 'X', { duration: 3500, panelClass: ['success-snackbar'] });
        this.formInforme.get("id_archivo")?.setValue(result.response);
      }
    });

  }

  eliminarInforme(item: informeDetalle ){
    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "D", itm: 0 }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        await this.solicitudEnsayoLaboratorioService.eliminarIDInforme(item.id_ensayo_informe).then(resp => {
          this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.borrarInforme = item;
          this.loading = false;
        }).catch(error => {
          this.snackBar.open("Error, no se pudieron realizar cambios la aplicacion genero el siguiente error: " + error.error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        })
      }
    });
  }

}
