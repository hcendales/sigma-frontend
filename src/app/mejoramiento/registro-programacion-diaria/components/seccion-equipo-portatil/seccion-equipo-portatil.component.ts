import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { maquinariaCrud, maquinariaCrudSchema } from 'src/app/core/models/registro-programacion-diaria';
import { RegistroProgramacionDiariaService } from 'src/app/core/services/registro-programacion-diaria.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-equipo-portatil',
  templateUrl: './seccion-equipo-portatil.component.html',
  styleUrls: ['./seccion-equipo-portatil.component.scss']
})
export class SeccionEquipoPortatilComponent implements OnInit {
  dataSchema: any = maquinariaCrudSchema;
  dataSource = new MatTableDataSource<maquinariaCrud>();
  displayedColumns: string[] = Object.keys(maquinariaCrudSchema);
  idMantenimientoVial: number = 0
  @Input() listas: any[] = [];
  @Input() unidadEjecutora: any[] = [];

  pageSize = 20;
  readyRol: boolean = false;
  idProgramacionDiaria: number = 0;
  descripcion_maquina: string = "";
  listaOrigen: any[] = [];
  listaClase: any[] = [];
  listaClases: any[] = [];
  listaEquipo: any[] = [];
  listaEquipos: any[] = [];
  listaMovil: any[] = [];
  listaMoviles: any[] = [];


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
    this.listaOrigen = this.getListas(this.listas[2], 'ninguno', 'id_tipo_origen_equipo', 'descripcion_origen_equipo');
    this.listaClase = this.getListas(this.listas[2], 'id_tipo_origen_equipo', 'id_tipo_clase_equipo', 'descripcion_clase_equipo').filter(e => e.id_tipo === 14241);
    this.listaEquipo = this.getListas(this.listas[2], 'id_tipo_clase_equipo', 'id_tipo_equipo', 'descripcion_tipo_equipo').filter(e => e.id_tipo === 14254 || e.id_tipo === 149);;
    this.listaMovil = this.getListas(this.listas[2], 'id_tipo_equipo', 'movil', 'movil');


    //console.log(this.listas[2], this.listaOrigen, this.listaClase, this.listaEquipo);

  }


  getListas(listaEquipos: any, id_join: string, id_tipo: string, descripcion: string) {
    const lista: any[] = listaEquipos.map((e: any) => {
      let dato: any = {};
      dato["id_join"] = e[id_join];
      dato["id_tipo"] = e[id_tipo];
      dato["descripcion"] = e[descripcion];
      return dato;
    });
    return [...new Map(lista.map(obj => [JSON.stringify(obj), obj])).values()];
  }


  updateListaClase(elemen: any) {
    this.listaClases = this.listaClase.filter((e: any) => e.id_join === elemen.id_tipo_origen);
    this.descripcion_maquina = ""
    console.log(this.listaClases)
  }


  updateListaEquipo(elemen: any) {
    this.listaEquipos = this.listaEquipo.filter((e: any) => e.id_join === elemen.id_tipo_clase_equipo);
    this.descripcion_maquina = ""
    console.log(this.listaEquipos)
  }

  updateListaMovil(elemen: any) {
    this.listaMoviles = this.listaMovil.filter((e: any) => e.id_join === elemen.id_tipo_equipo);
    this.descripcion_maquina = ""
    console.log(this.listaMoviles)
  }

  updateDescripcionMaquina(elemen: any) {
    const dato = this.listas[2].find((e: any) => e.movil === elemen.movil)
    console.log(dato.descripcion == "", dato.descripcion)
    this.descripcion_maquina = dato.descripcion == undefined ? "NO HAY DESCRIPCION" : dato.descripcion.toString().toUpperCase().trim();
  }


  /**Busca los registros existentes asociados al id mantenimiento */
  searchDataTable(id: number = this.idProgramacionDiaria) {
    this.progDiariaService.getMaquinaria("id_programacion_diaria = " + id).subscribe((res: any) => {
      res.respuesta = res.respuesta.sort((a: any, b: any) => (a.id_progdiaria_maquinaria > b.id_progdiaria_maquinaria ? -1 : 1))
      this.dataSource.data = res.respuesta;
      this.dataSource.paginator = this.paginator;
    })
  }

  /**Nueva Fila Obtiene los campos por defectos */
  addRow() {
    const newRow: maquinariaCrud = {
      id_progdiaria_maquinaria: 0,
      id_programacion_diaria: this.idProgramacionDiaria,
      id_tipo_clase_equipo: 0,
      descripcion_clase_equipo: '',
      id_tipo_equipo: 0,
      descripcion_tipo_equipo: '',
      id_tipo_origen: 0,
      descripcion_tipo_origen: '',
      cantidad: 1,
      hora: '',
      movil: '',
      id_tipo_unidadejecutora: 0,
      nombre_unidadejecutora: '',
      descripcion_maquina: '',
      isEdit: true,
      isSelected: false,
    }
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  /**Edicion de la fila seleccionada */
  editRow(row: maquinariaCrud) {

    if (row.id_progdiaria_maquinaria === 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.progDiariaService.addMaquinaria(row).subscribe((res: any) => {
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
            this.progDiariaService.updateMaquinaria(row).subscribe((res: any) => {
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
          this.progDiariaService.deleteRowMaquinaria(id).subscribe((r: any) => {
            if (r.codError === 0) {
              this.dataSource.data = this.dataSource.data.filter((u: maquinariaCrud) => u.id_progdiaria_maquinaria !== id);
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
    const maquinaria = this.dataSource.data.filter((u: maquinariaCrud) => u.isSelected);

    if (maquinaria.length === 0) {
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
          this.progDiariaService.deleteRowsMaquinaria(maquinaria).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter((u: maquinariaCrud) => !u.isSelected);
            this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          });
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

}
