import { Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { CargueArchivoService } from '../../../core/services/cargue-archivo.service';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cargue-archivo',
  templateUrl: './cargue-archivo.component.html',
  styleUrls: ['./cargue-archivo.component.scss']
})
export class CargueArchivoComponent implements OnInit {

  @Input() idTipoCargue:string = '';
  @Input() mostrarBtnPlanitlla:boolean = true;
  @Input() realizarConfirmacion = true; //ejecuta el método de confirmar cargue, si es false no lo ejecuta y debe ser llamado manualmente (es usado para llamar a otros métodos antes de realizar la confirmación del cargue).
  @Output() confirmacionAceptada = new EventEmitter(); // cuando el usuario le da "ok" a procesar el cargue. este evento solo se emite cuando el Input procesarCargueDirectamente es false
  @Output() confirmacionRealizada = new EventEmitter(); //cuando el proceso de confirmación termina por parte del backend
  //@Output() cargueRealizado = new EventEmitter();
  @ViewChild('fileInput') inputFile: any;
  @Input() procesarCargueDirectamente:boolean = true; //realiza el llamado a procesar cargue inmediatamente desppues de que el usuario confirma el cargue, se asigna falso cuando se necesita realizar un proceso intermedio entre la confirmación y el proceso del cargue.

  public dataSourceSolicitudes: MatTableDataSource<any>;
  public enEspera:boolean=false;
  public error:boolean=false;;
  public reporte:any=null;
  public idCargue:number=-1;
  public textobtnVerReporte = '';

  public cargueConfirmado = false;
  public erroresValidacion:any[] = []

  public displayedColumns :string[];

//numero de lineas del archivo que se subió
  public numLineas:number = -1;
  public validado:boolean = false;
  public totalRegistrosErroneos:number = -1;
  public cargueExitoso:boolean = false;

  
  

  constructor(private activatedRoute: ActivatedRoute, private cargueArchivoService:CargueArchivoService, private snackBar:MatSnackBar) { 
    this.dataSourceSolicitudes = new MatTableDataSource();
    this.displayedColumns = ['linea','pk_id','tipoError','nombreCampo','descripcionError'];
    
  }

  ngOnInit(): void {
    
  }

  async change(file:any) {
    this.cargueExitoso = false;
    this.error = false;
    this.enEspera = true;
    
    try{
      let contexto = this;
      let reader = new FileReader();
      reader.onload = function(e){
        contexto.numLineas = (this.result as string).split('\n').length -1;
      }
      reader.readAsText(file.target.files.item(0));
      
      let respServ = await this.cargueArchivoService.realizarCargue(this.idTipoCargue,'archivo.csv',file.target.files.item(0));
      
      if(respServ.codError == 0){
        this.idCargue = respServ.respuesta[0][":b1"];
        let respServValidacion = await this.cargueArchivoService.validarCargue(Number(this.idTipoCargue),this.idCargue);
        
        if(respServValidacion.codError == 991 || respServValidacion.codError < 8){
          
          if(respServValidacion.respuesta){
              this.erroresValidacion = respServValidacion.respuesta.map((x:any) => {
                let msj = x.mensaje.split('||');
                let mapped = {linea:x.linea, pkIdCalzada:x.pk_id_calzada, tipoError:msj[0], nombreCampo:msj[2], descripcion:msj[3].split('//')[0]};
                return mapped;
              });
            
              ///obtiene la cantidad de registros erroneos
              let tempErr = {} as any;
              for(let error of this.erroresValidacion){
                tempErr[error.linea] = true;
              }
              this.totalRegistrosErroneos = Object.keys(tempErr).length;
         }else{
           this.totalRegistrosErroneos = 0;
         }
           
          this.validado = true;
        }else{
          this.handleError();
        }
      }else{
        this.handleError();
      }
      this.enEspera = false;
    }catch(e){
      console.log(e);
      this.handleError();
    }
  }

  async confirmarCargue(idTipoCargue:string,idCargue:number) {
    this.enEspera = true;
    if(this.procesarCargueDirectamente){
      this.procesarCargue(idTipoCargue,idCargue);
    }else{
      console.log('EMITE');
      this.confirmacionAceptada.emit();
    }
   
  }

  public async procesarCargue(idTipoCargue:string,idCargue:number){
    this.enEspera = true;
    try{
    let respServ = await  this.cargueArchivoService.procesarCargue(Number(idTipoCargue),idCargue);
    if(respServ.codError == 0){
      this.confirmacionRealizada.emit(respServ.respuesta);
      this.cargueExitoso = true;
      this.Cancelar();
      this.snackBar.open('Cargue realizado', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }else{
      this.handleError();
    }
    }catch(e){
      this.handleError();
    }
    this.enEspera = false;
  }

  generarReporte(){
    let separadorCSV = ';';
    let fecha = new Date();
    let texto = 'ID cargue: '+this.idCargue+' \nFecha: '+ fecha.toLocaleDateString() + ' \n Linea;PK_ID calzada;Tipo error;Columna;Descripción \n';
    for(let error of this.erroresValidacion){
      texto += error.linea + separadorCSV + error.pkIdCalzada + separadorCSV + error.tipoError + separadorCSV + error.nombreCampo + separadorCSV + error.descripcion + ' \n';
    }

    let filename = 'Informe_errores_cargue_' + fecha.toLocaleDateString('es-CO').replace(/\//g, '-');

    this.textoACSV(texto,filename);
    
  }

  mostrarAdvertenciaCargue(){

  }

  Cancelar(){
    this.validado = false;
    this.erroresValidacion = [];
    this.totalRegistrosErroneos = -1;
  }

  handleError(){
    this.snackBar.open('Error al realizar la consulta', 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  obtenerPlantilla(idTipoCargue:string){
    if(idTipoCargue == '1'){
      let texto = 'PK_ID_CALZADA;RESPONSABLE;ORIGEN;RADICADO_ORFEO';
      this.textoACSV(texto,'Base_cargue_visitas');
    }
  }

  private textoACSV(texto:string,filename:string){
    let fecha = new Date();
    const blob = new Blob(['\ufeff' + texto], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  clickConfirmarCargue(){
    if(this.procesarCargueDirectamente){
      this.confirmacionAceptada.emit();
    };
    this.confirmarCargue(this.idTipoCargue,this.idCargue);
  }
}