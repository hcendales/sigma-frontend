import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { ModalConfirmarComponent } from 'src/app/mejoramiento/solicitud-ensayo-laboratorio/components/modal-confirmar/modal-confirmar.component';


@Component({
  selector: 'app-tabs-distribuidor',
  templateUrl: './tabs-distribuidor.component.html',
  styleUrls: ['./tabs-distribuidor.component.scss']
})
export class TabsDistribuidorComponent implements OnInit {
  
  /**
   * Controla los tabs
   */
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  
  
  /**
   * Campos de la solicitud de ensayo
   */
  rowUpdate: SolicitudEnsayoLaboratorio = {} as SolicitudEnsayoLaboratorio;

  /**
   * Titulo de cada tabs
   */
  titleCard: string = "";

  /**
   * Id del Tipo de Solicitud cargada
   */
  id_tipo_servicio: number = 0;

  /**
   * Activa el Spinner en el formulario
   */
  loading: boolean = false;       //-> accion que carga el spinner

  /**
   * Define el estado de la solicitud en caso de estar la solicitud Finalizada solo se puede consultar
   */
  situacion: boolean = false

  /**Tamanio del modal Confirmacion */
  wDialog: string = '25%';
  hDialog: string = '22%';

  constructor(
    private activatedRoute: ActivatedRoute,
    public cargueResultadoEnsayoService: CargueResultadoEnsayoService,
    public solicitudEnsayoLaboratorioService: SolicitudEnsayoLaboratorioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,) { }


  async ngOnInit() {

    /**
     * Obtiene el ID_ENSAYO de la URL lo envia al metodo de consultar solicitud y espera por la respuesta del servicio
     * imprime los datos en las variables correspondiente.
     */
    this.activatedRoute.params
      .pipe(switchMap(async ({ id }) => await this.solicitudEnsayoLaboratorioService.buscarSolicitudes("id_ensayo = " + id)))
      .subscribe(element => {

        console.log(">>~>",element)

        this.loading = true;
        this.rowUpdate = element.respuesta[0];
        this.situacion = this.rowUpdate.situacion === "FINALIZADO" ? true : false;
        this.titleCard = element.respuesta[0].desc_servicio;
        this.id_tipo_servicio = element.respuesta[0].id_tipo_servicio;
        this.loading = false;

      });
  }
  onFinalizar(){

    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { action: "F", itm: this.rowUpdate.codigo_ensayo }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        await this.cargueResultadoEnsayoService.cambiarEstadoSolicitud(this.rowUpdate.id_ensayo, "FINALIZADO").then(resp => {
          this.snackBar.open('Cambios realizados, se ha Finalizado la gestion de la Solicitud', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          this.router.navigate(['dashboard/mejoramiento-cargue-resultado-ensayo/'])
          this.loading = false;
        }).catch(error => {
          this.snackBar.open("Error, no se lograron obtener algunos datos para el formulario. por favor salga y vuelva a intentar: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          this.loading = false;
        });
      }
    });
  }
}
