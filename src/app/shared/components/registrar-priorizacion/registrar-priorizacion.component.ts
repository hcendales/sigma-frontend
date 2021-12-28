import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../core/en-espera/en-espera.component';

import { ConsultaListasService } from './../../../core/services/consulta-listas.service';
import { MantenimientoVialEventoService } from '../../../core/services/mantenimiento-vial-evento.service';

@Component({
  selector: 'app-registrar-priorizacion',
  templateUrl: './registrar-priorizacion.component.html',
  styleUrls: ['./registrar-priorizacion.component.scss']
})
export class RegistrarPriorizacionComponent implements OnInit {
    // Formario
    public formEntity: FormGroup;
    public titulo = 'Priorizar Intervenciones';

    // Variable de validación
    public ready: boolean = false;
    public guardadoTodo: boolean = false;
    public listas: any;
    public idMantenimientoVialEvento: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {idSelected: number [],
      idActividad: number},
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private listasService: ConsultaListasService,
    private mantenimientoVialEventoService: MantenimientoVialEventoService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    let NUMBERS_PATTERN = /^[0-9]*$/;
    let TRIMESTRE_PATTERN = /^[0-9]{4}\_[1-4]{1}/;
    this.formEntity = this.formBuilder.group({
      id_tipo_programa: [''],
      id_tipo_requerimiento: [''],
      id_tipo_grupo: [''],
      id_tipo_estrategia: [''],
      id_tipo_administracion: [''],
      priorizacion_trimestre: ['', [ Validators.maxLength(6), Validators.pattern(TRIMESTRE_PATTERN)]],
      observaciones_priorizacion: ['', [Validators.maxLength(300)]],
    }, { updateOn: 'blur'});
   }

  ngOnInit(): void {
    if(this.data.idSelected.length == 0){
      console.log('No hay id de Actividad');
    }else{
      //this.idMantenimientoVialEvento = this.data.idSelected;
      this.listasService.consultarListas([20,21,46,47,1103]).then((listas) => {this.listas = listas; this.ready = true;});
    }

  }

  save(event: Event): void {
    event.preventDefault();
    console.log('Validar', this.formEntity.valid);
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        // console.log(value);
        // Generar información para actualizar
        let strClaves = '';
        let strValues = '';
        // Arma los nombres de campos y valores respectivos segun los campos de la forma
        for(let clave in value){
          if(value[clave] !=''){
            strClaves += clave + ';';
            strValues += value[clave] + ';';
          }
          console.log('Key',value[clave]);
        }
        for(let idMantenimiento of this.data.idSelected){
          console.log('id ', idMantenimiento);
          this.mantenimientoVialEventoService.actualizarCampo(idMantenimiento, strClaves, strValues);
        }
        dialogRef.close();
        this.operationSuccess();
        // this.formEntity.reset();
      }catch(error){
        this.handleError(error);
        dialogRef.close();
      }
    }else {
      this.formEntity.markAllAsTouched();
    }
  }

  operationSuccess(): void{

    this.snackBar.open('Cambios realizados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  handleError(error?: any){
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

  mostrarVentanaEnEspera(titulo: string, footer?: string): any{
    const data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }


  returnlist(): void{
    this.router.navigate(['dashboard/mejoramiento-gestion-masiva/gestionar/' + this.data.idActividad]);
  }

  get tipoProgramaField(): any{
    return this.formEntity.get('id_tipo_programa');
  }

  get tipoRequerimientoField(): any{
    return this.formEntity.get('id_tipo_requerimiento');
  }

  get tipoGrupoField(): any{
    return this.formEntity.get('id_tipo_grupo');
  }

  get tipoEstrategiaField(): any{
    return this.formEntity.get('id_tipo_estrategia');
  }

  get tipoAdministracionField(): any{
    return this.formEntity.get('id_tipo_administracion');
  }

  get priorizacionTrimestreField(): any{
    return this.formEntity.get('priorizacion_trimestre');
  }

  get observacionesPriorizacionField(): any{
    return this.formEntity.get('observaciones_priorizacion');
  }

}
