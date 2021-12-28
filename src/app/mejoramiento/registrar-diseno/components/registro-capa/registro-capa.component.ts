import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';

@Component({
  selector: 'app-registro-capa',
  templateUrl: './registro-capa.component.html',
  styleUrls: ['./registro-capa.component.scss']
})
export class RegistroCapaComponent implements OnInit {
  @Input() idAlternativaDisenio: number = 0;

  public listas: any;
  public ready:boolean = false;

  form = this.formBuilder.group({
    capas: this.formBuilder.array([])
  })

  constructor(
    private listasService: ConsultaListasService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    if(!this.idAlternativaDisenio){
      console.error("No hay id de alternativa");
    }
    else{
      this.listasService.consultarListas([89]).then((listas) => {this.listas = listas; this.ready = true;});
    }
  }

  get capas(){
    return this.form.controls["capas"] as FormArray;
  }

  addCapa(){
    const capaForm = this.formBuilder.group({
      idTipoCapa: ['', Validators.required],
      espesor: ['', [Validators.required, Validators.min(0), Validators.max(50)]]
    });

    this.capas.push(capaForm);
  }

  deleteCapa(capaIndex: number){
    this.capas.removeAt(capaIndex);
  }

  public adicionarCapa(){
    console.log(this.capas);
  }

}
