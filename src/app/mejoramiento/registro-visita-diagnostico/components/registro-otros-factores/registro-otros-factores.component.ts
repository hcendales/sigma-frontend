import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-registro-otros-factores',
  templateUrl: './registro-otros-factores.component.html',
  styleUrls: ['./registro-otros-factores.component.scss']
})
export class RegistroOtrosFactoresComponent implements OnInit {

  public listas:any;
  public formOtrosFactores:FormGroup;
  public ready:boolean = false;
  public anteriorValor:any  | undefined;
  public accion:string;
  public filteredOtrosFactores:Observable<any[]> = new Observable<any[]>();
  public listaOtrosFactores:FormArray;

  public autocompleteObjectValidator(listaof:any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      let inList:any = listaof.find((x:any) =>{return x.id_tipo == control.value})
      return inList?null:{ 'invalidAutocompleteObject': { value: control.value } }
    }
  }

  public validadorOtroFactorRepetido(otrosFactoresForm:FormArray) : ValidatorFn{
    return (control: AbstractControl): ValidationErrors|null => {
      if(!control.value){
        return null;
      }
      //busca si algún control diferente al que se está modificando tiene el mismo valor de tipoFactor
      let otroFactorRepetido = otrosFactoresForm.controls.findIndex((x:any)=>{return x.get('tipoFactor').value == control.value && x.get('tipoFactor') !== control });
      console.log('El repetico', otroFactorRepetido);
      return otroFactorRepetido != -1? {'ofRepetido' : true} as ValidationErrors:null;
    };
  }
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private listasService: ConsultaListasService) {
    console.log('entraOF', data);
      this.formOtrosFactores = data.formData;
      this.listaOtrosFactores = data.otrosFactoresForm;
      this.anteriorValor = this.formOtrosFactores.value;
      this.formOtrosFactores.markAllAsTouched();
      if (data.nuevo)
        this.accion = 'delete';
      else
        this.accion = 'cancel';
  }

  async ngOnInit() {
    this.listas = await this.listasService.consultarListas([11]);
    console.log('LA PUTA LISTA', this.listas);
    this.formOtrosFactores.get('tipoFactor')?.clearValidators();
    this.formOtrosFactores.get('tipoFactor')?.setValidators(Validators.compose([Validators.required,this.validadorOtroFactorRepetido(this.listaOtrosFactores),this.autocompleteObjectValidator(this.listas[11])]));
    this.filteredOtrosFactores = this.formOtrosFactores.get('tipoFactor')!.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value == null? '':value.descripcion),
      map(name => name ? this._filter(name) : this.listas[11].slice())
    );
    this.formOtrosFactores.updateValueAndValidity();
      this.ready = true;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.listas[11].filter((of:any) => of.descripcion.toLowerCase().indexOf(filterValue) != -1);
  }

  onSubmit(){
    console.log('submitOtroFactor');
  }

  public displayOtroFactorFn(listaOf:any[],id_tipo:number): string  {
    let otroFactor = listaOf?.find((x:any)=>{return x.id_tipo == id_tipo});
    console.log('el resultado', otroFactor);
    return otroFactor ? otroFactor.descripcion : ''
  }
}
