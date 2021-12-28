import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { progDiariaCrud, progDiariaCrudSchema } from 'src/app/core/models/registro-programacion-diaria';
import { RegistroProgramacionDiariaService } from 'src/app/core/services/registro-programacion-diaria.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-programacion-diaria',
  templateUrl: './seccion-programacion-diaria.component.html',
  styleUrls: ['./seccion-programacion-diaria.component.scss'],
  providers: [DatePipe]
})
export class SeccionProgramacionDiariaComponent implements OnInit {

  dataSchema: any = progDiariaCrudSchema;
  dataSource = new MatTableDataSource<progDiariaCrud>();
  displayedColumns: string[] = Object.keys(progDiariaCrudSchema);
  idMantenimientoVial : number = 0;
  pageSize = 20;
  checkList : any;

  /**Error de tiempo y jornada Para usar la directiva  */
  errorRN : string = '' ; 
  hideErrorRN : boolean = false;

  @Input() listas: any;
  @Input() persona: any
  @Output() viewForm = new EventEmitter();
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  minDate = new Date(Date.now());
  listaEstadoProgramacion : any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private progDiariaService: RegistroProgramacionDiariaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  async ngOnInit() {

    /**Id de la URL */
    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimientoVial = +params['id']; });
    this.searchDataTable(this.idMantenimientoVial);

    //console.log("~~~>",this.persona)
    //console.log("~~~>",this.persona)
  }
  regresar() {
    this.router.navigate(['dashboard/mejoramiento-registro-programacion-diaria/1775']);
  }

  /**Busca los registros existentes asociados al id mantenimiento */
  searchDataTable(id: number = this.idMantenimientoVial) {
    this.progDiariaService.getProgDiaria("id_mantenimiento_vial = " + id).subscribe((res: any) => {

      res.respuesta.sort((a: any, b: any) => (a.id_programacion_diaria < b.id_programacion_diaria) ? 1 : ((b.id_programacion_diaria < a.id_programacion_diaria) ? -1 : 0));
      res.respuesta = res.respuesta.map((dato: any) => {
        dato.fecha = dato.fecha ? this.datePipe.transform(dato.fecha, 'yyyy-MM-dd') : dato
        //dato.fecha = dato.fecha ? this.datePipe.transform(dato.fecha, 'dd-MM-yyyy') : dato
        return dato;
      });

      this.dataSource.data = res.respuesta;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  /**Nueva Fila Obtiene los campos por defectos */
  addRow() {
    const newRow: progDiariaCrud = {
      observaciones: "",
      isSelected: false,
      isEdit: true,
      id_tipo_jornada: 0,
      id_tipo_estado_programacion: 0,
      id_programacion_diaria: 0,
      id_mantenimiento_vial: this.idMantenimientoVial,
      hora_trabajo_hasta: "",
      hora_trabajo_desde: "",
      fecha: 0,
      descripcion_jornada: '',
      descripcion_estado_programacion: '',
      viewElement: true,
      id_persona_elabora: this.persona.id_persona
    }
    this.estProgramacionRN(true);
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  /**
   * estProgramacionRN Regala de negocio
   * listaEstadoProgramacion: Si crear registro la lista solo debe tener estado Borrador
   */
  estProgramacionRN(e : boolean){
    if (e) this.listaEstadoProgramacion = this.listas[124].filter((e: any) => e.id_tipo === 1336)
    else this.listaEstadoProgramacion = this.listas[124];
  }

  /**
   * Validaciones generales de reglas de negocio
   * @param row progDiariaCrud
   */
  esFilaValida(row: progDiariaCrud){
    return this.esJornadaValida(row.fecha, row.id_tipo_jornada, row.hora_trabajo_desde, row.hora_trabajo_hasta)
  }

  validRol(element:any){
    console.log(element, this.persona); element.isEdit = !element.isEdit;
    //if (element.id_persona_elabora === this.persona.id_persona)element.isEdit = !element.isEdit;
    //else this.snackBar.open("Solo puede editar la misma persona que creo el archivo", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  /**contiene 2 Validaciones
   * 1ra si el rango de tiempo es correcto 
   * @return 001
   * 
   * 2da si esta dentro de la jornada valida
   * @return 002
   * 
   * @return 999 Todo OK
   */
  esJornadaValida(fecha : number, jornada : number = 0, desde : any, hasta : any){
    let isValid : string = '999';

    
    const event = new Date(fecha);
    const valJornada: any = [
      { jornada: 1331, ini: '5:00', fin: '18:00'}, ///Diurna
      { jornada: 1332, ini: '18:00', fin: '5:00'}  ///Nocturna
    ];
    const rnJornada = valJornada.find((e: any) => e.jornada === jornada)

    const pini = this.toSeconds(rnJornada.ini);
    const pfin = this.toSeconds(rnJornada.fin);
    const mdesde = this.toSeconds(desde);
    const mhasta = this.toSeconds(hasta);
    
    if (jornada === 1331 && mdesde < pini)             isValid = '001'
    else if (jornada === 1331 && (mdesde > mhasta))    isValid = '002'
    else if (jornada === 1331 && (mhasta > pfin))      isValid = '003'
    else if (jornada === 1331 && (mdesde > mhasta))    isValid = '004'
    else if (jornada === 1332 && (mdesde > mhasta))    isValid = '005'
    else if (jornada === 1332 && mhasta < 43200 && (mdesde > pini))      isValid = '006'
    else if (jornada === 1332 && mhasta < 43200 && (mhasta < pfin))      isValid = '007'


    //console.log(isValid, mdesde, pini, mhasta, pfin)



    return isValid
  }

  /**convierte a segundos */
  toSeconds(time : any ){
    let hrs: number = time.split(':')[0];
    let min: number = time.split(':')[1];
    return hrs * 3600 + min * 60;
  }

  /**Edicion de la fila seleccionada */
  editRow(row: progDiariaCrud) {
   
    this.hideErrorRN = true
    const esFilaValida = this.esFilaValida(row);

    if (esFilaValida !== '999'){
      let msgError : string = ""
      switch (esFilaValida) {
        case '001': 
          msgError = "Error, Rango de tiempo es incorrecto";
          break;
        case '002':
          msgError = "Error, Rango de tiempo es incorrecto";
          break;
        case '003':
          msgError = "Error, Seleccion de Jornada es incorrecta con la Hora desde y Hora hasta";
          break;
        default:
          msgError = "Error no esperado, valide los parametros ingresados e intente nuevamente";
          break;
      }
      this.errorRN = esFilaValida + "|" + msgError;
      this.snackBar.open( msgError , 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return 
    }



    if (row.id_programacion_diaria === 0) {

      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.progDiariaService.copyProgDiaria(row).subscribe((res: any) => {
              if (res.codError === 0) {
                //this.progDiariaService.copyProgDiaria(row).subscribe((e:any) => {
                  this.searchDataTable(this.idMantenimientoVial);
                  this.checkList = false;
                  this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
                //});
              } else {
                this.snackBar.open("Error, no se logro complear la accion solicitada: " + res.msgError, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
              }
            });
          } catch (error) {
            this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          }
        }
      });

    } else {

      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "A",
          mensaje: "Confirmar que desea Actualizar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.progDiariaService.updateProgDiaria(row).subscribe((res: any) => {
              row.id_persona_elabora = this.persona.id_tipo_rol;
              if (res.codError === 0) {
                this.viewForm.emit(0);
                this.checkList = false;
                this.searchDataTable(this.idMantenimientoVial);
                this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
              } else {
                this.snackBar.open("Error, no se logro complear la accion solicitada: " + res.msgError, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
              }
            });
          } catch (error) {
            this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          }
        }
      });

    }
  }

  /**Elimina una fila */
  removeRow(id: number) {
    const progDiaria : any = {}
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        accion: "E",
        mensaje: "Confirmar que desea Eliminar la fila seleccionadas"
      }
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        try {
          this.progDiariaService.deleteRow(id).subscribe((r: any) => {
            if (r.codError === 0) {
              progDiaria.id_programacion_diaria = 0;
              this.viewForm.emit(progDiaria);
              this.checkList = false;
              this.dataSource.data = this.dataSource.data.filter((u: progDiariaCrud) => u.id_programacion_diaria !== id);
              this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
            } else {
              this.snackBar.open("Error, no se logro complear la accion solicitada: " + r.msgError, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
            }
          })
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        } 
      }
    });
  }

  /**Elimina varias filas seleccionadas */
  removeSelectedRows() {
    const progDiaria : any = this.dataSource.data.filter((u: progDiariaCrud) => u.isSelected);

    if(progDiaria.length === 0){
      this.snackBar.open("Error, por favor seleccione registros en la grilla de datos ", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return
    }
    const dialogRef = this.dialog.open(DialogConfirmComponent,{
      data: {
        accion: "E",
        mensaje: "Confirmar que desea Eliminar las filas seleccionadas"
      }
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        try {
          this.progDiariaService.deleteRows(progDiaria).subscribe((r: any) => {
            this.dataSource.data = this.dataSource.data.filter((u: progDiariaCrud) => !u.isSelected);
            this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          });
          setTimeout(() => {
            progDiaria.id_programacion_diaria = 0;
            this.viewForm.emit(progDiaria);
            this.checkList = false;
          }, 1000);
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }


  asociarForm(element: any){
    this.viewForm.emit(element);

    if (element.id_tipo_estado_programacion === 1336) this.checkList = element;
  }

  registrar(){
    this.checkList['id_tipo_estado_programacion'] = 1337;
    this.editRow(this.checkList);
  }

}
