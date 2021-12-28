import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { listaEnsayo, SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalListaEnsayosComponent } from '../modal-lista-ensayos/modal-lista-ensayos.component';
import { ModalListaMaterialesComponent } from '../modal-lista-materiales/modal-lista-materiales.component';


@Component({
  selector: 'app-servicio-formula',
  templateUrl: './servicio-formula.component.html',
  styleUrls: ['./servicio-formula.component.scss'],
  providers: [DatePipe]
})
export class ServicioFormulaComponent implements OnInit {
  descripcion_tipo_grupo   : string = "";
  lista                    : any;
  listaEnsayoSelected      : any;
  listaEnsayolenth         : number = 0;
  listaMaterialSelected    : any;
  listaMaterialeslenth     : number = 0;
  listaObservacion         : string = ""
  listaPersonas            : any;  
  listaRecibeMuestra       : string = ""
  listaTipoMaterial        : any;
  pKsSelected              = '';
  ready                    : boolean = false;
  readyListas              : boolean = false;
  loading                  : boolean = false;
  listaUsuarios            : any;
  /**
   * Este campo compone el codigo del ensayo asi que para mantener un control en el versionamiento
   * se bloque este campo, asi al actualizar la solicitud este dato cambie y asi se pierda el codigo del ensayo de los ensayos anteriores.
   */
  actualiza: boolean = false;

  @Input() bloquear: boolean = false;       /// (CUS 12 / Cargue de Resultado), solicita solo ver los datos y no deben modificar.
  @Input() rowUpdate: any;
  @Output() guardar = new EventEmitter();
  
  formFormula: FormGroup = this.fb.group({
    codigo_ensayo   : [ , ],
    descripcion     : [ ,],
    // fecha_recepcion : [ ,Validators.required],
    fecha_solicitud : [ , ],    
    id_documento    : [0, ],
    id_ensayo       : [0, ],
    id_tipo_material_ensayo  : [ ,Validators.required],
    // id_tipo_observacion: [,],
    id_tipo_servicio: [56, ],      
    // id_usuario_recibe_muestra: [,],
    listaEnsayo     : [ ,Validators.required],
    listaMateriales : [ ,Validators.required],
    mezcla_formula  : [ ,Validators.required],
    fecha_programada: [, Validators.required],
  });

  constructor(private fb: FormBuilder, 
              public dialog: MatDialog,
              public datePipe: DatePipe,
              public consultaListasService: ConsultaListasService, 
              public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
              public entityTabPersonaService: EntityTabPersonaService,) { }

  async ngOnInit() {
    this.loading = true;
    /**
     * aqui se envia los datos del formulario a "registrarForm" para ser guardados,
     * No se desea validar cuando el formulario esta solo lectura
     */
    this.formFormula.valueChanges.subscribe(datosFormula => {
      if (!this.bloquear)this.formFormula.valid ? this.guardar.emit(datosFormula) : this.guardar.emit(false);
    });

    /** obtiene las listas (2)Estado Pk, (104)Mes, (103)Año, (52) Tipo de Mezcla (10) Tipo de Intervencion (107) Tipo Observacion*/
    await this.consultaListasService.consultarListas([107]).then((lista) => { this.lista = lista; this.readyListas = true; });

    /** Consulta la lista de usuarios a mostrar en los recidente_obra y director_obra. -id_persona_residente_social = 3157 */
    await this.solicitudEnsayoLaboratorioService.buscarPersona('id_tipo_rol in (3157)').then((lista) => { this.listaPersonas = lista.respuesta; this.ready = true; })

    /** Consulta la lista de usuarios a mostrar en quien recibe la muestra */
    await this.entityTabPersonaService.listUsuarios("").then((listaUsuarios) => { this.listaUsuarios = listaUsuarios.respuesta; this.ready = true; });

    /** Consulta las litas de materiales filtrado por servicio */
    await this.solicitudEnsayoLaboratorioService.buscarTipoMateriales('FT').then((lista) => {  this.listaTipoMaterial = lista.respuesta; this.ready = true; });

    /** Permite Cargar los datos para un Update */
    if (this.rowUpdate.id_tipo_servicio && this.rowUpdate.id_tipo_servicio === 56) await this.cargarDatos(this.rowUpdate);

    this.loading = false;
  }

  async cargarDatos(itm: SolicitudEnsayoLaboratorio) {
    //console.log("Formula ~> ", itm);

    //// Busca los datos correspondiente a cada modal
    const listasEnsayos  = await this.solicitudEnsayoLaboratorioService.buscarEnsayos("id_ensayo = " + itm.id_ensayo);
    const listasMaterial = await this.solicitudEnsayoLaboratorioService.buscarMaterial("id_ensayo = " + itm.id_ensayo);
    
    //// aplica los datos que trae en el ITM
    this.formFormula.patchValue(itm);
    // this.formFormula.get('fecha_recepcion')?.setValue(this.datePipe.transform(itm.fecha_recepcion, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formFormula.get('fecha_solicitud')?.setValue(this.datePipe.transform(itm.fecha_solicitud, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formFormula.get('fecha_programada')?.setValue(this.datePipe.transform(itm.fecha_programada, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    // this.formFormula.get('id_tipo_observacion')?.setValue(parseFloat(itm.id_tipo_observacion));
    // this.formFormula.get('id_usuario_recibe_muestra')?.setValue(parseFloat(itm.id_usuario_recibe_muestra));

    //// masajea los datos que trae de ensayo relacionados a la solicitud
    this.listaEnsayoSelected = "";
    this.listaEnsayoSelected = listasEnsayos.respuesta
    this.listaEnsayolenth = listasEnsayos.respuesta.length;
    this.formFormula.get('listaEnsayo')?.setValue(listasEnsayos.respuesta);

    this.actualiza = true;
    this.listaMaterialSelected = [];
    listasMaterial.respuesta.forEach((element:any) => {
      if (element.fuente_material === null){
        ///Aquel que pertenece al campo del formulario
        this.formFormula.get('id_tipo_material_ensayo')?.setValue(element.id_tipo_material_ensayo);
        this.descripcion_tipo_grupo = element.descripcion_tipo_grupo;

      }else{
        ///Otros que fueron seleccionados en el modal
        this.listaMaterialSelected.push( element );
      }
    });

    this.listaMaterialeslenth = this.listaMaterialSelected.length;
    this.formFormula.get('listaMateriales')?.setValue(this.listaMaterialSelected);

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

    this.formFormula.get('id_ensayo')?.setValue(itm.id_ensayo);
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
      this.formFormula.get('listaEnsayo')?.setValue(result);
      if (this.formFormula.invalid) this.formFormula.markAllAsTouched();
    });
  }

  /** modal con lista de ensayos del servicio */
  openDialogListasMateriales(item: any): void {

    const dialogRef = this.dialog.open(ModalListaMaterialesComponent, {
      width: '60%',
      height: '80%',
      data: {
        itm: item,
        invs: this.listaMaterialSelected,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) return;
      if (result[0] === "") result = null;

      this.listaMaterialSelected = "";
      this.listaMaterialSelected = result
      this.listaMaterialeslenth = result.length;
      this.formFormula.get('listaMateriales')?.setValue(result);
      if (this.formFormula.invalid) this.formFormula.markAllAsTouched();
    });
  }
}
