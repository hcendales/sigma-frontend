import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params } from "@angular/router";
import { CargarDocumentoService } from "src/app/core/services/cargar-documento.service";
import { ConsultaListasService } from "src/app/core/services/consulta-listas.service";
import { ModalConfirmarComponent } from "../modal-confirmar/modal-confirmar.component";


@Component({
  selector: 'app-drop-zone-documentos',
  templateUrl: './drop-zone-documentos.component.html',
  styleUrls: ['./drop-zone-documentos.component.scss']
})
export class DropZoneDocumentosComponent implements OnInit {

  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;

  @Input() idMantenimiento: number = 0;

  @Input() set actualizarArchivo(row: any) {
    //this.updateFile(row);
  }

  @Output() reCargar = new EventEmitter();

  tipoDocumento: any;
  estadoDocumento: any;
  esValidActividad: boolean = false
  breakpoint: number = 4;
  rowHeight = '8:10';
  gutterSize = '3px'
  files: any[] = [];

  /**Tamanio del modal Confirmacion */
  wDialog: string = '25%';
  hDialog: string = '22%';
  action: string | undefined;

  iWidth = [
    { responsive: 1000, value: 1, rowHeight: '8:5', gutterSize : '3px' },
    { responsive: 1300, value: 2, rowHeight: '8:10', gutterSize : '4px' },
    { responsive: 1480, value: 3, rowHeight: '8:10', gutterSize : '4px' },
    { responsive: 1500, value: 4, rowHeight: '8:8', gutterSize : '4px' },
    { responsive: 5000, value: 4, rowHeight: '8:8', gutterSize : '4px' },
  ];

  constructor(
    public cargarDocumentoService: CargarDocumentoService,
    public consultaListasService: ConsultaListasService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {

    this.breakpoint = (window.innerWidth <= 1400) ? 3 : 4;

    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimiento = +params['id']; });

    await this.consultaListasService.consultarListas([134]).then((resp: any) => {
      this.tipoDocumento = resp
    }).catch(e => {
      this.snackBar.open("Error, al Obtener la lista de tipo de documentos: " + e, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    });

  }

  onResize(event:any) {

    let cardSize = this.iWidth.find(ancho => event.target.innerWidth <= ancho.responsive)
    //console.log(event.target.innerWidth, cardSize)

    this.breakpoint = cardSize!.value;
    this.rowHeight  = cardSize!.rowHeight;
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files.target.files);
  }

  /**Realiza validacion de la tarjeta y si todo esta Ok continua el proceso */
  isInvalid(file: any, index: number){
    //console.log("->",file,index)
    let _isCorrect = false;
    if (file.idTipoDocumento === null){
      this.snackBar.open("Error, por favor seleccione un Tipo de Documento ", 'X', { duration: 5000, panelClass: ['error-snackbar'] });
    }else{
      _isCorrect = true;
    }


    if (_isCorrect)
      this.uploadFiles(file, index)
  }

  /** sube los archivos al mantenimiento vial */
  uploadFiles(file: any, index: number) {
    const dialogRef = this.dialog.open(ModalConfirmarComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: true,
      data: { action: "I" }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.cargarDocumentoService.insertarDocumento(this.idMantenimiento.toString(), file.idTipoDocumento.toString(), file.idTipoDocumento.toString(), file.descripcion, file).then(async resp => {
          if (resp) {
            this.loading(index);
          }
        }).catch(error => {
          this.snackBar.open("Error, al procesar al guardar, salga y vuelva a intentar : " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        });
      }
    });
  }


  /**
   * Simulate the upload process
   */
  loading(index: number) {
    setTimeout(() => {
      const progressInterval = setInterval(() => {
        if (this.files[index].progress === 100) {
          clearInterval(progressInterval);
          this.files.splice(index, 1);
          this.reCargar.emit(true);
          setTimeout(() => { this.reCargar.emit(false); }, 500); 
          this.snackBar.open('El archivo ha sido Guardado correctamente', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
          return;
        } else {
          this.files[index].progress += 5;
        }
      }, 100);
    }, 200);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  public deleteFile(index: number) {
    this.files.splice(index, 1);
    return
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item["nombre"] = null;
      item["idTipoDocumento"] = null;
      item["idTipoEstadoDocumento"] = null;
      item["descripcion"] = null;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
