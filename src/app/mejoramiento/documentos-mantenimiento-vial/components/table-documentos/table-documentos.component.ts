import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { CargarDocumentoService } from 'src/app/core/services/cargar-documento.service';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CargarDocumento } from 'src/app/core/models/cargar-documento';
import { environment } from 'src/environments/environment';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-table-documentos',
  templateUrl: './table-documentos.component.html',
  styleUrls: ['./table-documentos.component.scss']
})
export class TableDocumentosComponent implements OnInit {

  @Input() set notificador(event: boolean) {
    //console.log(event)
    if (event) this.ngOnInit();
  }

  displayedColumns: string[] = [
    'id_mantenimiento_vial_docu',
    'civ',
    'pk_id_calzada',
    'id_documento',
    'descripcion_tipo_documento',
    'descripcion',
    'descripcion_estado_documento',
    'fecha_documento',
    'url_archivo',
    '_CTRL_ACCION_TRABAJAR'];

  filterValues = {
    id_mantenimiento_vial_docu: '',
    civ: '',
    pk_id_calzada: '',
    id_documento: '',
    descripcion_tipo_documento: '',
    descripcion: '',
    descripcion_estado_documento: '',
    fecha_documento: '',
    url_archivo: '',
  };
  
  @Output() actualizar = new EventEmitter();
  @Input() idMantenimiento: number = 0;
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  filterColumns: string[] = [];
  formControls: FormControl[] = [];

  pageSize = 20;
  ready = false;
  search0 = new FormControl('');
  searchkey = '';
  selection: any = new SelectionModel<any>(true, []);



  constructor(
    private cargarDocumentoService: CargarDocumentoService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.ready = false;

    /**
     * Obtiene el id_mantenimiento_vial de la URL En caso no lo traiga desde el INPUT lo envia al metodo de consultar y espera por la respuesta del servicio
     * imprime los datos en las variables correspondiente.
     */

    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimiento = +params['id']; })
    
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.cargarColumnas().then(async () => await this.cargarDocumentoService.consultarXFiltro("id_mantenimiento_vial = " +( this.idMantenimiento === 0 ? id : this.idMantenimiento )))))
      .subscribe(element => {

        //console.log("consultarXFiltro: ",element)
        if (element.codError === 0){
          this.dataSource = new MatTableDataSource(element.respuesta);
          element.respuesta.sort((a: any, b: any) => (a.id_documento < b.id_documento) ? 1 : ((b.id_documento < a.id_documento) ? -1 : 0));
          //this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.creaFiltroXColumna();
          this.onClearFilters();
        }

      });

    this.search0.valueChanges
      .subscribe(
        valor0 => {
          this.filterValues.id_mantenimiento_vial_docu = valor0;
          this.filterValues.civ = '';
          this.filterValues.pk_id_calzada = '';
          this.filterValues.id_documento = '';
          this.filterValues.descripcion_tipo_documento = '';
          this.filterValues.descripcion = '';
          this.filterValues.descripcion_estado_documento = '';
          this.filterValues.fecha_documento = '';
          this.filterValues.url_archivo = '';
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );

    this.ready = true;
  }


  creaFiltroXColumna() {

    this.dataSource.filterPredicate = ((data: any, filter: any) => {
      const searchTerms = JSON.parse(filter);
      return (data.id_mantenimiento_vial_docu || '').toString().toLowerCase().indexOf(searchTerms.id_mantenimiento_vial_docu) !== -1
        && (data.civ || '').toString().toLowerCase().indexOf(searchTerms.civ) !== -1
        && (data.pk_id_calzada || '').toString().toLowerCase().indexOf(searchTerms.pk_id_calzada) !== -1
        && (data.id_documento || '').toString().toLowerCase().indexOf(searchTerms.id_documento) !== -1
        && (data.descripcion_tipo_documento || '').toString().toLowerCase().indexOf(searchTerms.descripcion_tipo_documento) !== -1
        && (data.descripcion || '').toString().toLowerCase().indexOf(searchTerms.descripcion) !== -1
        && (data.descripcion_estado_documento || '').toString().toLowerCase().indexOf(searchTerms.descripcion_estado_documento) !== -1
        && (data.fecha_documento || '').toString().toLowerCase().indexOf(searchTerms.fecha_documento) !== -1
        && (data.url_archivo || '').toString().toLowerCase().indexOf(searchTerms.url_archivo) !== -1;

    });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public async cargarColumnas() {
    this.filterColumns = [];
    this.formControls = [];

    //console.log("~>"+this.displayedColumns)
    for (let a of this.displayedColumns) {
      this.filterColumns.push(a + '_');
      if (!a.startsWith('_CTRL_ACCION_')) {
        let formControl = new FormControl('');
        formControl.valueChanges
          .subscribe(
            valor => {
              const attr: string = a as string;
              (this.filterValues as LooseObject)[attr] = valor;
              this.dataSource.filter = JSON.stringify(this.filterValues);
            }
          );
        this.formControls.push(formControl);
      }
    }
  }

  onClearFilters() {
    for (let c of this.formControls) {
      c.setValue('');
    }
  }

  buscarArchivo(fila : any){
    this.actualizar.emit(fila);
  }

  bajarArchivo(fila: CargarDocumento){
   window.open(environment.URL_FOTOS + this.idMantenimiento + "/" + fila.url_archivo);
  }

}