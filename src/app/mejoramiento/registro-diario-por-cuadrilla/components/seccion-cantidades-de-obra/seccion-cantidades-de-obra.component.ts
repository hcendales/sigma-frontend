import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { CantidadObra, CantidadObraSchema } from 'src/app/core/models/registro-diario-por-cuadrilla';
import { ProgramacionDiariaCuadrillaService } from 'src/app/core/services/programacion-diaria-cuadrilla.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-cantidades-de-obra',
  templateUrl: './seccion-cantidades-de-obra.component.html',
  styleUrls: ['./seccion-cantidades-de-obra.component.scss']
})
export class SeccionCantidadesDeObraComponent implements OnInit {

  dataSchema: any = CantidadObraSchema;
  dataSource = new MatTableDataSource<CantidadObra>();
  displayedColumns: string[] = Object.keys(CantidadObraSchema);
  idMantenimientoVial: number = 0
  pageSize = 5;
  readyRol: boolean = false;
  listas_personas: any[] = [];
  loading: boolean = false;
  idCuadrilla: number = 0;
  
  @Input() listas: any[] = [];
  @Input() set idInforme(id: number) {
    if (id > 0) {
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
    private snackBar: MatSnackBar,
  ) { }

  async ngOnInit() {

    /**Id de la URL */
    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimientoVial = +params['id']; });

    //console.log(this.listas)
  }

  /**Busca los registros existentes asociados al id mantenimiento */
  searchDataTable(id: number = this.idCuadrilla) {
    this.service.CantidadObra_consultarXFiltro("id_informe_diario_cuadrilla = " + id).subscribe((res: any) => {
      res.respuesta = res.respuesta.reverse();
      this.dataSource.data = res.respuesta;
      this.dataSource.paginator = this.paginator;
    })
  }

  /**Nueva Fila Obtiene los campos por defectos */
  addRow() {
    const newRow: CantidadObra = {
      id_infdiacua_cant_obra: 0,
      id_informe_diario_cuadrilla: this.idCuadrilla,
      id_tipo_actividad: 0,
      descripcion_tipo_actividad: '',
      id_tipo_material: 0,
      descripcion_tipo_material: '',
      id_tipo_clase_material: 0,
      descripcion_clase_material: '',
      id_tipo_unidad_medida: 0,
      descripcion_unidad_medida: '',
      cantidad: 0,
      largo: 0,
      ancho: 0,
      espesor: 0,
      volumen_material_compacto: 0,
      porcentaje_compactacion: 0,
      manual: '',
      mecanica: '',
      isEdit: true,
      isSelected: false
    }
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }


  /**Edicion de la fila seleccionada */
  editRow(row: CantidadObra) {

    if (row.id_infdiacua_cant_obra === 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.service.CantidadObra_insertar(row).subscribe((res: any) => {
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
            this.service.CantidadObra_actualizar(row).subscribe((res: any) => {
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
          this.service.CantidadObra_eliminar(id).subscribe((r: any) => {
            if (r.codError === 0) {
              this.dataSource.data = this.dataSource.data.filter((u: CantidadObra) => u.id_infdiacua_cant_obra !== id);
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
    const campos = this.dataSource.data.filter((u: CantidadObra) => u.isSelected);

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
          this.service.CantidadObra_eliminar_varios(campos).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter((u: CantidadObra) => !u.isSelected);
            this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          });
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

}
