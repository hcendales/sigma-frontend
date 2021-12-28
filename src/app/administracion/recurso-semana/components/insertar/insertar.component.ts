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
import { VerEquipoComponent } from '../../../recurso/components/ver-equipo/ver-equipo.component';
import { ListarFranjaComponent } from '../../../recurso/components/listar-franja/listar-franja.component';

@Component({
  selector: 'app-insertar',
  templateUrl: './insertar.component.html',
  styleUrls: ['./insertar.component.scss']
})
export class InsertarComponent implements OnInit {
   // Formulario
   public formEntity: FormGroup;
   public titulo = 'Vehículo Disponibilidad Semanal';
   // Variable de validación
   public ready: boolean = false;
   public guardadoTodo: boolean = false;
   public listas: any;
   // Variables para envío a componentes según tipo de recurso
   public identificadorEquipo: string='';
   public fecInicialNumero: number = 0;
   public fecFinalNumero: number = 0;
   public horaInicio: string = '';
   public horaFin: string = '';
   public intervalo: number = 0;
   // Variables para retorno de id de los registros al llamar al componente
   public idRetornoEquipo: number = 0;
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
      identificador: ['', Validators.required],
      idTipoRecurso: ['', Validators.required],
    }, { updateOn: 'blur'});
  }

  ngOnInit(): void {
    this.listasService.consultarListas([96]).then((listas) => {this.listas = listas; this.ready = true;});
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


async  buscarRecurso(){
    // Verificar que tipo de recurso se debe traer
    let opcRecurso = this.formEntity.get('idTipoRecurso')?.value;
    console.log('Tipo Recurso:',opcRecurso);
    // Recurso a consultar
    if(opcRecurso===4722){
      // Equipo
      this.identificadorEquipo = this.formEntity.get('identificador')?.value;
      console.log('identificadorEquipo: ', this.identificadorEquipo);
      this.verTabs = true;
      this.selectedTab = 1;
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
        //
        this.fecInicialNumero =fecInicio.getTime();
        this.fecFinalNumero= fecFin.getTime();
        //
        this.intervalo = this.recursoForm.get('intervaloProgramacion')?.value;
        this.recursoForm.controls.idEquipo.setValue(this.idRetornoEquipo);
        let objRecurso: Recurso =  {
          idRecurso: 0,
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
        this.horaInicio = this.recursoForm.get('horaInicioProgramacion')?.value;
        this.horaFin = this.recursoForm.get('horaFinProgramacion')?.value;
        this.idRecurso = result.respuesta[0][":b1"];
        this.recursoForm.controls.idRecurso.setValue(result.respuesta[0][":b1"]);
        console.log('ID nuevo',this.recursoForm.controls.idRecurso.value);
        this.saveFranja();
        dialogRef.close();
        this.operationSuccess();
       // this.formEntity.reset();
       // this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(()=>
       // this.router.navigate(["dashboard/administracion-personas/listar"]));
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
    }else {
      this.formEntity.markAllAsTouched();
    }
  }

async  saveFranja(){
    let fecInicio = new Date(this.recursoForm.controls.fechaInicio?.value);
    let fecFin = new Date(this.recursoForm.controls.fechaFin?.value);
    let objFranja: Franja = {
      idRecurso: this.recursoForm.get('idRecurso')?.value,
      fechaDesde: fecInicio.getTime(),
      fechaHasta: fecFin.getTime(),
      horaInicio: this.recursoForm.get('horaInicioProgramacion')?.value,
      horaFin: this.recursoForm.get('horaFinProgramacion')?.value,
      intervalo: this.recursoForm.get('intervaloProgramacion')?.value,
    }
    let result = await this.entityTabFranjaService.insertar(objFranja);
  }

  cancel(event: Event) {
    event.preventDefault();
    console.log('click');
  }

  returnlist(): void{
    this.router.navigate(['dashboard/administracion-personas/listar']);
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
