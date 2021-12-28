import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { FormFallasGeneradorService } from '../../services/form-fallas-generador.service';

@Component({
  selector: 'app-registro-fallas',
  templateUrl: './registro-fallas.component.html',
  styleUrls: ['./registro-fallas.component.scss']
})
export class RegistroFallasComponent implements OnInit {


  public listas:any;
  public formFalla:FormGroup;
  public listaUnidades: any[];
  public ready:boolean = false;
  public listaFallas:any[] = [];
  public listaintervenciones:any[] = [];
  public listaSeveridades:any[] = [];
  public idTipoPrograma:number|null = null;
  public aplicaUnidadesMuestreo:boolean = true;
  public anteriorValor:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder, private listasService: ConsultaListasService, private formFallasService: FormFallasGeneradorService) {
    console.log('entra', data);
    
    this.listaUnidades = this.data.listaUnidades;
    this.idTipoPrograma = this.data.idTipoPrograma;
    this.aplicaUnidadesMuestreo = this.data.aplicaUnidadesMuestreo;
    //crea un form nuevo si es una falla nueva (no trae form)
    if (!data.form){
      console.log('crea el form');
      this.formFalla = this.formFallasService.getForm(data);
      //solo viene con valore por defecto 0 cuando está en modo sin unidades
      if(this.formFalla.get('indexUnidadMuestreo')?.value == 0){
        this.unidadSelected();
      }
    }else{
      console.log('con e que viene');
      this.formFalla = data.form;
      this.anteriorValor = this.formFalla.value;
      this.formFalla.markAllAsTouched();
      
    }
    
  }

  ngOnInit(): void {
    this.listasService.consultarListas([9,24,25]).then((listas) => {this.listas = listas; this.filtrarListas(); this.ready = true;});
  }

  //filtra las listas de tipo de falla en función del tipo de superficie
  //y de tipo de intervención en funcion dle tipo de intervención total
  //y los tipos de intervención total en función del tipo de programa
  filtrarListas(){
    //filtra tipos de falla
    let filtro = '';
    if(this.data.tipoSuperficie == 1102){
        filtro = 'R'
    } else
    if(this.data.tipoSuperficie == 1103){
      filtro = 'F'
    } else
    if(this.data.tipoSuperficie == 1105 || this.data.tipoSuperficie == 1106){
      filtro = 'P'
    }

    for(let tipo of this.listas[9]){
      //no carga las fallas cuya superficie corresponda a articulados del anterior método, las q empiezan con 'A'
      if(tipo.valor.startsWith(filtro) && !tipo.valor.startsWith('A')){
        this.listaFallas.push(tipo);
      }
      this.listaFallas.sort((a:any,b:any) => (Number(a.valor.substring(1)) > Number(b.valor.substring(1))) ? 1 : ((Number(b.valor.substring(1)) > Number(a.valor.substring(1))) ? -1 : 0));
    }

    //filtra lista de tipos de intervención
    if(this.data.intervencionTotal == 1244){
      for(let tipo of this.listas[25]){
        if(tipo.id_tipo == 932){
          this.listaintervenciones.push(tipo);
          break;
        }
      }

    }else if(!this.data.intervencionTotal){
      this.listaintervenciones = this.listas[25];
    }

    if(this.idTipoPrograma == 599){
      this.listaintervenciones = this.listas[25].filter((x:any) => {return [931,932,942].find((y:any) =>{return y == x.id_tipo})});
    }else if(this.idTipoPrograma == 592){
      this.listaintervenciones = this.listas[25].filter((x:any) => {return [931,932,997,998].find((y:any) =>{return y == x.id_tipo})});
    }else if(this.idTipoPrograma == 1474){
      this.listaintervenciones = this.listas[25].filter((x:any) => {return [924,925,926,1242,1243,996].find((y:any) =>{return y == x.id_tipo})});
    }

    //tipos de severidad
    this.listaSeveridades = [...this.listas[24]];
    this.listaSeveridades.sort((a:any,b:any) => (Number(a.valor) > Number(b.valor)) ? -1 : ((Number(b.valor) > Number(a.valor)) ? 1 : 0));
  }

  tipoFallaSelected(){
    //si la falla seleccionada es la 20 de superficie flexible, quitar la severidad baja
    if(this.formFalla.get('idTipoFalla')?.value == 619){
      for(let i = 0;i<this.listaSeveridades.length;i++){
        if(this.listaSeveridades[i].valor == 3){
          this.listaSeveridades.splice(i,1);
          break;
        }  
      }
      if(this.formFalla.get('idTipoSeveridad')?.value == 923){
        this.formFalla.get('idTipoSeveridad')?.setValue(null);
      }
    }else{
      if(this.listaSeveridades.length != this.listas[24].length){
        this.listaSeveridades = [...this.listas[24]];
        this.listaSeveridades.sort((a:any,b:any) => (Number(a.valor) > Number(b.valor)) ? -1 : ((Number(b.valor) > Number(a.valor)) ? 1 : 0));
      }
    }

    //si el tipo de superficie diferente a flexible, rigido y articulado se deben poner los campos en funcion del tipo de superficie de la falla
    if(this.data.tipoSuperficie != 1102 && this.data.tipoSuperficie != 1103 && this.data.tipoSuperficie != 1105 && this.data.tipoSuperficie != 1106){
      for(let tipo of this.listaFallas){
        if(tipo.id_tipo == this.formFalla.get('idTipoFalla')?.value){
          this.formFallasService.cambioTipoSuperficie(this.formFalla,tipo.valor)
        }
      }
    }

    //si la falla no es longitudinal, agregar el campo ancho
    if(this.data.tipoSuperficie != 1102){
      let changed = false;
      for(let falla of this.listaFallas){
        if(falla.id_tipo == this.formFalla.get('idTipoFalla')?.value &&
          !this.formFallasService.esFallaLongitudinal(falla.valor) && 
          !falla.valor.startsWith('R')){
          this.formFallasService.addCampoAncho(this.formFalla);
          changed = true;
          break;
        }
      }
      //quita el campo ancho en caso de que se haya elegido una falla longitudinal
      if(!changed){
        this.formFalla.removeControl('ancho');
        // quita la validación de area de falla
        this.formFalla.clearValidators();
        this.formFalla.updateValueAndValidity();
      }
    }
    
    for(let falla of this.listaFallas){
      if(falla.id_tipo == this.formFalla.get('idTipoFalla')?.value){
        console.error('validacioooon');
        if(!this.formFallasService.esFallaLongitudinal(falla.valor)){
          let indexUnidad = this.formFalla.get('indexUnidadMuestreo')?.value;
          let formUnidadMuestreo = this.data.formUnidadMuestreo.get(indexUnidad.toString());
          this.formFallasService.addValidacionAreaFalla(this.formFalla,formUnidadMuestreo,this.data.tipoSuperficie == 1102,this.aplicaUnidadesMuestreo);
        }else{
          this.formFalla.clearValidators();
          this.formFalla.updateValueAndValidity();
        }
        break;
      }
    }
    
  }

  unidadSelected(){
    
    let indexUnidad = this.formFalla.get('indexUnidadMuestreo')?.value
    
    if(indexUnidad !== "" && indexUnidad != null){
      let idUnidad = this.listaUnidades[this.formFalla.get('indexUnidadMuestreo')?.value].idUnidadMuestreo;
      this.formFalla.get('idUnidadMuestreo')?.setValue(idUnidad);
      let formUnidadMuestreo = this.data.formUnidadMuestreo.get(indexUnidad.toString());
      this.formFallasService.addValidacionAreaFalla(this.formFalla,formUnidadMuestreo,this.data.tipoSuperficie == 1102, this.aplicaUnidadesMuestreo);
    }

  }

  getAreaFalla(){
    let ancho = this.formFalla.get('ancho')?this.formFalla.get('ancho')?.value:this.formFalla.get('anchoLosa')?.value;
    let longitud = this.formFalla.get('longitud')?this.formFalla.get('longitud')?.value:this.formFalla.get('longitudLosa')?.value;
    let area = longitud * ancho;
    if(this.formFalla.get('numeroLosas')){
      area *= this.formFalla.get('numeroLosas')?.value;
    }
    return area;
  }

  getLosasFalla(){
    return this.formFalla.get('numeroLosas')?.value;
  }

  getAreaUnidad(){
    let indexUnidad = this.formFalla.get('indexUnidadMuestreo')?.value;
    if(indexUnidad !== "" && indexUnidad != null){
      let formUnidadMuestreo = this.data.formUnidadMuestreo.get(indexUnidad.toString());
      return (formUnidadMuestreo.get('abscisaFinal')?.value - formUnidadMuestreo.get('abscisaInicial')?.value) * formUnidadMuestreo.get('ancho')?.value;
    }return null;
  }

  getLosasUnidad(){
    let indexUnidad = this.formFalla.get('indexUnidadMuestreo')?.value;
    if(indexUnidad !== "" && indexUnidad != null){
      let formUnidadMuestreo = this.data.formUnidadMuestreo.get(indexUnidad.toString());
      return formUnidadMuestreo.get('nLosas')?.value;
    }return null;
  }
  
  onSubmit(){
    console.log('submitFalla');
  }



}
