import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

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
  public titulo = 'Detalle Lugar';
  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation?.extras?.state;
  }

  ngOnInit(): void {}

  returnlist(): void{
    this.router.navigate(['dashboard/administracion-lugares/listar']);
  }
  onEdit(): void{
    this.navigationExtras.state = this.entity;
    this.router.navigate(['dashboard/administracion-lugares/actualizar'], this.navigationExtras);
  }
}
