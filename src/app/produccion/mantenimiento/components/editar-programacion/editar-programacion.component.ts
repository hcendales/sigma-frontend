import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { ProcesoMantenimientoService } from '../../../../core/services/proceso-mantenimiento.service';
import { SecurityService } from 'src/app/core/security/services/security.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';

/**
 * 
 * @param c Validador de la fecha.
 * @returns Resultado de validacion.
 */
export const isValidDate = (c: FormControl) => {
  let dateA = new Date();
  dateA.setDate(dateA.getDate() - 1);
  let dateB = new Date(c.value)
  return dateB >= dateA ? null : {
    fecha: {
      valid: false
    }
  };
}

/**
 * Componente: EditarProgramacionComponent
 * 
 * Permite crear o editar un registro de . 
 * 
 * @version 1.0
 * @revision 07-07-21
 */
@Component({
  selector: 'app-editar-programacion',
  templateUrl: './editar-programacion.component.html',
  styleUrls: ['./editar-programacion.component.scss']
})
export class EditarProgramacionComponent implements OnInit {

  //------------------------------------------------------
  // Define formularios
  //------------------------------------------------------
  
  /**
   * Define formulario de usqueda
   */
  formEditar:FormGroup;
  
  /**
   * Variable tipo
   */
  tipo:any = null;
  
  //------------------------------------------------------
  // Define propiedades de listas
  //------------------------------------------------------
  
  /**
   * Define la lista de programas.
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
  @Input() 
  edit_flag = false;

  /**
   * Bandera que indica el procesamiento de una
   * peticion.
   */
  realizandoCounsulta: boolean = false;

  //------------------------------------------------------
  // Define propiedades de componente.
  //------------------------------------------------------

  /**
   * Modo de visualizacion de la vista.
   */
  modo = 'edicion';

  /**
   * Contrato relacionado.
   */
  contrato:any;

  /**
   * Contrato relacionado.
   */
  des_contrato = "";

  /**
   * ID de usuario
   */
  id_usuario:any = null;

  /**
   * ID del registro a procesar.
   */
  @Input() reg:any = null;

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
   */
  constructor(
    public fb:FormBuilder,  
    private listasService: ConsultaListasService, 
    private procesoMantenimiento: ProcesoMantenimientoService, 
    private snackBar:MatSnackBar,
    private securityService: SecurityService,
    private personaService: EntityTabPersonaService
  ) {
    // Define el formulario principal del componente.  
    this.formEditar = this.fb.group({
      id_equipo: [''],
      tipo_mantenimiento: new FormControl('', [Validators.required,]),
      fecha: new FormControl(null, [Validators.required, isValidDate]),
      variable_control: new FormControl('', [Validators.required,]),
      valor_control: new FormControl('', [Validators.required,Validators.maxLength(6),]),
      persona: new FormControl(''),
      contratoctr: new FormControl(''),
      desctr: new FormControl(''),
      descripcion: new FormControl('', [Validators.required,Validators.maxLength(250),]),
      ubicacion: new FormControl('')
    });
  }

  /**
   * Metodo de carga del componente.
   */
   async ngOnInit() {
    try {
      this.contrato = "No seleccionado";
      this.des_contrato = "No seleccionado";
      this.formEditar.controls['contratoctr'].setValue(this.contrato);
      this.formEditar.controls['desctr'].setValue(this.des_contrato);
      // Deshabilita los solo lectura
      this.formEditar.controls['persona'].disable();
      this.formEditar.controls['contratoctr'].disable();
      this.formEditar.controls['desctr'].disable();
      this.formEditar.controls['ubicacion'].disable();
      // Carga los valores de las listas.
      this.listas = await this.listasService.consultarListas([90, 98]);
      this.listas[90].sort((a:any,b:any) => (a.valor > b.valor) ? 1 : ((b?.valor > a.valor) ? -1 : 0));
      this.listas[98].sort((a:any,b:any) => (a.valor > b.valor) ? 1 : ((b?.valor > a.valor) ? -1 : 0));
      // En caso de edicion carga los valores por defecto. 
      if (this.edit_flag) {
        //------------------------------------------------
        // Caso editar
        let resp = await this.procesoMantenimiento.consultarMantenimiento(`and id_mantenimiento_equipo = ${this.reg.id_mantenimiento_equipo}`);
        if(resp && resp.codError == 0) {
          console.log("Respuesta filtro mantenimiento:");
          console.log(resp);
          console.log("Registro actual:");
          console.log(this.reg);
          this.tipo = resp.respuesta[0].tipo;
          this.formEditar.controls['tipo_mantenimiento'].setValue(resp.respuesta[0].id_tipo_mantenimiento);
          if (resp.respuesta[0].fecha == null) {
            //--------------------------------------------
            // Editar: Caso sin asignar
            let respServFll = await this.procesoMantenimiento.listarFallos(`id_mantenimiento_equipo = ${this.reg.id_mantenimiento_equipo}`);
            console.log("Registro fallo:");
            console.log(respServFll.respuesta);
            this.formEditar.controls['fecha'].setValue(new Date(respServFll.respuesta[0].fecha_reporto_fallo));
            this.formEditar.controls['variable_control'].setValue(respServFll.respuesta[0].id_var_control_fallo);
            this.formEditar.controls['valor_control'].setValue(respServFll.respuesta[0].valor_var_fallo);            
            this.id_usuario = respServFll.respuesta[0].id_usuario_reporto_fallo;
            let respServPer = await this.personaService.listUsuarios(`id_usuario = ${this.id_usuario}`);
            console.log("Registro personas:");
            console.log(respServPer.respuesta);
            this.formEditar.controls['persona'].setValue(respServPer.respuesta[0].nombre);
            this.formEditar.controls['descripcion'].setValue(respServFll.respuesta[0].descripcion_fallo);
            this.formEditar.controls['ubicacion'].setValue(respServFll.respuesta[0].ubicacion);
          } else {
            //--------------------------------------------
            // Editar: Caso con mantenimiento asignado
            this.formEditar.controls['fecha'].setValue(new Date(resp.respuesta[0].fecha));
            this.formEditar.controls['variable_control'].setValue(resp.respuesta[0].id_var_control_mtto);
            this.formEditar.controls['valor_control'].setValue(resp.respuesta[0].valor_var_mtto);
            if (resp.respuesta[0].id_usuario_programa_mtto) {
              this.id_usuario = resp.respuesta[0].id_usuario_programa_mtto;
              let respServPer = await this.personaService.listUsuarios(`id_usuario = ${this.id_usuario}`);
              console.log("Registro personas:");
              console.log(respServPer.respuesta);
              this.formEditar.controls['persona'].setValue(respServPer.respuesta[0].nombre);  
            }
            this.id_usuario = resp.respuesta[0].id_usuario_programa_mtto;
            let respServPer = await this.personaService.listUsuarios(`id_usuario = ${this.id_usuario}`);
            console.log("Registro personas:");
            console.log(respServPer.respuesta);
            this.formEditar.controls['persona'].setValue(respServPer.respuesta[0].nombre);
            this.formEditar.controls['descripcion'].setValue(resp.respuesta[0].descripcion_mtto);
          }
          console.log("Registro Contrato:");
          console.log(resp.respuesta[0].contrato);
          if (resp.respuesta[0].contrato != null) {
            this.contrato = resp.respuesta[0].contrato;
            this.des_contrato = resp.respuesta[0].contratista;
            this.formEditar.controls['contratoctr'].setValue(this.contrato);
            //resp = await this.procesoMantenimiento.consultarMantenimiento(`and id_mantenimiento_equipo = ${this.reg.id_mantenimiento_equipo}`);
            this.formEditar.controls['desctr'].setValue(this.des_contrato);
          }
        } else {
          let msg = '';
          if (resp) {
            msg = resp.msgError;
          }
          this.handleError(msg);
        }
      } else {
        //------------------------------------------------
        // Caso nuevo
        this.tipo = 2;
        // Carga los datos quien crea el mantenimiento
        this.formEditar.controls['persona'].setValue(this.securityService.userSession.nombre);
      }
    } catch(e) {
      console.log(e);
      this.handleError('');
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
  handleError(msg: string) {
    this.snackBar.open('Error al realizar la operación: ' + msg, 'X', {
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
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado. 
   */
  async registroSeleccionadoEvt(row:any) {
    console.info("Seleccion contrato:");
    console.info(row);
    if (row) {
      this.contrato = parseInt(row.numero_contrato);
      this.des_contrato = row.nombre_contratista;
      this.formEditar.controls['contratoctr'].setValue(this.contrato);
      this.formEditar.controls['desctr'].setValue(this.des_contrato);
    }
    this.modo = 'edicion';
  }

  /**
   * Manejador de los eventos de la lista.
   * @param opcion Evento de la lista.
   */
  async opcionSeleccionadaEvt(opcion:any) {
    this.contrato = parseInt(opcion.row.numero_contrato);
    this.formEditar.controls['contratoctr'].setValue(this.contrato);
    this.formEditar.controls['desctr'].setValue(opcion.row.nombre_contratista);
    this.modo = 'edicion';
  }

  /**
   * Genera la sigla.
   */
  generarSigla() {
    let rtn = "PI";
    if (this.reg.clase_equipo == "VEHICULO_PESADO" || this.reg.clase_equipo == "VEHICULO_LIVIANO") {
      rtn = "VL Y VP";
    }
    if (this.reg.clase_equipo == "MAQUINARIA") {
      rtn = "EM Y M";
    }
    if (this.reg.clase_equipo == "MAQUINARIA") {
      rtn = "EM Y M";
    }
    return rtn;
  }

  /**
   * Envia el nuevo registro al backend.
   */
  async onSubmit() {
    let respServ = null;
    let valueForm = this.formEditar.value;
    this.realizandoCounsulta = true;
    try {
      console.info("Registro:");
      console.info(this.reg);
      console.info("Fecha:");
      console.info(valueForm.fecha);
      let mantenimiento:any = {
        id_mantenimiento_equipo: null,
        id_equipo: this.reg.id_equipo,
        numero_interno: this.reg.numero_interno,
        id_tipo_mantenimiento: valueForm.tipo_mantenimiento,
        tipo: this.tipo,
        fecha: new Date(valueForm.fecha).getTime(),
        variable_control: valueForm.variable_control,
        valor_control: valueForm.valor_control,
        cargo: null,
        descripcion: valueForm.descripcion,
        contrato: this.contrato,
        sigla: this.generarSigla(),
        idPersonaReporto: null
      }
      if (this.edit_flag) {
        mantenimiento.idPersonaReporto = this.id_usuario;
        mantenimiento.id_mantenimiento_equipo = this.reg.id_mantenimiento_equipo;
        respServ = await this.procesoMantenimiento.actualizarMantenimientoEquipo(mantenimiento);
      } else {
        mantenimiento.idPersonaReporto = this.securityService.userSession.idUsuario;
        respServ = await this.procesoMantenimiento.insertarMantenimientoEquipo(mantenimiento);
      }
      if(respServ && respServ.codError == 0) {
        this.operationSuccess();
        this.almacenadoEvent.emit(true);
      } else {
        let msg = '';
          if (respServ) {
            msg = respServ.msgError;
          }
          this.handleError(msg);
      }
      this.realizandoCounsulta = false;
    } catch(e) {
      console.log(e);
      this.handleError('');
      this.realizandoCounsulta = false;
    }
  }
}
