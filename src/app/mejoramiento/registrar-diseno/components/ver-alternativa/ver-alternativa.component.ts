import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-ver-alternativa',
  templateUrl: './ver-alternativa.component.html',
  styleUrls: ['./ver-alternativa.component.scss']
})
export class VerAlternativaComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      value: null
    }
  };

  entity: any = null;
  public titulo = 'Ver Detalle Alternativa';

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation?.extras?.state;
  }

  ngOnInit(): void {
    if ( typeof(this.entity) === 'undefined'){
      console.log('No hay datos para mostrar');
    }
  }

  // Retorna al listado
  returnlist(): void{
    this.router.navigate(['dashboard/administracion-personas/listar']);
  }
}
