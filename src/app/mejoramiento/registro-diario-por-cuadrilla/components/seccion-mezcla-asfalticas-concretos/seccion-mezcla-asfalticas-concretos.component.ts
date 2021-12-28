import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { Mezcla, MezclaSchema } from 'src/app/core/models/registro-diario-por-cuadrilla';
import { ProgramacionDiariaCuadrillaService } from 'src/app/core/services/programacion-diaria-cuadrilla.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-mezcla-asfalticas-concretos',
  templateUrl: './seccion-mezcla-asfalticas-concretos.component.html',
  styleUrls: ['./seccion-mezcla-asfalticas-concretos.component.scss']
})
export class SeccionMezclaAsfalticasConcretosComponent implements OnInit {


  dataSchema: any = MezclaSchema;
  dataSource = new MatTableDataSource<Mezcla>();
  displayedColumns: string[] = Object.keys(MezclaSchema);
  idMantenimientoVial: number = 0
  pageSize = 5;
  readyRol: boolean = false;
  loading: boolean = false;
  idCuadrilla: number = 0;
  listas_personas: any[] = [];

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

    //console.log("~>",this.listas)
  }

  /**Busca los registros existentes asociados al id mantenimiento */
  searchDataTable(id: number = this.idCuadrilla) {
    this.service.mezcla_consultarXFiltro("id_informe_diario_cuadrilla = " + id).subscribe((res: any) => {
      this.dataSource.data = res.respuesta;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  /**Nueva Fila Obtiene los campos por defectos */
  addRow() {
    const newRow: Mezcla = {
      id_infdiacua_mezcla_conc: 0,
      id_informe_diario_cuadrilla: this.idCuadrilla,
      id_tipo_material: 0,
      descripcion_tipo_material: '',
      id_tipo_clase_material: 0,
      descripcion_clase_material: '',
      movil: '',
      placa: '',
      volumen: 0,
      numero_recibo: '',
      id_archivo_recibo: null,
      hora_entrada: '',
      hora_instalacion: '',
      hora_salida: '',
      abcsisa_inicio: 0,
      abcsisa_final: 0,
      abcsisa_carril: 0,
      temperatura_recibo: 0,
      temperatura_llegada: 0,
      temperatura_extendido: 0,
      temperatura_compactacion: 0,
      isEdit: true,
      isSelected: false
    }
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  /**Edicion de la fila seleccionada */
  editRow(row: Mezcla) {

    if (row.id_infdiacua_mezcla_conc === 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.service.mezcla_insertar(row).subscribe((res: any) => {
              if (res.codError === 0) {
                this.searchDataTable();
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
            this.service.mezcla_actualizar(row).subscribe((res: any) => {
              if (res.codError === 0) {
                this.searchDataTable();
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
          this.service.mezcla_eliminar(id).subscribe((r: any) => {
            if (r.codError === 0) {
              this.dataSource.data = this.dataSource.data.filter((u: Mezcla) => u.id_infdiacua_mezcla_conc !== id);
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
    const campos = this.dataSource.data.filter((u: Mezcla) => u.isSelected);

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
          this.service.mezcla_eliminar_varios(campos).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter((u: Mezcla) => !u.isSelected);
            this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          });
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

}
