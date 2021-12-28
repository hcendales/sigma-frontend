import { Component, OnInit, Input, Output, EventEmitter, ViewChild,AfterContentInit,AfterViewInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { ProcesoMantenimientoService } from 'src/app/core/services/proceso-mantenimiento.service';
import { Asignacion } from './asignacion';
import { Relacion } from './realcion';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common'

/**
 * Componenete que muestra el calendario de asignacion de conductor u operario.
 */
@Component({
  selector: 'app-calendario-asignacion-co',
  templateUrl: './calendario-asignacion-co.component.html',
  styleUrls: ['./calendario-asignacion-co.component.scss'],
})
export class CalendarioAsignacionCoComponent implements OnInit, AfterViewInit {

  /**
   * Modo de visualizacion de la vista.
   */
  modo = 'salida';

   /**
    * Referencia al registro seleccionado en la lista.
    */
  row:any = null;

  /**
   * Bandera para el horario AM.
   */
  diurno_toggle = true;

  /**
   * Bandera para el horario PM.
   */
  nocturno_toggle = true;

  /**
   * Bandera para señalar que se esta cargando
   * el componenete.
   */
  cargandoComponente :boolean = false;

  /**
   * Referencia al objeto de calendario.
   */
  @ViewChild(MatCalendar)
  calendar!: MatCalendar<Date>;

  /**
   * ID del registro a procesar.
   */
  @Input() placa = '';

  /**
   * ID del registro a procesar.
   */
  @Input() reg: any = null;

  /**
   * ID del registro a procesar.
   */
  @Input() relaciones:Relacion[] = [];

  /**
   * .Matriz de relaciones por calendario.
   */
  relaMTX:Asignacion[] = [];

  /**
   * Emisor del evento de actualizacion de la lista.
   */
  updateSubject: Subject<void> = new Subject<void>();

  /**
   * Evento para indicar la opcion seleccioanda.
   */
  @Output() opcionSeleccionada: EventEmitter<any> = new EventEmitter();

  /**
   * Constructor por defecto.
   */
  constructor(
    public dialog: MatDialog,
    private dateAdapter: DateAdapter<any>,
    private procesoMantenimiento: ProcesoMantenimientoService,
    private snackBar:MatSnackBar,
    public datepipe: DatePipe
  ) { }

  /**
   * Metodo de carga del componente.
   */
  async ngOnInit() {
    this.dateAdapter.setLocale('es');
    console.info("Placa:");
    console.info(this.placa);
  }

  /**
   * function para para plasmar en casillas fechas especiales
   */
  print_string_special(){
    //debugger;
    let selection = Array.from(document.getElementsByClassName('special-date') as HTMLCollectionOf<HTMLElement>);
    const selection_lenght = selection.length -1;
    for(let l = 0 ; l <= selection_lenght; l++ ) {
      if (selection[l].children[0] instanceof HTMLElement) {
        let child: HTMLElement = <HTMLElement> selection[l].children[0];
        child.style.alignItems= "baseline";
      }
      for(let i=0;i<=this.relaMTX.length-1;i++) {
        let date =new Date(this.relaMTX[i].fecha).toString().substring(7,10);
        if(parseInt(selection[l].children[0].innerHTML) == parseInt(date)) {
          let relaciones:any  = this.relaMTX[i].relaciones;
          //debugger;
          let asing:string[] = []
          for (let rel of relaciones) {
            let libres = document.createElement('span');
            if(!asing.includes(rel.persona)) {
              libres.className = "date-resumen libres";
              libres.textContent = rel.persona.substring(0,10) + "...";
              selection[l].appendChild(libres);
              asing.push(rel.persona);
              this.celRenderedFlag = true;
            }
          }
        }
      }
    }
  }
celRenderedFlag = false;
calendarFlag = false;
  
  ngAfterViewInit(){
    /**
   * Pinta los nombres sobre las celdas despues de cargar 
   * el contenido del control de calendario.
   */
    if (!this.celRenderedFlag || this.calendarFlag) {
      this.print_string_special();
    }
  }

  /**
   * Carga las asignaciones de franjas por día.
   * @returns Retorna el estilo de la celda.
   */
  dateClass() {
    return (moment: any): MatCalendarCellCssClasses => {
      let reg = null;
      let initDate = null;
      let counter = 0;
      let existeRelacion = null;
      let asignacion:Asignacion = {fecha: 123};
      let relIniDate:Date = new Date();
      let relEndDate = null;
      let existeRelacionFlag = false;
      //debugger;
      let celDate = moment.toDate();
      celDate.setHours(0,0,0,0);
      for(let i=0; i<this.relaciones.length; i++) {
        relIniDate = new Date (this.relaciones[i].fecha_inicio);
        relIniDate.setHours(0,0,0,0);
        relEndDate = new Date (this.relaciones[i].fecha_fin);
        if (celDate.valueOf() == relIniDate.valueOf()) {
          console.info("Compare:");
          console.info(moment.year(), relIniDate.getFullYear(), moment.month(), relIniDate.getMonth(), moment.day(), relIniDate.getDay());
          //debugger;
          reg = this.relaMTX.find(x => new Date(x.fecha).valueOf() == relIniDate.valueOf());
          console.info("Asigancion reg:");
          console.info(reg);
          counter = 0;
          if (reg) {
            //debugger;
            existeRelacion = reg.relaciones?.findIndex(x => x.id_recurso_disponibilidad_relacion == this.relaciones[i].id_recurso_disponibilidad_relacion);
            console.info("Lista relaciones:");
            console.info(existeRelacion);
            if(!existeRelacion || existeRelacion < 0) {
              if (this.diurno_toggle && this.nocturno_toggle) {
                reg.relaciones?.push(this.relaciones[i]);
                counter++;
              } else {
                if (this.diurno_toggle) {
                  initDate = new Date (this.relaciones[i].fecha_inicio);
                  //debugger;
                  if (initDate.getHours()>=6 && initDate.getHours()<=18) {
                    reg.relaciones?.push(this.relaciones[i]);
                    counter++;
                  }
                }
                if (this.nocturno_toggle) {
                  initDate = new Date (this.relaciones[i].fecha_inicio);
                  //debugger;
                  if (initDate.getHours()>18 || initDate.getHours()<6) {
                    reg.relaciones?.push(this.relaciones[i]);
                    counter++;
                  }
                }
              }
            }
          } else {
            asignacion = {
              fecha: moment.toDate().getTime(),
              id_recurso_disponibilidad_relacion: this.relaciones[i].id_recurso_disponibilidad_relacion,
              relaciones:[]
            };
            if (this.diurno_toggle && this.nocturno_toggle) {
              asignacion.relaciones?.push(this.relaciones[i]);
              counter++;
            } else {
              if (this.diurno_toggle) {
                initDate = new Date (this.relaciones[i].fecha_inicio);
                //debugger;
                if (initDate.getHours()>=6 && initDate.getHours()<=18) {
                  asignacion.relaciones?.push(this.relaciones[i]);
                  counter++;
                }
              }
              if (this.nocturno_toggle) {
                initDate = new Date (this.relaciones[i].fecha_inicio);
                //debugger;
                if (initDate.getHours()>18 || initDate.getHours()<6) {
                  asignacion.relaciones?.push(this.relaciones[i]);
                  counter++;
                }
              }
            }
            this.relaMTX.push(asignacion);
            console.info("Matriz:");
            console.info(this.relaMTX);
          }
          existeRelacionFlag ||= counter > 0;
        }
      }
      if(existeRelacionFlag) {
        return 'special-date';
      }
      return 'disableclicking';
    };
  }

  /**
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado.
   */
   async registroSeleccionadoEvt(row:any) {
    if (row) {
      this.row = row;
    }
  }

  /**
   * Manejador de los eventos de la lista.
   * @param opcion Evento de la lista.
   */
  async opcionSeleccionadaEvt(opcion:any) {
    console.info(opcion);
    switch (opcion.accion) {
      case 'salida':
        this.celRenderedFlag = false;
        this.row = opcion.row;
        this.relaMTX = [];
        this.modo = opcion.accion;
        setTimeout(() => { this.print_string_special(); }, 500);
        break;
      case 'eliminar':
        this.row = opcion.row;
        let dialogRef = this.dialog.open(SimpleDialogComponent, {
          data: {
            titulo: 'Registrar Novedad',
            contenido: '¿Desea de registrar la novedad?',
            aceptar: true,
            cancelar: true,
            action: null
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.action == 'aceptar') {
            this.eliminar();
          }
        });
        break;
      default:
        this.row = opcion.row;
        this.modo = opcion.accion;
        break;
    }
  }

  /**
   * Desasocia un registro de relacion.
   */
  async eliminar() {
    let resp = await this.procesoMantenimiento.eliminarRelacion(this.row);
    if(resp && resp.codError == 0) {
      resp = await this.procesoMantenimiento.consultarRelaciones(`equipo = '${this.placa}'`);
      if(resp && resp.codError == 0) {
        console.info("Nuevas relaciones:");
        console.info(resp.respuesta);
        this.relaciones = resp.respuesta;
        this.relaMTX = [];
        this.modo = 'salida';
        this.operationSuccess();
      } else {
        this.handleError('No se pudo cargar las relaciones');
      }
    } else {
      this.handleError('No se pudo guardar la novedad');
    }
  }

  /**
   * Permite regresar al componente padre.
   */
  volver() {
    this.opcionSeleccionada.emit({accion: 'salida', row: null});
  }

  /**
   * Permite regresar al componente padre.
   */
  reasignar() {
    this.opcionSeleccionada.emit({accion: 'nueva', row: this.reg});
  }

  /**
   * Obtiene la celda seleccionada.
   * @param moment Momento asociado la celda.
   */
  getChangedValue(moment:any) {
    console.info("Evento");
    console.info(moment);
    if(moment) {
      console.info(moment.toDate().getTime());
      let reg = this.relaMTX.find(x => x.fecha == moment.toDate().getTime());
      console.info("Franjas");
      console.info(reg);
      this.row = reg?.relaciones;
      this.modo = 'franjas';
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
  }

  /**
   * metodo para controlar el comportamiento de el hoario seleccionado. 
   * @param btn Etiqueta el boton.
   */
  horario(btn:string) {
    this.calendarFlag = true;
    if (btn == "am") {
      this.diurno_toggle = !this.diurno_toggle;
    } else {
      this.nocturno_toggle = !this.nocturno_toggle;
    }
    this.relaMTX = [];
    this.calendar.updateTodaysDate();
    setTimeout(() => { this.print_string_special(); }, 500);
  }

  /**
   * Permite exportar los datos de la lista a archivo excel.
   */
  exportexcel() {
    if (this.relaMTX.length > 0) {
      let headers = {header:[
        'id_recurso_disponibilidad_relacion',
        'persona',
        'email',
        'fecha_inicio',
        'fecha_fin',
        'relacion'
      ]};
      let datos = [];
      let fecha = '';
      for (let registro of this.relaMTX) {
        let listaRela = registro.relaciones ? registro.relaciones : [];
        for (let relacion of listaRela) {
          datos.push({
            'id_recurso_disponibilidad_relacion': registro.id_recurso_disponibilidad_relacion,
            'persona': relacion.persona,
            'email': relacion.email,
            'fecha_inicio': this.datepipe.transform(new Date(relacion.fecha_inicio ? relacion.fecha_inicio : ''), 'yyyy-MM-dd hh:ss a'),
            'fecha_fin': this.datepipe.transform(new Date(relacion.fecha_fin ? relacion.fecha_fin : ''), 'yyyy-MM-dd hh:ss a'),
            'relacion': relacion.relacion
          });
        }
      }
      const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(datos, headers);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, "Detalle_Asignacion.xlsx");
    }
  }

}
