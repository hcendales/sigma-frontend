import { EntityTabAlternativaService } from 'src/app/core/services/entity-tab-alternativa.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormControl } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { RegistroCapaComponent } from '../registro-capa/registro-capa.component';


@Component({
  selector: 'app-registro-alternativa',
  templateUrl: './registro-alternativa.component.html',
  styleUrls: ['./registro-alternativa.component.scss']
})
export class RegistroAlternativaComponent implements OnInit {

  public formEntity: FormGroup;
  public listas: any;
  public ready:boolean = false;
  public numeroAlternativa: number=0;

  public titulo = "ALTERNATIVA";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {idMantenimientoVialEvento: string,
    cantidadRegistros: number},
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private entityTabAlternativaService: EntityTabAlternativaService,
    private listasService: ConsultaListasService,
  ) {
      let NUMBERS_PATTERN = /^[0-9]+([.][0-9])*$/;
      this.formEntity = this.formBuilder.group({
        idMantenimientoVialEvento: [''],
        alternativa: [{value: '', disable: true}],
        idTipoSuperficieDisenio: ['',[Validators.required, Validators.maxLength(20)]],
        idTipoIntervencionFinalDisenio: ['',[Validators.required, Validators.maxLength(20)]],
        idTipoMetodologiaDisenio: ['',[Validators.required, Validators.maxLength(20)]],
        idTipoMaterialGranular: ['',[Validators.required, Validators.maxLength(20)]],
        espesorDisenio: ['',[Validators.required, Validators.maxLength(4), Validators.pattern(NUMBERS_PATTERN), Validators.min(0.00), Validators.max(2.00)]],
        cbrInicialPct: ['',[Validators.required, Validators.maxLength(4), Validators.pattern(NUMBERS_PATTERN), Validators.min(0), Validators.max(100)]],
        seleccionada: [''],
      }, { updateOn: 'blur'});
    }

    ngOnInit(): void {
      if(!this.data.idMantenimientoVialEvento){
        console.error('No hay id de mantenimiento definido');
      }
      console.log('id', this.data.idMantenimientoVialEvento);
      this.formEntity.controls['idMantenimientoVialEvento'].setValue(this.data.idMantenimientoVialEvento);
      this.formEntity.controls['alternativa'].setValue(this.data.cantidadRegistros+1);
      this.numeroAlternativa = this.data.cantidadRegistros+1;
      this.listasService.consultarListas([83, 84, 85, 86, 87, 88]).then((listas) => {this.listas = listas; this.ready = true;});
    }

    onSubmit(){
      console.log('submitUnidad');
    }

    async save(event: Event) {
      event.preventDefault();
      if (this.formEntity.valid){
        const dialogRef = this.mostrarVentanaEnEspera('Guardando');
        try{
          const value = this.formEntity.value;
          console.log('Insertar ',value);
          await this.entityTabAlternativaService.insertar(value);
          this.formEntity.reset();
          this.operationSuccess();
          dialogRef.close();
          this.dialog.closeAll();
        }catch(error){
          this.handleError(error);
          dialogRef.close();
        }
      }else {
        this.formEntity.markAllAsTouched();
      }
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

  mostrarVentanaEnEspera(titulo:string, footer?:string){
    const data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }

  get tipoSuperficieField(): any{
    return this.formEntity.get('idTipoSuperficieDisenio');
  }

  get tipoIntervencionFinalField(): any{
    return this.formEntity.get('idTipoIntervencionFinalDisenio');
  }

  get tipoMetodologiaField(): any{
    return this.formEntity.get('idTipoMetodologiaDisenio');
  }

  get materialGranularField(): any{
    return this.formEntity.get('idTipoMaterialGranular');
  }

  get espesorField(): any{
    return this.formEntity.get('espesorDisenio');
  }

  get cbrInicialPctField(): any{
    return this.formEntity.get('cbrInicialPct');
  }

}
