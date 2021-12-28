import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { ProcesoMantenimientoService } from '../../../../core/services/proceso-mantenimiento.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { SecurityService } from 'src/app/core/security/services/security.service';

/**
 * Componente: EditarReporteFalloComponent
 * 
 * Permite crear o editar un registro de fallo. 
 * 
 * @version 1.0
 * @revision 16-07-21
 */
@Component({
  selector: 'app-editar-reporte-fallo',
  templateUrl: './editar-reporte-fallo.component.html',
  styleUrls: ['./editar-reporte-fallo.component.scss']
})
export class EditarReporteFalloComponent implements OnInit {

  //------------------------------------------------------
  // Define formularios
  //------------------------------------------------------
  
  /**
   * Define formulario de usqueda
   */
  formEditar:FormGroup;
  
  //------------------------------------------------------
  // Define propiedades de listas
  //------------------------------------------------------
  
  /**
   * Define la lista de variable de control.
   */
  listas: any = {};

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

  //------------------------------------------------------
  // Define propiedades de componente.
  //------------------------------------------------------
  
  /**
   * Datos del registro a procesar.
   */
  @Input() reg: any = null;

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
   * @param procesoMantenimiento Servicio de ProcesoMantenimientoService.
   * @param snackBar  Scancbar. 
   * @param dialog Dialogo de acaeptacion
   */
  constructor(
    public fb:FormBuilder,
    public dialog: MatDialog,
    private listasService: ConsultaListasService, 
    private procesoMantenimiento: ProcesoMantenimientoService, 
    private snackBar:MatSnackBar,
    private securityService: SecurityService
  ) {
    // Define el formulario principal del componente.
    this.formEditar = this.fb.group({
      descripcion: new FormControl('', [Validators.required,Validators.maxLength(250),]),
      variable_control: new FormControl('', [Validators.required,]),
      valor_control: new FormControl('', [Validators.required,Validators.maxLength(6),]),
      ubicacion: new FormControl('', [Validators.required,Validators.maxLength(100),]),
    });
  }

  /**
   * Metodo de carga del componente.
   */
   async ngOnInit() {
    try {
      // Carga los valores de las listas.
      this.listas = await this.listasService.consultarListas([98]);
      this.listas[98].sort((a:any,b:any) => (a.valor > b.valor) ? 1 : ((b?.valor > a.valor) ? -1 : 0));
    } catch(e) {
      console.log(e);
      this.handleError();
    }
  }
  
  /**
   * Maneja la respuesta con exito de las peticiones.
   */
  operationSuccess() {
    this.snackBar.open('Operación Realizada', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja el error de las peticiones.
   */
  handleError() {
    this.snackBar.open('Error al realizar la operación', 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
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
   * Accion submit del formulario.
   */
  async onSubmit() {
    this.realizandoCounsulta = true;
    let dialogRef2 = this.dialog.open(SimpleDialogComponent, {
      data: {
        titulo: 'Registrar Falla',
        contenido: '¿Desea registrar la falla?',
        aceptar: true,
        cancelar: true,
        action: null
      }
    });
    dialogRef2.afterClosed().subscribe(result => {
      if (result && result.action == 'aceptar') {
        this.enviar();
      } else {
        this.realizandoCounsulta = false;
      }
    });
    this.realizandoCounsulta = false;
  }

  /**
   * Envia el nuevo registro al backend.
   */
  async enviar() {
    let respServ = null;
    let valueForm = this.formEditar.value;
    try {
      let fallo:any = {
        id: this.reg.id_equipo,
        descripcion: valueForm.descripcion,
        variable_control: valueForm.variable_control,
        valor_control: valueForm.valor_control,
        ubicacion: valueForm.ubicacion,
        id_usuario: null
      }
      if (this.edit_flag) {
        fallo.id = this.reg.id_equipo;
        fallo.id_usuario = null;
        respServ = await this.procesoMantenimiento.actualizarFallo(fallo);
      } else {
        fallo.id_usuario = this.securityService.userSession.idUsuario;
        respServ = await this.procesoMantenimiento.insertarFallo(fallo);
      }
      if(respServ && respServ.codError == 0) {
        this.operationSuccess();
        this.almacenadoEvent.emit(true);
        this.procesoMantenimiento.enviarNotificacion();
      } else {
        this.handleError();
      }
      this.realizandoCounsulta = false;
    } catch(e) {
      console.log(e);
      this.handleError();
      this.realizandoCounsulta = false;
    }  
  }
}
