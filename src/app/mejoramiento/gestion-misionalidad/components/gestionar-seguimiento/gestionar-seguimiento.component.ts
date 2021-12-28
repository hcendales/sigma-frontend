import { Component, OnInit, Inject } from '@angular/core';
import { Routes, Router, ActivatedRoute, Params } from '@angular/router';
import { EnEsperaComponent } from '../../../../core/en-espera/en-espera.component';
import { MatDialog, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { UtilitariosService } from '../../../../core/services/utilitarios.service';
import { DialogVerVisitaDisenioComponent } from './dialog-ver-visita-disenio/dialog-ver-visita-disenio.component';

@Component({
  selector: 'app-gestionar-seguimiento',
  templateUrl: './gestionar-seguimiento.component.html',
  styleUrls: ['./gestionar-seguimiento.component.scss']
})
export class GestionarSeguimientoComponent implements OnInit {

  public idActividad:number = -1;
  public titulo:string = '';
  public routeReady :boolean = false;
  public cargandoComponente :boolean = false;
  public mostrarOpcionDefaultTabla:boolean = true;
  public acciones :any[] = [];
  constructor(private activatedroute: ActivatedRoute,public dialog: MatDialog, private utilitariosService:UtilitariosService) {

  }

  ngOnInit(): void {
    //this.mostrarVentanaEnEspera("Cargando");
    this.cargandoComponente = true;
    this.activatedroute.paramMap.subscribe(params => {
      this.cargandoComponente = true;
      this.routeReady = false;
      this.idActividad =  Number(params.get('idActividad'));
      console.log('EL ID DE LA ACTIVIDAD ES:',this.idActividad);
      this.acciones = [];
      this.mostrarOpcionDefaultTabla = true;
      if(this.idActividad == 9){
        this.titulo = 'Gestionar seguimiento';
      }else if (this.idActividad == 10){
        this.titulo = 'Gestionar misionalidad';
      }else if(this.idActividad == 5){
        this.titulo = 'Validar visita de diagnóstico';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
      }else if (this.idActividad == 15){
        this.titulo = 'Validar visita de prediseño';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verPredisenio',icon:'description',label:null,tooltip:'Ver visita de prediseño'});
      }else if(this.idActividad == 1561){
        this.titulo = 'Gestionar visitas de pre-diseño';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verPredisenio',icon:'description',label:null,tooltip:'Ver visita de prediseño'});
      }else if (this.idActividad == 1540){
        this.titulo = 'Validar visita de diseño';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDisenio',icon:'description',label:null,tooltip:'Ver visita de diseño'});
      }else if (this.idActividad == 6){
        this.titulo = 'Priorizar intervenciones';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDisenio',icon:'description',label:null,tooltip:'Ver visita de diseño'});
      }else if (this.idActividad == 12){
        this.titulo = 'Validar priorización';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDisenio',icon:'description',label:null,tooltip:'Ver visita de diseño'});
      }
      else if (this.idActividad == 44){
        this.titulo = 'Gestión alcaldías';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
      }
      else if (this.idActividad == 45){
        this.titulo = 'Priorización alcaldías';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
      }
      else if (this.idActividad == 46){
        this.titulo = 'Ejecución alcaldías';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
      }
      else if (this.idActividad == 47){
        this.titulo = 'Seguimiento alcaldías';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
      }
      else if (this.idActividad == 26){
        this.titulo = 'Gestionar visitas de diseño';
        this.mostrarOpcionDefaultTabla = false;
        this.acciones.push({nombre: 'verDiagnostico',icon:'description',label:null,tooltip:'Ver visita de diagnóstico'});
      }else if(this.idActividad == 1821){
        this.titulo = 'Gestionar cambios de diagnóstico';
        this.mostrarOpcionDefaultTabla = false;
        
      }


      console.log('LA COSA ESTAAAA EN', this.titulo);
      let ctx = this;
      setTimeout(function(){ ctx.routeReady = true; }, 0);
    });
  }

  mostrarVentanaEnEspera(titulo:string, footer?:string){
    let data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
  }

  componenteListo(){
    this.cargandoComponente = false;
    this.dialog.closeAll();
  }

  onOpcionSelectedEvt(e:any){
    if(e.opcion == 'verPredisenio'){
      this.dialog.open(DialogVerVisitaDiagnostico,{height: '85vh',width: '85vw',data:{titulo:"Visita de pre diseño",dataMantenimiento:e.data}});
    }else if(e.opcion == 'verDiagnostico'){
      this.dialog.open(DialogVerVisitaDiagnostico,{height: '85vh',width: '85vw',data:{titulo:"Visita de diagnóstico",dataMantenimiento:e.data}});
    }
    else if(e.opcion == 'verDisenio'){
      this.dialog.open(DialogVerVisitaDisenioComponent,{height: '85vh',width: '85vw',data:{titulo:"Visita de diseño",dataMantenimiento:e.data}});
    }
  }

  async gestionRealizadaEvt(e:any){
    //si es desde validar visita de diagnostico o validar visita de pre-diseño
    if(this.idActividad == 5 || this.idActividad == 15 && (e.transicion == 69 || e.transicion == 12 || e.transicion == 2105)){
      console.log('**GENRA ACTAS DE VISITA **')
      for(let gestion of e.evento){
        let idDocumento = gestion.id_documento;
        let idMantenimientoVial = gestion.id_mantenimiento_vial;
        let idMantenimientoVialEvento = gestion.id_mantenimiento_vial_evento;
        let extent = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1";
        let bboxSR = "102100";
        let res = this.utilitariosService.generarActaDianostico(idDocumento,idMantenimientoVial, idMantenimientoVialEvento, extent, bboxSR,this.idActividad, true);
        //console.log('La res de la generación', res);
      }
      //si va de gestion alcaldía s priorización alcaldías
    }else if(this.idActividad == 44 && e.transicion == 43){
      console.log('**GENRA ACTAS DE VISITA ALCALDÍAS**')
      for(let gestion of e.evento){
        let idDocumento = gestion.id_documento;
        let idMantenimientoVial = gestion.id_mantenimiento_vial;
        let idMantenimientoVialEvento = gestion.id_mantenimiento_vial_evento;
        let extent = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1";
        let bboxSR = "102100";
        let res = this.utilitariosService.generarActaDianostico(idDocumento,idMantenimientoVial, idMantenimientoVialEvento, extent, bboxSR,this.idActividad, true);
      }
    }else if(this.idActividad == 1821 && e.transicion == 43){
      console.log('**GENRA ACTAS DE VISITA ALCALDÍAS**')
      for(let gestion of e.evento){
        let idDocumento = gestion.id_documento;
        let idMantenimientoVial = gestion.id_mantenimiento_vial;
        let idMantenimientoVialEvento = gestion.id_mantenimiento_vial_evento;
        let extent = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1";
        let bboxSR = "102100";
        let res = this.utilitariosService.generarActaDianostico(idDocumento,idMantenimientoVial, idMantenimientoVialEvento, extent, bboxSR,this.idActividad, true);
      }
    }

  }

}

@Component({
  selector: 'dialog-ver-visita-diagnostico',
  templateUrl: 'dialog-ver-visita-diagnostico.html',
})
export class DialogVerVisitaDiagnostico {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('la data es:',data);
  }
}
