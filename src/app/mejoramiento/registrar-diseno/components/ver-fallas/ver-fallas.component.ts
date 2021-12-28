import { Component, OnInit, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Falla } from '../../../../core/models/falla';
import { UnidadMuestreo } from '../../../../core/models/unidad-muestreo';

import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { EntityTabUnidadMuestreoService } from '../../../../core/services/entity-tab-unidad-muestreo-service';
import { EntityTabFallasServiceService } from '../../../../core/services/entity-tab-fallas-service.service';
import { MantenimientoVialEventoService } from '../../../../core/services/mantenimiento-vial-evento.service';
import { EntityTabMantenimientoVialService } from '../../../../core/services/entity-tab-mantenimiento-vial.service';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';


@Component({
  selector: 'app-ver-fallas',
  templateUrl: './ver-fallas.component.html',
  styleUrls: ['./ver-fallas.component.scss']
})
export class VerFallasComponent implements OnInit {

  @Input() idMantenimientoEvento:number = 0;

  public unidadesMantenimiento:UnidadMuestreo[] = [];
  public fallasMantenimiento:Falla[] = [];
  public IDS_FALLAS_LONGITUD =  [604, 607, 608, 609, 610, 1567, 645, 648];

  public conUnidadesMuestreo = true;
  public arrayValores = new Array<any>();
  public dictValores = {} as any;
  public mantenimientoVialEvento:any;
  public ready: boolean = false;

  constructor(
    private listasService: ConsultaListasService,
    private tabMantenimientoService:EntityTabMantenimientoVialService,
    private tabUnidadMuestreoService:EntityTabUnidadMuestreoService,
    private tabFallasService:EntityTabFallasServiceService,
    private mantenimientoVialEventoService: MantenimientoVialEventoService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    try{
      let operaciones = [
                         this.getMantenimientoVialEvento(this.idMantenimientoEvento),
                         this.getUnidadesYFallas(this.idMantenimientoEvento),
                        ];
      forkJoin(operaciones).subscribe((lista) => {
        this.conUnidadesMuestreo = this.aplicaUnidadesMuestreo();
        this.ready = true;
      });
      }catch(error){
        this.handleError(error);
      }
  }

  async getMantenimientoVialEvento(idMantenimientoVialEvento:number){
    let respServ = await this.mantenimientoVialEventoService.get(idMantenimientoVialEvento);
    this.mantenimientoVialEvento = respServ.respuesta[0];
    console.log('elEvento', this.mantenimientoVialEvento);
    return;
  }

  async getUnidadesYFallas(idMantenimiento:number){
    try{
      await this.getUnidadesMuestreo(idMantenimiento);

      let arrayFork = [];
      for(let unidad of this.unidadesMantenimiento){
        arrayFork.push(this.getFallas(unidad.idUnidadMuestreo!));
      }
      await forkJoin(arrayFork);
    }catch(error){
        this.handleError(error);
    }
    console.log('fallas',this.fallasMantenimiento);
  }

  async getUnidadesMuestreo(idMantenimiento:number){

    let respuestaServicio = await this.tabUnidadMuestreoService.get(idMantenimiento);
    if(respuestaServicio.codError !== 0){
      throw respuestaServicio;
    }
    this.unidadesMantenimiento = respuestaServicio.respuesta.map((und:any) => this.serviceResponseToUnidadMuestreo(und as any));
    this.unidadesMantenimiento.sort((a:UnidadMuestreo,b:UnidadMuestreo) => !a?.abscisaInicial?-1:!b?.abscisaInicial?1:(a.abscisaInicial > b.abscisaInicial) ? 1 : ((b?.abscisaInicial > a.abscisaInicial) ? -1 : 0));
    console.log('Unidades de muestreo:',this.unidadesMantenimiento);

  }

  async getFallas(idUnidadMuestreo:number){
    let respuestaServicio = await this.tabFallasService.get(idUnidadMuestreo);
    if(respuestaServicio.codError !== 0){
      throw respuestaServicio;
    }
    this.fallasMantenimiento = [...this.fallasMantenimiento,...respuestaServicio.respuesta.map((falla:any) => this.serviceResponseToFalla(falla as any))];
    for(let falla of this.fallasMantenimiento){
      let index = this.unidadesMantenimiento.findIndex((und:UnidadMuestreo)=>und.idUnidadMuestreo==falla.idUnidadMuestreo);
      if(index != -1){
        falla.indexUnidadMuestreo = index;
      }
      this.arrayValores.push(falla.idTipoFalla);
      this.arrayValores.push(falla.idTipoSeveridad);
      this.arrayValores.push(falla.idTipoIntervencion);
    }
    if(this.arrayValores.length > 0){
      this.dictValores = {...this.dictValores,...await this.listasService.consultarTipos(this.arrayValores)};
    }
    this.fallasMantenimiento.sort((a:Falla,b:Falla) => !a?.indexUnidadMuestreo?-1:!b?.indexUnidadMuestreo?1:(a.indexUnidadMuestreo > b.indexUnidadMuestreo) ? 1 : ((b?.indexUnidadMuestreo > a.indexUnidadMuestreo) ? -1 : 0));
    console.log('Fallas ',this.fallasMantenimiento, idUnidadMuestreo);
  }

  aplicaUnidadesMuestreo(){
    //revisa si para el tipo de superficie aplican unidades de muestreo
    let tiposSuperficieUnidad = [1102,1103,1105,1106];//tipos de superficie para los que aplica unidad de muestreo
    return tiposSuperficieUnidad.indexOf(this.mantenimientoVialEvento.id_tipo_superficie) != -1
  }

  handleError(error?:any){
    let txtError = ''
    if(error.msjError){
      txtError = error.msjError;
    }else if (error.error){
      txtError = error.error.msjError;
    }else{
      txtError = error.status;
    }
    const dialogRef = this.dialog.open(SimpleDialogComponent,{
      data:{
        contenido: 'Hubo un error en la operación: ' + txtError,
        aceptar: true
      }
    });
  }

  serviceResponseToUnidadMuestreo(unidadResponse:any){
    let res:UnidadMuestreo = new UnidadMuestreo();
    res.idUnidadMuestreo = unidadResponse.id_unidad_muestreo;
    res.abscisaInicial = unidadResponse.abscisa_inicial;
    res.abscisaFinal = unidadResponse.abscisa_final;
    res.ancho = unidadResponse.ancho;
    res.area = unidadResponse.area;
    return res;
  }

  serviceResponseToFalla(fallaResponse:any){
    let res:Falla = new Falla();
    res.idFalla = fallaResponse.id_falla;
    res.distancia = fallaResponse.distancia;
    res.idTipoSuperficie = fallaResponse.id_tipo_superficie;
    res.idTipoFalla = fallaResponse.id_tipo_falla;
    res.idTipoSeveridad = fallaResponse.id_tipo_severidad;
    res.longitud = fallaResponse.longitud;
    res.ancho = fallaResponse.ancho;
    res.area = fallaResponse.area;
    res.idTipoIntervencion = fallaResponse.id_tipo_intervencion;
    res.numeroLosas = fallaResponse.numero_losas;
    res.idUnidadMuestreo = fallaResponse.id_unidad_muestreo;
    return res;
  }

  esFallaLongitudinal(idFalla:any){
    return this.IDS_FALLAS_LONGITUD.includes(idFalla);
  }

}
