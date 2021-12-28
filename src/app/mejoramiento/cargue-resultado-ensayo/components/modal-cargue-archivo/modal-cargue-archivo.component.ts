import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CargueArchivoDocumentoService } from 'src/app/core/services/cargue-archivo-documento.service';
import { CargueResultadoEnsayoService } from 'src/app/core/services/cargue-resultado-ensayo.service';
import { SolicitudEnsayoLaboratorioService } from 'src/app/core/services/solicitud-ensayo-laboratorio.service';
import { UtilitariosService } from 'src/app/core/services/utilitarios.service';


@Component({
  selector: 'app-modal-cargue-archivo',
  templateUrl: './modal-cargue-archivo.component.html',
  styleUrls: ['./modal-cargue-archivo.component.scss']
})
export class ModalCargueArchivoComponent implements OnInit {


  /**
   *  propiedades angular-file
   */
  accept              = 'application/pdf';
  dragFiles           : any;
  fileDropDisabled    : any;
  files               : File[] = [];
  lastFileAt          !: Date;
  lastInvalids        : any;
  loadExport          : boolean = false;
  maxSize             : any;
  validComboDrag      : any;

  /** Codigo de Orfeo */
  numeroRadicado      : number = 0;
  idArchivo           : number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalCargueArchivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cargueArchivoDocumentoService: CargueArchivoDocumentoService,
    private idsMantenimientoVial: SolicitudEnsayoLaboratorioService,
    private cargueResultadoEnsayoService: CargueResultadoEnsayoService,
    private utilitariosService: UtilitariosService,
  ) { }

  ngOnInit(): void { 
    this.numeroRadicado = this.data.itm.numero_radicado;
  }

  async subirArchivo(): Promise<any> {
    this.loadExport = true;
    const archivo = this.files[0];

    this.data.itm.id_documento_informe  = 0;
    await this.cargueResultadoEnsayoService.buscarInforme("id_ensayo = " + this.data.idEnsayo).then(r => {
      console.log(r.respuesta, r.respuesta[0])

      if (r.respuesta[0] !== undefined)
      this.data.itm.id_documento_informe = r.respuesta[0].id_documento_informe;
    })

    if (this.data.itm.id_documento_informe === 0)
    await this.cargueResultadoEnsayoService.guardarInforme(this.data.itm, this.data.idTipoServicio).then(async resp => {
      console.log(resp.respuesta, resp.respuesta[0])
      this.data.itm.id_documento_informe = resp.respuesta[0].id_documento
    });

    await this.idsMantenimientoVial.buscarMantenimientosActivos("id_ensayo = " + this.data.idEnsayo).then(async (e)=>{
      if (e.codError === 0){
        const datosPks = e.respuesta
        if (datosPks.length > 0){
          for (let index = 0; index < datosPks.length; index++) {
            const element = datosPks[index];

            await this.cargueArchivoDocumentoService.realizarCargue(this.data.itm.id_documento_informe, element.id_mantenimiento_vial, archivo).then( async (respuesta : number) => {
              this.idArchivo = respuesta;
              this.loadExport = false;
              await this.utilitariosService.asociarDocumentoAMantenimiento(this.data.itm.id_documento_informe, element.id_mantenimiento_vial).then((y) => {
                return y;
              })
            });
          }
        }else{
          await this.cargueArchivoDocumentoService.realizarCargue(this.data.itm.id_documento_informe, "", archivo).then((respuesta: number) => {
            this.idArchivo = respuesta;
            this.loadExport = false;
          });
        }
        
      }
    })
    

    this.dialogRef.close({ ... this.data, response: this.idArchivo });
  }

  getDate() {
    return new Date();
  }

  public handleOk() {
    this.dialogRef.close();
  }

}