import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormUnidadesMuestreoGeneradorService } from '../../services/form-unidades-muestreo-generador.service';

@Component({
  selector: 'app-registro-unidad-muestreo',
  templateUrl: './registro-unidad-muestreo.component.html',
  styleUrls: ['./registro-unidad-muestreo.component.scss']
})
export class RegistroUnidadMuestreoComponent implements OnInit {

  public formUnidadMuestreo:FormGroup;

  public anteriorValor:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,private formGeneratorService:FormUnidadesMuestreoGeneradorService) {
    console.log('entra', data);
    if (!data.form){
      this.formUnidadMuestreo = this.formGeneratorService.getForm(data);
    }else{
      this.formUnidadMuestreo = data.form;
      this.anteriorValor = this.formUnidadMuestreo.value;
    }
  }

  ngOnInit(): void {
    
  }

  onSubmit(){
    console.log('submitUnidad');
  }

}
