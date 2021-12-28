import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitariosService } from '../../../../core/services/utilitarios.service';
import { GestionService } from '../../../../core/services/gestion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolicitudDialogComponent } from '../solicitud-dialog/solicitud-dialog.component';
import { CargueResultadoEnsayoService } from '../../../../core/services/cargue-resultado-ensayo.service';
import { CargueArchivoDocumentoService } from '../../../../core/services/cargue-archivo-documento.service';
import { SolicitudEnsayoLaboratorioService } from '../../../../core/services/solicitud-ensayo-laboratorio.service';
import { EntityTabArchivoServiceService } from '../../../../core/services/entity-tab-archivo-service.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsociarAforosComponent } from '../asociar-aforos/asociar-aforos.component';
import { RealizarSolicitudesComponent } from '../realizar-solicitudes/realizar-solicitudes.component';
import { CargarDocumentoService } from '../../../../core/services/cargar-documento.service';
import { EntityTabApiqueService } from '../../../../core/services/entity-tab-apique.service';





@Component({
  selector: 'app-solicitudes-apiques-aforos',
  templateUrl: './solicitudes-apiques-aforos.component.html',
  styleUrls: ['./solicitudes-apiques-aforos.component.scss']
})
export class SolicitudesApiquesAforosComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') mapElement: any;

  ready:boolean = false;
  idActividad:string|null = '';

  //opciones para la columna de acciones
  opciones: {nombre:string, label?:string, icon?:string, tooltip?:string}[] = [];
  

  dataSourceSolicitados: MatTableDataSource<any> = new MatTableDataSource();
  configColumnasSolicitudes:{attr:string,label:string,ancho?:string,tipo?:string}[] = [];
  configColumnasEnEspera:{attr:string,label:string,ancho?:string,tipo?:string}[] = [];
  configColumnasResultados:{attr:string,label:string,ancho?:string,tipo?:string}[] = [];
  predefinedColoumns:string[] = ['orden','requiere_apiques','requiere_aforo','vincular_aforo'];

  solicitudesPorRealizar:any[] = [];
  solicitudesEnEspera:any[] = [];
  solicitudesRealizadas:any[] = [];
  
  public formControlsFiltro:any[] = [];
  public formControlsFiltroSolRealizadas:any[] = [];
  
  public filterValues:any = {} as any;
  filterColumns:string[] = [];
  displayedColumnsResultados:string[] = [];
  filterColumnsResultados:string[] = [];
  public transicion:any;
  public masterCheck:boolean = false;
  public selectedList:any = {};
  public arraySelected:any[] = [];

  public queryMapaPorRealizar:string = '';
  public queryMapaEnProceso:string = '';
  public queryMapaRealizados:string = '';
  

  public mostrarTabla:boolean = false;

  public consultandoArchivo:boolean = false;

  @ViewChild('tablaPendeintes', { static: false }) tablaPendientes:any;
  @ViewChild('tablaEnProceso', { static: false }) tablaEnProceso:any;
  @ViewChild('tablaResultados', { static: false }) tablaResultados:any;
  
  
  @ViewChild('realizadasTableSort') sortRealizadas: any;
  
  @ViewChild(MatPaginator) paginator: any;

  

  constructor(private activatedroute: ActivatedRoute, private utilitariosService:UtilitariosService, private gestionService:GestionService, private dateAdapter:DateAdapter<Date>, public dialog: MatDialog,public cargueResultadoEnsayoService:CargueResultadoEnsayoService, public solicitudEnsayoLaboratorioService:SolicitudEnsayoLaboratorioService, private entityTabArchivoServiceService:EntityTabArchivoServiceService, private cargueArchivoDocumentoService:CargueArchivoDocumentoService, private snackBar:MatSnackBar, private cargarDocumentoService:CargarDocumentoService, private entityTabApiqueService:EntityTabApiqueService) {
    this.dateAdapter.setLocale('es-CO');
  }

  ngOnInit(): void {
    this.ready = false;
    this.filterColumns = [];
    this.displayedColumnsResultados = [];
    this.filterColumnsResultados = [];
    this.activatedroute.paramMap.subscribe(params => {
      this.idActividad = params.get('idActividad')?params.get('idActividad'):'';
      this.cargarTransicion(this.idActividad);
      this.utilitariosService.obtenerColumnasListaPendientes(this.idActividad as string).then(
        (config) => {
          this.configColumnasSolicitudes = [... config['pendientes']];
          this.configColumnasEnEspera = [... config['progreso']];
          this.configColumnasResultados = [... config['realizado']];

          this.gestionService.listarBandejaGestionPendiente(Number(this.idActividad)).then(
            (resp:any) =>{
              if(resp.codError == 0){
                this.consultarProgreso(resp.respuesta).then(
                  (listaSolicitudes) =>{
                   
                    let porRealizar = [];
                    let enEspera = [];
                    let realizados = [];
                    for(let r of listaSolicitudes){
                      //si requiere apiques y no se ha realizado ninguna solicitud...
                     if(r.requiere_apiques == 'SI' && (r.respuesta_apiques != 'SI' && r.respuesta_apiques != 'PENDIENTE')){
                       porRealizar.push(r);
                       //si (requiere apiques y no se han subido resultados) o (requiere aforos y no se han subido resultados)
                     }else if((r.requiere_apiques == 'SI' && r.respuesta_apiques == 'PENDIENTE') || (r.requiere_aforo == 'SI' && r.respuesta_aforo != 'SI')){
                          
                         enEspera.push(r);
                         //si (requiere apiques y ya se subieron resultados) o (requiere aforos y ya se subieron resultados)
                     }else if((r.requiere_apiques == 'SI' && r.respuesta_apiques == 'SI') || (r.requiere_aforo == 'SI' && r.respuesta_aforo == 'SI')){
                        
                        realizados.push(r);
                       }
                    }

                    this.solicitudesPorRealizar = porRealizar;
                    this.solicitudesEnEspera = enEspera;
                    this.solicitudesRealizadas = realizados;
                    console.log('porRealizar', this.solicitudesPorRealizar);
                    console.log('enEspera', this.solicitudesEnEspera);
                    console.log('realizados', this.solicitudesRealizadas);

                    this.queryMapaPorRealizar = 'PK_ID_CALZADA in ('+this.solicitudesPorRealizar.map((x:any) => x.pk_id_calzada).join()+')';
                    this.queryMapaEnProceso = 'PK_ID_CALZADA in ('+this.solicitudesPorRealizar.map((x:any) => x.pk_id_calzada).join()+')';
                    this.queryMapaRealizados = 'PK_ID_CALZADA in ('+this.solicitudesRealizadas.map((x:any) => x.pk_id_calzada).join()+')';

                    this.ready = true;
                    this.mostrarTabla = true;
                  }
                );
               
              }else{
                console.error('HUBO UN ERROR:', resp.msgError);
              }
            }
          )
        });
    });
  }

  ngAfterViewInit(){
    setTimeout(() => { this.coso(); }, 20000);
  }

  async coso(){
    await this.mapElement.PksFL.load();
    console.log('El query que ejecuta', this.queryMapaPorRealizar);
    this.mapElement.queryFeatures(this.queryMapaPorRealizar);
  }

 





  
////// metodo obsoleto, se deja como referencia para realizar la funcionalidad de ver resultados
  async onOpcionSelected(e:any){
    if(e.opcion == 'solApiques' || e.opcion == 'solAforo'){
      let dialogRef = this.dialog.open(SolicitudDialogComponent);
      dialogRef.afterClosed().subscribe(res => {
        console.log('La prioridad es', res );
        console.log('La E es', e );
        this.entityTabApiqueService.list1(e.data.id_mantenimiento_vial_evento).then(
          (res:any) => {
            if(res.codError == 0){
              this.cargueResultadoEnsayoService.crearEnsayoApique(e.data.id_mantenimiento_vial,e.data.pk_id_calzada,res.respuesta.length,res);
            }else{
              this.snackBar.open(res.msgError, 'X', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }
          }
        ).catch(
          (x:any) =>{
            this.snackBar.open('Error al crear la solicitud', 'X', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        )
        
       // console.log('el datasource es:',this.dataSource.data);
       // let reg = this.dataSource.data.find((x:any) => {return x.id_mantenimiento_vial == e.data.id_mantenimiento_vial})
       // reg.respuesta_apiques = 'PENDIENTE';
      });
    }
    else if(e.opcion == 'verApiques'){
      let respServArchivo = await this.entityTabArchivoServiceService.list('ID_DOCUMENTO = '+ e.data.id_documento);
      let archivos = JSON.parse(respServArchivo.respuesta[0].json).respuesta;
      if(archivos.length == 0){
        this.snackBar.open('No se encontraron los archivos', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      let arrayPeticiones:any[] = [];
      for(let archivo of archivos){
        //arrayPeticiones.push(this.cargueArchivoDocumentoService.descargarArchivo(e.data.id_documento,archivo.id_archivo));
      }
      let respuestas:any[] = [];
      try{
        respuestas = await forkJoin(arrayPeticiones).toPromise();
      }catch(e){
        this.snackBar.open('No se encontraron los archivos', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
      
      for(let r of respuestas){
        const blob = new Blob([(r as any).body as BlobPart], { type: 'application/PDF' });
        const url= window.URL.createObjectURL(blob);
        window.open(url);
      }
      
    }else if(e.opcion == 'verAforo'){
      console.log('Abre aforo');
    }
    else if(e.opcion == 'vincularAforo'){
      let dialogRef = this.dialog.open(AsociarAforosComponent,{
        data:e.data,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.recargarDatos();
      });
      
    }
    
  }

  async consultarProgreso(lista:any){
    let idsMant = lista.map((x:any) => x.id_mantenimiento_vial);
    //obtiene las solicitudes
    let solicitudes = await this.solicitudEnsayoLaboratorioService.buscarMantenimientosActivos('ID_MANTENIMIENTO_VIAL IN ('+idsMant.join()+')');
    let solicitudesObj = {} as any;

    for(let e of solicitudes.respuesta){
      solicitudesObj[e.id_mantenimiento_vial] = e;
    }

    //obtiene los ensayos basado en las solicitudes
    
    let solicitudesMap = solicitudes.respuesta.map((x:any) => x.id_ensayo).join();


    let resultados:any = null;
    
    if(solicitudesMap){
      resultados = await this.cargueResultadoEnsayoService.buscarInforme('ID_ENSAYO IN ('+solicitudesMap+')');
    }else{
      resultados = {codError:0,respuesta:[]};
    }
    

    let resultadosEnsayos = {} as any;
    for(let e of resultados.respuesta){
      resultadosEnsayos[e.id_ensayo] = e;
    }

    for(let solLab of solicitudes.respuesta){
      let respEnsayo = resultadosEnsayos[solLab.id_ensayo];
      let pkgestion = lista.find((x:any) => x.id_mantenimiento_vial == solLab.id_mantenimiento_vial);
      if(respEnsayo){
        pkgestion.respuesta_apiques = 'SI';
        pkgestion['id_documento'] = respEnsayo.id_documento_informe;
      }else{
        if(solicitudesObj[solLab.id_mantenimiento_vial]){
          pkgestion.respuesta_apiques = 'PENDIENTE';
        }else{
          pkgestion.respuesta_apiques = 'NO';
        }
      }
    }
    return lista;
  }


  async cargarTransicion(idActividad:string|null){
    let resp = await this.gestionService.listarTransicionesPorActividad(Number(idActividad));
    if(resp.codError == 0){
      this.transicion = resp.respuesta[0];
          
    }
  }


  recargarDatos(){
    this.ngOnInit();
    this.coso();
  }


  cargaMapa(e:any){
    //console.log('*****CARGA MAPA******',e);
  }

  pkSelectedEvt(tabla:string, e:any){
    console.log('UN PK SELECCIONADO',e);
    if(tabla == 'porRealizar'){
      this.tablaPendientes.checkRow(e.map((x:any)=>{return {pk_id_calzada:x};}));
    }
    
  }

  pkClickedEvt(tabla:string,e:any){
   
   if(tabla == 'porRealizar'){
    this.tablaPendientes.checkRow([{pk_id_calzada:e['PK_ID_CALZADA']}]);
   }else if(tabla == 'enProceso'){

   }
    
  }

  realizarSolicitudes(){
    let selected = this.tablaPendientes.getChecked();
    let dialogRef = this.dialog.open(RealizarSolicitudesComponent,{
      data:selected,
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('el result',result);
      if(result.selected.length > 0){
        let arrayPeticiones:any[] = [];
        for(let pk of result.selected){
          arrayPeticiones.push(this.cargueResultadoEnsayoService.crearEnsayoApique(pk.id_mantenimiento_vial,pk.pk_id_calzada,3,result.prioridad));
        }
        forkJoin(arrayPeticiones).toPromise().then(
          (res:any[])=>{
            let hayError = false;
            for(let r of res){
              if(r.codError != 0){
                hayError = true;
              }
            }
            if(hayError){
              this.snackBar.open('Error al momento de crear las solicitudes', 'X', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }else{
              this.snackBar.open('Solicitudes creadas correctamente', 'X', {
                duration: 5000,
                panelClass: ['success-snackbar']
              });
            }
            this.recargarDatos();
          }
        );
      }
      
     
    });
  }

  async verEstudio(pk:any){
    this.consultandoArchivo = true;
    let respServArchivo = await this.entityTabArchivoServiceService.list('ID_DOCUMENTO = '+ pk.id_documento);
      let archivos = JSON.parse(respServArchivo.respuesta[0].json).respuesta;
      if(archivos.length == 0){
        this.snackBar.open('No se encontraron los archivos', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.consultandoArchivo = false;
        return;
      }
      let arrayPeticiones:any[] = [];
      for(let archivo of archivos){
        arrayPeticiones.push(this.cargueArchivoDocumentoService.descargarArchivo(pk.id_documento,pk.id_mantenimiento_vial+'_0',archivo.id_archivo));
      }
      let respuestas:any[] = [];
      try{
        respuestas = await forkJoin(arrayPeticiones).toPromise();
      }catch(e){
        this.snackBar.open('No se encontraron los archivos', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
      
      for(let r of respuestas){
        const blob = new Blob([(r as any).body as BlobPart], { type: 'application/PDF' });
        const url= window.URL.createObjectURL(blob);
        window.open(url);
      }
      this.consultandoArchivo = false;
  }

  pkChecked(e:any){
    
    if(e.checked){
      this.arraySelected.push(e.data.id_proceso_gestion);
    }else{
      let index = this.arraySelected.findIndex((x:any)=>{return x == e.data.id_proceso_gestion});
      if(index != -1){
        this.arraySelected.splice(index,1);
      }
    }
  }

  allpkChecked(e:any){
    
    this.arraySelected = [... e.map((x:any)=>{return x.id_proceso_gestion})];
  }

  gestionRealizadaEvt(){
    this.arraySelected = [];
    this.recargarDatos();
  }

  async verAforo(e:any){
    this.consultandoArchivo = true;
    console.log('Consultando documentos x FIltroooooo');
    let respServ = await this.cargarDocumentoService.consultarXFiltro("id_mantenimiento_vial = " +e.id_mantenimiento_vial);
    if(respServ.codError == 0){
      let docus = respServ.respuesta.filter((x:any) => {return x.id_tipo_documento == 8038 || x.id_tipo_documento == 252});
      if(docus.length == 0){
        this.snackBar.open('No se encontraron los archivos', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
      for(let docu of docus){
        try{
          let res = await this.entityTabArchivoServiceService.consultarDocumentoAdjunto(docu.id_documento);
          const blob = new Blob([res.body as BlobPart], { type: 'application/PDF' });
          const url= window.URL.createObjectURL(blob);
          window.open(url);
        }catch(e){
          this.snackBar.open('Error al consultar el archivo', 'X', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        
        //this.verEstudio({id_documento:docu.id_documento,id_mantenimiento_vial:docu.id_mantenimiento_vial})
      }
    }else{
      this.snackBar.open(respServ.msgError, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
    this.consultandoArchivo = false;
    
  }
  irAPK(pk:number){
    let w = "PK_ID_ELEMENTO = " + pk.toString();
    console.log(w);
    this.mapElement.goTo(w);
  }
  
  
}

interface LooseObject {
  [key: string]: any
}