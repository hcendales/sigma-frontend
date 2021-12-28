import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { Personal, PersonalSchema, Personas } from 'src/app/core/models/registro-diario-por-cuadrilla';
import { ProgramacionDiariaCuadrillaService } from 'src/app/core/services/programacion-diaria-cuadrilla.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-informacion-del-personal',
  templateUrl: './seccion-informacion-del-personal.component.html',
  styleUrls: ['./seccion-informacion-del-personal.component.scss'],
  providers: [DatePipe]
})
export class SeccionInformacionDelPersonalComponent implements OnInit {

  dataSchema: any = PersonalSchema;
  dataSource = new MatTableDataSource<Personal>();
  displayedColumns: string[] = Object.keys(PersonalSchema);
  idMantenimientoVial: number = 0
  pageSize = 5;
  readyRol: boolean = false;
  idCuadrilla: number = 0; 
  listas_personas: any[] = [];
  loading : boolean = false;
  telefono : string = "";
  correo : string = ""
  @Input() listas: any[] = [];
  @Input() set idInforme(id : number){
    if (id > 0){ 
      this.loading = true; 
      this.idCuadrilla = id;
      this.searchDataTable(this.idCuadrilla);
    }
  }
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: ProgramacionDiariaCuadrillaService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private snackBar: MatSnackBar,
  ) { }

  async ngOnInit() {

    /**Id de la URL */
    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimientoVial = +params['id']; });
    //console.log(this.listas)
  }

  /**Busca los registros existentes asociados al id mantenimiento */
  searchDataTable(id: number = this.idCuadrilla) {
    this.service.personal_consultarXFiltro("id_informe_diario_cuadrilla = " + id).subscribe((res: any) => {
      
      res.respuesta = res.respuesta.map((element:any) => {
        element['horario_llegada'] = this.datePipe.transform(element.horario_llegada, 'yyyy-MM-dd') + 'T05:00:00.000Z';
        element['horario_salida'] = this.datePipe.transform(element.horario_salida, 'yyyy-MM-dd') + 'T05:00:00.000Z';
        return element;
      });

      res.respuesta = res.respuesta.reverse();
      this.dataSource.data = res.respuesta;
      this.dataSource.paginator = this.paginator;
    })
  }

  /**Nueva Fila Obtiene los campos por defectos */
  addRow() {
    const newRow: Personal = {
      id_infdiacua_personal: 0,
      id_informe_diario_cuadrilla: this.idCuadrilla,
      id_tipo_horario: 0,
      descripcion_tipo_horario: '',
      id_persona: 0,
      identificacion: '',
      nombre: '',
      id_tipo_cargo: 0,
      descripcion_cargo: '',
      id_tipo_rol: 0,
      descripcion_rol: '',
      telefono: null,
      email: null,
      id_tipo_categoria_persona: 0,
      descripcion_categoria_persona: '',
      horario_llegada: 0,
      horario_salida: 0,
      observaciones: '',
      isEdit: true,
      isSelected: false
    }
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  isValidRol(element: any) {
    this.listas_personas = this.listas[1].filter((e: Personas) => e.id_tipo_rol === element.id_tipo_rol)
    this.correo = element.email
    this.telefono = element.telefono
    return element
  }
  getCampos(element: any){
    //console.log(element, this.dataSource.data);
    const persona = this.listas[1].filter((e: Personas) => e.id_persona === element.id_persona)
    //console.log(persona)
    this.telefono = persona[0].telefono;
    this.dataSource.data[0].telefono = persona[0].telefono
    this.correo = persona[0].email;
    this.dataSource.data[0].email = persona[0].email
  }

  /**Edicion de la fila seleccionada */
  editRow(row: Personal) {

    if (row.id_infdiacua_personal === 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.service.personal_insertar(row).subscribe((res: any) => {
              if (res.codError === 0) {
                this.searchDataTable(this.idCuadrilla);
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
            this.service.personal_actualizar(row).subscribe((res: any) => {
              if (res.codError === 0) {
                this.searchDataTable(this.idCuadrilla);
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
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        accion: "E",
        mensaje: "Confirmar que desea Eliminar la fila seleccionadas"
      }
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        try {
          this.service.personal_eliminar(id).subscribe((r: any) => {
            if (r.codError === 0) {
              this.dataSource.data = this.dataSource.data.filter((u: Personal) => u.id_infdiacua_personal !== id);
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
    const campos = this.dataSource.data.filter((u: Personal) => u.isSelected);

    if (campos.length === 0) {
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
          this.service.personal_eliminar_varios(campos).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter((u: Personal) => !u.isSelected);
            this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          });
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

}
