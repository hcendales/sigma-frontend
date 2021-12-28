import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalListaEnsayosComponent } from '../modal-lista-ensayos/modal-lista-ensayos.component';
import { ModalTableAsociarComponent } from '../modal-table-asociar/modal-table-asociar.component';

@Component({
  selector: 'app-servicio-densidad',
  templateUrl: './servicio-densidad.component.html',
  styleUrls: ['./servicio-densidad.component.scss'],
  providers: [DatePipe]
})
export class ServicioDensidadComponent implements OnInit {
  @Input() rowUpdate : any;
  @Input() bloquear: boolean = false;       /// (CUS 12 / Cargue de Resultado), solicita solo ver los datos y no deben modificar.
  @Output() guardar = new EventEmitter();

  listaEnsayoSelected    : any = "";
  pKsSelected            = '';                  
  material_ensayar       : any;
  tipo_material          : any;
  ready                  : boolean | undefined;
  tipoOrigenSeleccionado !: number;
  listaEnsayolenth       : number = 0;
  loading                : boolean = false;
/**
 * Este campo compone el codigo del ensayo asi que para mantener un control en el versionamiento
 * se bloque este campo, asi al actualizar la solicitud este dato cambie y asi se pierda el codigo del ensayo de los ensayos anteriores.
 */
  actualiza           : boolean = false;
  
  

  //Filtro de (recidente_obra y director_obra)
  filteredResident       : Observable<any[]> = new Observable<any[]>();
  filteredDirector       : Observable<any[]> = new Observable<any[]>();
  personasResident       : any[] = [];
  personasDirector       : any[] = [];
  srvPersonasResp        : any;
  listaPersonas          : any;
  listaUsuarios          : any;
  listaTipoMaterial      : any;
  descripcion_tipo_grupo : string = "";
  nombre4769             : string  = "";
  nombre4770             : string  = "";
  listaObservacion       : string = ""
  listaRecibeMuestra     : string = ""
  lista                  : any;
  listaJornada           : string = ""

  /*** validador de campos */
  formDensidad : FormGroup = this.fb.group({
    codigo_ensayo               : [ , ],
    fecha_programada            : [ ,Validators.required],
    fecha_recepcion             : [ ,Validators.required],
    fecha_solicitud             : [ , ],
    hora                        : [ ,Validators.required],
    id_documento                : [0, ],
    id_ensayo                   : [0, ],
    id_jornada                  : [ , ],              
    id_persona_director_obra    : [ ,Validators.required],
    id_persona_residente_social : [ ,Validators.required],
    id_tipo_material_ensayo     : [ ,Validators.required],
    // id_tipo_observacion         : [ , ],   
    id_tipo_servicio            : [53, ],
    // id_usuario_recibe_muestra   : [ , ],
    listaEnsayo                 : [ ,Validators.required],
    listaPKMantActivos          : [ ,Validators.required],
    observacion                 : [ , ],
    telefono_director_obra      : [ ,[Validators.required, Validators.pattern('\\d{10}')]],
    telefono_residente_social   : [ ,[Validators.required, Validators.pattern("^[0-9]*$"), Validators.pattern('\\d{10}')]],
  });


  constructor(private fb: FormBuilder, public dialog: MatDialog, 
              public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
              public consultaListasService: ConsultaListasService,
              public entityTabPersonaService: EntityTabPersonaService,
              private snackBar:MatSnackBar, 
              private datePipe: DatePipe) { }

  async ngOnInit() { 
    this.loading = true;

    /**
     * aqui se envia los datos del formulario a "registrarForm" para ser guardados,
     * No se desea validar cuando el formulario esta solo lectura
     */
    this.formDensidad.valueChanges.subscribe(datosDensidad => {
      if (!this.bloquear) this.formDensidad.valid ? this.guardar.emit(datosDensidad) : this.guardar.emit(false);
    })

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
    await this.consultaListasService.consultarListas([58, 107]).then((lista) => { this.lista = lista; this.ready = true; });

    /** Consulta la lista de usuarios a mostrar en los recidente_obra y director_obra */
    await this.solicitudEnsayoLaboratorioService.buscarPersona('id_tipo_rol in (4769, 4770, 3157)').then((lista) => {
      this.listaPersonas = lista.respuesta; 
      this.ready = true;
    })
  
    /** Consulta la lista de usuarios a mostrar en quien recibe la muestra */
    await this.entityTabPersonaService.listUsuarios("").then((listaUsuarios) => {
      this.listaUsuarios = listaUsuarios.respuesta;
      this.ready = true; 
    });
  
    /** Consulta las litas de materiales filtrado por servicio */
    await this.solicitudEnsayoLaboratorioService.buscarTipoMateriales('DN').then((lista) => { this.listaTipoMaterial = lista.respuesta; this.ready = true; });

    /** Permite Cargar los datos para un Update */
    if (this.rowUpdate.id_tipo_servicio && this.rowUpdate.id_tipo_servicio === 53) await this.cargarDatos(this.rowUpdate);

    this.loading = false;
  }
  async cargarDatos(itm : SolicitudEnsayoLaboratorio){
    //console.log("densidad ~> ", itm);

    /**
     * Este campo compone el codigo del ensayo asi que para mantener un control en el versionamiento
     * se bloque este campo, asi al actualizar la solicitud este dato cambie y asi se pierda el codigo del ensayo de los ensayos anteriores.
     */
       //// Busca los datos correspondiente a cada modal
    const listasEnsayos     = await this.solicitudEnsayoLaboratorioService.buscarEnsayos("id_ensayo = " + itm.id_ensayo);
    const listasMttActivos  = await this.solicitudEnsayoLaboratorioService.buscarMantenimientosActivos("id_ensayo = " + itm.id_ensayo);
    const listasMaterial    = await this.solicitudEnsayoLaboratorioService.buscarMaterial("id_ensayo = " + itm.id_ensayo);

    this.formDensidad.patchValue(itm);
    this.formDensidad.get('fecha_recepcion')?.setValue(this.datePipe.transform(itm.fecha_recepcion, 'yyyy-MM-dd') + 'T05:00:00.000Z' );
    this.formDensidad.get('fecha_programada')?.setValue(this.datePipe.transform(itm.fecha_programada, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    this.formDensidad.get('fecha_solicitud')?.setValue(this.datePipe.transform(itm.fecha_solicitud, 'yyyy-MM-dd') + 'T05:00:00.000Z');
    // this.formDensidad.get('id_tipo_observacion')?.setValue(parseFloat(itm.id_tipo_observacion));
    // this.formDensidad.get('id_usuario_recibe_muestra')?.setValue(parseFloat(itm.id_usuario_recibe_muestra));
    this.formDensidad.get('id_jornada')?.setValue(parseFloat(itm.id_jornada));

    /// para llenar los input, SOLO CUANDO [bloquear == TRUE]
    if (this.bloquear){
      this.listaPersonas.forEach((element: any) => {
        if (element.id_persona === itm.id_persona_residente_social) this.nombre4769 = element.nombre;
        if (element.id_persona === itm.id_persona_director_obra) this.nombre4770 = element.nombre;
      });
    }
    
    //// masajea los datos que trae de ensayo relacionados a la solicitud
    this.listaEnsayoSelected = "";
    this.listaEnsayoSelected = listasEnsayos.respuesta;
    this.listaEnsayolenth = listasEnsayos.respuesta.length;
    this.formDensidad.get('listaEnsayo')?.setValue(listasEnsayos.respuesta);

    //// aplica los datos que trae el servicio de buscarMantenimientosActivos
    this.pKsSelected = listasMttActivos.respuesta;
    this.formDensidad.get('listaPKMantActivos')?.setValue(listasMttActivos.respuesta);
    
    //// aplica el tipo de material seleccionado 
    this.actualiza = true;
    if (typeof listasMaterial.respuesta[0] !== 'undefined') {
      this.formDensidad.get('id_tipo_material_ensayo')?.setValue(listasMaterial.respuesta[0].id_tipo_material_ensayo);
      this.descripcion_tipo_grupo = listasMaterial.respuesta[0].descripcion_tipo_grupo;
    }
    
    /// para llenar los input, SOLO CUANDO [bloquear == TRUE]
    if (this.bloquear) {
      this.listaJornada       = itm.desc_jornada;
      this.lista[58].forEach((element: any) => {
        if (element.id_tipo === parseInt(itm.id_jornada))
          return this.listaJornada = element.descripcion
      });      
      // this.lista[107].forEach((element: any) => {
      //   if (element.id_tipo === parseInt(itm.id_tipo_observacion))
      //     return this.listaObservacion = element.descripcion
      // });
      // this.listaUsuarios.forEach((element: any) => {
      //   if (element.id_usuario === parseInt(itm.id_usuario_recibe_muestra)){
      //     return this.listaRecibeMuestra = element.nombre;
      //   }
      // });
      // this.listaPersonas.forEach((element: any) => {
      //   if (element.id_tipo_rol === 3157 && element.id_persona === parseInt(itm.id_usuario_recibe_muestra))
      //     return this.listaRecibeMuestra = element.nombre;
      // });
    }

    this.formDensidad.get('id_ensayo')?.setValue(itm.id_ensayo);
  }

  _filterResident(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.personasResident.filter(resident => resident.nombre.toLowerCase().indexOf(filterValue) != -1);
  }

  _filterDirector(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.personasDirector.filter(director => director.nombre.toLowerCase().indexOf(filterValue) != -1);
  }
  
  displayContactFn(contact?: any): string {
    return contact ? contact.nombre : ''
  }

  handleError(){
    this.snackBar.open('Error al realizar la consulta', 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /** modal con PKs mantenimientos Activos */
  openDialogAsociarPKs( item : any ): void { 
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
      this.formDensidad.get('listaPKMantActivos')?.setValue(result);
      if (this.formDensidad.invalid) this.formDensidad.markAllAsTouched();
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
      this.formDensidad.get('listaEnsayo')?.setValue(result);
      if (this.formDensidad.invalid) this.formDensidad.markAllAsTouched();
    });
  }
  /** recibe las filas restantes del dialogo y actualiza el FormGroup */
  updatelistaPKMantActivos(event: any) {
    this.formDensidad.get('listaPKMantActivos')?.setValue(event)
  }

}
