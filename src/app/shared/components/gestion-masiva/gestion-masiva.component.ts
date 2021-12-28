import { Respuesta } from './../../../core/models/revision-visitas';
import { Routes, Router, ActivatedRoute, Params } from '@angular/router';
import { AfterViewInit, Component, ViewChild, ViewChildren, OnInit, ViewEncapsulation, Input, Output, EventEmitter, QueryList } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { TabItem } from '../../../core/models/tabs-items';
import { GestionService } from '../../../core/services/gestion.service';
import { Transiciones } from '../../../core/models/transiciones';
import { ConsultaListaRevisionVisitaService } from '../../../core/services/consulta-lista-revision-visita.service';
import { UtilitariosService } from '../../../core/services/utilitarios.service';
import { createViewChildren } from '@angular/compiler/src/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ListaTransicionComponent } from '../lista-transicion/lista-transicion.component';
import { RegistrarPriorizacionComponent } from '../registrar-priorizacion/registrar-priorizacion.component';

@Component({
  selector: 'app-gestion-masiva',
  templateUrl: './gestion-masiva.component.html',
  styleUrls: ['./gestion-masiva.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class GestionMasivaComponent implements OnInit {
  // Indice que esta activo
  active = 0;
  // Propiedad para leer parametros
  //public idActividad: number = 0;
  // Transiciones
  public transiciones: any = [];
  public title = '';

  idsProcesoGestion:any = {}as any; //ids de proceso gestion seleccionados por transición
  totalesKmCarrilImpacto:any={}as any; //contiene los km carril impacto por transición

  idsMantenimientoVial: any = [];

  currentTabIndex:number = -1;

  @Input() idActividad:number = 0;
  @Input() selectedFeatures:any[] = [];
  @Input() acciones:any[] = [];
  @Output() ready = new EventEmitter();
  @Output() cambioPestana = new EventEmitter();
  @Output() dataSource = new EventEmitter();
  @Output() selecteDataSource = new EventEmitter();
  @Output() gestionRealizada = new EventEmitter();
  @Output() onOpcionSelected = new EventEmitter();
  @Input() mostrarOpcionDefaultTabla:boolean = true;
  @ViewChildren('listaTransicion') listasTran:QueryList<any> = new QueryList<any>();
  @ViewChild('listaTransicion')
  public tabTransicion!: ListaTransicionComponent;
  @Input() cargueAutomatico:boolean = true; //realiza el cargue de las tablas apenas cargue el componente
  private procesosGestionSelected:any = {} as any;

  @Input() export_flag:Boolean = false;

  @Input() columnas: string[] = [];

  transicionesConsultadas:boolean = false;

  // Priorizar intervenciones
  public verPriorizar: boolean = false;

  constructor(
    private gestionService: GestionService,
    private snackBar:MatSnackBar,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private utilitariosService: UtilitariosService,
    public dialog: MatDialog,) { }

    async ngOnInit() {
      //this.idActividad =  Number(params.get('idActividad'))
        //console.log('Actividad ', this.idActividad)
      try{
        let resp = await this.gestionService.listarTransicionesPorActividad(this.idActividad);
        if(resp.codError == 0){
          this.transiciones = resp.respuesta;
          this.transicionesConsultadas = true;
          for(let transicion of this.transiciones){
            this.totalesKmCarrilImpacto[transicion.id_actividad_transicion] = {seleccionados:0,total:0,discriminado:[]};
            this.idsProcesoGestion[transicion.id_actividad_transicion] = [];
            this.procesosGestionSelected[transicion.id_actividad_transicion] = [];
          }
          console.log('las transiciones ', this.transiciones);
          console.log('idActividad ', this.idActividad);
          if(this.idActividad == 6){
            this.verPriorizar = true;
          }
          if (this.columnas.length == 0) {
            this.columnas = await this.utilitariosService.obtenerColumnasListaPendientes(String(this.idActividad));
            if(this.columnas == null){
              this.columnas = [
                'ch','id_mantenimiento_vial', 'pk_id_calzada', 'descripcion_localidad', 'descripcion_zona',
                'descripcion_barrio', 'descripcion_upz', 'solicitud_radicado_entrada',
                'descripcion_origen', 'descripcion_estado_pk', 'fecha_asignacion', 'fecha_vencimiento',
                'nombre_responsable_visita', '_CTRL_ACCION_TRABAJAR'];
            }
          }
        }else{
          this.snackBar.open(resp.msgError, 'X', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }catch(e){
        this.snackBar.open('Error al realizar la consulta', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
      this.ready.emit();

    }


    onTabChange(e: any){
      if(e == -1){
        return;
      }
      this.currentTabIndex = e;
      this.listasTran.toArray()[e]?.onClearFilters();
      this.listasTran.toArray()[e]?.clearchecked();
      if(this.cargueAutomatico){
        this.listasTran.toArray()[e].consultarData({});
      }
      this.cambioPestana.emit();

    }

    dataSourceEvt($event:any){
      this.dataSource.emit($event);
    }

    selecteDataSourceEvt($event:any){
       this.selecteDataSource.emit($event);
    }

    async registroSeleccionadoEvt(procesosGestion:any[],idTransicion:number){

      let idsProcesoGSeleccionados = procesosGestion.map(pg=>pg.id_proceso_gestion);
      this.idsMantenimientoVial = procesosGestion.map(pg=>pg.id_mantenimiento_vial);
      this.procesosGestionSelected[idTransicion] = [...procesosGestion];
      console.log('idsMantenimientoVial: ', this.idsMantenimientoVial);
      console.log('los procesos gestionSelected', this.procesosGestionSelected);
      console.log('idTransicion: ', idTransicion);
      this.idsProcesoGestion[idTransicion] = procesosGestion.map(pg=>pg.id_proceso_gestion);
      let objDisc = {} as any;
      for(let idt of procesosGestion){
        objDisc[idt.codigo_actividad_agrupada] = objDisc[idt.codigo_actividad_agrupada]?objDisc[idt.codigo_actividad_agrupada] + idt.km_carril_impacto:idt.km_carril_impacto;
      }

      let arrayDisc = [];
      let total = 0;
      for(let d in objDisc){
        arrayDisc.push({codigo_actividad_agrupada:d,km_carril_impacto:Math.round(objDisc[d]*100)/100});
        total += Number(objDisc[d]);
      }

      this.totalesKmCarrilImpacto[idTransicion].seleccionados = idsProcesoGSeleccionados.length;
      this.totalesKmCarrilImpacto[idTransicion].discriminado = arrayDisc;
      this.totalesKmCarrilImpacto[idTransicion].total = Math.round(total*100)/100;

    }

    gestionRealizadaEvt(idTransicion:any){
      this.transiciones = [];
      this.idsProcesoGestion = {}as any;
      this.totalesKmCarrilImpacto={}as any;
      console.log('La cosa que sale del Evento',this.procesosGestionSelected[idTransicion]);
      this.gestionRealizada.emit({evento:this.procesosGestionSelected[idTransicion],transicion:idTransicion});
      this.procesosGestionSelected = {}as any;
      this.ngOnInit();
    }

    //carga los datos de la tabla de la pestaña activa
    public cargarData(filtro:any){
      console.log(filtro);
      this.listasTran.toArray()[this.currentTabIndex].consultarData(filtro);
    }

    public onOpcionSelectedEvt(e:any){
      this.onOpcionSelected.emit(e);
    }

    priorizacion(){
      console.log('Ingreso', this.procesosGestionSelected);
    }

    openDialogPriorizacion(): void {
      console.log('Ids ', this.idsProcesoGestion[24]);
      const dialogRef = this.dialog.open(RegistrarPriorizacionComponent, {
        width: '850px',
        disableClose: false,
        data: {idSelected: this.idsMantenimientoVial,
        idActividad: this.idActividad}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        //this.ngOnInit();
      });
  }

  }
