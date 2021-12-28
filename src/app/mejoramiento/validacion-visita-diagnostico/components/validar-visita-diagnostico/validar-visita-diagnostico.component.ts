import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validar-visita-diagnostico',
  templateUrl: './validar-visita-diagnostico.component.html',
  styleUrls: ['./validar-visita-diagnostico.component.scss']
})
export class ValidarVisitaDiagnosticoComponent implements OnInit {

  constructor(public route:ActivatedRoute) { }

  ngOnInit(): void {
  }

  gestionRealizadaEvt(e:any){
    console.log('lo que sale del evento ',e);
  }

}
