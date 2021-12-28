import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.scss']
})
export class VerComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      value: null
    }
  };
  entity: any = null;
  public titulo = 'Ver Detalle Persona';

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation?.extras?.state;
    // console.log('LLega ', this.entity);
  }

  ngOnInit(): void {
    if ( typeof(this.entity) === 'undefined'){
      this.router.navigate(['dashboard/administracion-personas/listar']);
    }
  }
  onEdit(): void{
    this.navigationExtras.state = this.entity;
    this.router.navigate(['dashboard/administracion-personas/actualizar'], this.navigationExtras);
  }
  // Retorna al listado
  returnlist(): void{
    this.router.navigate(['dashboard/administracion-personas/listar']);
  }
}
