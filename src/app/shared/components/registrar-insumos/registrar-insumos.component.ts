import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { forkJoin } from 'rxjs';

import { EnEsperaComponent } from '../../../core/en-espera/en-espera.component';
import { SimpleDialogComponent } from '../../../core/simple-dialog/simple-dialog.component';
import { ConsultaListasService } from '../../../core/services/consulta-listas.service';
import { UtilitariosService } from '../../../core/services/utilitarios.service';
import { EntityTabArchivoServiceService } from '../../../core/services/entity-tab-archivo-service.service';
import { EntityTabMantenimientoVialService } from '../../../core/services/entity-tab-mantenimiento-vial.service';
import { Archivo } from '../../../core/models/archivo';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-registrar-insumos',
  templateUrl: './registrar-insumos.component.html',
  styleUrls: ['./registrar-insumos.component.scss']
})
export class RegistrarInsumosComponent implements OnInit {
  @Input() idMantenimientoVial: number = 0;
  @Input() idDocumento: number = 0;
  @Input() idTipoArchivo: number = 0;
  @Input() idPermisos: number = 0;
  @Input() textoBtn: string = '';

  public previsualizacion: string = '';

  public form: FormGroup;
  public listas: any;
  public ready:boolean = false;
  public fotosMantenimiento:any[] = [];
  public URL_FOTOS = environment.URL_FOTOS;
  public selected: string = '';
  public adicionaDocumento: boolean = false;
  public borrarDocumento: boolean = false;
  public verArchivo: boolean = false;
  public idArchivoEspecial: number = 0;
  public list_accept: string = "image/png,image/jpeg";

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private listasService: ConsultaListasService,
    private formBuilder: FormBuilder,
    private tabArchivoService: EntityTabArchivoServiceService,
    public dialog: MatDialog,
    private snackBar:MatSnackBar,
    private utilitariosService:UtilitariosService,
    private entityTabMantenimientoVialService: EntityTabMantenimientoVialService,
  ) {
    this.form = this.formBuilder.group({
      fotos: this.formBuilder.array([])
    })
   }

  ngOnInit(): void {
    if(!this.idMantenimientoVial){
      console.error("No hay id de Mantenimiento");
    }
    else{
      this.listasService.consultarListas([49]).then((listas) => {this.listas = listas; this.ready = true;});
      // console.log('idDocumento', this.idDocumento);
      // console.log('idTipoArchivo', this.idTipoArchivo);
      if(this.idPermisos===2){
        this.adicionaDocumento = true;
      }else if(this.idPermisos>=3){
        this.adicionaDocumento = true;
        this.borrarDocumento = true;
      }

      if(this.idTipoArchivo==251 || this.idTipoArchivo===252 || this.idTipoArchivo===8038){
        this.adicionaDocumento = false;
      }
      this.getFotos(this.idDocumento, this.idTipoArchivo);
    }
  }

  get fotosForm(){
    return this.form.controls["fotos"] as FormArray;
  }


  async getFotos(idDocumento:number, idTipoArchivo: number){
    let condicion = " id_documento=" + idDocumento + " and id_tipo_archivo= " + idTipoArchivo;
    console.log('GetFotos:', condicion);
    if( idTipoArchivo != 2051){
      this.list_accept = ".xlsx, .xls, .doc, .docx, .pdf";

    }else{
      this.list_accept = "image/png,image/jpeg";
    }
    console.log('LISTA ', this.idTipoArchivo,  this.list_accept);
    // console.log('Condicion:', condicion);
    // Condicion para Apiques - Aforos
    if( idTipoArchivo == 251 || idTipoArchivo == 252 || idTipoArchivo == 8038){
      condicion = "id_mantenimiento_vial = " + this.idMantenimientoVial;
      console.log("Condicion apiques - aforos ", condicion);
      let res: any = await this.entityTabMantenimientoVialService.searchDocumento(condicion);
      if (res.codError != 0){
        throw res;
      }else{
        let documento = res.respuesta;
        console.log('Respuesta: ', documento);
        for(let iddoc of documento){
          //if(iddoc.id_tipo_documento == 251 || iddoc.id_tipo_documento == 252 || iddoc.id_tipo_documento == 8038){
          if(iddoc.id_tipo_documento == this.idTipoArchivo){
            // armar condicion
            console.log('idDocumento Especial ', iddoc.id_documento);
            this.idArchivoEspecial = iddoc.id_documento;
            this.verArchivo = true;
            console.log('verArchivo', this.verArchivo);
          }
        }
        // console.log('Condicion de apiques id documento ', condicion);

      }
    }else{
      console.log('Paso condicion', condicion);
      let res:any = await this.tabArchivoService.listArchivos(condicion);
      // let res:any = await this.tabArchivoService.get(idDocumento);
      if(res.codError != 0){
        throw res;
      }else{
        let ListaArchivos = res.respuesta;
        // console.log('ListaArchivos', ListaArchivos);
        for(let archivo of ListaArchivos){
          let objArchivo = {idArchivo:archivo.id_archivo,url:''+archivo.url_archivo,fileInfo:archivo.fileInfo,idTiposArchivos: archivo.id_tipo_archivo};
          // console.log('objArchivo', objArchivo);
          this.fotosMantenimiento.push(objArchivo);
          let form = this.formBuilder.group(this.getFormFoto());
          // this.form.controls.idTiposArchivos.setValue(archivo.idTiposArchivos);
          form.patchValue(objArchivo)
          this.fotosForm.push(form);
          // console.log('fotosForm', this.fotosForm);
        }
      }
    }

  }

  getFormFoto(){
    let formFoto:any = {
      idArchivo:['',[]],
      url: [''],
      fileInfo :['',[]],
      idTiposArchivos: ['', Validators.required],
    };
    return formFoto;
  }

  addFoto(){
    const fotosForm = this.formBuilder.group({
      idArchivo: [''],
      url: [''],
      fileInfo: [''],
      idTiposArchivos: [this.idTipoArchivo, Validators.required],
    });
    // console.log('Fotos', fotosForm);
    this.fotosForm.push(fotosForm);
  }

  deleteFoto(documentoIndex: number){
    this.fotosForm.removeAt(documentoIndex);
  }

  onFotoChanged(event:any, index: number) {
    const reader: FileReader = new FileReader();
    const fileInfo = event.target.files[0];
    reader.readAsDataURL(fileInfo);
    reader.onload = (e) => {
      this.fotosForm.get(index.toString())?.get('url')?.setValue(reader.result?.toString());
      this.fotosForm.get(index.toString())?.get('fileInfo')?.setValue(fileInfo);
      console.log('Archivo info', this.fotosForm);
      }
      this.fotosForm.markAllAsTouched();
    }

   async onSubmit(){
      try{
        await this.guardarFotos();
        this.operationSuccess();
        this.dialog.closeAll();
        this.fotosForm.clear();
        this.ngOnInit();
      }catch(e){
        console.log('El error', e);
        console.error('ERROR al guardar todo');
      }
    }
  async guardarFotos(){
    let dialogRef = this.mostrarVentanaEnEspera('Guardando');
    try{
    let fotosActualizar = [];
    let fotosInsertar = [];
    let idsfotosEliminar = [];

    //convierte lo existente en el form, a objetos;
    let ObjFotos =  this.fotosForm.controls.map(
      control => {
        let fileInfo = null;
        fileInfo = control.get('fileInfo')?.value;
        let archivo = new Archivo();
        archivo.idMantenimientoVial = this.idMantenimientoVial;
        archivo.idArchivo = control.get('idArchivo')?.value;
        archivo.urlTmp = control.get('url')?.value;
        archivo.selectedFile = fileInfo;
        archivo.idDocumento = this.idDocumento;
        archivo.idTiposArchivos = control.get('idTiposArchivos')?.value ? control.get('idTiposArchivos')!.value:'';
        return archivo;
      }
    );

    //determina las fotos a insertar y actualizar

    for(let i = 0;i<ObjFotos.length;i++){
      let archivo = ObjFotos[i];
// console.log('archivo', archivo);
      if(!archivo.idArchivo && archivo.selectedFile && archivo.urlTmp?.startsWith('data:')){
        console.log('Ingresa push');
        fotosInsertar.push({archivo:archivo, index:i, tipoArchivo: archivo.idTiposArchivos});
      }else if(archivo.idArchivo && archivo.selectedFile && archivo.urlTmp?.startsWith('data:')){

        fotosActualizar.push({archivo:archivo, index:i, tipoArchivo: archivo.idTiposArchivos});
      }
    }

    //determina las fotos a eliminar
    for(let foto of this.fotosMantenimiento){
      let index = ObjFotos.findIndex(archivo => archivo.idArchivo == foto.idArchivo);
      if(index == -1){
        idsfotosEliminar.push(foto.idArchivo);
      }
    }

    //alista las operaciones
    let operacionesEliminar = idsfotosEliminar.map(idFoto => this.tabArchivoService.delete(idFoto));
    let operacionesInsertar = fotosInsertar.map(
        foto =>{
          console.log('archivo Foto', foto);
          return {llamadoServ:this.tabArchivoService.create(foto.archivo, foto.tipoArchivo!), index:foto.index};
        }
      );

    let operacionesActualizar = fotosActualizar.map(
        foto =>{
          return {llamadoServ:this.tabArchivoService.update(foto.archivo,foto.tipoArchivo!), index:foto.index};
        }
      );

      //ejecuta operaciones
      if(operacionesEliminar.length > 0){
        let respElim = await forkJoin(operacionesEliminar).toPromise();
        for(let resp of respElim){
          if(resp.codError != 0){
            throw resp.msgError;
          }
          //elimina fotos en el array de fotos
          for(let i = this.fotosMantenimiento.length - 1;i>=0;i--){
            if(idsfotosEliminar.findIndex(idArchivo => idArchivo == this.fotosMantenimiento[i].idArchivo) != -1){
              this.fotosMantenimiento.splice(i,1);
            }
          }
        }
      }

      if(operacionesInsertar.length > 0){
        let respInsert = await forkJoin(operacionesInsertar.map(f => f.llamadoServ)).toPromise();
        //asigna los nuevos ids de fotos
        for(let i=0;i<respInsert.length;i++){
          let nuevoId = (respInsert as any)[i].respuesta[0].idArchivo;
          let indexFoto = fotosInsertar[i].index;
          console.log('nuevaFoto',nuevoId,'index',indexFoto);
          this.fotosForm.get(indexFoto.toString())?.get('idArchivo')?.setValue(nuevoId);
          this.fotosForm.get(indexFoto.toString())?.get('fileInfo')?.setValue(null);
        }
        console.log('insert', respInsert);
      }

      if(operacionesActualizar.length > 0){
        let respActualizar = await forkJoin(operacionesActualizar.map(f => f.llamadoServ)).toPromise();

        for(let i=0;i<respActualizar.length;i++){
          let indexFoto = fotosActualizar[i].index;
          this.fotosForm.get(indexFoto.toString())?.get('fileInfo')?.setValue(null);
        }
        console.log('update', respActualizar);
      }
      dialogRef.close();
      this.operationSuccess();
    }catch(error){
      this.handleError(error);
      dialogRef.close();
    }
  }

  mostrarVentanaEnEspera(titulo:string, footer?:string){
    let data:any = {
      titulo: titulo,
      footer: footer
    }
    const dialogRef = this.dialog.open(EnEsperaComponent,{
      data: data
    });
    return dialogRef;
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

  operationSuccess(){

    this.snackBar.open('Cambios realizados', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  //evento de click para que no comunique el evento al componente padre ni al componente hijo
  stopPropagation(e:any){
    e.stopPropagation();
  }

  async descargarDocumento(){
    console.log('llamado idArchivoEspecial ', this.idArchivoEspecial);
    let res = await this.tabArchivoService.consultarDocumentoAdjunto(this.idArchivoEspecial);
    const blob = new Blob([res.body as BlobPart], { type: 'application/PDF' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

}
