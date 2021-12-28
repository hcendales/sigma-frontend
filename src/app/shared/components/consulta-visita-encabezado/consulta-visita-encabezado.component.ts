import { Component, OnInit, Input} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { MantenimientoVial } from '../../../core/models/mantenimiento-vial';
import { ConsultaListasService } from '../../../core/services/consulta-listas.service'
import { EntityTabMantenimientoVialService } from '../../../core/services/entity-tab-mantenimiento-vial.service';
import { MantenimientoVialEventoService } from '../../../core/services/mantenimiento-vial-evento.service';
import { SimpleDialogComponent } from '../../../core/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-consulta-visita-encabezado',
  templateUrl: './consulta-visita-encabezado.component.html',
  styleUrls: ['./consulta-visita-encabezado.component.scss']
})
export class ConsultaVisitaEncabezadoComponent implements OnInit {
  @Input() idMantenimientoEvento:number = 0;
  public mantenimientoVialEvento:any;

  constructor(
    private activatedroute:ActivatedRoute,
              private router:Router,
              private listasService: ConsultaListasService,
              private tabMantenimientoService:EntityTabMantenimientoVialService,
              public dialog: MatDialog,
              private snackBar:MatSnackBar,
              private mantenimientoVialEventoService: MantenimientoVialEventoService,
    ){

    }

  ngOnInit(): void {
    try{
      // console.log('idMantenimientoEvento: Llega', this.idMantenimientoEvento);
      if(this.idMantenimientoEvento!=0){
        this.getMantenimientoVialEvento(this.idMantenimientoEvento);
      }
    }catch(error){
      this.handleError(error);
    }
  }

  async getMantenimientoVialEvento(idMantenimientoVialEvento:number){
    let respServ = await this.mantenimientoVialEventoService.get(idMantenimientoVialEvento);
    this.mantenimientoVialEvento = respServ.respuesta[0];
    // console.log('elEvento', this.mantenimientoVialEvento);
    return;
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

}
