import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { ModalConfirmarComponent } from 'src/app/mejoramiento/solicitud-ensayo-laboratorio/components/modal-confirmar/modal-confirmar.component';
import { CargueArchivoDocumentoService } from 'src/app/core/services/cargue-archivo-documento.service';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';
import { EntityTabArchivoServiceService } from 'src/app/core/services/entity-tab-archivo-service.service';

@Component({
  selector: 'app-modal-descarga-archivo',
  templateUrl: './modal-descarga-archivo.component.html',
  styleUrls: ['./modal-descarga-archivo.component.scss']
})
export class ModalDescargaArchivoComponent implements OnInit {

  searchkey: string = '';
  selection: any = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id_archivo', 'nombre','DESCARGAR'];
  filterColumns: string[] = ['search1', 'search2', 'search3'];

    
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  @Output() rowInforme = new EventEmitter();  

  
  search1 = new FormControl('');
  search2 = new FormControl('');

  /**Tamanio del modal Confirmacion */
  wDialog: string = '25%';
  hDialog: string = '22%';
  
  /**
   * Controla el spinner al ejecutar el crud
   */
  loading: boolean = false;

  filterValues = {
    id_archivo:'',
    nombre: ''
  };
    
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cargueArchivoDocumentoService: CargueArchivoDocumentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private entityTabArchivoServiceService: EntityTabArchivoServiceService,
    public dialogRef: MatDialogRef<ModalDescargaArchivoComponent>,
    public cargueResultadoEnsayoService: CargueResultadoEnsayoService,
  ) { }

  async ngOnInit() {

    this.data.itm.id_documento_informe = 0
    await this.cargueResultadoEnsayoService.buscarInforme("id_ensayo = " + this.data.itm.id_ensayo).then(r => {
      this.data.itm.id_documento_informe = r.respuesta[0].id_documento_informe;
    })

    this.cargueArchivoDocumentoService.buscarArchivos(this.data.itm.id_documento_informe).then((res => {
      
      this.dataSource = new MatTableDataSource(res.respuesta);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.creaFiltroXColumna();

    })).catch(e => {

    })
      
    /** Inicio Filtros por Columna */
    this.search1.valueChanges
      .subscribe(
        valor1 => {
          this.filterValues.id_archivo           = valor1;
          this.dataSource.filter                 = JSON.stringify(this.filterValues);
        }
      );
    this.search2.valueChanges
      .subscribe(
        valor2 => {
          this.filterValues.nombre         = valor2;
          this.dataSource.filter                 = JSON.stringify(this.filterValues);
        }
      );

    /** Fin Filtros por Columna */
   }

  /** Crea los filtros por cada columna */
  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {

      const searchTerms = JSON.parse(filter);
      return (data.id_archivo || '').toString().toLowerCase().indexOf(searchTerms.id_archivo)!== -1
      && (data.nombre || '').toString().toLowerCase().indexOf(searchTerms.nombre)    !== -1;

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
  }

  /**
   * Metodo de descarga del Archivo
   * recibe la fila que se selecciono
   * @param row 
   */
  async onDescargarFila(row: any) {
    this.loading = true;
    await this.cargueArchivoDocumentoService.descargarArchivo(row.id_documento, row.nombre, row.id_archivo).then(async resp => {
      const blob = new Blob([resp.body as BlobPart], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      this.snackBar.open('Descarga Completa', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
      this.loading = false;
    }).catch((error:any) => {
      this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
      this.loading = false;
    });
  }

  /**
   * Metodo de Eliminar 
   * Solo se solicita al servicio la eliminacion de la fila y luego se elimina del DOM
   * @param row 
   */
  onEliminarFila(row : any){
    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "D" }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        this.entityTabArchivoServiceService.delete(row.id_archivo).toPromise().then(resp => {
          
          if (row.id_archivo === resp.respuesta[0].id_archivo){
            this.snackBar.open('Se elimino correctamente el archivo', 'X', { duration: 5000, panelClass: ['success-snackbar'] });  
          }else{
            this.snackBar.open("Error, algo ocurrio en el proceso, y no se pudo validar. Por favor valide que se elimino correctamente ", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          }
          
          this.dataSource.data = this.dataSource.data.filter(e => e !== row);
          this.loading = false;
        }).catch((error: any) => {
          this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        });




      }
    });
  }

}
