import { Component, OnInit, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consulta-disenio',
  templateUrl: './consulta-disenio.component.html',
  styleUrls: ['./consulta-disenio.component.scss']
})
export class ConsultaDisenioComponent implements OnInit {
  public ready: boolean = false;
  public step: number = 0;
  @Input() idGestion: number = 0;
  @Input() idActividad: number=0;
  @Input() idDocumento:number = 0;
  @Input() idMantenimientoEvento: number = 0;
  @Input() idMantenimientoVial: number = 0;
  public idTiposArchivos: number = 0;
  public guardadoTodo = true;
  public titulo:string = '';
  constructor(
    private router:Router,
  ) { }

  ngOnInit(): void {
    console.log('Pasa: ', this.idMantenimientoEvento);
    if(this.idActividad === 14){
      this.titulo = "Revisar Diseño";
    }
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

  gestionRealizada(){
    this.router.navigate(["dashboard/lista-pendientes/" + this.idActividad]);
  }

  accionGestion(e:any){
    if(e.action == 'cancel'){
      this.guardadoTodo = false;
    }
  }
}
