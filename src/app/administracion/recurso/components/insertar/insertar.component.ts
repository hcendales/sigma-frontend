import { Respuesta } from './../../../../core/models/revision-visitas';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators, ValidationErrors, AbstractControl, AbstractControlOptions } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { ReplaySubject, Subject } from 'rxjs';
import {debounceTime, delay, tap, filter, map, startWith, takeUntil} from 'rxjs/operators';
import { Routes, Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import {Observable} from 'rxjs';
import { BooleanInput } from '@angular/cdk/coercion';

import { Recurso } from '../../../../core/models/recurso';
import { Franja } from '../../../../core/models/franjas';
import { ConsultaListasService } from './../../../../core/services/consulta-listas.service';
import { EntityTabRecursoService } from 'src/app/core/services/entity-tab-recurso.service';
import { EntityTabLugarService } from '../../../../core/services/entity-tab-lugar.service';
import { EntityTabPersonaService } from './../../../../core/services/entity-tab-persona.service';
import { EntityTabEquipoService } from './../../../../core/services/entity-tab-equipo.service';
import { EntityTabFranjaService } from '../../../../core/services/entity-tab-franja.service';
import { VerPersonaComponent } from '../ver-persona/ver-persona.component';
import { VerEquipoComponent } from '../ver-equipo/ver-equipo.component';
import { VerLugarComponent } from '../ver-lugar/ver-lugar.component';
import { ListarNovedadComponent } from '../listar-novedad/listar-novedad.component';
import { ListarFranjaComponent } from '../listar-franja/listar-franja.component';

// Entidades
import { Persona } from '../../../../core/models/persona';
import { Equipo } from '../../../../core/models/equipo';
import { Lugar } from '../../../../core/models/lugar';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string' && control.value != ''  ) {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}


@Component({
  selector: 'app-insertar',
  templateUrl: './insertar.component.html',
  styleUrls: ['./insertar.component.scss']
})
export class InsertarComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      value: null
    }
  };
  public entity: any;
  // Formulario
  public formEntity: FormGroup;
  public titulo = 'Crear Recurso';
  // Variable de validación
  public ready: boolean = false;
  public guardadoTodo: boolean = false;
  public listas: any;
  // Variables para envío a componentes según tipo de recurso
  public identificadorPersona: string='';
  public identificadorEquipo: string='';
  public identificadorLugar: string='';
  public fecInicialNumero: number = 0;
  public fecFinalNumero: number = 0;
  public horaInicio: string = '';
  public horaFin: string = '';
  public intervalo: number = 0;
  // Variables para retorno de id de los registros al llamar al componente
  public idRetornoPersona: number = 0;
  public idRetornoEquipo: number = 0;
  public idRetornoLugar: number = 0;
  //
  public verTabs: boolean = false;
  public selectedTab: number = 0;
  public idRecurso: number = 0;

  // Campos de busqueda
  public entidad: any[] = [];

  public filteredEntidades: Observable<any[]> = new Observable<any[]>();

  public selected = '';

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private entityTabRecursoService: EntityTabRecursoService,
    private entityTabFranjaService: EntityTabFranjaService,
    private entityTabPersonaService: EntityTabPersonaService,
    private entityTabEquipoService: EntityTabEquipoService,
    private entityTabLugarService: EntityTabLugarService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    let NUMBERS_PATTERN = /^[0-9]*$/;
    let HORAMIN_PATTERN = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation?.extras?.state;
    this.formEntity = this.formBuilder.group({
      recurso: this.formBuilder.group({
        idRecurso: [''],
        intervaloProgramacion: [''],
        idPersona: [''],
        idEquipo: [''],
        idLugar: [''],
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        horaInicioProgramacion: ['', [Validators.required, Validators.pattern(HORAMIN_PATTERN), Validators.maxLength(5)]],
        horaFinProgramacion: ['',[Validators.required, Validators.pattern(HORAMIN_PATTERN), Validators.maxLength(5)]],
        descripcion: ['', Validators.maxLength(100)],
      }),
      identificador: ['', autocompleteObjectValidator()],
      idTipoRecurso: ['', Validators.required],
    },{validator:this.filledOne} as AbstractControlOptions);
   }

  ngOnInit(): void {
    this.listasService.consultarListas([96]).then((listas) => {this.listas = listas; this.ready = true;});
  }
  private filledOne(formGroup: FormGroup){
    for(let c in formGroup.controls){
      if(c == 'fechas'){
        if(formGroup.get(c)?.get('desde')?.value && formGroup.get(c)?.get('hasta')?.value){
          return null;
        }
      }else{

      let value = formGroup.get(c)?.value
      if(value){
        if(typeof value == "string"){
          if(value.length > 0){
            return null;
          }
        }else{
          return null;
        }

      }
    }
    }
    return {'ningunoDiligenciado':true};
  }

  ngAfterViewInit() {
    // console.log('Id Rertono Persona:', this.idRetornoPersona);
    // console.log('Id Retorno Equipo:', this.idRetornoEquipo);
    // console.log('Id Retorno Lugar', this.idRetornoLugar);
  }

  get recursoForm(){
    return this.formEntity.controls["recurso"] as FormGroup;
  }

  get identificadorForm(){
    return this.formEntity.controls['identificador'] as FormControl;
  }

  get tipoRecursoForm(){
    return this.formEntity.controls['tipoRecurso'] as FormControl;
  }

async mostrarRecurso(e: any){
  let opcRecurso = e.value;
  // console.log ('Opcion :', opcRecurso);
  if(opcRecurso===4721){
    let condicion = "descripcion_estado_persona='ACTIVO'";
    let srvPersonasResp = await this.entityTabPersonaService.list(condicion);
    // console.log('Busco personas', srvPersonasResp.codError);
      if(srvPersonasResp.codError == 0){
        this.entidad = srvPersonasResp.respuesta;
        this.entidad.sort((a:any,b:any) => (a.nombre > b.nombre) ? 1 : ((b?.nombre > a.nombre) ? -1 : 0));
        this.filteredEntidades = this.formEntity.get('identificador')!.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value == null? '':value.nombre),
            map(name => name ? this._filterPersona(name) : this.entidad.slice())
          );

      }else{
        this.handleError();
      }
  }else if(opcRecurso===4722){
    let condicion = "descripcion_estado_equipo='ACTIVO'";
    let srvEquiposResp = await this.entityTabEquipoService.list(condicion);
    // console.log('Busco equipos', srvEquiposResp.codError);
      if(srvEquiposResp.codError == 0){
        this.entidad = srvEquiposResp.respuesta;
        this.entidad.sort((a:any,b:any) => (a.numero_interno > b.numero_interno) ? 1 : ((b?.numero_interno > a.numero_interno) ? -1 : 0));
        this.filteredEntidades = this.formEntity.get('identificador')!.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value == null? '':value.numero_interno),
            map(name => name ? this._filterEquipo(name) : this.entidad.slice())
          );

      }else{
        this.handleError();
      }
  }else if(opcRecurso===4723){
    let condicion = "descripcion_estado_lugar='ACTIVO'";
    let srvLugarResp = await this.entityTabLugarService.list(condicion);
    // console.log('Busco equipos', srvLugarResp.codError);
      if(srvLugarResp.codError == 0){
        this.entidad = srvLugarResp.respuesta;
        this.entidad.sort((a:any,b:any) => (a.nombre > b.nombre) ? 1 : ((b?.nombre > a.nombre) ? -1 : 0));
        this.filteredEntidades = this.formEntity.get('identificador')!.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value == null? '':value.nombre),
            map(name => name ? this._filterPersona(name) : this.entidad.slice())
          );

      }else{
        this.handleError();
      }
  }
}

public displayContactFn(contact?: any): string  {
  return contact ? contact.nombre : ''
}

public displayContactFnEquipo(contact?: any): string  {
  return contact ? contact.numero_interno : ''
}

private _filterPersona(value: string): string[] {
  const filterValue = value.toLowerCase().trim();
  return this.entidad.filter(persona => persona.nombre.toLowerCase().indexOf(filterValue) != -1);
}

private _filterEquipo(value: string): string[] {
  const filterValue = value.toLowerCase().trim();
  return this.entidad.filter(equipo => equipo.numero_interno.toLowerCase().indexOf(filterValue) != -1);
}

async  buscarRecurso(){
    // Verificar que tipo de recurso se debe traer
    this.identificadorPersona = '';
    this.identificadorEquipo = '';
    this.identificadorLugar = '';

    let opcRecurso = this.formEntity.get('idTipoRecurso')?.value;
    // console.log('Tipo Recurso:',opcRecurso);
    // Recurso a consultar
    if(opcRecurso===4721){
      // Persona
      let tmpid = this.formEntity.get('identificador')?.value;
      this.identificadorPersona = tmpid.id_persona;
      // console.log('identificadorPersona: ', this.identificadorPersona);
      this.verTabs = true;
      this.selectedTab = 0;
    }else if(opcRecurso===4722){
      // Equipo
      let tmpid = this.formEntity.get('identificador')?.value;
      this.identificadorEquipo = tmpid.id_equipo;
      // console.log('identificadorEquipo: ', this.identificadorEquipo);
      this.verTabs = true;
      this.selectedTab = 1;
    }else if(opcRecurso===4723){
      // Lugar
      let tmpid = this.formEntity.get('identificador')?.value;
      this.identificadorLugar = tmpid.id_lugar;
     // console.log('identificadorLugar: ', this.identificadorLugar);
      this.verTabs = true;
      this.selectedTab = 2;
    }
  }

  async save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        // const value = this.formEntity.value;
        let fecInicio = new Date(this.recursoForm.controls.fechaInicio?.value);
        let fecFin = new Date(this.recursoForm.controls.fechaFin?.value);
        this.fecInicialNumero =fecInicio.getTime();
        this.fecFinalNumero= fecFin.getTime();
        //
        this.intervalo = this.recursoForm.get('intervaloProgramacion')?.value;
        this.recursoForm.controls.idPersona.setValue(this.idRetornoPersona);
        this.recursoForm.controls.idEquipo.setValue(this.idRetornoEquipo);
        this.recursoForm.controls.idLugar.setValue(this.idRetornoLugar);
        let objRecurso: Recurso =  {
          idRecurso: this.recursoForm.get('idRecurso')?.value,
          idTipoRecurso: this.formEntity.get('idTipoRecurso')?.value,
          intervaloProgramacion: this.recursoForm.get('intervaloProgramacion')?.value,
          idPersona: this.recursoForm.get('idPersona')?.value,
          idEquipo: this.recursoForm.get('idEquipo')?.value,
          idLugar: this.recursoForm.get('idLugar')?.value,
          fechaInicio: fecInicio.getTime(),
          fechaFin: fecFin.getTime(),
          horaInicioProgramacion: this.recursoForm.get('horaInicioProgramacion')?.value,
          horaFinProgramacion: this.recursoForm.get('horaFinProgramacion')?.value,
          descripcion: this.recursoForm.get('descripcion')?.value,
        }
        let opcRecurso = this.formEntity.get('idTipoRecurso')?.value;
        let result;
        if(opcRecurso===4721){
          result = await this.entityTabRecursoService.insertarRecursoPersona(objRecurso);
        }else if(opcRecurso===4722){
          result = await this.entityTabRecursoService.insertarRecursoEquipo(objRecurso);
        }else if(opcRecurso===4723){
          result = await this.entityTabRecursoService.insertarRecursoLugar(objRecurso);
        }
        if(result.codError===null){
          alert('Verificar. ' + result.msgError);
          dialogRef.close();
        }else{
          this.idRecurso = result.respuesta[0][":b1"];
          dialogRef.close();
          this.operationSuccess();
          // Revisión para envio a Actualizar
          let condicion = "id_recurso=" + this.idRecurso;
          let resp = await this.entityTabRecursoService.list(condicion);
          if(resp.respuesta[0]){
            const navigation = this.router.getCurrentNavigation();
            this.navigationExtras.state = resp.respuesta[0];
            this.router.navigate(['dashboard/administracion-recurso/actualizar'], this.navigationExtras);
          }else{
            alert('Verificar, No se pudo realizar consulta');
         }
        }
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
    }else {
      this.formEntity.markAllAsTouched();
    }
  }

  cancel(event: Event) {
    event.preventDefault();
    console.log('click');
  }

  returnlist(): void{
    this.router.navigate(['dashboard/administracion-recurso/listar']);
  }

  operationSuccess(){

    this.snackBar.open('Cambios realizados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  handleError(error?:any){
    console.log('Error',error);
    let txtError = ''
    if(error.msgError){
      txtError = error.msgError;
    }else if (error.error){
      txtError = error.error.msgError;
    }else{
      txtError = error.status;
    }
    const dialogRef = this.dialog.open(SimpleDialogComponent,{
      data:{
        contenido: 'Hubo un error en la operación: ' + txtError,
        aceptar: true
      }
    });
  }

  mostrarVentanaEnEspera(titulo: string, footer?: string){
    const data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }
  // Campo a validar Identificacion
  get tipoRecursoField(): any{
    return this.formEntity.get('idTipoRecurso');
  }

  get identificadorField(): any{
    return this.formEntity.get('identificador');
  }

  get intervaloProgramacionField(): any{
    return this.recursoForm.get('intervaloProgramacion');
  }

  get horaInicioProgramacionField(): any{
    return this.recursoForm.get('horaInicioProgramacion');
  }

  get horaFinProgramacionField(): any{
    return this.recursoForm.get('horaFinProgramacion');
  }



}
