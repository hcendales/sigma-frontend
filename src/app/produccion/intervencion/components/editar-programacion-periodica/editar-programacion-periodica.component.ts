import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { ProcesoIntervencionService } from '../../../../core/services/proceso-intervencion.service';
import { OnDestroy } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/**
 * Componente: EditarProgramacionPeriodicaComponent
 * 
 * Permite crear o editar un registro de . 
 * 
 * @version 1.0
 * @revision 07-07-21
 */
@Component({
  selector: 'app-editar-programacion-periodica',
  templateUrl: './editar-programacion-periodica.component.html',
  styleUrls: ['./editar-programacion-periodica.component.scss']
})
export class EditarProgramacionPeriodicaComponent implements OnInit {

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
   * Define la lista de programas.
   */
  listas: any = {};

  /**
   * Define la lista de vigencias.
   */
  listaVigencias:Vigencia[] = [];

  /**
   * Define la lista de periodos.
   */
  listaPeriodos: Periodo[] = [];

  /**
   * ID tipo periodo programacion.
   */
  idPeriodoProgramacion:any = null;

  /**
   * Numero de dias laborales.
   */
  noDiasLaborales = 0;

  /**
   * Bandera de tamano del archivo.
   */
  size = false;

  /**
   * Bandera de extencion del archivo. 
   */
  extencion = false;

  /**
   * Bandera del archivo.
   */
  file = false;

  /**
   * Datos del archivo.
   */
  fileData:any = null;
  
  //------------------------------------------------------
  // Define propiedades de bandera de control del 
  // componenete.
  //------------------------------------------------------

  /**
   * Libera la suscripcion.
   */
  destroyed: ReplaySubject<any> = new ReplaySubject<any>(1);

  /**
   * Destructir de suscripciones. 
   */
  destroy(observable: Observable<any>) {
    return observable.pipe(takeUntil(this.destroyed));
  }

  /**
   * Suscripcion para cambios de los controles.
   */
  subscribe<T>(
      observable: Observable<T>,
      next?: (value: T) => void,
      error?: (error: any) => void,
      complete?: () => void
  ): Subscription {
      return this.destroy(observable).subscribe(next, error, complete);
  }

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
   * Nombre de arcchivo.
   */
  fileName = new FormControl('');

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
   * @param procesoIntervencion Servicio de ProcesoIntervencionService.
   * @param snackBar  Scancbar. 
   */
  constructor(
    public fb:FormBuilder,  
    private listasService: ConsultaListasService, 
    private procesoIntervencion: ProcesoIntervencionService, 
    private snackBar:MatSnackBar
  ) {
    // Define el formulario principal del componente.
    this.formEditar = this.fb.group({
      vigencia: new FormControl('', [Validators.required,]),
      periocidad: new FormControl('', [Validators.required,]),
      periodo: new FormControl('', [Validators.required,]),
      no_dias_laborales: new FormControl('', [Validators.required,]),
      archivo:[null]
    });
  }

  /**
   * Metodo de carga del componente.
   */
   async ngOnInit() {
    try {
      // Carga los valores de las listas.
      this.listas = await this.listasService.consultarListas([118, ]);
      this.listas[118].sort((a:any,b:any) => (a.valor > b.valor) ? 1 : ((b?.valor > a.valor) ? -1 : 0));
      // Carga las vigencias
      let resp = await this.procesoIntervencion.obtenerVigencias();
      this.listaVigencias = resp.respuesta;
      console.info("Lista de vigencias");
      console.info(this.listaVigencias);
      // Inactiva los controles correspndientes
      this.formEditar.controls['periocidad'].disable();
      this.formEditar.controls['periodo'].disable();
      this.formEditar.controls['no_dias_laborales'].disable();
      // Asigna controles de cambios
      this.subscribe(this.formEditar.controls['vigencia'].valueChanges, _ => {
        if(this.formEditar.controls['vigencia'].value) {
          this.formEditar.controls['periocidad'].enable();
        }
      });
      this.subscribe(this.formEditar.controls['periocidad'].valueChanges, async _ => {
        if(this.formEditar.controls['vigencia'].value && this.formEditar.controls['periocidad'].value) {
          resp = await this.procesoIntervencion.consultarPeriodos(
            parseInt(this.formEditar.controls['vigencia'].value), 
            parseInt(this.formEditar.controls['periocidad'].value)
          );
          console.info("Lista periodos");
          console.info(resp.respuesta);
          this.listaPeriodos = resp.respuesta;
          if (this.listaPeriodos.length > 0) {
            if (!this.edit_flag) {
              this.formEditar.controls['periodo'].enable();
            }
          }
        }
      });
      this.subscribe(this.formEditar.controls['periodo'].valueChanges, async _ => {
        this.idPeriodoProgramacion = this.formEditar.controls['periodo'].value;
        if (this.idPeriodoProgramacion) {
          let periodoVal: any = this.listaPeriodos.find((x: { id_tipo_periodo_programacion: any; dias_laborales: any;}) => x.id_tipo_periodo_programacion == this.idPeriodoProgramacion);
          this.noDiasLaborales = periodoVal ? periodoVal.dias_laborales : 0;
          if (!this.edit_flag) {
            this.formEditar.controls['no_dias_laborales'].setValue(this.noDiasLaborales);
          }
        }
      });      
      if (this.edit_flag) {
        this.formEditar.controls['vigencia'].setValue(this.reg.vigencia);
        this.formEditar.controls['periocidad'].setValue(this.reg.id_tipo_periodicidad);
        this.formEditar.controls['periodo'].setValue(this.reg.id_tipo_periodo_programacion);
        this.formEditar.controls['no_dias_laborales'].setValue(this.reg.dias_laborales);
        // Inactiva los controles correspndientes
        this.formEditar.controls['vigencia'].disable();
        this.formEditar.controls['periocidad'].disable();
        this.formEditar.controls['periodo'].disable();
        this.formEditar.controls['no_dias_laborales'].disable();
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
  handleError(msg:string) {
    this.snackBar.open('Error al realizar la operación. ' + msg , 'X', {
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
   * Verifica las caaracteristicas del archivo.
   * @param event Datos del arcivo.
   */
  capturarFile(event:any) {
    this.fileData = event.target.files.item(0);
    this.fileName.setValue(this.fileData.name);
    if(event.target.files[0].size >= 4096000){
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
    //debugger;
    let respServ = null;
    let valueForm = this.formEditar.value;
    this.realizandoCounsulta = true;
    try {
      let duracion = -1;
      let idArchivo = -1;
      let totalNumeroCuadrillas = -1;
      let id_periocidad = parseInt(valueForm.periocidad);
      if (this.edit_flag) {
        id_periocidad = this.reg.id_tipo_periodicidad;
        this.noDiasLaborales = this.reg.dias_laborales;
      }
      let periocidadDes = this.listas[118].find((x: { id_tipo: any; descripcion: any;}) => x.id_tipo == id_periocidad);
      switch (periocidadDes.valor) {
        case "Mensual":
          duracion = 30;
          break;
        case "Bimestral":
          duracion = 60;
          break;
        case "Trimestral":
          duracion = 90;
          break;
        case "Semestral":
          duracion = 180;
          break;
        case "Anual":
          duracion = 360;
          break;
        default:
          break;
      }
      if (duracion > 0 && this.noDiasLaborales > 0) {
        idArchivo = await this.procesoIntervencion.insertarArcivoCaliope(this.fileData, '2065');
        totalNumeroCuadrillas = Math.ceil(duracion / this.noDiasLaborales);
        let programacion_periodica:any = {
          idTipoPeriodoProgramacion: this.idPeriodoProgramacion,
          idArchivo:idArchivo,
          observaciones:"",
          totalNumeroCuadrillas: totalNumeroCuadrillas
        }
        if (this.edit_flag) {
          programacion_periodica.id = this.reg.id_programacion_periodica;
          respServ = await this.procesoIntervencion.actualizarProgramacionPeriodica(programacion_periodica);
        } else {
          respServ = await this.procesoIntervencion.insertarProgramacionPeriodica(programacion_periodica);
        }
        //debugger;
        if(respServ && respServ.codError == 0) {
          this.operationSuccess();
          this.almacenadoEvent.emit(true);
        } else {
          this.handleError(respServ.msgError);
        }
        this.realizandoCounsulta = false;
      } else {
        this.handleError('');
        this.realizandoCounsulta = false;  
      }
    } catch(e) {
      console.log(e);
      this.handleError('');
      this.realizandoCounsulta = false;
    }  
  }
}

/**
 * Interfaz para las vigencias.
 */
interface Vigencia {
  vigencia: any;
}

/**
 * Interfaz para los periodos.
 */
interface Periodo {
  id_tipo_periodo_programacion: any;
  nombre_periodo: any;
  dias_laborales: any;
}
