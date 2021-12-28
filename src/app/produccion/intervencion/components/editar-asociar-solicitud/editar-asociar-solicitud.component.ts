import {Observable} from 'rxjs';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GestionService } from 'src/app/core/services/gestion.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { ProcesoIntervencionService } from '../../../../core/services/proceso-intervencion.service';
import { BuscarRadicadoOrfeoService } from 'src/app/core/services/buscar-radicado-orfeo.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';

/**
 * Componente: EditarAsociarSolicitudComponent
 * 
 * Permite crear o editar un registro de . 
 * 
 * @version 1.0
 * @revision 07-07-21
 */
@Component({
  selector: 'app-editar-asociar-solicitud',
  templateUrl: './editar-asociar-solicitud.component.html',
  styleUrls: ['./editar-asociar-solicitud.component.scss'],
  providers: [DatePipe]
})
export class EditarAsociarSolicitudComponent implements OnInit {

  //------------------------------------------------------
  // Define formularios
  //------------------------------------------------------

  /**
   * Value del campo numero_radicado
   */
  radicado = '';


  /**
   * Habilita el boton de busqueda de Numero Radicado Orfeo
   */
  validNumeroRadicado: boolean = false;

  /**
   * Define formulario de usqueda
   */
  formEditar:FormGroup;
  

  //------------------------------------------------------
  // Define propiedades de listas
  //------------------------------------------------------
  
  /**
   * Define la lista de programas.
   */
  radicados: any = {};

  /**
   * Referencia al registro seleccionado en la lista.
   */
  row:any = null;

  /**
   * Bandera para indicar si fue seleccionado un registro. 
   */
  row_selected = false;

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
  realizandoCounsulta: boolean = false;

  /**
   *  Emisor del evento de actualizacion de la lista.
   */
  updateSubject: Subject<any> = new Subject<any>();

  //------------------------------------------------------
  // Define propiedades de componente.
  //------------------------------------------------------
  
  /**
   * ID del registros a procesar.
   */
  @Input() arrayChecked: any = [];

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
    private gestionService: GestionService,
    private listasService: ConsultaListasService, 
    private procesoIntervencion: ProcesoIntervencionService, 
    private buscarRadicadoService: BuscarRadicadoOrfeoService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private snackBar:MatSnackBar
  ) {
    // Define el formulario principal del componente.
    this.formEditar = this.fb.group({
      radicado: new FormControl('', [Validators.required,Validators.maxLength(14)]),
      asunto: new FormControl('', [Validators.required,]),
      fechaRadicado: new FormControl('', [Validators.required,]),
    });
  }

  /**
   * Metodo de carga del componente.
   */
   async ngOnInit() {
     this.formEditar.get("radicado")?.valueChanges.subscribe(element => {
       
      this.radicado = element;
       /**
        * validador de numero para el campo de numero de radicado
        */
       this.validNumeroRadicado = (!isNaN(parseInt(element))) ? true : false;

     });
   }
  
  /**
   * Obtiene datos consultados en Orfeo con el campo numero_radicado
   */
  buscarRadicadoOrfeo() {
    this.buscarRadicadoService.get(this.radicado).then((resp: any) => {
      if (resp.respuesta && resp.respuesta.length > 0) {

        this.formEditar.get("asunto")?.setValue(resp.respuesta[0].ra_asun);
        this.formEditar.get("fechaRadicado")?.setValue(this.datePipe.transform(resp.respuesta[0].radi_fech_radi, 'yyyy-MM-dd') + 'T05:00:00.000Z');
        this.formEditar.get("radicado")?.setValue(resp.respuesta[0].radi_nume_radi);
        this.operationSuccess()
        this.realizandoCounsulta = false;
      } else {
        this.radicado = "";
        this.LimpiarNumeroRadicado();
        this.handleError('No se encontró el número de radicado, por favor intente nuevamente', false)
      }
    });
  }


  /**
   * Maneja la respuesta con exito de las peticiones.
   */
  operationSuccess() {
    this.snackBar.open('Consulta Realizada', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja el error de las peticiones.
   */
  handleError(msjError: string = "Error al realizar la operacion", volver: boolean = true) {
    this.snackBar.open(msjError, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    if (volver)this.almacenadoEvent.emit(false);
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
  * Metodo para limpiar el campo en el html
  */
  LimpiarNumeroRadicado() {
    this.formEditar.get("radicado")?.setValue("");
    this.formEditar.get("fechaRadicado")?.setValue("");
    this.formEditar.get("asunto")?.setValue("");
  }
  
  /**
   * Manejador del evento de registro seleccionado.
   * @param arrayChecked Registro seleccionado. 
   */
   async registroSeleccionadoEvt(arrayChecked:any) {
    if (arrayChecked && arrayChecked.length > 0) {
      this.row = arrayChecked[0];
      this.row_selected = true;
    } else {
      this.row_selected = false;
    }
  }

  /**
   * Manejador de los eventos de la lista.
   * @param opcion Evento de la lista.
   */
  async opcionSeleccionadaEvt(opcion:any) {
    console.info(opcion);
    switch (opcion.accion) {
      case 'eliminar':
        break;
      default:
        this.row = opcion.row;
        break;
    }
  }

  onSubmit() {
    let valueForm = this.formEditar.value;
    //debugger;
    if(!this.formEditar.invalid) {
      let idMantenimientoVial = "";
      for (let index = 0; index < this.arrayChecked.length; index++) {
        if(index+1 < this.arrayChecked.length) {
          idMantenimientoVial += this.arrayChecked[index].id_mantenimiento_vial + ",";
        } else {
          idMantenimientoVial += this.arrayChecked[index].id_mantenimiento_vial
        }
      }
      // @TODO valueForm.radicado
      this.updateSubject.next({mantenimientoIDsString: idMantenimientoVial});
    }
  }

  /**
   * Envia el nuevo registro al backend.
   */
  async enviar() {
    let respServ = null;
    let idMantenimientoVial = "";
    let idPkSendList: number[] = [];
    let valueForm = this.formEditar.value;
    this.realizandoCounsulta = true;
    
    try {

      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: "25%",
        height: '25%',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: { accion: "A", mensaje: "Se actualizarán los datos. ¿Desea de continuar con la operación? "}
      });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          for (let index = 0; index < this.arrayChecked.length; index++) {
            idPkSendList.push(this.arrayChecked[index].id_proceso_gestion);
            if(index+1 < this.arrayChecked.length) {
              idMantenimientoVial += this.arrayChecked[index].id_mantenimiento_vial + ",";
            } else {
              idMantenimientoVial += this.arrayChecked[index].id_mantenimiento_vial
            }
          }
          //debugger;
          let solicitud:any = {
            radicado: valueForm.radicado,
            idMantenimientoVial: idMantenimientoVial,
            fechaRadicadoUMV: new Date().getTime(),
            idDocumento: await this.procesoIntervencion.obtenerIdDocumento(1463)
          }
          if (this.edit_flag) {
            respServ = await this.procesoIntervencion.actualizarSolicitud(solicitud);
          } else {
            respServ = await this.procesoIntervencion.insertarSolicitud(solicitud);
          }
          if(respServ && respServ.codError == 0) {
            this.operationSuccess();
            this.realizandoCounsulta = true;
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([currentUrl]);
            });
          } else {
            this.handleError();
          }
          this.realizandoCounsulta = false;
        }
        this.realizandoCounsulta = false;
      });
    } catch(e) {
      console.log(e);
      this.handleError();
      this.realizandoCounsulta = false;
    }  
  }
}
