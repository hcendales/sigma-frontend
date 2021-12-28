import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { EntityTabAforoService } from '../../../../core/services/entity-tab-aforo.service'
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registro-aforos',
  templateUrl: './registro-aforos.component.html',
  styleUrls: ['./registro-aforos.component.scss']
})
export class RegistroAforosComponent implements OnInit {

  public fechaAforo:string = '';
  public tipoAforo:string = ''; 
  public tipoInformacion:string = '';
  public observacionesAforo:string = '';
  public idNuevoAforo:number = -1;
  public nuevoAforo:any|null = null;
  public listaPksSelected:any[] = [];
  public listaMantenimientosSelected:any[] = [];
  @ViewChild('cargueArchivo') cargueArchivo:any;
  @ViewChild('listaPks') listaPks:any; //
  @ViewChild('datosAforoManual',{static:false}) datosAforoManual:any;
  @ViewChild('stepper') stepper: any;
  
  
  constructor(private entityTabAforoService:EntityTabAforoService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    
  }

  public datosAgregados(){
    return this.nuevoAforo!=null && this.idNuevoAforo != -1;
  }

  async confirmacionAceptada(){
    let idCargue = this.cargueArchivo.idCargue;
    console.log('El idCargue es', idCargue);
    console.log('La lista de Pks es', this.listaPks.getSeleccion());
    let listaPksAforo = this.listaPks.getSeleccion().map((x:any)=>{return {
      pkIdCalzada:x.pk_id_calzada,
      aledanio:x.aledanio?'SI':'NO',
      civ:x.civ,
      ejeVial:x.eje_vial,
      desde:x.desde,
      hasta:x.hasta,
      idLocalidad:x.id_localidad,
      descripcionLocalidad:x.descripcion_localidad,
      idTipoSuperficie:x.id_tipo_superficie,
      descripcionTipoSuperficie:x.descripcion_tipo_superficie,
    }});
    this.listaPksSelected = listaPksAforo;

    let aforo = {idCargue: idCargue,
                 fechaAforo:this.fechaAforo,
                 digital:this.tipoAforo == 'digital'?'SI':'NO',
                 tpdTotal: 0,
                 analisisNee82:0,
                 anios82:0,
                 analisis2Nee82:0,
                 anios282:0,
                 analisisTpdVComerciales35:0,
                 anios35:0,
                 automoviles:0,
                 busesVan:0,
                 busesBuseta:0,
                 busesSitpAlimentadores:0,
                 camionesC2p:0,
                 camionesC2g:0,
                 camionesC3C4:0,
                 camionesC5C5:0,
                 vcAcumulados:0,
                 tabAforoCalzadaList:listaPksAforo
                };
                
    let resp = await this.entityTabAforoService.nuevoAforo(aforo);
    if(resp.codError != 0){
      this.snackBar.open(resp.msgError, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.idNuevoAforo = resp.respuesta[0].id_aforo;
    let resp2 = this.cargueArchivo.procesarCargue('4',idCargue);
    if(resp2.codError != 0){
      this.snackBar.open(resp2.msgError, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  }

  

  async confirmacionTerminada(e:any){
    //consulta el aforo
    let resp = await this.entityTabAforoService.consultarXFiltro('ID_AFORO = ' + this.idNuevoAforo);
    if(resp.codError == 0){
      this.nuevoAforo = resp.respuesta[0];
      this.nuevoAforo.fecha_aforo == this.fechaAforo;
      this.nuevoAforo.origen_informacion = this.tipoInformacion;
      this.nuevoAforo.observaciones = this.observacionesAforo;
    }
  }

  btnGenerarEstudioDisponible(){
    if(this.tipoAforo == 'manual'){
      //si es un aforo manual la validacion es que esten llenos los campos de fecha foro y tipoInformacion
      return !(this.fechaAforo && this.tipoInformacion);

    }else if (this.tipoAforo == 'digital'){
      //si es un aforo digital, se valida que esté creado el aforo y este tenga los datos correspondientes diligenciados
      let hayAforo = this.nuevoAforo != null;
      let aforoDigitalConfirmado = this.nuevoAforo?.digital == 'SI' && this.nuevoAforo?.id_aforo;
      let aforoManual = this.nuevoAforo?.digital == 'NO';
      let campoFechaAforo = this.nuevoAforo?.fecha_aforo != null;
      let campoPrimariaYOrigenDiligenciados = (this.tipoInformacion == 'Primaria' || this.nuevoAforo?.digital == 'SI') || (this.tipoInformacion == 'Secundaria' && this.nuevoAforo?.origen_informacion && this.nuevoAforo?.origen_informacion.length > 0);
      return !( hayAforo && (aforoDigitalConfirmado || aforoManual ) && campoFechaAforo && campoPrimariaYOrigenDiligenciados);
    }
    return true;
  }

  async guardarAforo(){
    //si el aforo es manual crea el nueo aforo basado en los datos ingresados manualmente.
    if(this.tipoAforo == 'manual'){

      let aforoDatoList = this.datosAforoManual.getDatos();

      let listaPksAforo = this.listaPks.getSeleccion().map((x:any)=>{return {
        pkIdCalzada:x.pk_id_calzada,
        aledanio:x.aledanio?'SI':'NO',
        civ:x.civ,
        ejeVial:x.eje_vial,
        desde:x.desde,
        hasta:x.hasta,
        idLocalidad:x.id_localidad,
        descripcionLocalidad:x.descripcion_localidad,
        idTipoSuperficie:x.id_tipo_superficie,
        descripcionTipoSuperficie:x.descripcion_tipo_superficie,
      }});
      this.listaPksSelected = listaPksAforo;
      let aforo = {
        fechaAforo:this.fechaAforo,
        digital:'NO',
        tpdTotal: 0,
        analisisNee82:0,
        anios82:0,
        analisis2Nee82:0,
        anios282:0,
        analisisTpdVComerciales35:0,
        anios35:0,
        automoviles:this.getSumatoriaAtibuto(aforoDatoList,'automoviles'),
        busesVan:this.getSumatoriaAtibuto(aforoDatoList,'busesVan'),
        busesBuseta:this.getSumatoriaAtibuto(aforoDatoList,'busesBuseta'),
        busesSitpAlimentadores:this.getSumatoriaAtibuto(aforoDatoList,'busesSitpAlimentadores'),
        camionesC2p:this.getSumatoriaAtibuto(aforoDatoList,'camionesC2p'),
        camionesC2g:this.getSumatoriaAtibuto(aforoDatoList,'camionesC2g'),
        camionesC3C4:this.getSumatoriaAtibuto(aforoDatoList,'camionesC3C4'),
        camionesC5C5:this.getSumatoriaAtibuto(aforoDatoList,'camionesC5C5'),
        vcAcumulados:0,
        observaciones : this.observacionesAforo,
        tabAforoCalzadaList:listaPksAforo,
        tabAforoDatoList:aforoDatoList,
       };
      let res = await this.entityTabAforoService.nuevoAforo(aforo);
      if(res.codError == 0){
        this.idNuevoAforo = res.respuesta[0].id_aforo;
      }else{

      }
      let resp = await this.entityTabAforoService.consultarXFiltro('ID_AFORO = ' + this.idNuevoAforo);
      if(resp.codError == 0){
        this.nuevoAforo = resp.respuesta[0];
      }
    }
  }

  getSumatoriaAtibuto(aforoDatoList:any[], atributo:string){
    let total = 0;
    for(let a of aforoDatoList){
      total += a[atributo];
    }
    return total;
  }

  selectionChanged(e:any){
    console.log(e);

    if(e.selectedIndex == 2){
      let solicitudesAforos:any[] = this.listaPks.solicitudesAforos;
      this.listaMantenimientosSelected = solicitudesAforos.filter((x:any)=>{
                                                                return this.listaPksSelected.find(
                                                                  (y:any) => {
                                                                    return y.pkIdCalzada == x.pk_id_calzada;
                                                                  }
                                                                );
                                                              });
    }
  }

  finProceso(){
    this.fechaAforo = '';
    this.tipoAforo = ''; 
    this.tipoInformacion = '';
    this.observacionesAforo = '';
    this.idNuevoAforo = -1;
    this.nuevoAforo = null;
    this.listaPksSelected = [];
    this.listaMantenimientosSelected = [];
    this.stepper.reset();
    
    this.listaPks.mostrarMapa = false;
    setTimeout(() => { this.listaPks.mostrarMapa = true;
                      this.listaPks.ngOnInit();
    }, 100);
    setTimeout(() => {
      this.listaPks.coso();
    }, 200);
    

  }

 crearAforosCalzada(){

 }

}
