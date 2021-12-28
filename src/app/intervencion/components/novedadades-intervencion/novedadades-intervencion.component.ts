import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { IntervencionService } from 'src/app/core/services/intervencion.service';

import { AbstractControl,
        FormBuilder,
        Validators,
        FormControl,
        FormArray } from '@angular/forms';


@Component({
  selector: 'app-novedadades-intervencion',
  templateUrl: './novedadades-intervencion.component.html',
  styleUrls: ['./novedadades-intervencion.component.scss']
})
export class NovedadadesIntervencionComponent implements OnInit {

    public listas:any;

  ready: boolean;
  anteriorValor: any;
  accion: string | undefined;

  form = this.fb.group({
    activity: [{value: '', disabled: false}, [Validators.required]]
  });

  constructor(
              private listasService: ConsultaListasService,
              private intervencionService: IntervencionService,
              private fb: FormBuilder
            ) {


    this.ready = false;
   }

  ngOnInit(): void {
    this.listasService.consultarListas([116]).then((listas) => {this.listas = listas; console.log(this.listas); this.ready = true;});
  }
  /**
   * Cancela toda accion y cierra el modal
   */
  onNoClick(): void {
    //this.dialogRef.close();
    console.log(this.form.value);
  }

  /**
   * Envia los datos seleccionados al formulario
   */
  onAsociar(): void {
    //this.dialogRef.close(this.datos);
  }

}
