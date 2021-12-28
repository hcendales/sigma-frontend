import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { listaEnsayo, SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalListaEnsayosComponent } from '../modal-lista-ensayos/modal-lista-ensayos.component';
import { ModalTableAsociarComponent } from '../modal-table-asociar/modal-table-asociar.component';

@Component({
  selector: 'app-servicio-otros',
  templateUrl: './servicio-otros.component.html',
  styleUrls: ['./servicio-otros.component.scss'],
  providers: [DatePipe]
})
export class ServicioOtrosComponent implements OnInit {
  @Output() guardar = new EventEmitter();
  @Input() rowUpdate: any;
  @Input() bloquear: boolean = false;       /// (CUS 12 / Cargue de Resultado), solicita solo ver los datos y no deben modificar.

  datos                  : any[] | undefined;
  descripcion_tipo_grupo : string = "";
  listaEnsayoSelected    : any;
  listaEnsayolenth       : number = 0;
  listaTipoMaterial      : any;
  pKsSelected            : string = ""
  ready                  : boolean = false;
  typesOfShoes           : string[] = [];
  lista                  : any;
  listaPersonas          : any;  
  listaJornada           : string = ""
  listaObservacion       : string = ""
  listaRecibeMuestra     : string = ""
  loading                : boolean = false;
  listaUsuarios          : any;
  /**
   * Este campo compone el codigo del ensayo asi que para mantener un control en el versionamiento
   * se bloque este campo, asi al actualizar la solicitud este dato cambie y asi se pierda el codigo del ensayo de los ensayos anteriores.
   */
  actualiza: boolean = false;

  formOtros: FormGroup = this.fb.group({
    codigo_ensayo         : [ , ],
    descripcion           : [ , Validators.required],
    fecha_recepcion       : [ , Validators.required],
    fecha_solicitud       : [ , ],
    id_documento          : [0, ],
    id_ensayo             : [0, ],
    id_jornada            : [ , ],     
    id_tipo_material_ensayo:[ , Validators.required],
    //id_tipo_observacion   : [ , ],
    id_tipo_servicio      : [109, ],        
    //id_usuario_recibe_muestra:[,],
    listaEnsayo           : [ , Validators.required],
    listaPKMantActivos    : [ , ],
    observacion           : [ , ],
    fecha_programada      : [ , Validators.required],
  })
 
  constructor(public fb: FormBuilder, 
              public dialog: MatDialog,
              public datePipe: DatePipe,
              public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService, 
              public consultaListasService: ConsultaListasService,
              public entityTabPersonaService: EntityTabPersonaService,) { }

   async ngOnInit() {
     this.loading = true;

    /** 
     * aqui se envia los datos del formulario a "registrarForm" para ser guardados, 
     * No se desea validar cuando el formulario esta solo lectura 
     */
    this.formOtros.valueChanges.subscribe(datosOtros => {
      if (!this.bloquear) this.formOtros.valid ? this.guardar.emit(datosOtros) : this.guardar.emit(false);
    });

    /** 
     * 
          listaCantidad           : 105
          listaCapas              : 64
          listaFrecuencia         : 68
          listaJornada            : 58
          listaLote               : 56
          listaObra               : 2005
          listaObservacion        : 107
          listaPerfil             : 106
          listaPlanta             : 2005
        */
     await this.consultaListasService.consultarListas([58, 107 ]).then((lista) => {  this.lista = lista; this.ready = true; });

     /** Consulta la lista de usuarios a mostrar en los id_persona_residente_social */
    //  await this.solicitudEnsayoLaboratorioService.buscarPersona('id_tipo_rol in (3157)').then((lista) => {
    //    this.listaPersonas = lista.respuesta;
    //    this.ready = true;
    //  })
     
     /** Consulta la lista de usuarios a mostrar en quien recibe la muestra */
     await this.entityTabPersonaService.listUsuarios("").then((listaUsuarios) => { this.listaUsuarios = listaUsuarios.respuesta; this.ready = true; });

    /** Consulta las litas de materiales filtrado por servicio */
    await this.solicitudEnsayoLaboratorioService.buscarTipoMateriales('OTROS').then((lista) => { this.listaTipoMaterial = lista.respuesta; this.ready = true; });

    /** Permite Cargar los datos para un Update */
    if (this.rowUpdate.id_tipo_servicio && this.rowUpdate.id_tipo_servicio === 109) await this.cargarDatos(this.rowUpdate);
    
    this.loading = false;
  }

  async cargarDatos(itm: SolicitudEnsayoLaboratorio) {
    ////console.log("Otros ~> ", itm);

     //// Busca los datos correspondiente a cada modal
    const listasMttActivos = await this.solicitudEnsayoLaboratorioService.buscarMantenimientosActivos("id_ensayo = " + itm.id_ensayo);
    const listasEnsayos    = await this.solicitudEnsayoLaboratorioService.buscarEnsayos("id_ensayo = " + itm.id_ensayo);
    const listasMaterial   = await this.solicitudEnsayoLaboratorioService.buscarMaterial("id_ensayo = " + itm.id_ensayo);

     //// aplica los datos que trae en el ITM
    this.formOtros.patchValue(itm);
    this.formOtros.get('fecha_recepcion')?.setValue(this.datePipe.transform(itm.fecha_recepcion, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formOtros.get('fecha_solicitud')?.setValue(this.datePipe.transform(itm.fecha_solicitud, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formOtros.get('fecha_programada')?.setValue(this.datePipe.transform(itm.fecha_programada, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formOtros.get('id_jornada')?.setValue(parseFloat(itm.id_jornada));
    // this.formOtros.get('id_tipo_observacion')?.setValue(parseFloat(itm.id_tipo_observacion));
    // this.formOtros.get('id_usuario_recibe_muestra')?.setValue(parseInt(itm.id_usuario_recibe_muestra));
    
     //// aplica los datos que trae el servicio de buscarMantenimientosActivos
    this.pKsSelected = listasMttActivos.respuesta;
    this.formOtros.get('listaPKMantActivos')?.setValue(listasMttActivos.respuesta);

     //// masajea los datos que trae de ensayo relacionados a la solicitud
    this.listaEnsayoSelected = "";
    this.listaEnsayoSelected = listasEnsayos.respuesta;
    this.listaEnsayolenth = listasEnsayos.respuesta.length;
    this.formOtros.get('listaEnsayo')?.setValue(listasEnsayos.respuesta);

    //// aplica el tipo de material seleccionado 
    this.actualiza = true;
    if (typeof listasMaterial.respuesta[0] !== 'undefined'){
      this.formOtros.get('id_tipo_material_ensayo')?.setValue(listasMaterial.respuesta[0].id_tipo_material_ensayo);
      this.descripcion_tipo_grupo = listasMaterial.respuesta[0].descripcion_tipo_grupo;
    }

    /// para llenar los input, SOLO CUANDO [bloquear == TRUE]
    if (this.bloquear) {    
      this.lista[58].forEach((element: any) => {
        if (element.id_tipo === parseInt(itm.id_jornada))
          return this.listaJornada = element.descripcion
      });
      // this.lista[107].forEach((element: any) => {
      //   if (element.id_tipo === parseInt(itm.id_tipo_observacion))
      //     return this.listaObservacion = element.descripcion
      // });
      // this.listaUsuarios.forEach((element: any) => {
      //   if (element.id_usuario === parseInt(itm.id_usuario_recibe_muestra)) {
      //     return this.listaRecibeMuestra = element.nombre;
      //   }
      // });
      // this.listaPersonas.forEach((element: any) => {
      //   if (element.id_tipo_rol === 3157 && element.id_persona === parseInt(itm.id_usuario_recibe_muestra))
      //     return this.listaRecibeMuestra = element.nombre;
      // });
    }

    this.formOtros.get('id_ensayo')?.setValue(itm.id_ensayo);
  }
  
  /** modal con PKs mantenimientos Activos */
  openDialogAsociarPKs(item: any): void {
    
    const dialogRef = this.dialog.open(ModalTableAsociarComponent, {
      width: '90%',
      height: '90%',
      data: {
        itm: this.pKsSelected,
        lock: this.bloquear
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) return;
      this.pKsSelected = result;
      this.formOtros.get('listaPKMantActivos')?.setValue(result);
      if (this.formOtros.invalid) this.formOtros.markAllAsTouched();
    });
  }

  /** modal con lista de ensayos del servicio */
  openDialogListasEnsayos(item: any): void {
    
    const dialogRef = this.dialog.open(ModalListaEnsayosComponent, {
      width: '80%',
      height: '80%',
      data: {
        itm: item,
        invs:  this.listaEnsayoSelected,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) return;
      if (result[0] === "") result = null;

      this.listaEnsayoSelected = "";
      this.listaEnsayoSelected = result
      
      this.listaEnsayolenth = result.length;
      this.formOtros.get('listaEnsayo')?.setValue(result);
      if (this.formOtros.invalid) this.formOtros.markAllAsTouched();
    });
  }
  
  /** recibe las filas restantes del dialogo y actualiza el FormGroup */
  updatelistaPKMantActivos(event: any) {
    this.formOtros.get('listaPKMantActivos')?.setValue(event);
  }
}
