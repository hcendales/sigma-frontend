import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { ProcesoMantenimientoService } from 'src/app/core/services/proceso-mantenimiento.service';
import { DialogoMotivoCancelacionComponent } from '../dialogo-motivo-cancelacion/dialogo-motivo-cancelacion.component';

/**
 * Componenete principal para programar mantenimientos de 
 * maquinarias o equipos.
 */
@Component({
  selector: 'app-programar',
  templateUrl: './programar.component.html',
  styleUrls: ['./programar.component.scss']
})
export class ProgramarComponent implements OnInit {

  /**
   * Referencia al registro seleccionado en la lista.
   */
  row:any = null;

  /**
   * Modo de visualizacion de la vista.
   */
  modo = 'salida';

  /**
   * Bandera para señalar que se esta cargando 
   * el componenete.
   */
  cargandoComponente :boolean = false;

  /**
   * Bandera para indicar si fue seleccionado un registro. 
   */
  row_selected = false;

  /**
   *  Emisor del evento de actualizacion de la lista.
   */
  updateSubject: Subject<void> = new Subject<void>();

  /**
   * Constructor del componente.
   * @param dialog Componenete de gestion de dialogos.
   * @param snackBar Componenete snack.
   * @param procesoMantenimiento Referencia al servicio de
   * proceso de mantenimiento.
   */
  constructor(
    public dialog: MatDialog,
    private snackBar:MatSnackBar,
    private procesoMantenimiento: ProcesoMantenimientoService
  ) {}

  /**
   * Metodo de carge de la vista.
   */
  ngOnInit(): void {}

  /**
   * Muestra mensaje de cargar.
   * @param titulo Titulo de mensaje.
   * @param footer Pie del mensaje.
   * @returns Accion correspondiente.
   */
  mostrarVentanaEnEspera(titulo:string, footer?:string){
    let data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }

  /**
   * oculta el dialogo de carge.
   */
  componenteListo() {
    this.cargandoComponente = false;
    this.dialog.closeAll();
  }

  /**
   * Manejador del evento de registro seleccionado.
   * @param id_equipo ID del equipo seleccionado. 
   */
  async registroSeleccionadoEvt(row:any) {
    if (row) {
      this.row = row;
      if (this.row.ingreso_como_fallo == 0 || !this.row.ingreso_como_fallo) {
        this.row_selected = true;
      } else {
        this.row_selected = false;
      }
    } else {
      this.row_selected = false;
    }
  }

  /**
   * Manejador de los eventos de la lista.
   * @param opcion Evento de la lista.
   */
  async opcionSeleccionadaEvt(opcion:any) {
    switch (opcion.accion) {
      case 'eliminar':
        let dialogRef = this.dialog.open(DialogoMotivoCancelacionComponent, {
          data: {motivo_cancelacion: ''}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.eliminar({
              id_mantenimiento_equipo: opcion.row.id_mantenimiento_equipo,
              descripcion: result
            });
          }
        });
        break;
      case 'finalizar':
        let dialogRef2 = this.dialog.open(SimpleDialogComponent, {
          data: {
            titulo: 'Finalizar el Mantenimiento',
            contenido: '¿Desea de finalizar el mantenimiento?',
            aceptar: true,
            cancelar: true,
            action: null
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result && result.action == 'aceptar') {
            this.finalizar({
              id_mantenimiento_equipo: opcion.row.id_mantenimiento_equipo
            });
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
   * Accion de nuevo registro.
   */
  nuevo() {
    this.modo = "nuevo";
  }

  /**
   * Manejador del evento de confirmacion de 
   * almacenamiento del editor.
   * 
   * @param event Evento del editor.
   */
  almacenado(event: any) {
    this.modo = "salida";
    this.row_selected = false;
  }

  /**
   * Metodo cncelar.
   */
  cancelarMotivo() {
    this.modo = "salida";
  }

  /**
   * Maneja la respuesta con exito de las peticiones.
   */
   operationSuccess() {
    this.snackBar.open('Operación realizada', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja el error de las peticiones.
   */
  handleError(msg:string) {
    this.snackBar.open('Error al realizar la consulta: ' + msg, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Metodo eliminar registro.
   * 
   * @param mantenimiento Registro de mantenimiento.
   */
  async eliminar(mantenimiento:any) {
    try {
      let respServ = await this.procesoMantenimiento.cancelarMantenimientoEquipo(mantenimiento);
      if(respServ && respServ.codError == 0) {
        this.operationSuccess();
        this.updateSubject.next();
      } else {
        let msg = '';
        if (respServ) {
          msg = respServ.msgError;
        }
        this.handleError(msg);
      }
    } catch(e) {
      console.log(e);
      this.handleError('');
    }
  }

  /**
   * Metodo de finalizar registro.
   * 
   * @param mantenimiento Metodo de finalizar registro.
   */
  async finalizar(mantenimiento:any) {
    try {
      let respServ = await this.procesoMantenimiento.finalizarMantenimientoEquipo(mantenimiento);
      if(respServ && respServ.codError == 0) {
        this.operationSuccess();
        this.updateSubject.next();
      } else {
        let msg = '';
        if (respServ) {
          msg = respServ.msgError;
        }
        this.handleError(msg);
      }
    } catch(e) {
      console.log(e);
      this.handleError('');
    }
  }
}
