import { Component, OnInit, Input } from '@angular/core';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service'
import { EntityTabOtrosFactoresServiceService } from '../../../../core/services/entity-tab-otros-factores-service.service';
@Component({
  selector: 'app-ver-otro-factor',
  templateUrl: './ver-otro-factor.component.html',
  styleUrls: ['./ver-otro-factor.component.scss']
})
export class VerOtroFactorComponent implements OnInit {
  @Input() idMantenimientoVialEvento: number = 0;
  public otrosFactoresMantenimiento:any[] = [];
  public arrayValores = new Array<any>();
  public dictValores = {} as any;
  public ready: boolean = false;

  constructor(
    private entityTabOtrosFactoresServiceService: EntityTabOtrosFactoresServiceService,
    private listasService: ConsultaListasService,
  ) { }

  ngOnInit(): void {
    if(this.idMantenimientoVialEvento!==0){
      this.getOtrosFactores(this.idMantenimientoVialEvento);
    }
  }
  async getOtrosFactores(idMantenimientoVialEvento:number){

    let res:any = await this.entityTabOtrosFactoresServiceService.get(idMantenimientoVialEvento);
    if(res.codError != 0){
      throw res;
    }else{
      let ListaOtrosFactores = res.respuesta;
      for(let otroFactor of ListaOtrosFactores){
        let objFactor = {idOtroFactor:otroFactor.id_otro_factor,tipoFactor:otroFactor.id_tipo_otro_factor};
        this.otrosFactoresMantenimiento.push(objFactor);
        this.arrayValores.push(objFactor.tipoFactor);
      }
      if(this.arrayValores.length > 0){
        this.dictValores = {...this.dictValores,...await this.listasService.consultarTipos(this.arrayValores)};
      }
      console.log('otros factores', this.otrosFactoresMantenimiento);
      this.ready = true;
    }

  }
}
