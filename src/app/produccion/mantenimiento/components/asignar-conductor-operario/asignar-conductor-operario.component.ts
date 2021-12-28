import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { Component, OnInit } from '@angular/core';
import { ProcesoMantenimientoService } from 'src/app/core/services/proceso-mantenimiento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Relacion } from '../calendario-asignacion-co/realcion';
import { CalendarioAsignacionCoComponent } from '../calendario-asignacion-co/calendario-asignacion-co.component';

/**
 * Componenete para conductor u operario.
 */
@Component({
  selector: 'app-asignar-conductor-operario',
  templateUrl: './asignar-conductor-operario.component.html',
  styleUrls: ['./asignar-conductor-operario.component.scss']
})
export class AsignarConductorOperarioComponent implements OnInit {

  /**
   * Modo de visualizacion de la vista.
   */
  modo = 'salida';

  /**
   * Referencia al registro seleccionado en la lista.
   */
  row:any = null;

  /**
   * Relaciones asociadas al registro.
   */
   relaciones:Relacion[] = [];

  /**
   * Bandera para señalar que se esta cargando 
   * el componenete.
   */
  cargandoComponente :boolean = false;

  /**
   * Emisor del evento de actualizacion de la lista.
   */
  updateSubject: Subject<void> = new Subject<void>();

  /**
   * Constructor por defecto.
   */
  constructor(
    private procesoMantenimiento: ProcesoMantenimientoService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
  ) { }

  /**
   * Metodo de carga del componente.
   */
  ngOnInit(): void {}

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
      case 'nueva':
        this.row = opcion.row;
        this.modo = opcion.accion;
        break;
      case 'calendario':
        this.row = opcion.row;
        let resp = await this.procesoMantenimiento.consultarRelaciones(`id_equipo = ${this.row.id_equipo}`);
        if(resp && resp.codError == 0) {
          console.info("Relaciones:");
          console.info(resp.respuesta);
          if (resp.respuesta.length > 0) {
            this.relaciones = resp.respuesta;
            this.modo = opcion.accion;
          } else {
            this.handleError('El registro seleccionado no disponde de asignación.');
          }
        } else {
          this.handleError('No se pudo cargar las relaciones');
        }
        break;
      default:
        this.row = opcion.row;
        this.modo = opcion.accion;
        break;
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
   * Manejador del evento de confirmacion de 
   * almacenamiento del editor.
   * 
   * @param event Evento del editor.
   */
  async almacenado(asignacion: any) {
    //debugger;
    console.info('Asignacion:');
    console.info(asignacion);
    try {
      let full = false;
      let tipo = 1279;
      let errorFlag = false;
      let relacion:any = null;    
      let rule = false;
      let deltaA:number = 0;
      let deltaB:number = 0;
      let franIniA:Date = new Date();
      let franEndA:Date = new Date();
      let franIniB:Date = new Date();
      let franEndB:Date = new Date();
      let idRecurso:number = asignacion.conductor; 
      let fechaDesde:number = new Date(asignacion.fechas.desde).getTime();
      let fechaHasta:number = new Date(asignacion.fechas.hasta).getTime();
      let horaInicio:string = asignacion.hora_inicio;
      let horaFin:string = asignacion.hora_fin;
      //--------------------------------------------------
      // Obtiene la franja de persona
      let resp = await this.procesoMantenimiento.consultarFranjas(
        idRecurso, 
        fechaDesde, 
        fechaHasta, 
        horaInicio, 
        horaFin
      );
      if(resp && resp.codError == 0) {
        console.info("Franjas Persona:");
        console.info(resp.respuesta);
        let franjasPersona = resp.respuesta;
        //------------------------------------------------
        // Obtiene la franja de equipo
        idRecurso = asignacion.id_recurso_equipo; 
        fechaDesde = new Date(asignacion.fechas.desde).getTime();
        fechaHasta = new Date(asignacion.fechas.hasta).getTime();
        horaInicio = asignacion.hora_inicio;
        horaFin = asignacion.hora_fin;
        resp = await this.procesoMantenimiento.consultarFranjas(
          idRecurso, 
          fechaDesde, 
          fechaHasta, 
          horaInicio,
          horaFin
        );
        if(resp && resp.codError == 0) {
          console.info("Franjas Equipo:");
          console.info(resp.respuesta);
          let franjasEquipo = resp.respuesta;
          //----------------------------------------------
          // Obtiene la interseccion.
          full = false;
          let interseccion: {
            full: boolean; 
            franIni: string;
            franFin: string;
            idFranjaEquipo: any; 
            idFranjaPersona: any;
          }[] = [];
          //debugger;
          for(let i=0; i<franjasPersona.length; i++) {
            for(let j=0; j<franjasEquipo.length; j++) {
              franIniA = new Date(franjasPersona[i].fecha_inicio);
              franEndA = new Date(franjasPersona[i].fecha_fin);
              franIniB = new Date(franjasEquipo[j].fecha_inicio);
              franEndB = new Date(franjasEquipo[j].fecha_fin);
              deltaA = franjasPersona[i].fecha_fin - franjasPersona[i].fecha_inicio;
              deltaB = franjasEquipo[j].fecha_fin - franjasEquipo[j].fecha_inicio;
              //debugger;
              if (deltaA > deltaB) {
                rule = franIniB <= franIniA && franEndB >= franEndA;
              } else {
                rule = franIniA >= franIniB && franEndA <= franEndB;
              }
              //debugger;
              full = ((franIniB.getTime() == franIniA.getTime()) && (franEndB.getTime() == franEndA.getTime()));
              if (rule) {
                //debugger;
                interseccion.push({
                  full: full,
                  franIni: franIniB.toLocaleString(),
                  franFin: franEndB.toLocaleString(),
                  idFranjaPersona: franjasPersona[i].id_recurso_disponibilidad,
                  idFranjaEquipo: franjasEquipo[j].id_recurso_disponibilidad
                });
              }
            }
          }
          if (interseccion.length > 0) {
            let noExiste = true; 
            let msg = "Las siguientes franjas del equipo se asignarían de forma incompleta:\n";
            //--------------------------------------------
            // Envia mensaje de confirmacion
            let mensajeList = [];
            for(let i=0; i<interseccion.length; i++) {
              if (!interseccion[i].full) {
                noExiste = true;
                for(let j=0; j<mensajeList.length; j++) {
                  if (mensajeList[j].franIni == interseccion[i].franIni && mensajeList[j].franFin == interseccion[i].franFin) {
                    noExiste = false;
                    break;
                  }
                }
                if (noExiste){
                  msg += "[" + interseccion[i].franIni + " - " + interseccion[i].franFin + ']; \n';
                  mensajeList.push({
                    franIni: interseccion[i].franIni,
                    franFin: interseccion[i].franFin
                  });
                }
              }
            }
            if (msg == "Las siguientes franjas del equipo se asignarían de forma incompleta:\n") {
              msg = "Todas las franjas se asignarían de forma completa.";
            }
            let dialogRef = this.dialog.open(SimpleDialogComponent, {
              data: {
                titulo: 'Efectuar Asignación',
                contenido: msg + ' ¿Desea efectuar la asignación?',
                aceptar: true,
                cancelar: true,
                action: null
              }
            });
            dialogRef.afterClosed().subscribe(async result => {
              if (result && result.action == 'aceptar') {
                //----------------------------------------
                // Efectua la asignacion.
                if (asignacion.descripcion_tipo_rol && asignacion.descripcion_tipo_rol.includes('CONDUCTOR')) {
                  tipo = 1277;
                }
                for(let i=0; i<interseccion.length; i++) {
                  relacion = {
                    idRecursoDisponibilidad: interseccion[i].idFranjaEquipo,
                    idRecursoDisponibilidadRelacionado: interseccion[i].idFranjaPersona,
                    idPersona: asignacion.id_persona,
                    idTipoAsignacion: tipo
                  }
                  resp = await this.procesoMantenimiento.asignarRecurso(relacion);
                  if(resp && resp.codError == 0) {
                    console.info("[OK]: Franja registrada:", interseccion[i].idFranjaPersona, interseccion[i].idFranjaEquipo);
                  } else {
                    errorFlag = true;
                    console.info("[ERROR]: No se pudo registrar la franja:", interseccion[i].idFranjaPersona, interseccion[i].idFranjaEquipo);
                  }
                }
                // verifica el resultado de la operacion
                if (errorFlag) {
                  this.handleError('No se pudo efectuar la asignación');
                } else {
                  //this.modo = "salida";
                  this.opcionSeleccionadaEvt({row: this.row, accion: 'calendario'});
                  this.operationSuccess();
                }
              }
            });
          } else {
            this.handleError('No se pude efectuar la asignación no existen franjas disponibles');
          }
        }
      } else {
        let msg = '';
        if (resp) {
          msg = resp.msgError;
        }
        this.handleError(msg);
      }
    } catch(e) {
      console.log(e);
      this.handleError('');
    }
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
  
}
