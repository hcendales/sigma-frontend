import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { listaEnsayo, SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { EntityTabApiqueService } from 'src/app/core/services/entity-tab-apique.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalListaEnsayosComponent } from '../modal-lista-ensayos/modal-lista-ensayos.component';
import { ModalTableAsociarComponent } from '../modal-table-asociar/modal-table-asociar.component';

@Component({
  selector: 'app-servicio-apiques',
  templateUrl: './servicio-apiques.component.html',
  styleUrls: ['./servicio-apiques.component.scss'],
  providers: [DatePipe]
})
export class ServicioApiquesComponent implements OnInit {
  descripcion_tipo_grupo : string = "";
  lista                  : any;
  listaEnsayoSelected    : any = "";
  listaEnsayolenth       : number = 0;
  listaObservacion       : string = "";
  listaPersonas          : any;  
  listaRecibeMuestra     : string = ""
  listaTipoMaterial      : any;
  listaTipoPerfil        : any;
  pKsSelected            : any;
  ready                  : boolean | undefined;
  pattern                = "^[1-9]0?$";
  loading                : boolean = false;
  listaUsuarios          : any;
  idMantenimientoVialEvento:any;
  nomenclatura            :any;
/**
 * Este campo compone el codigo del ensayo asi que para mantener un control en el versionamiento
 * se bloque este campo, asi al actualizar la solicitud este dato cambie y asi se pierda el codigo del ensayo de los ensayos anteriores.
 */
  actualiza           : boolean = false;
  

  @Input() rowUpdate: any;
  @Input() bloquear: boolean = false;       /// (CUS 12 / Cargue de Resultado), solicita solo ver los datos y no deben modificar.
  @Output() guardar = new EventEmitter();

  formApiques: FormGroup = this.fb.group({
    apiques                     : [0,[Validators.max(999999)]],
    codigo_ensayo               : [ , ],
    descripcion                 : [ ,Validators.required],
    fecha_recepcion             : [ ,],
    fecha_solicitud             : [ , ],
    id_documento                : [0, ],   
    id_ensayo                   : [0, ],
    // id_perfil                   : [ , ],
    id_tipo_material_ensayo     : [ , Validators.required],
    // id_tipo_observacion         : [ , ],
    id_tipo_servicio            : [54, ],    
    // id_usuario_recibe_muestra   : [ , ],    
    listaEnsayo                 : [ ,Validators.required],
    listaPKMantActivos          : [ ,Validators.required],
    observacion                 : [ , ],   
    prioridad                   : [false, ],   
    fecha_programada            : [ ,],
  }); 

  constructor(public fb: FormBuilder,
              public dialog: MatDialog, 
              public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
              public datePipe: DatePipe,
              public consultaListasService: ConsultaListasService,
              public entityTabPersonaService: EntityTabPersonaService,
              public entityTabApiqueService: EntityTabApiqueService) { }

  async ngOnInit() {
    this.loading = true;
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
    await this.consultaListasService.consultarListas([107, 106]).then((lista) => { this.lista = lista; this.ready = true; });

    /** Consulta la lista de usuarios a mostrar en los id_persona_residente_social */
    // await this.solicitudEnsayoLaboratorioService.buscarPersona('id_tipo_rol in (3157)').then((lista) => {
    //   this.listaPersonas = lista.respuesta;
    //   this.ready = true;
    // });
    
    /** Consulta la lista de usuarios a mostrar en quien recibe la muestra */
    await this.entityTabPersonaService.listUsuarios("").then((listaUsuarios) => { this.listaUsuarios = listaUsuarios.respuesta; this.ready = true; });

    /** Consulta las litas de materiales filtrado por servicio */
    await this.solicitudEnsayoLaboratorioService.buscarTipoMateriales('AP').then((lista) => { this.listaTipoMaterial = lista.respuesta; this.ready = true; });

    /** 
     * aqui se envia los datos del formulario a "registrarForm" para ser guardados, 
     * No se desea validar cuando el formulario esta solo lectura 
     */
    this.formApiques.valueChanges.subscribe( datosApiques => {
      if (!this.bloquear) this.formApiques.valid ? this.guardar.emit(datosApiques) : this.guardar.emit(false);
    });

    /** Permite Cargar los datos para un Update */
    if (this.rowUpdate.id_tipo_servicio && this.rowUpdate.id_tipo_servicio === 54) await this.cargarDatos(this.rowUpdate);

    this.loading = false;
  }

  async cargarDatos(itm: SolicitudEnsayoLaboratorio) {
    //console.log("Apiques ~> ", itm);

    //// Busca los datos correspondiente a cada modal
    const listasMttActivos = await this.solicitudEnsayoLaboratorioService.buscarMantenimientosActivos("id_ensayo = " + itm.id_ensayo);
    const listasEnsayos    = await this.solicitudEnsayoLaboratorioService.buscarEnsayos("id_ensayo = " + itm.id_ensayo);
    const listasMaterial   = await this.solicitudEnsayoLaboratorioService.buscarMaterial("id_ensayo = " + itm.id_ensayo);

    //// aplica los datos que trae el servicio de buscarMantenimientosActivos
    this.formApiques.patchValue(itm);
    this.formApiques.get('prioridad')?.setValue(itm.prioridad === 1 ? false : true);
    this.formApiques.get('fecha_recepcion')?.setValue(this.datePipe.transform(itm.fecha_recepcion, 'yyyy-MM-dd') + 'T05:00:00.000Z' );
    this.formApiques.get('fecha_solicitud')?.setValue(this.datePipe.transform(itm.fecha_solicitud, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formApiques.get('fecha_programada')?.setValue(this.datePipe.transform(itm.fecha_programada, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    // this.formApiques.get('id_perfil')?.setValue(parseFloat(itm.id_perfil));
    // this.formApiques.get('id_tipo_observacion')?.setValue(parseFloat(itm.id_tipo_observacion));
    // this.formApiques.get('id_usuario_recibe_muestra')?.setValue(parseFloat(itm.id_usuario_recibe_muestra));

    //// aplica el tipo de material seleccionado 
    this.actualiza = true;
    if (typeof listasMaterial.respuesta[0] !== 'undefined')
    {
      this.formApiques.get('id_tipo_material_ensayo')?.setValue(listasMaterial.respuesta[0].id_tipo_material_ensayo);
      this.descripcion_tipo_grupo = listasMaterial.respuesta[0].descripcion_tipo_grupo;
    }


    //// aplica los datos que trae el servicio de buscarMantenimientosActivos
    this.pKsSelected = listasMttActivos.respuesta;
    this.formApiques.get('listaPKMantActivos')?.setValue(listasMttActivos.respuesta);

    /// buscar las nomenclatura
    const idMantenimiento = this.pKsSelected.map((e:any)=>{
      let ids = [];
      ids.push(e.id_mantenimiento_vial);

      return ids;
    })
    
    await this.solicitudEnsayoLaboratorioService.buscarMantenimientoActivo("", "", null, null, null, null, idMantenimiento.toString()).then(async (resp: any) => {
      if (resp.codError === 0 && resp.respuesta.length > 0)
      {
        this.idMantenimientoVialEvento = resp.respuesta.map((r: any) => {
          let dts = [];
          dts.push(r.id_mantenimiento_vial_evento);

          return dts;
        });

        // this.idMantenimientoVialEvento = "1000115,19856"
        this.solicitudEnsayoLaboratorioService.buscarIdMantenimientoVialEvento(this.idMantenimientoVialEvento.toString()).then(async (t: any) => {
          if (t.codError === 0 && t.respuesta.length > 0)
            this.nomenclatura = t.respuesta
        });
      }
    });



    //// masajea los datos que trae de ensayo relacionados a la solicitud
    this.listaEnsayoSelected = "";
    this.listaEnsayoSelected = listasEnsayos.respuesta;
    this.listaEnsayolenth = listasEnsayos.respuesta.length;
    this.formApiques.get('listaEnsayo')?.setValue(listasEnsayos.respuesta);

    /// para llenar los input, SOLO CUANDO [bloquear == TRUE]
    if (this.bloquear) {
      this.lista[106].forEach((element: any) => {
        if (element.id_tipo === parseInt(itm.id_perfil))
          return this.listaTipoPerfil = element.descripcion
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

    this.formApiques.get('id_ensayo')?.setValue(itm.id_ensayo);
  }

  /**
   * validacion del campo
   * @param campo que sera validado en el formulario
   * @returns 
   */
  campoEsValido(campo: string) {
    return this.formApiques.controls[campo].errors
      && this.formApiques.controls[campo].touched;
  }

  /** modal con PKs mantenimientos Activos */
  openDialogAsociarPKs(item: any): void {
    const dialogRef = this.dialog.open(ModalTableAsociarComponent, {
      width : '90%',
      height: '90%',
      data: {
        itm: this.pKsSelected,
        lock: this.bloquear
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === undefined) return;
      this.pKsSelected = result;
      this.formApiques.get('listaPKMantActivos')?.setValue(result);
      if (this.formApiques.invalid) this.formApiques.markAllAsTouched();
    });
  }

  /** modal con lista de ensayos del servicio */
  openDialogListasEnsayos(item: any): void {

    const dialogRef = this.dialog.open(ModalListaEnsayosComponent, {
      width: '80%',
      height: '80%',
      data: {
        itm: item,
        invs: this.listaEnsayoSelected,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) return; 
      if (result[0] === "") result = null;
      this.listaEnsayoSelected = "";
      this.listaEnsayoSelected = result
      this.listaEnsayolenth = result.length;
      this.formApiques.get('listaEnsayo')?.setValue(result);
      if (this.formApiques.invalid) this.formApiques.markAllAsTouched();
    });
  }

  /** recibe las filas del dialogo restantes y actualiza el FormGroup */
  updatelistaPKMantActivos(event: any) {
    this.formApiques.get('listaPKMantActivos')?.setValue(event)
  }

}
