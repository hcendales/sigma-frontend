import { Respuesta } from './../../../core/models/revision-visitas';
import { Alternativa } from './../../../core/models/alternativa';
import { EntityTabAlternativaService } from 'src/app/core/services/entity-tab-alternativa.service';
import { EntityTabCapaService } from 'src/app/core/services/entity-tab-capa.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from '../../../core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from '../../../core/en-espera/en-espera.component';
import { ConsultaListasService } from '../../../core/services/consulta-listas.service';
import { Capa } from 'src/app/core/models/capa';

import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-consulta-alternativa',
  templateUrl: './consulta-alternativa.component.html',
  styleUrls: ['./consulta-alternativa.component.scss']
})
export class ConsultaAlternativaComponent implements OnInit {
  public formEntity: FormGroup;
  public listas: any;
  public ready:boolean = false;
  public idAlternativaDisenio: number = 0;
  public numeroAlternativa: string = '';
  public NUMBERS_PATTERN = /^[0-9]+(.[0-9]{0,2})*$/;

  public disenioCapa: any[] = [];

  public titulo = "ALTERNATIVA";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {idAlternativaDisenio: number,
      idMantenimientoVialEvento: string,
      alternativa: string,
      idTipoSuperficieDisenio: number,
      idTipoIntervencionFinalDisenio: number,
      idTipoMetodologiaDisenio: number,
      idTipoMaterialGranular: number,
      espesorDisenio: number,
      cbrInicialPct: number,
      idTipoGeosinteticos: number,
      idTipoSistemaDrenaje: number,
      observaciones: string,
      cantidadRegistros: number},
      private activatedroute: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private entityTabAlternativaService: EntityTabAlternativaService,
      private entityTabCapaService: EntityTabCapaService,
      private listasService: ConsultaListasService,
  ) {
    this.formEntity = this.formBuilder.group({
      alternativa: this.formBuilder.group({
        idAlternativaDisenio: [''],
        idMantenimientoVialEvento: [''],
        alternativa: [{value: '', disable: true}],
        idTipoSuperficieDisenio: [{value: '', disabled: true}],
        idTipoIntervencionFinalDisenio: [{value: '', disabled: true},[Validators.required, Validators.maxLength(20)]],
        idTipoMetodologiaDisenio: [{value: '', disabled: true},[Validators.required, Validators.maxLength(20)]],
        idTipoMaterialGranular: [{value: '', disabled: true},[Validators.required, Validators.maxLength(20)]],
        espesorDisenio: [{value: '', disabled: true},[Validators.required, Validators.maxLength(4), Validators.pattern(this.NUMBERS_PATTERN), Validators.min(0.00), Validators.max(2.00)]],
        cbrInicialPct: [{value: '', disabled: true},[Validators.required, Validators.maxLength(4), Validators.pattern(this.NUMBERS_PATTERN), Validators.min(0), Validators.max(100)]],
      }),
      capas: this.formBuilder.array([]),
      idTipoGeosinteticos: [{value: '', disabled: true},[Validators.required, Validators.maxLength(20)]],
      idTipoSistemaDrenaje: [{value: '', disabled: true},[Validators.required, Validators.maxLength(20)]],
      observaciones: [{value: '', disabled: true},[Validators.required, Validators.maxLength(100)]],
    }, { updateOn: 'blur'});
   }

  ngOnInit(): void {
    if(!this.data.idAlternativaDisenio){
      // Nuevo registro
      // console.error('No hay id de alternativa definido');
      if(!this.data.idMantenimientoVialEvento){
        console.error('No hay id de mantenimiento definido');
      }
      console.log('id', this.data.idMantenimientoVialEvento);
      this.alternativaForm.controls['idMantenimientoVialEvento'].setValue(this.data.idMantenimientoVialEvento);
      this.alternativaForm.controls['alternativa'].setValue(this.data.cantidadRegistros+1);
      let varnumero =  this.data.cantidadRegistros+1;
      this.numeroAlternativa = varnumero.toString();
    }
    else{
      this.idAlternativaDisenio=this.data.idAlternativaDisenio;
      this.alternativaForm.controls.idAlternativaDisenio.setValue(this.data.idAlternativaDisenio);
      this.alternativaForm.controls.idMantenimientoVialEvento.setValue(this.data.idMantenimientoVialEvento);
      this.alternativaForm.controls.alternativa.setValue(this.data.alternativa);
      this.numeroAlternativa = this.data.alternativa;
      this.alternativaForm.controls.idTipoSuperficieDisenio.setValue(this.data.idTipoSuperficieDisenio);
      this.alternativaForm.controls.idTipoIntervencionFinalDisenio.setValue(this.data.idTipoIntervencionFinalDisenio);
      this.alternativaForm.controls.idTipoMetodologiaDisenio.setValue(this.data.idTipoMetodologiaDisenio);
      this.alternativaForm.controls.idTipoMaterialGranular.setValue(this.data.idTipoMaterialGranular);
      this.alternativaForm.controls.espesorDisenio.setValue(this.data.espesorDisenio);
      this.alternativaForm.controls.cbrInicialPct.setValue(this.data.cbrInicialPct);

      this.tipoGeosinteticosForm.setValue(this.data.idTipoGeosinteticos);
      this.tipoSistemaDrenajeForm.setValue(this.data.idTipoSistemaDrenaje);
      this.observacionesForm.setValue(this.data.observaciones);

      this.getDisenioCapas(this.idAlternativaDisenio);
    }
    this.listasService.consultarListas([84, 83, 85, 86, 87, 88, 89]).then((listas) => {this.listas = listas; this.ready = true;});
  }

  get alternativaForm(){
    return this.formEntity.controls["alternativa"] as FormGroup;
  }

  get capas(){
    return this.formEntity.controls["capas"] as FormArray;
  }

  get observacionesForm(){
    return this.formEntity.controls['observaciones'] as FormControl;
  }

  get tipoGeosinteticosForm(){
    return this.formEntity.controls['idTipoGeosinteticos'] as FormControl;
  }

  get tipoSistemaDrenajeForm(){
    return this.formEntity.controls['idTipoSistemaDrenaje'] as FormControl;
  }

  addCapa(){
    const capaForm = this.formBuilder.group({
      idAlternativaDisenio: [this.idAlternativaDisenio],
      idTipoCapa: ['', Validators.required],
      espesor: ['', [Validators.required, Validators.pattern(this.NUMBERS_PATTERN), Validators.min(0), Validators.max(50)]]
    });
    this.capas.push(capaForm);
    // console.log('capas', this.capas);
  }

  deleteCapa(capaIndex: number){
    this.capas.removeAt(capaIndex);
  }

  getFormDisenioCapa(){
    let formDisenioCapa:any = {
      idAlternativaDisenio: [''],
      idTipoCapa:['',[Validators.required]],
      espesor: ['', [Validators.required, Validators.pattern(this.NUMBERS_PATTERN), Validators.min(0), Validators.max(50)]]
    };
    return formDisenioCapa;
  }

  async getDisenioCapas(idAlternativaDisenio: number){

    let condicion = "id_alternativa_disenio = " + idAlternativaDisenio;
    console.log('getDisenioCapas', condicion);
    let res:any = await this.entityTabCapaService.list(condicion);
    if(res.codError != 0){
      throw res;
    }else{
      let ListaDisenioCapa = res.respuesta;
      for(let disenioCapa of ListaDisenioCapa){
        let objCapa = {idDisenioCapa:disenioCapa.id_disenio_capa,
          idAlternativaDisenio:disenioCapa.id_alternativa_disenio,
          idTipoCapa: disenioCapa.id_tipo_capa,
          espesor: disenioCapa.espesor,
        };
        this.disenioCapa.push(objCapa);
        let form = this.formBuilder.group(this.getFormDisenioCapa());
        form.patchValue(objCapa);
        this.capas.push(form);
      }
    }
  }

  async onSubmit(){
    try{
      await this.saveAlternativa();
      await this.saveCapa();
    }catch(e){
      console.log('El error', e);
      console.error('ERROR al guardar todo');
    }
  }

  async saveAlternativa() {
    if (this.formEntity.valid){
      const dialogRef = this.mostrarVentanaEnEspera('Guardando');
      try{

        let objAlternativa: Alternativa = {
          idAlternativaDisenio: this.alternativaForm.get('idAlternativaDisenio')?.value,
          idMantenimientoVialEvento: this.alternativaForm.get('idMantenimientoVialEvento')?.value,
          alternativa: this.alternativaForm.get('alternativa')?.value,
          idTipoSuperficieDisenio: this.alternativaForm.get('idTipoSuperficieDisenio')?.value,
          idTipoIntervencionFinalDisenio: this.alternativaForm.get('idTipoIntervencionFinalDisenio')?.value,
          idTipoMetodologiaDisenio: this.alternativaForm.get('idTipoMetodologiaDisenio')?.value,
          idTipoMaterialGranular: this.alternativaForm.get('idTipoMaterialGranular')?.value,
          espesorDisenio: this.alternativaForm.get('espesorDisenio')?.value,
          cbrInicialPct: this.alternativaForm.get('cbrInicialPct')?.value,
          idTipoGeosinteticos: this.tipoGeosinteticosForm.value,
          idTipoSistemaDrenaje: this.tipoSistemaDrenajeForm.value,
          observaciones: this.observacionesForm.value,
          seleccionada: '',
        }
        console.log("Datos : ", objAlternativa);
        if(this.idAlternativaDisenio===0){
          let res:any = await this.entityTabAlternativaService.insertar(objAlternativa);
          if(res.respuesta[0][":b1"]!==0){
            // console.log('Id nuevo: ', res.respuesta[0][":b1"]);
            this.idAlternativaDisenio = res.respuesta[0][":b1"];
            this.alternativaForm.controls.idAlternativaDisenio.setValue(this.idAlternativaDisenio);
          }else{
            console.error('Error al generar idAlternativa y Capa');
          }
        }else{
          this.entityTabAlternativaService.actualizar(objAlternativa);
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

  async saveCapa(){
    let capasActualizar = [];
    let capasInsertar: any[] = [];
    let idscapasEliminar = [];

     //convierte lo existente en el form, a objetos;
     let ObjCapas =  this.capas.controls.map(
      control => {
        let capa = {
          idDisenioCapa: control.get(' ')?.value,
          idAlternativaDisenio: this.idAlternativaDisenio,
          idTipoCapa: control.get('idTipoCapa')?.value,
          espesor: control.get('espesor')?.value,
        };
        return capa;
      }
    );
    console.log('Objeto Capas',ObjCapas);

    //determina los factores a insertar y actualizar
    for(let capa of ObjCapas){
      let idx = this.disenioCapa.findIndex(e => e.idDisenioCapa == capa.idDisenioCapa);
      if(!capa.idDisenioCapa && capa.idTipoCapa){
        capasInsertar.push(capa);
      }else if(idx != -1 && capa.idTipoCapa != this.disenioCapa[idx].idTipoCapa){
        capasActualizar.push(capa);
      }
    }

    //determina los factores a eliminar
    for(let capa of this.disenioCapa){
      let index = ObjCapas.findIndex(oDisenioCapa => oDisenioCapa.idDisenioCapa == capa.idDisenioCapa);
      if(index == -1){
        idscapasEliminar.push(capa.idDisenioCapa);
      }
    }
    let dialogRef = this.mostrarVentanaEnEspera('Guardando');
    try{
      //alista las operaciones
      let operacionesEliminar = idscapasEliminar.map(idDisenioCapa => this.entityTabCapaService.eliminar(idDisenioCapa));
      let operacionesInsertar = capasInsertar.map(
          capa =>{
            return this.entityTabCapaService.insert(capa);
          }
        );

      let operacionesActualizar = capasActualizar.map(
          capa =>{
            return this.entityTabCapaService.actualizar(capa);
          }
        );

      //ejecuta operaciones
      if(operacionesEliminar.length > 0){
        let respElim = await forkJoin(operacionesEliminar).toPromise();
        for(let resp of respElim){
          if(resp.codError != 0){
            throw resp.msgError;
          }
        //elimina fotos en el array de fotos
          for(let i = this.disenioCapa.length - 1;i>=0;i--){
            if(idscapasEliminar.findIndex(idDisenioCapa => idDisenioCapa == this.disenioCapa[i].idDisenioCapa) != -1){
              this.disenioCapa.splice(i,1);
            }
          }
        }
      }

      if(operacionesInsertar.length > 0){
        let respInsert:any = await forkJoin(operacionesInsertar).toPromise();
        for(let i=0;i<respInsert.length;i++){
          let idx = ObjCapas.findIndex(e => e.idDisenioCapa == capasInsertar[i].idDisenioCapa);
          //console.log('insertad', respInsert[0].respuesta[i][":b1"]);
          //ObjFactores[idx].idOtroFactor = respInsert[0].respuesta[i][":b1"];
          let nuevoId = (respInsert as any)[i].respuesta[0][":b1"];
          console.log('nuevoFct',nuevoId,'index',idx);
          this.capas.get(idx.toString())?.get('idDisenioCapa')?.setValue(nuevoId);
        }
      }

      if(operacionesActualizar.length > 0){
        let respActualizar = await forkJoin(operacionesActualizar).toPromise();
        console.log('update', respActualizar);
      }
      dialogRef.close();
      this.operationSuccess();
    } catch(error){
      this.handleError(error);
      dialogRef.close();
    }

  }
  cancel(event: Event) {
    event.preventDefault();
    console.log('click');
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

  get tipoSuperficieField(): any{
    return this.alternativaForm.get('idTipoSuperficieDisenio');
  }

  get tipoIntervencionFinalField(): any{
    return this.alternativaForm.get('idTipoIntervencionFinalDisenio');
  }

  get tipoMetodologiaField(): any{
    return this.alternativaForm.get('idTipoMetodologiaDisenio');
  }

  get materialGranularField(): any{
    return this.alternativaForm.get('idTipoMaterialGranular');
  }

  get espesorField(): any{
    return this.alternativaForm.get('espesorDisenio');
  }

  get cbrInicialPctField(): any{
    return this.alternativaForm.get('cbrInicialPct');
  }

  get tipoGeosinteticosField(): any{
    return this.formEntity.get('idTipoGeosinteticos');
  }

  get tipoSistemaDrenajeField(): any{
    return this.formEntity.get('idTipoSistemaDrenaje');
  }

  get observacionesField(): any{
    return this.formEntity.get('observaciones');
  }

}
