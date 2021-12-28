import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportar-fallo',
  templateUrl: './reportar-fallo.component.html',
  styleUrls: ['./reportar-fallo.component.scss']
})
export class ReportarFalloComponent implements OnInit {

  /**
   * Modo de visualizacion de la vista.
   */
  modo = 'salida';

  /**
   * Referencia al registro seleccionado en la lista.
   */
  row:any = null;

  /**
   * Bandera para señalar que se esta cargando 
   * el componenete.
   */
  cargandoComponente :boolean = false;

  /**
   *  Emisor del evento de actualizacion de la lista.
   */
  updateSubject: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Bandera para indicar si fue seleccionado un registro. 
   */
   row_selected = false;

  /**
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado. 
   */
  async registroSeleccionadoEvt(row:any) {
    if (row) {
      this.row = row;
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
        this.modo = opcion.accion;
        break;
    }
  }

}
