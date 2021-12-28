import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { EntityTabFranjaService } from '../../../../core/services/entity-tab-franja.service';
import { Franja } from  '../../../../core/models/franjas';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-insertar-franja',
  templateUrl: './insertar-franja.component.html',
  styleUrls: ['./insertar-franja.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class InsertarFranjaComponent implements OnInit {
  public formEntity: FormGroup;
  public listas: any;
  public ready:boolean = false;
  public idRecursoNovedad: number = 0;
  public NUMBERS_PATTERN = /^[0-9]+(.[0-9]{0,2})*$/;
  public HORAMIN_PATTERN = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  public titulo = "FRANJA DE DISPONIBILIDAD";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {idRecurso: number,
      fechaDesde: number,
      fechaHasta: number,
      horaInicio: string,
      horaFin: string,
      intervalo: number,
    },
      private activatedroute: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private entityTabFranjaService: EntityTabFranjaService,
      private listasService: ConsultaListasService,
  ) {
    this.formEntity = this.formBuilder.group({
      idRecurso: [''],
      fechaDesde: [''],
      fechaHasta: [''],
      horaInicio: ['', [Validators.required]],
      horaFin: [''],
      intervalo: ['']
    })
   }

  ngOnInit(): void {
    if(!this.data.idRecurso){
      // Nuevo registro
      console.log('id', this.data.idRecurso);
      this.formEntity.controls['idRecurso'].setValue(this.data.idRecurso);
    }
    else{
      this.formEntity.controls.idRecurso.setValue(this.data.idRecurso);
      if(this.data.fechaDesde !== null) {
        let fechaini = new Date(this.data.fechaDesde).toISOString().slice(0, 10);
        this.formEntity.controls.fechaDesde.setValue(fechaini.toString());
      }
      if(this.data.fechaHasta !== null) {
        let fechahasta = new Date(this.data.fechaHasta).toISOString().slice(0, 10);
        this.formEntity.controls.fechaHasta.setValue(fechahasta.toString());
      }
      this.formEntity.controls.horaInicio.setValue(this.data.horaInicio);
      this.formEntity.controls.horaFin.setValue(this.data.horaFin);
      this.formEntity.controls.intervalo.setValue(this.data.intervalo);
      this.ready=true;
    }
  }

  async onSubmit(){
    try{
      await this.saveFranja();
      this.operationSuccess();
      this.dialog.closeAll();
    }catch(e){
      console.log('El error', e);
      console.error('ERROR al guardar todo');
    }
  }

  async  saveFranja(){

    let fecInicio = new Date(this.formEntity.controls.fechaDesde?.value);
    let fecFin = new Date(this.formEntity.controls.fechaHasta?.value);
    let objFranja: Franja = {
      idRecurso: this.formEntity.get('idRecurso')?.value,
      fechaDesde: fecInicio.getTime(),
      fechaHasta: fecFin.getTime(),
      horaInicio: this.formEntity.get('horaInicio')?.value,
      horaFin: this.formEntity.get('horaFin')?.value,
      intervalo: this.formEntity.get('intervalo')?.value,
    }
    console.log('Crear ObjFranja:', objFranja);
    let result = await this.entityTabFranjaService.insertar(objFranja);
    if(result.codError===null || result.codError===0){
     alert('Verificar. ' + result.msgError);
     // this.mostrarVentanaEnEspera('ALERTA', result.msgError);
    }
    console.log('Respuesta al salvar:', result);
  }

  cancel(event: Event) {
    event.preventDefault();
    console.log('click');
    this.dialog.closeAll();
  }

  operationSuccess(){

    this.snackBar.open('Cambios realizados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  handleError(error?:any){
    let txtError = ''
    if(error.msjError){
      txtError = error.msjError;
    }else if (error.error){
      txtError = error.error.msjError;
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

  get fechaDesdeField(): any{
    return this.formEntity.get('fechaDesde');
  }

  get fechaHastaField(): any{
    return this.formEntity.get('fechaHasta');
  }


  get horaInicioField(): any{
    return this.formEntity.get('horaInicio');
  }

  get horaFinField(): any{
    return this.formEntity.get('horaFin');
  }

   get intervaloField(): any{
     return this.formEntity.get('intervalo');
   }

}
