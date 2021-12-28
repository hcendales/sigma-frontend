import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { ProcesoMantenimientoService } from '../../../../core/services/proceso-mantenimiento.service';
import { Disponible } from './disponible';

/**
 * Componente: EditarAsignacionComponent
 * 
 * Permite crear o editar un registro de . 
 * 
 * @version 1.0
 * @revision 07-07-21
 */
@Component({
  selector: 'app-editar-asignacion',
  templateUrl: './editar-asignacion.component.html',
  styleUrls: ['./editar-asignacion.component.scss']
})
export class EditarAsignacionComponent implements OnInit {

  //------------------------------------------------------
  // Define formularios
  //------------------------------------------------------
  
  /**
   * Define formulario de usqueda
   */
  formEditar:FormGroup;
  
  /**
   * Define formualrio de Periodo de asignación.
   */
  formFechas:FormGroup;

  //------------------------------------------------------
  // Define propiedades de listas
  //------------------------------------------------------
  
  /**
   * Define la lista de programas.
   */
  listas:Disponible[] = [];

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
   * ID del registro a procesar.
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
   */
  constructor(
    public fb:FormBuilder,  
    private procesoMantenimiento: ProcesoMantenimientoService, 
    private snackBar:MatSnackBar
  ) {
    // Defin el formulario para la captura de rango de 
    // fechas desde-hasta.
    this.formFechas = this.fb.group({
      desde: new FormControl('', [Validators.required,]),
      hasta: new FormControl('', [Validators.required,]),
    })
    // Define el formulario principal del componente.
    this.formEditar = this.fb.group({
      conductor: new FormControl('', [Validators.required,]),
      fechas: this.formFechas,
      inicio: new FormControl('', [Validators.required,]),
      fin: new FormControl('', [Validators.required,]),
    });
  }

  /**
   * Metodo de carga del componente.
   */
  async ngOnInit() {
    try {
      // Carga los valores de las listas.
      let resp = await this.procesoMantenimiento.listarConductores(this.reg.id_equipo, '1277,1279');
      if(resp && resp.codError == 0) {
        this.listas = resp.respuesta;
        console.info("Conductores:");
        console.info(this.listas);
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
    this.snackBar.open('Consulta Realizada', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja el error de las peticiones.
   */
  handleError(msg: string) {
    this.snackBar.open('Error al realizar la consulta' + msg, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    //this.almacenadoEvent.emit(null);
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
   * Limpia el control de fechas.
   */
  clearDate() {
    this.formFechas.get('desde')?.setValue(null);
    this.formFechas.get('hasta')?.setValue(null);
  }

  /**
   * Envia el nuevo registro al backend.
   */
   async onSubmit() {
    let valueForm = this.formEditar.value;
    this.realizandoCounsulta = true;
    try {
      let reg = this.listas.find(x => x.id_equipo == this.reg.id_equipo);
      let asignacion:any = {
        id_recurso_equipo: reg ? reg.id_recurso_equipo : null,
        conductor: valueForm.conductor,
        fechas: valueForm.fechas,
        hora_inicio: valueForm.inicio,
        hora_fin: valueForm.fin,
        id_persona: reg ? reg.id_persona : null,
        descripcion_tipo_rol: reg ? reg.descripcion_tipo_rol : null
      }
      //debugger;
      let passFlag = false;
      let fechaDesde:number = new Date(asignacion.fechas.desde).getTime();
      let fechaHasta:number = new Date(asignacion.fechas.hasta).getTime();
      if (fechaDesde == fechaHasta) {
        let inicio = parseInt(valueForm.inicio.split(":")[0])
        let fin = parseInt(valueForm.fin.split(":")[0])
        passFlag = inicio < fin;
      } else {
        passFlag = true;
      }
      if (passFlag) {
        let ahora = new Date();
        ahora.setDate(ahora.getDate() - 1);
        let ahor = ahora.getTime();
        if (ahor <= fechaDesde) {
          this.almacenadoEvent.emit(asignacion);
          this.realizandoCounsulta = false;
        } else {
          this.handleError(': No se puede asignar en fechas pasadas');  
        }
      } else {
        this.handleError(': En el mismo día la hora de inicio no puede ser igual o mayor a la hora fin');  
      }
    } catch(e) {
      console.log(e);
      this.handleError('');
      this.realizandoCounsulta = false;
    }  
  }

}
