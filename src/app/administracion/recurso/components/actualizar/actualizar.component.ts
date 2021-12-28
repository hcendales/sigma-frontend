import { Respuesta } from './../../../../core/models/revision-visitas';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

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

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss']
})
export class ActualizarComponent implements OnInit {
  public entity: any;
  // Formulario
  public formEntity: FormGroup;
  public titulo = 'Actualizar Recurso';
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

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private entityTabRecursoService: EntityTabRecursoService,
    private entityTabFranjaService: EntityTabFranjaService,
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
      identificador: [{value:'',disabled: true}, Validators.required],
      idTipoRecurso: [{value:'',disabled: true}, Validators.required],
    }, { updateOn: 'blur'});
  }

  ngOnInit(): void {
    if (typeof this.entity === 'undefined'){
      // Redirigir
      this.router.navigate(['dashboard/administracion-recurso/listar']);
    }else{
      this.recursoForm.controls.idRecurso.setValue(this.entity.id_recurso);
      this.idRecurso = this.entity.id_recurso;
      this.formEntity.controls.idTipoRecurso.setValue(this.entity.id_tipo_recurso);
      if(this.entity.id_tipo_recurso===4721){
        this.formEntity.controls.identificador.setValue(this.entity.identificacion_recurso);
      }else if(this.entity.id_tipo_recurso===4722){
        this.formEntity.controls.identificador.setValue(this.entity.placa_equipo);
      }else if(this.entity.id_tipo_recurso===4723){
        this.formEntity.controls.identificador.setValue(this.entity.nombre_lugar);
      }
      this.recursoForm.controls.intervaloProgramacion.setValue(this.entity.intervalo_programacion);
      this.recursoForm.controls.idPersona.setValue(this.entity.id_persona);
      this.recursoForm.controls.idEquipo.setValue(this.entity.id_equipo);
      this.recursoForm.controls.idLugar.setValue(this.entity.id_lugar);
      this.fecInicialNumero = this.entity.fecha_inicio;
      this.fecFinalNumero = this.entity.fecha_fin;
      this.intervalo = this.entity.intervalo_programacion;
      let fechault = new Date(this.entity.fecha_inicio).toISOString().slice(0, 22);
      console.log('Fecha ', fechault.toString());
      this.recursoForm.controls.fechaInicio.setValue(fechault.toString());
      if(this.entity.fecha_fin !== null){
        let fechasig = new Date(this.entity.fecha_fin).toISOString().slice(0, 22);
        this.recursoForm.controls.fechaFin.setValue(fechasig.toString());
      }
      this.horaInicio = this.entity.hora_inicio_programacion;
      this.horaFin = this.entity.hora_fin_programacion;
      this.recursoForm.controls.horaInicioProgramacion.setValue(this.entity.hora_inicio_programacion);
      this.recursoForm.controls.horaFinProgramacion.setValue(this.entity.hora_fin_programacion);
      this.recursoForm.controls.descripcion.setValue(this.entity.descripcion);
      this.buscarRecurso();
      this.listasService.consultarListas([96]).then((listas) => {this.listas = listas; this.ready = true;});
    }
  }

  async  buscarRecurso(){
    // Verificar que tipo de recurso se debe traer
    let opcRecurso = this.formEntity.get('idTipoRecurso')?.value;
    console.log('Tipo Recurso:',opcRecurso);
    // Recurso a consultar
    if(opcRecurso===4721){
      // Persona
      this.identificadorPersona = this.recursoForm.get('idPersona')?.value;
      console.log('identificadorPersona: ', this.identificadorPersona);
      this.verTabs = true;
      this.selectedTab = 0;
    }else if(opcRecurso===4722){
      // Equipo
      this.identificadorEquipo = this.recursoForm.get('idEquipo')?.value;
      console.log('identificadorEquipo: ', this.identificadorEquipo);
      this.verTabs = true;
      this.selectedTab = 1;
    }else if(opcRecurso===4723){
      // Lugar
      this.identificadorLugar = this.recursoForm.get('idLugar')?.value;
      console.log('identificadorLugar: ', this.identificadorLugar);
      this.verTabs = true;
      this.selectedTab = 2;
    }
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

  async save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        // const value = this.formEntity.value;
        let fecInicio = new Date(this.recursoForm.controls.fechaInicio?.value);
        let fecFin = new Date(this.recursoForm.controls.fechaFin?.value);
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
        console.log('ObjRecurso para actualizar: ', objRecurso);
        let opcRecurso = this.formEntity.get('idTipoRecurso')?.value;
        let result;
        if(opcRecurso===4721){
          result = await this.entityTabRecursoService.actualizarRecursoPersona(objRecurso);
        }else if(opcRecurso===4722){
          result = await this.entityTabRecursoService.actualizarRecursoEquipo(objRecurso);
        }else if(opcRecurso===4723){
          result = await this.entityTabRecursoService.actualizarRecursoLugar(objRecurso);
        }
        console.log('Respuesta : ', result);
        if(result.codError===null || result.codError===0){
          alert('Verificar. ' + result.msgError);
        }
        // this.idRecurso = result.respuesta[0][":b1"];
        // this.recursoForm.controls.idRecurso.setValue(result.respuesta[0][":b1"]);
        console.log('ID nuevo: ',this.recursoForm.controls.idRecurso.value);
        dialogRef.close();
        this.operationSuccess();
        // this.ngOnInit();
        // this.formEntity.reset();
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
