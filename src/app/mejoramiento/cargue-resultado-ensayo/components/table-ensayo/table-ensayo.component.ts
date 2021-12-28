import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { listaEnsayo } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalConfirmarComponent } from 'src/app/mejoramiento/solicitud-ensayo-laboratorio/components/modal-confirmar/modal-confirmar.component';

@Component({
  selector: 'app-table-ensayo',
  templateUrl: './table-ensayo.component.html',
  styleUrls: ['./table-ensayo.component.scss']
})
export class TableEnsayoComponent implements OnInit {

  searchkey: string = '';
  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['codigo_tipo_ensayo', 'descripcion_tipo_ensayo', 'programado','ejecutado', 'acciones'];
  filterColumns: string[] = ['search1', 'search2', 'search3', 'search4', 'search5'];

  /**
 * Controla el spinner al ejecutar el crud
 */
  loading: boolean = false;

  /**
   * Campo / input a actualizar de la tabla.
   */
  ejecutado: number = 0;

  /**Tamanio del modal Confirmacion */
  wDialog: string = '25%';
  hDialog: string = '22%';

  /** Cantidad de Item a mostrar en la tabla 3 minimo default*/
  pageSize: number = 3

  /**
   * Obtiene el ID_ENSAYO Y Busca los asociados a la solicitud
   */
  @Input() set idEnsayo(idEnsayo: any) {
    this.listarData(idEnsayo);
  }

  /**
   * Si la situacion de la solicitud es Finalizado debe quedar todo bloqueado
   */
  @Input() bloquear: boolean = false;          
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  @Output() actualiza = new EventEmitter();

  search0 = new FormControl('');
  search1 = new FormControl('');
  search2 = new FormControl('');
  search3 = new FormControl('');
  search4 = new FormControl('');
  
  filterValues = {
    codigo_tipo_ensayo: '',
    descripcion_tipo_ensayo: '',
    programado: '',
    ejecutado: ''
  };
    
  constructor(
              public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              ) {  }

  ngOnInit(): void { 

    /** Inicio Filtros por Columna */
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.codigo_tipo_ensayo      = valor1.toLowerCase();
          this.dataSource.filter                    = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.descripcion_tipo_ensayo  = valor2.toLowerCase();
          this.dataSource.filter                     = JSON.stringify(this.filterValues);
        }
      );
    this.search3.valueChanges
      .subscribe(
        valor3 => {
          this.filterValues.programado               = valor3;
          this.dataSource.filter                     = JSON.stringify(this.filterValues);
        }
      );
    this.search4.valueChanges
      .subscribe(
        valor4 => {
          this.filterValues.ejecutado                 = valor4;
          this.dataSource.filter                      = JSON.stringify(this.filterValues);
        }
      );
    /** Fin Filtros por Columna */
   }


/** Llama el servicio que carga la tabla de datos */
  async listarData(id_ensayo : number): Promise<any> {

    await this.solicitudEnsayoLaboratorioService.buscarEnsayos("id_ensayo = " + id_ensayo).then((resp: any) => {
      
      this.dataSource = new MatTableDataSource(resp.respuesta);

      this.pageSize = resp.respuesta.length > 3 ? resp.respuesta.length : 3;

      if (this.dataSource.data !== null)
      {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.creaFiltroXColumna();
        this.onClearFilters();
      }
    });
  }


  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {

      const searchTerms = JSON.parse(filter);
      return (data.codigo_tipo_ensayo      || '').toString().toLowerCase().indexOf(searchTerms.codigo_tipo_ensayo)         !== -1
        && (data.descripcion_tipo_ensayo   || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_ensayo)    !== -1
        && (data.programado                || '').toString().toLowerCase().indexOf(searchTerms.programado)                 !== -1
        && (data.ejecutado                 || '').toString().toLowerCase().indexOf(searchTerms.ejecutado)                  !== -1;

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
    this.search4.setValue('');
  }

  /** emite toda la fila al form papa para actualizar */
  onUpdateRow(itm: listaEnsayo){
    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "U", itm: 0 }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        await this.solicitudEnsayoLaboratorioService.actualizarEnsayos(itm).then(resp => {
          this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.loading = false;
        }).catch(error => {
          this.snackBar.open("Error, no se pudieron realizar cambios la aplicacion genero el siguiente error: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        })
      }
    });
  }

  /** valida todos los input y si tienen datos envia el update a cada elemento de la fila */
  onUpdateAllRow() {
    if (this.dataSource.data.some(element => element.ejecutado === null || element.ejecutado < 1)) {
      this.snackBar.open("Solo pueden haber valores enteros, por favor valide que no existan valores iguales a cero(0) o valores vacios. Luego intente de guardar nuevamente", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }
    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "U", itm: 0 }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        for (const iterator of this.dataSource.data) {
          this.loading = true;

          await this.solicitudEnsayoLaboratorioService.actualizarEnsayos(iterator).then(() => {


          }).catch(error => {
            this.snackBar.open("Error, no se pudieron realizar cambios la aplicacion genero el siguiente error: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
            this.loading = false;
          });


          this.snackBar.open('Cambios realizados', 'X', { duration: 5000, panelClass: ['success-snackbar'] });

        }
        this.loading = false;
      }
    });
  }

}


