import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { materialCrud, materialCrudSchema } from 'src/app/core/models/registro-programacion-diaria';
import { RegistroProgramacionDiariaService } from 'src/app/core/services/registro-programacion-diaria.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-material',
  templateUrl: './seccion-material.component.html',
  styleUrls: ['./seccion-material.component.scss']
})
export class SeccionMaterialComponent implements OnInit {

  dataSchema: any = materialCrudSchema;
  dataSource = new MatTableDataSource<materialCrud>();
  displayedColumns: string[] = Object.keys(materialCrudSchema);

  /**Listado de tablas listas */
  @Input() listas: any[] = [];
  @Input() unidadEjecutora: any[] =[];

  /**Listado Clase Material <Mutable> */
  listaClase: any[] = [];

  pageSize = 20;
  idProgramacionDiaria: number = 0
  idMantenimientoVial: number = 0
  descrUnidadMedida: string = "";
  listaUnidadMedida: any[] =[];

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
    this.listaClase = this.listas[3];
  }



  updateListaMaterial(elemen: any){
    
    elemen.id_tipo_material = 0
    elemen.id_tipo_clase_material = 0
    this.descrUnidadMedida = ""
    this.listaUnidadMedida = [];
    elemen.id_tipo_unidad_medida = 0;
    elemen.id_tipo_unidadejecutora = 0;
  }

  updateListaClase(elemen : any){
    this.listaClase = this.listas[3].filter((e: any) => e.id_tipo_material === elemen.id_tipo_material);
    this.descrUnidadMedida = ""
    this.listaUnidadMedida = [];
    elemen.id_tipo_unidadejecutora = 0
  }

  updateUnidadMedida(element: any) {
    
    this.listaUnidadMedida = this.listas[3].filter((e: any) => e.id_tipo_clase_material === element.id_tipo_clase_material);
    this.descrUnidadMedida = this.listaUnidadMedida[0].desc_unidad_medida == undefined ? "NO HAY DESCRIPCION" : this.listaUnidadMedida[0].desc_unidad_medida.toString().toUpperCase().trim();
  }

  /**Busca los registros existentes asociados al id mantenimiento */
  searchDataTable(id: number = this.idProgramacionDiaria) {
    this.progDiariaService.getMaterial("id_programacion_diaria = " + id).subscribe((res: any) => {
      res.respuesta = res.respuesta.sort((a: any, b: any) => (a.id_progdiaria_material > b.id_progdiaria_material ? -1 : 1))
      this.dataSource.data = res.respuesta;
      this.dataSource.paginator = this.paginator;
    })
  }

  /**Nueva Fila Obtiene los campos por defectos */
  addRow() {
    const newRow: materialCrud = {
      id_progdiaria_material: 0,
      id_programacion_diaria: this.idProgramacionDiaria,
      id_tipo_material: 0,
      descripcion_tipo_material: '',
      id_tipo_clase_material: 0,
      descripcion_clase_material: '',
      id_tipo_origen: 0,
      descripcion_origen: '',
      cantidad: 1,
      id_tipo_unidad_medida: 0,
      descripcion_unidad_medida: '',
      hora: '',
      isEdit: true,
      isSelected: false,
      id_tipo_unidadejecutora: 0,
      nombre_unidadejecutora: ''
    }
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  /**Edicion de la fila seleccionada */
  editRow(row: materialCrud) {

    if (row.id_tipo_clase_material > 0) row.id_tipo_unidad_medida = this.listaUnidadMedida[0].id_tipo_unidad_medida;
    if (!this.isValid(row)) return

    if (row.id_progdiaria_material === 0) {

      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.progDiariaService.addMaterial(row).subscribe((res: any) => {
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
            this.progDiariaService.updateMaterial(row).subscribe((res: any) => {
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


  isValid(row: materialCrud) {

    

    if (row.id_tipo_origen === null || row.id_tipo_origen === 0 || row.id_tipo_origen === undefined) {
      this.snackBar.open("Error, es requerido el ORIGEN", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.id_tipo_clase_material === null || row.id_tipo_clase_material === 0 || row.id_tipo_clase_material === undefined) {
      this.snackBar.open("Error, es requerido la CLASE", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.id_tipo_material === null || row.id_tipo_material === 0 || row.id_tipo_material === undefined) {
      this.snackBar.open("Error, es requerido TIPO", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.cantidad === null || row.cantidad <= 0 || row.cantidad === undefined) {
      this.snackBar.open("Error, es requerido la CANTIDAD", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.id_tipo_unidad_medida === null || row.id_tipo_unidad_medida === 0 || row.id_tipo_unidad_medida === undefined) {
      this.snackBar.open("Error, es requerido la UNIDAD", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.id_tipo_unidadejecutora === null || row.id_tipo_unidadejecutora === 0 || row.id_tipo_unidadejecutora === undefined) {
      this.snackBar.open("Error, es requerido el UE", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else if (row.hora === null || row.hora === "" || row.hora === undefined) {
      this.snackBar.open("Error, es requerido el HORA", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return false;
    } else {
      return true;
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
          this.progDiariaService.deleteRowMaterial(id).subscribe((r: any) => {
            if (r.codError === 0) {
              this.dataSource.data = this.dataSource.data.filter((u: materialCrud) => u.id_progdiaria_material !== id);
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
    const material = this.dataSource.data.filter((u: materialCrud) => u.isSelected);
    if (material.length === 0) {
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
          this.progDiariaService.deleteRowsMaterial(material).subscribe((r: any) => {
            this.dataSource.data = this.dataSource.data.filter((u: materialCrud) => !u.isSelected);
            this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          });
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

}
