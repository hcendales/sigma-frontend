import { Component, OnInit, Input } from '@angular/core';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service'
import { EntityTabArchivoServiceService } from '../../../../core/services/entity-tab-archivo-service.service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-ver-fotos',
  templateUrl: './ver-fotos.component.html',
  styleUrls: ['./ver-fotos.component.scss']
})
export class VerFotosComponent implements OnInit {
  @Input() idDocumento: number = 0;
  public fotosMantenimiento:any[] = [];
  public URL_FOTOS = environment.URL_FOTOS;

  constructor(
    private listasService: ConsultaListasService,
    private tabArchivoService:EntityTabArchivoServiceService,

  ) { }

  ngOnInit(): void {
    if(this.idDocumento!==0){
      this.getFotos(this.idDocumento);
    }
  }

  async getFotos(idDocumento:number){
    let condicion = " id_documento=" + idDocumento + " and id_tipo_archivo=2051";
    // console.log('Condicion:', condicion);
    let res:any = await this.tabArchivoService.listArchivos(condicion);
    // let res:any = await this.tabArchivoService.get(idDocumento);
    if(res.codError != 0){
      throw res;
    }else{
      let ListaArchivos = res.respuesta;
      for(let archivo of ListaArchivos){
        let objArchivo = {idArchivo:archivo.id_archivo,url:''+archivo.url_archivo,fileInfo:null};
        this.fotosMantenimiento.push(objArchivo);
      }
      // console.log('Fotos',this.fotosMantenimiento);
    }

  }

}
