import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UnidadMuestreo } from '../../../core/models/unidad-muestreo';

@Injectable({
  providedIn: 'root'
})
export class FormUnidadesMuestreoGeneradorService {
  MAX_AREA_PCI = 315;
  MAX_LOSAS_PCI = 28;
  constructor(private fb: FormBuilder) { }

  getForm(data:any):FormGroup{
    let form:FormGroup = this.fb.group(
      {
        abscisaInicial: ['',[Validators.required,Validators.min(0)]],
        abscisaFinal: ['',[Validators.required,Validators.min(0)]],
        idUnidadMuestreo: ['',[]]
      },data.tipoSuperficie != 1102 && data.conUnidadesMuestreo?{validator: this.areaUnidad(0,this.MAX_AREA_PCI)} as AbstractControlOptions:{}
    );
    if(data.tipoSuperficie == 1102){
      console.log('la data', data);
      if(data.conUnidadesMuestreo){
        console.log('hay limite pci')
        form.addControl('nLosas', new FormControl('',[Validators.required, Validators.min(0), Validators.max(this.MAX_LOSAS_PCI)]));
      }else{
        console.log('sin limite pci')
        form.addControl('nLosas', new FormControl('',[]));
      }
      
    }else{
      form.addControl('ancho', new FormControl('',[Validators.required, Validators.min(0)]));
    }
    return form;
  }

  areaUnidad = (min: number,max: number) => {
    return (c: AbstractControl): {[key: string]: any} => {
      let abscisaInicial = c.get('abscisaInicial')?.value;
      let abscisaFinal = c.get('abscisaFinal')?.value;
      if(abscisaInicial >= abscisaFinal){
        return {abscisadoIncorrecto:true}
      }
      let area = (abscisaFinal - abscisaInicial) * c.get('ancho')?.value;
      return (area > max)?{ MaxAreaUnidad: true}:((area <= min)?{ MinAreaUnidad: true}:null as any);
    }
  }

  formToObj(formUnidad:FormGroup){
    let res:UnidadMuestreo = new UnidadMuestreo();
    res.idUnidadMuestreo = formUnidad.get('idUnidadMuestreo')?.value;
    res.abscisaInicial = formUnidad.get('abscisaInicial')?.value;
    res.abscisaFinal = formUnidad.get('abscisaFinal')?.value;
    res.ancho = formUnidad.get('ancho')?.value;
    if(formUnidad.get('nLosas')){
      res.area =  formUnidad.get('nLosas')?.value?formUnidad.get('nLosas')?.value:0;
    }else if(res.abscisaFinal != undefined && res.abscisaInicial != undefined && res.ancho != undefined){
      res.area = (res.abscisaFinal - res.abscisaInicial) * res.ancho;
    }
    return res;
  }

  //transforma el objeto que viene del servicio a UnidadMuestreo
  serviceResponseToObj(unidadResponse:any){
    let res:UnidadMuestreo = new UnidadMuestreo();
    res.idUnidadMuestreo = unidadResponse.id_unidad_muestreo;
    res.abscisaInicial = unidadResponse.abscisa_inicial;
    res.abscisaFinal = unidadResponse.abscisa_final;
    res.ancho = unidadResponse.ancho;
    res.area = unidadResponse.area;
    res.pci = unidadResponse.pci;
    return res;
  }

  aplicaUnidadesMuestreo(idTipoSuperficie:number, esEspacioPublico:boolean ,idTipoPrograma?:number){
    //revisa si para el tipo de superficie aplican unidades de muestreo
    let tiposSuperficieUnidad = [1102,1103,1105,1106];//tipos de superficie para los que aplica unidad de muestreo
    let aplicaTipoSuperficie = tiposSuperficieUnidad.indexOf(idTipoSuperficie) != -1
    //revisa si para el tipo de programa NO aplican unidades de muestreo
    let tiposProgramaSinUnidad  =  [592,599,1474];
    let aplicaTipoPrograma = idTipoPrograma?tiposProgramaSinUnidad.indexOf(idTipoPrograma) == -1:true
    return aplicaTipoSuperficie && aplicaTipoPrograma && !esEspacioPublico;
  }
  
}
