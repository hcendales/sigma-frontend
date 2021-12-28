import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GestionService } from 'src/app/core/services/gestion.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { ProcesoIntervencionService } from '../../../../core/services/proceso-intervencion.service';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Componente: EditarAsociarCoiComponent
 * 
 * Permite crear o editar un registro de . 
 * 
 * @version 1.0
 * @revision 07-07-21
 */
@Component({
  selector: 'app-editar-asociar-coi',
  templateUrl: './editar-asociar-coi.component.html',
  styleUrls: ['./editar-asociar-coi.component.scss']
})
export class EditarAsociarCoiComponent implements OnInit {

  //------------------------------------------------------
  // Define formularios
  //------------------------------------------------------
  
  /**
   * Define formulario.
   */
  formEditar:FormGroup;
  // formEnviar:FormGroup;
  
  idActividad: number = 0;
  //------------------------------------------------------
  // Define propiedades de listas
  //------------------------------------------------------
  
  /**
   * Define la lista de programas.
   */
  listas: any[] = [];

  //------------------------------------------------------
  // Define propiedades de bandera de control del 
  // componenete.
  //------------------------------------------------------
  
  /**
   * Bandera que indica cuando el componente debe
   * regsitrar un nuevo registro (true) o actualizar un
   * registro (false).
   */
  @Input() edit_flag = false;

  /**
   * Bandera que indica el procesamiento de una
   * peticion.
   */
  salvarCOI: boolean = false;
  enviarCOI: boolean = false;
  buscandoCOI: boolean = false;
  onDescargar: boolean = false;
  buttonRegistrar: boolean = false;
  

  //------------------------------------------------------
  // Define propiedades de componente.
  //------------------------------------------------------
  
  /**
   * Bandera del archivo.
   */
  file = false;

  /**
  * Datos del archivo.
  */
  fileData:any = null;
 
  /**
   * Nombre de arcchivo.
   */
  fileName = new FormControl('');
  nombreArchivo : string = "";

  /**
   * Bandera de tamano del archivo.
   */
  size = false;

  /**
   * Bandera de extencion del archivo. 
   */
  extencion = false;

  /**
   * Bandera que condiciona la visibilidad del control de 
   * actividades. 
   */
  mostrarOpcActividad = false;


  /**
   * permite activar el boton de salvar
   */
  blockSaveOk: boolean = false
 
  /**
   * ID del registros a procesar.
   */
  @Input() arrayChecked: any = [];
  idPkSendList: number[] = []
  idsProcesoGestion:any;
  actividadDestino:any;

  /**
   * Define el emisor del evento de regreso por 
   * cancelacion.
   * @see app-programar
   */
  @Output() regresarEvent: EventEmitter<void> = new EventEmitter();

  /**
   * Define el emisor del evento de regreso por 
   * submit.
   * @see app-programar
   */
  @Output() almacenadoEvent: EventEmitter<any> = new EventEmitter();

  /**
   * Define el contrucutor del componenete.
   * @param fb Constructor de utilidades.
   * @param listasService Servicio de listas.
   * @param procesoIntervencion Servicio de ProcesoIntervencionService.
   * @param snackBar  Scancbar. 
   */
  constructor(
    public fb:FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gestionService: GestionService,  
    private listasService: ConsultaListasService, 
    private procesoIntervencion: ProcesoIntervencionService, 
    private snackBar:MatSnackBar,
    private dialog: MatDialog,
  ) {
    // Define el formulario principal del componente.
    this.formEditar = this.fb.group({
      idArchivoCOI: new FormControl('',),
      coi: new FormControl('', [Validators.required,]),
      radicado_sdm: new FormControl('', [Validators.required,]),
      tipo_respuesta: new FormControl('', [Validators.required,]),
      observaciones: new FormControl('', [Validators.required, Validators.maxLength(250),]),
      archivo: [null, Validators.required],
    });
    // this.formEnviar = this.fb.group({
    //   isValidFormEditar: new FormControl('', [Validators.required,]),
    //   actividad_destino: new FormControl('', [Validators.required,]),
    // });
  }

  /**
   * Metodo de carga del componente.
   */
   async ngOnInit() {
    try {


      // for (let index = 0; index < this.arrayChecked.length; index++) {
      //   let response = await this.gestionService.obtenerActividadesDestino(this.arrayChecked[index].id_proceso_gestion);
      //   if (response.codError === 0 && response.respuesta.length > 0) {
      //     this.listas[index] = response.respuesta[0]
      //   }
      // }

      // let hash : any = {};
      // this.listas = this.listas.filter(o => hash[o.id_actividad] ? false : hash[o.id_actividad] = true);

      this.activatedRoute.params.subscribe((params: Params) => { this.idActividad = +params['idActividad']; });

      this.obtenerIDMantenimiento();
      this.idsProcesoGestion = [...this.idPkSendList];
      let response = await this.gestionService.listarTransicionesPorActividad( this.idActividad )
      if (response.codError === 0 && response.respuesta.length > 0) {
        let datos = response.respuesta;
        this.formEditar.get("tipo_respuesta")?.valueChanges.subscribe((e:any)=>{
          if (e === 'aprobado')
            this.actividadDestino = datos.find((x: any) => x.id_actividad_destino === 1761)
          else
            this.actividadDestino = datos.find((x: any) => x.id_actividad_destino === 1760)
        })
      }





    } catch(e) {
      console.log(e);
      this.handleError();
    }
   }
  
  /**
   * Maneja la respuesta con exito de las peticiones.
   */
  operationSuccess(msjOpcion: string = 'Los datos fueron almacenados') {
    this.snackBar.open(msjOpcion, 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja el error de las peticiones.
   */
  handleError(msj: string = 'Error de la operación', irMenu:boolean=true) {
    this.snackBar.open(msj, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });

    if(irMenu)
    this.almacenadoEvent.emit(false);
  }

  /**
   * Limpia los campos del formualrio.
   */
  limpiarCampos() {
    if(this.formEditar) {
      for(let c in this.formEditar.controls) {
        if(c == 'fechas') {
          this.formEditar.get(c)?.get('desde')?.setValue(null);
          this.formEditar.get(c)?.get('hasta')?.setValue(null);
        } else {
          this.formEditar.get(c)?.setValue(null);
        }
      }
    }
  }

  /**
   * Verifica las caaracteristicas del archivo.
   * @param event Datos del arcivo.
   */
  capturarFile(event:any) {
    this.onDescargar = false;
    this.nombreArchivo = "";
    this.formEditar.addControl('archivo', new FormControl('',Validators.required));
    this.fileData = event.target.files.item(0);
    this.fileName.setValue(this.fileData.name);
    if (event.target.files[0].size >= 1e+7){
      this.size = true;
      this.file = false
    }else{
      this.size = false;
      this.file = true;
    }
    if(event.target.files[0].type =='application/pdf'){
      this.extencion = false;
      this.file=true;
    }else{
      this.extencion = true;
      this.file=false;
    }
  }

  /**
   * Envia el nuevo registro al backend.
   */
  async onSubmit() {
    let msj = "";
    let respServ = null;
    let valueForm = this.formEditar.value;
    this.salvarCOI = true;
    
    try{
      if (await this.buscarCOI()){
        msj = "Se ha actualizado el campo COI y Radicado SDM";
      }

      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: "25%",
        height: '25%',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: { accion: "G", mensaje: msj+" ¿Desea de continuar con la operación? " }
      });
      dialogRef.afterClosed().subscribe(async (result: any) => {
        if (result) {

          let idArchivo = "";
          if (!this.onDescargar){
            idArchivo = await this.procesoIntervencion.insertarArcivoCaliope(this.fileData, '1463');
            this.onDescargar = true;
            this.nombreArchivo = idArchivo+".pdf"
            this.formEditar.get("idArchivoCOI")?.setValue(idArchivo); 
          }

          let solicitud: any = {
            idMantenimientoVial: this.obtenerIDMantenimiento(),
            coi: valueForm.coi,
            radicado_sdm: valueForm.radicado_sdm,
            idArchivoCoi: idArchivo,
            idTipoEstadoPMT: valueForm.tipo_respuesta === 'aprobado' ? 4801 : 4802,
            fechaRadicadoRta: new Date().getTime(),
            observaciones: valueForm.observaciones
          }
          
          respServ = await this.procesoIntervencion.insertarCOI(solicitud);
          if (respServ && respServ.codError == 0) {
            
            this.operationSuccess();
            this.buttonRegistrar = true;
            this.mostrarOpcActividad = true;
            // this.formEnviar.get("isValidFormEditar")?.setValue("ACTIVAR");
            
          } else {
            this.handleError();
          }
          
        }
      });
    }catch(e:any){
      this.handleError(e.error?.msgError ? 'Error: ' + e.error.msgError : e.message ? 'Error: ' + e.message : 'Error interno ', false);
      console.error(e.error?.msgError ? 'Error:' + e.error.msgError : e.message ? 'Error:' + e.message : 'Error interno');
    }finally{
      this.salvarCOI = false;
    }

  }

  

  // enviar(){

  //   const dialogRef = this.dialog.open(DialogConfirmComponent, {
  //     width: "25%",
  //     height: '25%',
  //     panelClass: 'custom-dialog-container',
  //     autoFocus: false,
  //     data: { accion: "G",  mensaje: "Serán enviados los Pks Seleccionados a la siguiente actividad  ¿confirme que desea Continuar?" }
  //   });
  //   dialogRef.afterClosed().subscribe(async (result: any) => {
  //     if (result) {
  //       let respServ = await this.gestionService.avanzarMantenimientoMasivo(this.idPkSendList, this.formEnviar.get("actividad_destino")?.value, "", false, 0);
  //       if (respServ && respServ.codError == 0) {

  //         this.operationSuccess("Los PKs han sido enviados de forma correcta.");
  //         this.regresarEvent.emit()

  //       } else {
  //         this.handleError();
  //       }
  //     }
  //   })
  // }

  async buscarCOI() {

    this.onDescargar = false;
    this.buscandoCOI = true;
    let existenCodigos: boolean = false;
    let valueForm = this.formEditar.value;


    try {

      if (valueForm.coi == "" && valueForm.radicado_sdm == "") {
        this.handleError('No ha ingresado datos, ingrese el valor que desea consultar', false);
      } else {

        let response = await this.procesoIntervencion.consultaArchivoCOI(valueForm.coi, valueForm.radicado_sdm);
        if (response.codError == 0 && response.respuesta.length > 0) {

          this.operationSuccess("Se ha encontrado el codigo correctamente");
          this.formEditar.get("coi")?.setValue(response.respuesta[0].coi);
          this.formEditar.get("idArchivoCOI")?.setValue(response.respuesta[0].id_archivo_coi_pmt);
          this.formEditar.get("radicado_sdm")?.setValue(response.respuesta[0].numero_radicado_sdm_pmt);

          /// HAY ARCHIVO?
          if (response.respuesta[0].url_archivo.split(".")[1] === "unknown") {
            this.handleError("No se encontro Archivo, por favor cargue un archivo", false);

          } else {
            this.file = true;
            this.onDescargar = true;
            this.nombreArchivo = response.respuesta[0].nombre_archivo;
            this.fileName.setValue(response.respuesta[0].nombre_archivo);
            this.formEditar.removeControl("archivo");
          }

          this.edit_flag = true;
          existenCodigos = true;

        } else if (response.codError == 0 && response.respuesta.length == 0) {
          this.operationSuccess(response.msgError)
        } else {
          this.handleError('Error de la operación', true);
        }
      }
    } catch (e: any) {
      this.handleError(e.error?.msgError ? 'Error: ' + e.error.msgError : e.message ? 'Error: ' + e.message : 'Error interno ', false);
      console.error(e.error?.msgError ? 'Error:' + e.error.msgError : e.message ? 'Error:' + e.message : 'Error interno');
    } finally {
      this.buscandoCOI = false;
      return existenCodigos;
    }
  }

  obtenerIDMantenimiento(){
    let idMantenimientoVial = "";

    for (let index = 0; index < this.arrayChecked.length; index++) {
      this.idPkSendList.push(this.arrayChecked[index].id_proceso_gestion);
      if (index + 1 < this.arrayChecked.length) {
        idMantenimientoVial += this.arrayChecked[index].id_mantenimiento_vial + ",";
      } else {
        idMantenimientoVial += this.arrayChecked[index].id_mantenimiento_vial
      }
    }
    return idMantenimientoVial;
  }

  async descargar(){
    try{
      let valueForm = this.formEditar.value;
      await this.procesoIntervencion.consultarArchivoCal(valueForm.idArchivoCOI).then(async resp => {
        const blob = new Blob([resp.body as BlobPart], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }).catch((error: any) => {
        this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      });
    }catch(e:any){
      this.handleError(e.error?.msgError ? 'Error: ' + e.error.msgError : e.message ? 'Error: ' + e.message : 'Error interno ', false);
      console.error(e.error?.msgError ? 'Error:' + e.error.msgError : e.message ? 'Error:' + e.message : 'Error interno');
    }
  }
}
