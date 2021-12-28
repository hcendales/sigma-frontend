import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Falla } from '../../../core/models/falla';

@Injectable({
  providedIn: 'root'
})
export class FormFallasGeneradorService {

  //fallas en las que solo se mide la longitud
  public VALORES_FALLAS_LONGITUD =  ['F4', 'F7', 'F8', 'F9', 'F10','P3','A46','A49'];
  //los id correspondientes de VALORES_FALLAS_LONGITUD
  public IDS_FALLAS_LONGITUD =  [604, 607, 608, 609, 610, 1567, 645, 648];

  constructor(private fb: FormBuilder) { }

  getForm(data:any):FormGroup{
    console.log('data del getform',data);
    let form = this.fb.group(
      {
        indexUnidadMuestreo: ['',Validators.required],
        idTipoFalla: ['',Validators.required],
        idTipoSeveridad: ['',Validators.required],
        idUnidadMuestreo: ['',[]],
        idFalla:['',[]],
      }
    );
    
    if(data.formUnidadMuestreo){
      this.addValidacionAreaFalla(form, data.formUnidadMuestreo, data.tipoSuperficie == 1102,data.aplicaUnidadesMuestreo)
    }
    //si la ficha no se diligencian unidades de muestreo se le asigna a la falla la primera unidad de muestreo
    if(!data.aplicaUnidadesMuestreo){
      form.get('indexUnidadMuestreo')?.setValue(0);
    }

    //si la intervencion total es igual a cambio de carpeta el campo tipo de intervención no es obligatorio.
    //si no se eligió ninguna intervención total, el tipo de intervención es obligatorio.
    //esta regla se encuentra aplicada en registroVisita component en el evento de cambio de tipo de intervención
    if(data.intervencionTotal == 1244 || !data.intervencionTotal){
      form.addControl('idTipoIntervencion', new FormControl('',data.intervencionTotal == 1244?[]:Validators.required));
    }
    //si la superficie es rigida, agregar los campos longitud y ancho losa
    if(data.tipoSuperficie == 1102){
      form.addControl('anchoLosa', new FormControl('',[Validators.required, Validators.min(0)]));
      form.addControl('longitudLosa', new FormControl('',[Validators.required, Validators.min(0)]));
      form.addControl('numeroLosas', new FormControl('',[Validators.required, Validators.min(0)]));
    }else{ //de lo contrario agregar el campo longitud
      form.addControl('longitud', new FormControl('',[Validators.required, Validators.min(0)]));

      if(!this.esIdFallaLongitudinal(data.idTipoFalla) && data.idFalla){
        this.addCampoAncho(form);
      }
    }
    return form;
  }

  formToObj(formFalla:FormGroup){
    let res:Falla = new Falla();
    res.idFalla = formFalla.get('idFalla')?.value;
    res.indexUnidadMuestreo = formFalla.get('indexUnidadMuestreo')?.value;
    res.idTipoFalla = formFalla.get('idTipoFalla')?.value;
    res.idTipoSeveridad = formFalla.get('idTipoSeveridad')?.value;
    res.idUnidadMuestreo = formFalla.get('idUnidadMuestreo')?.value;
    res.idTipoIntervencion = formFalla.get('idTipoIntervencion')?.value;

    if(formFalla.get('ancho')){
      res.ancho =  formFalla.get('ancho')?.value;
    }else{
      res.ancho = 0;
      if(formFalla.get('anchoLosa')){
        res.ancho =  formFalla.get('anchoLosa')?.value;
      }
    }

    if(formFalla.get('longitud')){
      res.longitud =  formFalla.get('longitud')?.value;
    }else if(formFalla.get('longitudLosa')){
      res.longitud =  formFalla.get('longitudLosa')?.value;
    }

    if(formFalla.get('numeroLosas')){
      res.numeroLosas = formFalla.get('numeroLosas')?.value;
      if(res.ancho != undefined && res.longitud != undefined){
        res.area =  formFalla.get('numeroLosas')?.value *res.ancho * res.longitud;
      }
    }else{
      if(res.ancho != undefined && res.longitud != undefined){
        res.area = res.ancho * res.longitud;
      }
    }

    return res;
  }

  //transforma el objeto que viene del servicio a Falla
  serviceResponseToObj(fallaResponse:any){
    let res:Falla = new Falla();
    res.idFalla = fallaResponse.id_falla;
    res.distancia = fallaResponse.distancia;
    res.idTipoSuperficie = fallaResponse.id_tipo_superficie;
    res.idTipoFalla = fallaResponse.id_tipo_falla;
    res.idTipoSeveridad = fallaResponse.id_tipo_severidad;
    res.longitud = fallaResponse.longitud;
    res.ancho = fallaResponse.ancho;
    res.area = fallaResponse.area;
    res.idTipoIntervencion = fallaResponse.id_tipo_intervencion;
    res.numeroLosas = fallaResponse.numero_losas;
    res.idUnidadMuestreo = fallaResponse.id_unidad_muestreo;
    return res;
  }

  esFallaLongitudinal(idTipoFallaValor:string){
    return this.VALORES_FALLAS_LONGITUD.indexOf(idTipoFallaValor) != -1;
  }
  esIdFallaLongitudinal(idTipoFalla:number){
    return this.IDS_FALLAS_LONGITUD.indexOf(idTipoFalla) != -1;
  }

  addCampoAncho(form:FormGroup){
    form.addControl('ancho',new FormControl('',[Validators.required, Validators.min(0)]));
  }

  //cuando se cambia el tipo de falla en superficie mixta o diferente de flexible rigido y articulado
  cambioTipoSuperficie(form:FormGroup, valorTipoFalla:string){
     //si la superficie es rigida, agregar los campos longitud y ancho losa
    if(valorTipoFalla.startsWith('R')){
      //agrega los controles de rigido
      if(!form.get('anchoLosa')){
        form.addControl('anchoLosa', new FormControl('',[Validators.required, Validators.min(0)]));
      }
      if(!form.get('longitudLosa')){
        form.addControl('longitudLosa', new FormControl('',[Validators.required, Validators.min(0)]));
      }
      if(!form.get('numeroLosas')){
        form.addControl('numeroLosas', new FormControl('',[Validators.required, Validators.min(0), Validators.max(28)]));
      }
      if(form.get('longitud')){
        form.removeControl('longitud');
      }
      if(form.get('ancho')){
        form.removeControl('ancho');
      }
    } else{
      if(form.get('anchoLosa')){
        form.removeControl('anchoLosa');
      }
      if(form.get('longitudLosa')){
        form.removeControl('longitudLosa');
      }
      if(form.get('numeroLosas')){
        form.removeControl('numeroLosas');
      }
      if(!form.get('longitud')){
        form.addControl('longitud', new FormControl('',[Validators.required, Validators.min(0)]));
      }
    }
  }

  validadorAreaFalla = (formUnidadMuestreo: FormGroup) => {
    return (c: AbstractControl): {[key: string]: any} => {
      let abscisaInicialUnd = formUnidadMuestreo.get('abscisaInicial')?.value;
      let abscisaFinalUnd = formUnidadMuestreo.get('abscisaFinal')?.value;
      let areaUnd = (abscisaFinalUnd - abscisaInicialUnd) * formUnidadMuestreo.get('ancho')?.value;
      let longitudFalla = c.get('longitud')?.value != null?c.get('longitud')?.value: c.get('longitudLosa')?.value;
      let anchoFalla = c.get('ancho')?.value != null?c.get('ancho')?.value:c.get('anchoLosa')?.value;
      let areaFalla = c.get('numeroLosas')?.value != null?longitudFalla * anchoFalla * c.get('numeroLosas')?.value:longitudFalla * anchoFalla;
      return (areaFalla > areaUnd)?{ MaxAreaFalla: true}:null as any;
    }
  }

  validadorLosasFalla = (formUnidadMuestreo: FormGroup) => {
    return (c: AbstractControl): {[key: string]: any} => {
      let losasUnd = formUnidadMuestreo.get('nLosas')?.value;
      let losasFalla = c.get('numeroLosas')?.value;
      return (losasFalla > losasUnd)?{ MaxLosasFalla: true}:null as any;
    }
  }

  addValidacionAreaFalla(formFalla: FormGroup,formUnidadMuestreo: FormGroup, superficieRigido:boolean, aplicaUnidadesMuestreo:boolean){
    if(formUnidadMuestreo == null || !aplicaUnidadesMuestreo){
      console.log('No aplica la validacion area falla');
      return;
    }
    console.log('SI aplica la validacion area falla');
    formFalla.setValidators(superficieRigido?this.validadorLosasFalla(formUnidadMuestreo):this.validadorAreaFalla(formUnidadMuestreo));
    formFalla.updateValueAndValidity();
  }

  public aplicaFallas(idTipoSuperficie:number, esEspacioPublico:boolean){
    //superficies donde aplican fallas rigido, flexible, mixtos, adoquin concreto, adoquin arcilla
    let superficiesFallas = [1102,1103,1104,1106,1105];
    let aplicaTipoSuperFicie = superficiesFallas.findIndex(x => x == idTipoSuperficie);
    return !esEspacioPublico && aplicaTipoSuperFicie != -1;
  }

}
