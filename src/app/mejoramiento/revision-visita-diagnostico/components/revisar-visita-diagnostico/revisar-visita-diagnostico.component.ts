import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-revisar-visita-diagnostico',
  templateUrl: './revisar-visita-diagnostico.component.html',
  styleUrls: ['./revisar-visita-diagnostico.component.scss']
})
export class RevisarVisitaDiagnosticoComponent implements OnInit {

  idGestion:number;
  idActividad:number;
  idDocumento:number;
  idMantenimientoEvento:number;
  idMantenimientoVial:number;
  ready:boolean;
  titulo:string = '';

  constructor(private activatedroute:ActivatedRoute, private router: Router) {
    this.idGestion = 0;
    this.idActividad = 0;
    this.idDocumento=0;
    this.idMantenimientoEvento = 0;
    this.idMantenimientoVial = 0;
    this.ready = false;
  }

  ngOnInit(): void {

    this.ready = false;
    this.activatedroute.paramMap.subscribe(params => {
      this.idMantenimientoEvento =  Number(params.get('idMantenimientoEvento'));
      if(!this.idMantenimientoEvento){
        console.error('No hay ningún id de mantenimiento evento definido');
      }
    });
    this.activatedroute.queryParams.subscribe(params =>{
      console.log('Los params de la ruta: ' , params);
        this.idGestion = params['idGestion'];
        if(!this.idGestion){
         console.error('No hay ninguna gestión asociada');
        }
        this.idActividad = params['idActividad'];
        if(!this.idActividad){
         console.error('No hay ninguna actividad asociada');
        }else if(this.idActividad == 4){
          this.titulo = "Revisar visita de diagnóstico";
        }else if (this.idActividad == 5){
          this.titulo = "Validar visita de diagnóstico";
        }else if (this.idActividad == 1521){
          this.titulo = "Revisar visita de pre diseño";
        }
        this.idDocumento = params['idDocumento'];
        if(!this.idDocumento){
          console.error('No hay ningun documento asociado a la captura');
        }

        this.idMantenimientoVial = params['idMantenimiento'];
        if(!this.idMantenimientoVial){
          console.error('No hay ningún id de mantenimiento vial definido');
        }
        this.ready = true;
      }
    );
  }

  
  gestionRealizada(){
    this.router.navigate(["dashboard/lista-pendientes/" + this.idActividad]);
  }

  
  
}
