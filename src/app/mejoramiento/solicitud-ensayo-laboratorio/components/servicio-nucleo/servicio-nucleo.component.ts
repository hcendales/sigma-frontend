import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, MaxLengthValidator } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { listaEnsayo, SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalListaEnsayosComponent } from '../modal-lista-ensayos/modal-lista-ensayos.component';
import { ModalTableAsociarComponent } from '../modal-table-asociar/modal-table-asociar.component';

@Component({
  selector: 'app-servicio-nucleo',
  templateUrl: './servicio-nucleo.component.html',
  styleUrls: ['./servicio-nucleo.component.scss'],
  providers: [DatePipe]
})
export class ServicioNucleoComponent implements OnInit {
  @Output() guardar = new EventEmitter();
  @Input() rowUpdate: any;
  @Input() bloquear: boolean = false;       /// (CUS 12 / Cargue de Resultado), solicita solo ver los datos y no deben modificar.

  anio                : string  = "";  
  descripcion         : string  = "";  
  descripcion_tipo_grupo : string = "";
  lista               : any;
  listaEnsayoSelected : any = "";
  listaEnsayolenth    : number = 0;
  listaObservacion    : string = ""
  listaPersonas       : any;  
  listaRecibeMuestra  : string = ""
  listaTipoMaterial   : any;
  listaCapas          : any;
  mes                 : string  = "";  
  nombre4769          : string  = "";
  nombre4770          : string  = "";  
  pKsSelected         : string = ""
  ready               : boolean = false;
  loading             : boolean = false;
  listaUsuarios       : any;
/**
 * Este campo compone el codigo del ensayo asi que para mantener un control en el versionamiento
 * se bloque este campo, asi al actualizar la solicitud este dato cambie y asi se pierda el codigo del ensayo de los ensayos anteriores.
 */
  actualiza           : boolean = false;

  formNucleo: FormGroup = this.fb.group({
    actividad                : [ ,Validators.required],
    anio                     : [ ,Validators.required],
    codigo_ensayo            : [ , ],    
    espesor                  : [, [Validators.required, Validators.max(9999999999)]],
    fecha_instalacion_mezcla : [ ,Validators.required],
    fecha_recepcion          : [ ,Validators.required],
    fecha_solicitud          : [ , ],
    id_capas                 : [ , ],
    id_documento             : [0, ],
    id_ensayo                : [0, ],
    id_persona_director_obra : [ ,Validators.required],
    id_persona_residente_social:[,Validators.required],
    id_tipo_intervencion     : [ ,Validators.required],
    id_tipo_material_ensayo  : [ ,Validators.required],
    // id_tipo_observacion      : [ , ],
    id_tipo_servicio         : [55,],    
    // id_usuario_recibe_muestra: [ , ],    
    listaEnsayo              : [ ,Validators.required],
    listaPKMantActivos       : [ ,Validators.required],
    mes                      : [ ,Validators.required],
    observacion              : [ ,Validators.required],
    origen                   : [ ,Validators.required],
    fecha_programada         : [ ,Validators.required],
  });

  constructor(public fb: FormBuilder,
              public dialog: MatDialog, 
              public consultaListasService: ConsultaListasService, 
              public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService, 
              public datePipe: DatePipe,
              public entityTabPersonaService: EntityTabPersonaService, ) { }

  async ngOnInit() {
    this.loading = true;
    
    /** obtiene las listas (2)Estado Pk, (104)Mes, (103)Año, (52) Tipo de Mezcla (10) Tipo de Intervencion (107) Tipo Observacion (64) capas*/
    await this.consultaListasService.consultarListas([64, 10, 103, 104, 107]).then((lista) => { this.lista = lista;  this.ready = true; });
    
    /** Consulta la lista de usuarios a mostrar en los recidente_obra y director_obra. -id_persona_residente_social = 3157 */
    await this.solicitudEnsayoLaboratorioService.buscarPersona('id_tipo_rol in (4769, 4770, 3157)').then((lista) => { this.listaPersonas = lista.respuesta; this.ready = true; })
    
    /** Consulta la lista de usuarios a mostrar en quien recibe la muestra */
    //await this.entityTabPersonaService.listUsuarios("").then((listaUsuarios) => { this.listaUsuarios = listaUsuarios.respuesta; this.ready = true; });

    /** Consulta las litas de materiales filtrado por servicio */
    await this.solicitudEnsayoLaboratorioService.buscarTipoMateriales('NU').then((lista) => { this.listaTipoMaterial = lista.respuesta; this.ready = true; });
        
    // this.formNucleo.get('espesor')?.valueChanges.subscribe( v => {
    //   console.log (v.MaxLengthValidator)
    // });
    /**
     * aqui se envia los datos del formulario a "registrarForm" para ser guardados,
     * No se desea validar cuando el formulario esta solo lectura
     */
    this.formNucleo.valueChanges.subscribe(datosNucleo => {
      if (!this.bloquear) this.formNucleo.valid ? this.guardar.emit(datosNucleo) : this.guardar.emit(false);
    });

    /** Permite Cargar los datos para un Update */
    if (this.rowUpdate.id_tipo_servicio && this.rowUpdate.id_tipo_servicio === 55) await this.cargarDatos(this.rowUpdate);

    this.loading = false;
  }

  async cargarDatos(itm : SolicitudEnsayoLaboratorio){
    ////console.log("nucleo   ~> ", itm);
    //// Busca los datos correspondiente a cada modal
    const listasMttActivos  = await this.solicitudEnsayoLaboratorioService.buscarMantenimientosActivos("id_ensayo = " + itm.id_ensayo);
    const listasEnsayos     = await this.solicitudEnsayoLaboratorioService.buscarEnsayos("id_ensayo = " + itm.id_ensayo);
    const listasMaterial    = await this.solicitudEnsayoLaboratorioService.buscarMaterial("id_ensayo = " + itm.id_ensayo);

    //// aplica los datos que trae en el ITM
    this.formNucleo.patchValue(itm);
    this.formNucleo.get('fecha_recepcion')?.setValue(this.datePipe.transform(itm.fecha_recepcion, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formNucleo.get('fecha_instalacion_mezcla')?.setValue(this.datePipe.transform(itm.fecha_instalacion_mezcla, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formNucleo.get('fecha_solicitud')?.setValue(this.datePipe.transform(itm.fecha_solicitud, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formNucleo.get('fecha_programada')?.setValue(this.datePipe.transform(itm.fecha_programada, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formNucleo.get('mes')?.setValue(itm.mes.toString().length === 1 ? '0' + itm.mes.toString() : itm.mes.toString());
    this.formNucleo.get('anio')?.setValue(itm.anio.toString());
    // this.formNucleo.get('id_tipo_observacion')?.setValue(parseFloat(itm.id_tipo_observacion));
    // this.formNucleo.get('id_usuario_recibe_muestra')?.setValue(parseFloat(itm.id_usuario_recibe_muestra));
    this.formNucleo.get('id_capas')?.setValue(parseFloat(itm.id_capas));

    /// para llenar los input, SOLO CUANDO [bloquear == TRUE]
    if (this.bloquear) {
      this.listaPersonas.forEach((element: any) => {
        if (element.id_persona === itm.id_persona_residente_social) this.nombre4769 = element.nombre;
        if (element.id_persona === itm.id_persona_director_obra) this.nombre4770 = element.nombre;
      });
      this.lista[10].forEach((element:any) => {
        if (element.id_tipo === itm.id_tipo_intervencion) { return this.descripcion = element.descripcion; }
      });
      this.lista[104].forEach((element: any) => {
        if (parseFloat(element.valor) === itm.mes) { return this.mes = element.descripcion; }
      });
      this.lista[103].forEach((element: any) => {
        if (parseFloat(element.valor) === itm.anio) { return this.anio = element.descripcion; }
      });
      this.lista[64].forEach((element: any) => {
        if (element.id_tipo === itm.id_capas) { return this.listaCapas = element.descripcion; }
      });
    }

    //// aplica los datos que trae el servicio de buscarMantenimientosActivos
    this.pKsSelected = listasMttActivos.respuesta;
    this.formNucleo.get('listaPKMantActivos')?.setValue(listasMttActivos.respuesta);

    //// masajea los datos que trae de ensayo relacionados a la solicitud
    this.listaEnsayoSelected = "";
    this.listaEnsayoSelected = listasEnsayos.respuesta;
    this.listaEnsayolenth = listasEnsayos.respuesta.length;
    this.formNucleo.get('listaEnsayo')?.setValue(listasEnsayos.respuesta);

    //// aplica el tipo de material seleccionado 
    this.actualiza = true;
    if (typeof listasMaterial.respuesta[0] !== 'undefined'){
      this.formNucleo.get('id_tipo_material_ensayo')?.setValue(listasMaterial.respuesta[0].id_tipo_material_ensayo);
      this.descripcion_tipo_grupo = listasMaterial.respuesta[0].descripcion_tipo_grupo;
    }
    
    /// para llenar los input, SOLO CUANDO [bloquear == TRUE]
    if (this.bloquear) {    
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

    this.formNucleo.get('id_ensayo')?.setValue(itm.id_ensayo);
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
      this.formNucleo.get('listaPKMantActivos')?.setValue(result);
      if (this.formNucleo.invalid) this.formNucleo.markAllAsTouched();
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
      console.log(this.listaEnsayoSelected)
      this.formNucleo.get('listaEnsayo')?.setValue(result);
      if (this.formNucleo.invalid) this.formNucleo.markAllAsTouched();
    });
  }
  
  /** recibe las filas restantes del dialogo y actualiza el FormGroup */
  updatelistaPKMantActivos(event: any) {
    this.formNucleo.get('listaPKMantActivos')?.setValue(event)
  }
}
