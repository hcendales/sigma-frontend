import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';

@Component({
  selector: 'app-modal-autoprogramar',
  templateUrl: './modal-autoprogramar.component.html',
  styleUrls: ['./modal-autoprogramar.component.scss']
})
export class ModalAutoprogramarComponent implements OnInit {
  solMant: any;
  modalAutoprog: FormGroup;
  anteriorValor: any;
  pkAutoprogamable: Boolean;
  pkFueraRango: Boolean;
  tipoOrigenSeleccionado: number | undefined;
  tipoRad:string = "Entrada";
  radicadoStr:any = {};
  listas: any;
  ready: boolean | undefined;
  entidadUsuario:number;
  origFilter: any;
  @ViewChild('buscarRadicado',{static:false}) buscarRadicado: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder, private listasService: ConsultaListasService) {
    //console.log('entra ModalAuto', data);
      this.modalAutoprog = this.fb.group({tipoOrigenSeleccionado:[0,[]]});
      this.modalAutoprog.markAllAsTouched();
      this.solMant = data.solMant;
      this.pkAutoprogamable = data.pkAutoprogamable;
      this.pkFueraRango = data.pkFueraRango;
      this.entidadUsuario = data.entidadUsuario;
      this.origFilter = data.origFilter;
  }


  ngOnInit(): void {
    console.log('apModFil',this.origFilter);
    this.ready = true;
    /*this.listasService.consultarListas([15]).then((listas) => {
      console.log('lstSr',listas);
      this.listas = listas;//.filter((f:any)=>{return this.origFilter.indexOf(f);});
    });*/
  }

  cancelarAutoprog() {
    this.solMant = undefined;
  }
  onSubmit(){
    console.log('submitModalAutoprog');
  }
  public asignarRadicado(event:any){
    console.log('cheRad',this.buscarRadicado);
    this.radicadoStr = this.buscarRadicado.radicado;
  }
  get tipoOrigen() {
    return this.modalAutoprog.get('tipoOrigenSeleccionado') as FormArray;
  }
  mostrarBotonOk(){
    if(this.pkAutoprogamable && this.pkFueraRango){
      return false;
    }
    if(!this.pkAutoprogamable){
      return false;
    }
    if (this.tipoOrigenSeleccionado == 371){
      return false;
    } else {
      return this.pkAutoprogamable && this.tipoOrigenSeleccionado != 0;
    }
  }
}
