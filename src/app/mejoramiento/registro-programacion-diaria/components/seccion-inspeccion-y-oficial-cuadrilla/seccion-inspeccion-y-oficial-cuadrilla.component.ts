import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params } from '@angular/router';
import { RegistroProgramacionDiariaService } from 'src/app/core/services/registro-programacion-diaria.service';
import { personalCrud, personalCrudSchema } from 'src/app/core/models/registro-programacion-diaria';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Personas } from 'src/app/core/models/registro-diario-por-cuadrilla';

@Component({
  selector: 'app-seccion-inspeccion-y-oficial-cuadrilla',
  templateUrl: './seccion-inspeccion-y-oficial-cuadrilla.component.html',
  styleUrls: ['./seccion-inspeccion-y-oficial-cuadrilla.component.scss']
})
export class SeccionInspeccionYOficialCuadrillaComponent implements OnInit {

  dataSchema: any = personalCrudSchema;
  dataSource = new MatTableDataSource<personalCrud>();
  displayedColumns: string[] = Object.keys(personalCrudSchema);
  idMantenimientoVial: number = 0
  @Input() listas: any[] = [];
  pageSize = 20;
  readyRol: boolean = false;
  idProgramacionDiaria: number = 0
  listas_personas: any[] = [];
  @Output() unidadEjecutora = new EventEmitter();
  @Input() set programacion_diaria(row: any) {
    if (row !== undefined) {
      this.idProgramacionDiaria = row.id_programacion_diaria;
      this.searchDataTable(this.idProgramacionDiaria);
    }
  }

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private progDiariaService: RegistroProgramacionDiariaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  async ngOnInit() {

    /**Id de la URL */
    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimientoVial = +params['id']; });

    this.isValidRol();
  }

  /**Busca los registros existentes asociados al id mantenimiento */
  searchDataTable(id: number = this.idProgramacionDiaria) {
    this.progDiariaService.getPersonal("id_programacion_diaria = " + id).subscribe((res: any) => {
      console.log("~>>>",this.dataSource.data) 
      this.dataSource.data = res.respuesta;
      this.unidadEjecutora.emit(res.respuesta)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  /**Nueva Fila Obtiene los campos por defectos */
  addRow() {
    const newRow: personalCrud = {
      cantidad: 1,
      descripcion_origen: '',
      descripcion_rol: '',
      id_progdiaria_personal: 0,
      id_programacion_diaria: this.idProgramacionDiaria,
      id_tipo_origen: 361,
      id_tipo_rol: 4786,
      isEdit: true,
      isSelected: false,
      id_persona: 0,
      identificacion: ''
    }
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  /**Edicion de la fila seleccionada */
  editRow(row: personalCrud) {

    if (!this.isValid(row)) return 

    if (row.id_progdiaria_personal === 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.progDiariaService.addPersonal(row).subscribe((res: any) => {
              if (res.codError === 0) {
                this.searchDataTable(this.idProgramacionDiaria);
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
            this.progDiariaService.updatePersonal(row).subscribe((res: any) => {
              if (res.codError === 0) {
                this.searchDataTable(this.idProgramacionDiaria);
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

  isValid(row: personalCrud) {

    if (row.id_tipo_origen === null || row.id_tipo_origen === 0 || row.id_tipo_origen === undefined) {
      this.snackBar.open("Error, es requerido el Origen", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.id_tipo_rol === null || row.id_tipo_rol === 0 || row.id_tipo_rol === undefined){
      this.snackBar.open("Error, es requerido el Rol", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.id_persona === null || row.id_persona === 0 || row.id_persona === undefined){
      this.snackBar.open("Error, es requerido el Nombre", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    }else {
      return true;
    }

  }

  isValidRol(element: number = 4786) {
    //console.log(element);
    this.listas_personas = this.listas[1].filter((e: Personas) => e.id_tipo_rol === 4786)
    return element
  }

  /**Elimina una fila */
  removeRow(id: number) {

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        accion: "E",
        mensaje: "Confirmar que desea Eliminar la fila seleccionadas"
      }
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        try {
          this.progDiariaService.deleteRowPersonal(id).subscribe((r: any) => {
            if (r.codError === 0) {
              this.dataSource.data = this.dataSource.data.filter((u: personalCrud) => u.id_progdiaria_personal !== id);
              this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
            } else {
              this.snackBar.open("Error, no se logro complear la accion solicitada: " + r.msgError, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
            }
          });
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

  /**Elimina varias filas seleccionadas */
  removeSelectedRows() {

    const personal = this.dataSource.data.filter((u: personalCrud) => u.isSelected);

    if (personal.length === 0) {
      this.snackBar.open("Error, por favor seleccione registros en la grilla de datos ", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return
    }
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        accion: "E",
        mensaje: "Confirmar que desea Eliminar las filas seleccionadas"
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        try {
          this.progDiariaService.deleteRowsPersonal(personal).subscribe((r: any) => {
            this.dataSource.data = this.dataSource.data.filter((u: personalCrud) => !u.isSelected);
            this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          });
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }
}
