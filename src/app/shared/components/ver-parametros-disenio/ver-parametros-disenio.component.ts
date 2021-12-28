import { Component, OnInit, Input } from '@angular/core';
import { MantenimientoVialEventoService } from '../../../core/services/mantenimiento-vial-evento.service';


@Component({
  selector: 'app-ver-parametros-disenio',
  templateUrl: './ver-parametros-disenio.component.html',
  styleUrls: ['./ver-parametros-disenio.component.scss']
})
export class VerParametrosDisenioComponent implements OnInit {
  @Input() idMantenimientoVialEvento: number = 0;
  public entity: any = null;
  public titulo: string = 'Parametros de Diseño'

  constructor(
    private mantenimientoVialEventoService: MantenimientoVialEventoService,
  ) { }

  ngOnInit(): void {
    console.log('Parametros idMantenimientoVialEvento ', this.idMantenimientoVialEvento);
    if(this.idMantenimientoVialEvento != 0){
      this.getMantenimientoVialEvento(this.idMantenimientoVialEvento);
    }
  }

  async getMantenimientoVialEvento(idMantenimientoVialEvento:number){
    let respServ = await this.mantenimientoVialEventoService.get(idMantenimientoVialEvento);
    this.entity = respServ.respuesta[0];
    console.log('elEvento Parametros', this.entity);
    return;
  }

}
