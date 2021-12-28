import { MantenimientoVial } from './../../../../core/models/mantenimiento-vial';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';

import { MantenimientoVialEventoService } from '../../../../core/services/mantenimiento-vial-evento.service';
import { UbicarApiqueComponent } from '../ubicar-apique/ubicar-apique.component';
import { EntityTabAledanioService } from '../../../../core/services/entity-tab-aledanio.service';
// import { Console } from 'console';

@Component({
  selector: 'app-registro-apique',
  templateUrl: './registro-apique.component.html',
  styleUrls: ['./registro-apique.component.scss']
})
export class RegistroApiqueComponent implements OnInit {

  @Input() MantenimientoVialEvento: any;
  @Output() guardadoRealizado = new EventEmitter<boolean>();

  public formEntity: FormGroup;
  public titulo = 'Información de Apiques';
  public selected = 'NO';
  public idMantenimientoVialEvento: number = 0;
  public idPkCalzada: number = 0;

  //Pk id del pk que tiene como aledanio este PK
  public aledanioDe:number = 0;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private mantenimientoVialEventoService: MantenimientoVialEventoService,
    private entityTabAledanioService:EntityTabAledanioService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,)
    {
      this.formEntity = this.formBuilder.group({
        requiere_apiques: ['SI',[Validators.required]],
        requiere_aforo: ['SI'],
        solicitudes_adicionales: [''],
        observacion_adicionales: ['', [Validators.maxLength(100)]],
        viable_intervencion: [''],
        observacion_viable_intervencion: ['', [Validators.maxLength(100)]],
      },{ updateOn: 'blur'});

   }

  async ngOnInit() {
   // this.idMantenimientoVialEvento = 1000127;
   console.log('EL EVVVT Q LE LLEGA', this.MantenimientoVialEvento);
    if (Object.keys(this.MantenimientoVialEvento).length !== 0){
      this.idMantenimientoVialEvento = this.MantenimientoVialEvento.id_mantenimiento_vial_evento;
      this.idPkCalzada = this.MantenimientoVialEvento.pk_id_calzada;
    // console.log('id ', this.idMantenimientoVialEvento);
      if( this.MantenimientoVialEvento.requiere_apiques !== null){
        this.formEntity.controls.requiere_apiques.setValue(this.MantenimientoVialEvento.requiere_apiques);
        this.selected =  this.formEntity.controls.requiere_apiques.value;
      }else{
        this.formEntity.controls.requiere_apiques.setValue(this.selected);
      }
      this.formEntity.controls.requiere_aforo.setValue(this.MantenimientoVialEvento.requiere_aforo);
      this.formEntity.controls.solicitudes_adicionales.setValue(this.MantenimientoVialEvento.solicitudes_adicionales);
      this.formEntity.controls.observacion_adicionales.setValue(this.MantenimientoVialEvento.observacion_adicionales);
      this.formEntity.controls.viable_intervencion.setValue(this.MantenimientoVialEvento.viable_intervencion);
      this.formEntity.controls.observacion_viable_intervencion.setValue(this.MantenimientoVialEvento.observacion_viable_intervencion);

      let res = await this.entityTabAledanioService.consultarXFiltro("ID_MV_EVENTO_ALEDANIO = " + this.MantenimientoVialEvento.id_mantenimiento_vial_evento);
      if(res.codError == 0 && res.respuesta.length > 0){
        let res2 = await this.mantenimientoVialEventoService.get(res.respuesta[0].id_mantenimiento_vial_evento);
        if(res2.codError == 0 && res2.respuesta.length>0){
          this.aledanioDe = res2.respuesta[0].pk_id_calzada;
          console.log('Es aledanio de: ', this.aledanioDe)
        }
      }

      if(this.aledanioDe){
        let campo = this.formEntity.get('requiere_apiques');
        if(campo){
          campo.setValue('AL');
          campo.disable();
        }
        
      }

      
      
   }
  }
  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{
        const value = this.formEntity.value;
        // Generar información para actualizar
        let strClaves = '';
        let strValues = '';
        // Arma los nombres de campos y valores respectivos segun los campos de la forma
        for(let clave in value){
          strClaves += clave + ';';
          strValues += value[clave] + ';';
        console.log('Key',value[clave]);
        }
        this.mantenimientoVialEventoService.actualizarCampo(this.idMantenimientoVialEvento, strClaves, strValues);
      // console.log('Paso');
        //this.formEntity.reset();
        dialogRef.close();
        this.operationSuccess();
        this.guardadoRealizado.emit(true);
      }catch(error){
        this.handleError(error);
        dialogRef.close();
        this.guardadoRealizado.emit(false);
      }
    }else {
      this.formEntity.markAllAsTouched();
    }
  }
// Abre la ventana de ubicar apiques y envia el id
  openDialog(): void {
    console.log('Apique antes ', this.formEntity.get('requiere_apiques'));
    const dialogRef = this.dialog.open(UbicarApiqueComponent, {
      width: '400px',
      disableClose: true,
      data: {idMantenimientoVialEvento: this.idMantenimientoVialEvento,
      apiqueValor: this.formEntity.value.requiere_apiques,
      idPkCalzada: this.MantenimientoVialEvento.pk_id_calzada}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
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

  // Get para los campos para validar
  get requiereApiqueField(): any{
    return this.formEntity.get('requiere_apiques');
  }

  get requiereAforoField(): any{
    return this.formEntity.get('requiere_aforo');
  }

  get requiereAdicionalField(): any{
    return this.formEntity.get('solicitudes_adicionales');
  }

  get observacionAdicionalField(): any{
    return this.formEntity.get('observaciones_adicionales');
  }

  get viableIntervencionField(): any{
    return this.formEntity.get('viable_intervencion');
  }

  viableSelected(e:any){
    if(e.value == 'NO'){
      this.requiereApiqueField.setValue('NO');
      this.requiereApiqueField.disable();
      this.selected = 'NO';
      this.requiereAforoField.setValue('NO');
      this.requiereAforoField.disable();
      //this.requiereAdicionalField.setValue('NO');
      //this.requiereAdicionalField.disable();
    }else{
      this.requiereApiqueField.enable();
      this.requiereApiqueField.setValue('SI');
      this.selected = 'SI';
      this.requiereAforoField.enable();
      this.requiereAforoField.setValue('SI');
      //this.requiereAdicionalField.enable();
      //this.requiereAdicionalField.reset();
    }

    if(this.aledanioDe){
      let campo = this.formEntity.get('requiere_apiques');
      if(campo){
        campo.setValue('AL');
        campo.disable();
      }
      
    }
  }
}
