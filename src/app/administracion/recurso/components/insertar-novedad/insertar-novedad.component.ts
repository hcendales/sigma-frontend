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

import { EntityTabNovedadService } from '../../../../core/services/entity-tab-novedad.service';
import { Novedad } from '../../../../core/models/novedad';

@Component({
  selector: 'app-insertar-novedad',
  templateUrl: './insertar-novedad.component.html',
  styleUrls: ['./insertar-novedad.component.scss'],
})
export class InsertarNovedadComponent implements OnInit {
  public formEntity: FormGroup;
  public listas: any;
  public ready:boolean = false;
  public idRecursoNovedad: number = 0;
  public NUMBERS_PATTERN = /^[0-9]+(.[0-9]{0,2})*$/;
  public HORAMIN_PATTERN = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  public titulo = "NOVEDAD";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {idRecursoNovedad: number,
      idRecurso: number,
      idTipoNovedad: number,
      horaDesde: string,
      horaHasta: string,
      observaciones: string,
      descripcionTipoNovedad: string,
      valorTipoNovedad: string,
      descripcionRecurso: string,
      identificacionRecurso: string,
    },
      private activatedroute: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private entityTabNovedadService: EntityTabNovedadService,
      private listasService: ConsultaListasService,
  ) {
    this.formEntity = this.formBuilder.group({
      idRecursoNovedad: [''],
      idRecurso: [''],
      idTipoNovedad: [''],
      horaDesde: ['', [Validators.required]],
      horaHasta: [''],
      observaciones: ['']
    })
  }

  ngOnInit(): void {
    if(!this.data.idRecursoNovedad){
      // Nuevo registro
      if(!this.data.idRecurso){
        console.error('No hay id de Recurso definido');
      }
      console.log('id', this.data.idRecurso);
      this.formEntity.controls['idRecurso'].setValue(this.data.idRecurso);
    }
    else{
      this.formEntity.controls.idRecursoNovedad.setValue(this.data.idRecursoNovedad);
      this.idRecursoNovedad = this.data.idRecursoNovedad;
      this.formEntity.controls.idRecurso.setValue(this.data.idRecurso);
      this.formEntity.controls.idTipoNovedad.setValue(this.data.idTipoNovedad);
      if(this.data.horaDesde !== null) {
        let fechaini = new Date(this.data.horaDesde).toISOString().slice(0, 22);
        this.formEntity.controls.horaDesde.setValue(fechaini.toString());
      }
      if(this.data.horaHasta !== null) {
        let fechahasta = new Date(this.data.horaHasta).toISOString().slice(0, 22);
        this.formEntity.controls.horaHasta.setValue(fechahasta.toString());
      }
      this.formEntity.controls.observaciones.setValue(this.data.observaciones);
    }
    this.listasService.consultarListas([97]).then((listas) => {this.listas = listas; this.ready = true;});
  }

  async onSubmit(){
    try{
      await this.saveNovedad();
    }catch(e){
      console.log('El error', e);
      console.error('ERROR al guardar todo');
    }
  }

  async saveNovedad() {
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        let fecDesde = new Date(this.formEntity.controls.horaDesde?.value);
        let fecHasta = new Date(this.formEntity.controls.horaHasta?.value);
        let objNovedad: Novedad = {
          idRecursoNovedad: this.formEntity.get('idRecursoNovedad')?.value,
          idRecurso: this.formEntity.get('idRecurso')?.value,
          idTipoNovedad: this.formEntity.get('idTipoNovedad')?.value,
          horaDesde: fecDesde.getTime(),
          horaHasta: fecHasta.getTime(),
          observaciones: this.formEntity.get('observaciones')?.value,
        }
        console.log("Datos : ", objNovedad);
        if(this.idRecursoNovedad===0){
          let res:any = await this.entityTabNovedadService.insertar(objNovedad);
          if(res.respuesta[0][":b1"]!==0){
            // console.log('Id nuevo: ', res.respuesta[0][":b1"]);
            this.idRecursoNovedad = res.respuesta[0][":b1"];
            this.formEntity.controls.idRecursoNovedad.setValue(this.idRecursoNovedad);
          }else{
            console.error('Error al generar idAlternativa y Capa');
          }
        }else{
          this.entityTabNovedadService.actualizar(objNovedad);
        }
        dialogRef.close();
        this.operationSuccess();
        this.dialog.closeAll();
      }catch(error){
        console.log(error);
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

  get tipoNovedadField(): any{
    return this.formEntity.get('idTipoNovedad');
  }

  get horaDesdeField(): any{
    return this.formEntity.get('horaDesde');
  }

  get horaHastaField(): any{
    return this.formEntity.get('horaHasta');
  }

   get observacionesField(): any{
     return this.formEntity.get('observaciones');
   }
}
