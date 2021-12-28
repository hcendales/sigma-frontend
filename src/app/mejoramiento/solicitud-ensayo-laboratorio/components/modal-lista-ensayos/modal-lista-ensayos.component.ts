import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { listaMateriales } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';




@Component({
  selector: 'app-modal-lista-ensayos',
  templateUrl: './modal-lista-ensayos.component.html',
  styleUrls: ['./modal-lista-ensayos.component.scss']
})
export class ModalListaEnsayosComponent implements OnInit {


  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id_tipo_servicio_ensayo', 'codigo_tipo_ensayo', 'descripcion_tipo_ensayo','programado'];
  filterColumns: string[] = ['search1', 'search2', 'search3'];
  pageSize = 5;

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  @Output() registroSeleccionado: EventEmitter<any> = new EventEmitter();
  @Output() selecteDataSourceEmiter: EventEmitter<any> = new EventEmitter();

  /**
   * buscadores de columnas
   */
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');

  /**
   * Accion de seleccionar todos los items
   */
  masterCheck: boolean = false;

  /**
   * El listado de los items a mostrar en el formulario
   */
  selectedList: any = {} as any;

  /**
   * campo extra agregado para el input tipo text
   */
  programado: string = ""

  /**
   * variable para asociar los checkbox true
   */
  arrayChecked = [] as any;

  filterValues = {
    id_tipo_servicio_ensayo: '',
    codigo_tipo_ensayo: '',
    descripcion_tipo_ensayo: '',
  };

  constructor(
    public dialogRef: MatDialogRef<ModalListaEnsayosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    /** Llama el metodo que carga los datos */
    this.listarData(this.data.itm);

    /** Inicio Filtros por Columna */
    this.search1.valueChanges
      .subscribe(
        valor1=> {
          this.filterValues.codigo_tipo_ensayo = valor1;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.codigo_tipo_ensayo = valor2;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.descripcion_tipo_ensayo = valor3;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  /**
   * Obtiene los registros a cargar en la tabla
   * @param itm 
   */
  async listarData(itm: string): Promise<any> {

    await this.solicitudEnsayoLaboratorioService.buscarTipoEnsayoXServicio(this.data.itm).then((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.respuesta);

      /** Agrego la columna de Fuente Material y con ngModel la imprimo en el input */
      let count: number = 0;
      this.dataSource.data.map(element => {

        /**
         * se realiza el matching con los IDs que vienen precargados del Formulario
         * carga el value del input y el checked lo pasa a true
         */
        let texto: string = "";
        if (this.data.invs !== undefined && this.data.invs !== "" ) {
          this.data.invs.find((input: any) => {
            if (input.id_tipo_servicio_ensayo === element.id_tipo_servicio_ensayo) {
              count++
              this.arrayChecked.push(element);
              texto = input.programado;
              element.checked = true;
            }
          });
        }
        element['programado'] = texto;
      });

      this.dataSource.sort = this.sort;

      /**Permite ampliar el pagineo solo si la cantidad de items es mayor a 05 */
      this.pageSize = count > 5 ? count : this.pageSize

      /**ReOrdena por el campo fuente_material */
      resp.respuesta.sort((a: any, b: any) => (a.fuente_material < b.fuente_material) ? 1 : ((b.fuente_material < a.fuente_material) ? -1 : 0));

      this.dataSource.paginator = this.paginator;
      this.creaFiltroXColumna();
      this.onClearFilters();
    });

  }

  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {

      const searchTerms = JSON.parse(filter);
      return (data.codigo_tipo_ensayo || '').toString().toLowerCase().indexOf(searchTerms.codigo_tipo_ensayo) !== -1
        && (data.descripcion_tipo_ensayo || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_ensayo) !== -1;
    });

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  /** Limpiar los filtros de cada columna */
  onClearFilters() {
    this.search1.setValue('');
    this.search2.setValue('');
    this.search3.setValue('');
  }

  /**
   * salir del modal
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**
   * accion que reune todos los registros seleccionados 
   * tiene la validacion que impide asociar un input fuente_material vacio
   */
  onAsociar(): void {

    /** recorre todos los que han sido selected */
    let arraySelected = [] as any;
    this.arrayChecked.forEach((element: any) => { if (element.checked) arraySelected.push(element); });

    /**Elimina duplicados */
    this.arrayChecked = [...new Set(arraySelected)];

    /** metodo para validar input fuente_material */
    const validator = this.arrayChecked.find((element: any) => element.programado === "" || element.programado === undefined || element.programado === 0);

    /** devuelve los que cumpla la condicion */
    (validator === undefined) ? this.dialogRef.close(this.arrayChecked) : this.snackBar.open("Debe diligenciar todos los campos que seleccione ", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
  }


  /**
   * actualiza la lista de items con check true
   * @param event 
   * @param index 
   */
  updateCheckedList(event: any, index: any) {
    if (event.checked) {
      this.selectedList[index.id_proceso_gestion] = index;
    } else {
      delete this.selectedList[index.id_proceso_gestion];
    }

    for (let key in this.selectedList) {
      this.arrayChecked.push(this.selectedList[key]);
    }

    if (!this.isAlternated()) {
      this.masterCheck = this.dataSource.filteredData[0].checked;
    }
  }

  isAlternated() {
    if (this.dataSource && this.dataSource.filteredData.length > 1) {
      let antValue = this.dataSource.filteredData[0].checked;
      for (let i = 1; i < this.dataSource.filteredData.length; i++) {
        if (this.dataSource.filteredData[i].checked != antValue) {
          return true;
        } else {
          antValue = this.dataSource.filteredData[i].checked;
        }
      }
    }
    return false;
  }
}
