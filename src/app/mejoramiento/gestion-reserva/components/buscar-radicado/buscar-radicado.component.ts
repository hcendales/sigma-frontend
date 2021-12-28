import { BooleanInput } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BuscarRadicadoOrfeoService } from 'src/app/core/services/buscar-radicado-orfeo.service';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-buscar-radicado',
  templateUrl: './buscar-radicado.component.html',
  styleUrls: ['./buscar-radicado.component.scss']
})
export class BuscarRadicadoComponent implements OnInit {
    radicadoStr!: string;
    radicado: any | undefined;
    radicadoOrfeo!: Observable<any>;
    detalleRadicado!: Boolean;
    buscarRadicado!: BooleanInput;
    respuestaSeleccionada!: number;
    @Input()
  tipoRad!: string;
    @Input()
  solMantenimientoVial!: any;

  @Input()
  tipoDestino: boolean = false;

    @Input()
  openedAtStart: boolean = false;

    @Output() radLoaded = new EventEmitter<boolean>();
    @Output() changeResp = new EventEmitter<number>();

    @ViewChild('panel') panel:any;

    constructor(private buscarRadicadoService: BuscarRadicadoOrfeoService, public dialog: MatDialog) { }

    ngOnInit() {
      this.detalleRadicado = false;
      this.buscarRadicado = true;
    }

    ngAfterViewInit(){
      if(this.openedAtStart){
        this.open();
      }
    }
    buscarRadicadoOrfeo(){
      this.buscarRadicadoService.get(this.radicadoStr).then((resp: any) => {
          if(resp.respuesta){
            console.log("radicado:",resp.respuesta[0]);
            this.radicado = resp.respuesta[0];
            this.detalleRadicado = true;
            let content = "<ul><b>Detalle del radicado: </b>" + this.radicado.radi_nume_radi + "</ul>";
            content += "<li><b>Asunto: </b>" + this.radicado.ra_asun + "</li>";
            content += "<li><b>Fecha radicado: </b>" + new Date(this.radicado.radi_fech_radi) + "</li>";
            content += "<li><b>Fecha vencimiento: </b>" + new Date(this.radicado.fech_vcmto) + "</li></ul>";
            const dialogRef = this.dialog.open(SimpleDialogComponent,{
              data: {
                titulo: 'Radicado Orfeo',
                contenido: content,
                aceptar: true,
                cancelar: true,
                cerrar: false
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              this.radLoaded.emit(true);
            });
          } else {
            this.radicado = undefined;
            this.detalleRadicado = false;
          }
        }
      );
    }
    vincularRadicado(){
      this.detalleRadicado = false;
      this.radLoaded.emit(true);
     }
    cancelarVincular(){
      this.detalleRadicado = false;
      this.radicado = undefined;
      this.radicadoStr = '';
    }
    checkRadicado(event: KeyboardEvent){
      const target = event.target as HTMLInputElement;
      if (target) {
        let str: string = target.value;
        let radRegex = /20([0-9]{12})/g;
         this.buscarRadicado = !radRegex.test(str);
     }
    }
    selTipoResp(){
      this.changeResp.emit(this.respuestaSeleccionada);
    }

    open(){
      this.panel.open();
    }

}
