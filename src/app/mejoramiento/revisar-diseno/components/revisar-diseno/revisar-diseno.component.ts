import { Component, OnInit, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-revisar-diseno',
  templateUrl: './revisar-diseno.component.html',
  styleUrls: ['./revisar-diseno.component.scss']
})
export class RevisarDisenoComponent implements OnInit {
  public ready: boolean = false;
  public step: number = 0;
  public idGestion: number = 0;
  public idActividad: number=0;
  public idDocumento:number = 0;
  public idMantenimientoEvento: number = 0;
  public idMantenimientoVial: number = 0;
  public idTiposArchivos: number = 0;
  titulo:string = '';


  constructor(
    private activatedroute:ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.ready = false;
    this.activatedroute.paramMap.subscribe(params => {
      this.idMantenimientoEvento =  Number(params.get('idMantenimientoEvento'));
      console.log('idMantenimientoEnvento', this.idMantenimientoEvento)
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
        }else if (this.idActividad == 14){
          this.titulo = "Revisar visita de pre diseño";
        }else if (this.idActividad == 1521){
          this.titulo = "Revisar visita de diseño";
        }else if (this.idActividad == 26){
          this.titulo = "Gestionar visitas de diseño";
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


  setStep(index: number) {
    this.step = index;
  }
  nextStep(){
    this.step++;
  }
  prevStep(){
    this.step--;
  }

}
