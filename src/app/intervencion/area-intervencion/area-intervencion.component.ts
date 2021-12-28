import { Component, Inject, OnInit } from '@angular/core';

import { FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { IntervencionService } from 'src/app/core/services/intervencion.service';

@Component({
  selector: 'app-area-intervencion',
  templateUrl: './area-intervencion.component.html',
  styleUrls: ['./area-intervencion.component.scss']
})
export class AreaIntervencionComponent implements OnInit {

  public listas:any;
  public listaF:any;
  public formAreaIntervencion:FormGroup;
  ready = false;
  filtroAct:string;
  anteriorValor : any;
  tipoElemento_lista = [
                       {"id_tipo":"1","descripcion":"1"},
                       {"id_tipo":"2","descripcion":"2"},
                       {"id_tipo":"3","descripcion":"3"},
                       {"id_tipo":"4","descripcion":"4"},
                       {"id_tipo":"5","descripcion":"5"},
                       {"id_tipo":"6","descripcion":"6"},
                       {"id_tipo":"7","descripcion":"7"},
                       {"id_tipo":"8","descripcion":"8"},
                       {"id_tipo":"9","descripcion":"9"},
                       {"id_tipo":"10","descripcion":"10"},
                       {"id_tipo":"11","descripcion":"11"},
                       {"id_tipo":"12","descripcion":"12"}
                     ];


  public accion:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private listasService: ConsultaListasService,
              private intervencionService: IntervencionService) {
    console.log(data);
    this.formAreaIntervencion = data.formData;
    this.filtroAct = data.filtroAG;
    this.anteriorValor = this.formAreaIntervencion.value
    if (data.nuevo)
      this.accion = 'delete';
    else
      this.accion = 'cancel';
   }

  ngOnInit(): void {
    let listasIds = [
      42, //Tipo de superficie: (DOMINIO: TAB_FALLA_ID_TIPO_SUPERFICIE)
      25 //Tipo de intervención: (DOMINIO: TAB_FALLA_ID_TIPO_INTERVENCION)
    ];

    this.listasService.consultarListas(listasIds)
        .then((listas) => {
          this.listas = listas;
          console.log(this.listas);
          this.ready = true;
        });
    this.intervencionService.queryFiltroActividad(this.filtroAct)
      .then((listaFiltrada) => {
        this.listaF = listaFiltrada.respuesta;
        console.log('filtro AG:', this.filtroAct);
        console.log('filtradas AG:', listaFiltrada);
      });
  }

  onSubmit(){

  }
  //filtra las listas de tipo de falla en función del tipo de superficie
  //y de tipo de intervención en funcion dle tipo de intervención total
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
/*
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

    //tipos de severidad
    this.listaSeveridades = [...this.listas[24]];
    this.listaSeveridades.sort((a:any,b:any) => (Number(a.valor) > Number(b.valor)) ? -1 : ((Number(b.valor) > Number(a.valor)) ? 1 : 0));
    */
  }
}
