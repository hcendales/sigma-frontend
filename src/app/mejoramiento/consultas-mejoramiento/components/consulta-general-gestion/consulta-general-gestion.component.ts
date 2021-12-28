import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, ValidationErrors, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { ConsultasMejoramientoService } from '../../../../core/services/consultas-mejoramiento.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { UtilitariosService } from '../../../../core/services/utilitarios.service';
import { EntityTabPersonaService } from '../../../../core/services/entity-tab-persona.service';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { BooleanInput } from '@angular/cdk/coercion';

 function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string' && control.value != ''  ) {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}
@Component({
  selector: 'app-consulta-general-gestion',
  templateUrl: './consulta-general-gestion.component.html',
  styleUrls: ['./consulta-general-gestion.component.scss']
})
export class ConsultaGeneralGestionComponent implements OnInit {

  @ViewChild('pag') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  
  

  public formBusqueda:FormGroup;
  public formFechas:FormGroup;
  public actividades: any[] = [];
  public personas: any[] = [];
  public listas: any = {};
  public tipoConsulta: string = '';
  public campos_columnas:string[] = [];
  public dataSourceConsulta: MatTableDataSource<any> = new MatTableDataSource();
  public realizandoCounsulta: boolean = false;
  public archivoEnProceso:boolean = false;
  public cargandoArchivo:boolean = false;
  public upz: any[] = [];
  public barrios: any[] = [];

  public keepscrolling: boolean = false;
 

  public consultaDivTerritorial:boolean = true;

  public filteredPersonas: Observable<any[]> = new Observable<any[]>();

  step: BooleanInput = true;

  constructor(public fb:FormBuilder,  private listasService: ConsultaListasService, private activatedRoute: ActivatedRoute, private consultasMejoramientoService:ConsultasMejoramientoService, private snackBar:MatSnackBar, private utilitariosService:UtilitariosService, private entityTabPersonaService:EntityTabPersonaService) {
    this.activatedRoute.params.subscribe(params => {
     //this.coso = false;
     
    
      this.tipoConsulta = params['tipoConsulta'];

      if(this.tipoConsulta == 'gestion'){
        this.campos_columnas = ['civ', 'pk_id_calzada', 'descripcion_elemento', 'descripcion_localidad', 'descripcion_barrio',
        'eje_vial', 'desde', 'hasta', 'fecha_inicio','fecha_fin', 'fecha_visita_tecnica',
        'km_carril_impacto', 'descripcion_actividad', 'observaciones_diagnostico',
        'observacion_gestion', 'nombre_responsable_visita', 'actividad', 'nombre',
        'descripcion_origen', 'descripcion_estado_pk', 'descripcion_estado_gestion'];

        //this.dataSourceConsulta = new MatTableDataSource<any>();
      }
      else if(this.tipoConsulta == 'seguimiento' || this.tipoConsulta == 'seguimiento-ult'){
        this.campos_columnas = ['descripcion_origen','descripcionPrograma', 'descripcion_estado_pk', 'civ', 'pk_id_calzada', 'descripcion_elemento',
        'descripcion_localidad', 'descripcion_barrio', 'eje_vial', 'desde','hasta', /*'FECHA_TERMINADO_EJECUCION',*/
        'descripcionTipoSuperficie', 'seguimiento_numero', 'pci',
        'fecha_visita_tecnica', 'actividad_agrupada', 'observaciones_diagnostico', 'nombre_responsable_visita','FALLAS','OTROS_FACTORES'];

        //this.dataSourceConsulta = new MatTableDataSource<any>();
      }
      this.dataSourceConsulta = new MatTableDataSource();
      this.limpiarCampos();
     
     // this.coso = true;
    });
    this.formFechas = this.fb.group({
      desde: new FormControl(),
      hasta: new FormControl()
    })
    this.formBusqueda = this.fb.group({
      pk_id_calzada: [''],
      id_localidad: [''],
      id_upz: [''],
      id_barrio: [''],
      id_zona: [''],
      id_programa: [''],
      id_persona: ['', autocompleteObjectValidator()],
      id_actividad: [''],
      fechas: this.formFechas,
    },{validator:this.filledOne} as AbstractControlOptions);
    //falta consultar actividades y personas
  }
    /*
    lista 7: localidades
    lista 8: UPZ
    lista 12: barrios
    lista 27: Zonas
    lista 2002: PROGRAMA
    */
  async ngOnInit() {
    
    try{
      this.listas = await this.listasService.consultarListas([7,27,2002]);
      this.listas[7].sort((a:any,b:any) => (a.valor > b.valor) ? 1 : ((b?.valor > a.valor) ? -1 : 0));
      this.listas[27].sort((a:any,b:any) => (a.valor > b.valor) ? 1 : ((b?.valor > a.valor) ? -1 : 0));

      let act = await this.consultasMejoramientoService.getActividadesMejoramiento();
      if(act.codError == 0){
        this.actividades = JSON.parse(act.respuesta[0].json).respuesta;
      }else{
        this.handleError();
      }

      let srvPersonasResp = await this.entityTabPersonaService.listUsuarios('');
      if(srvPersonasResp.codError == 0){
        this.personas = srvPersonasResp.respuesta;
        
        this.personas.sort((a:any,b:any) => (a.nombre > b.nombre) ? 1 : ((b?.nombre > a.nombre) ? -1 : 0));


        this.filteredPersonas = this.formBusqueda.get('id_persona')!.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value == null? '':value.nombre),
            map(name => name ? this._filter(name) : this.personas.slice())
          );

      }else{
        this.handleError();
      }
      

    }catch(e){
      console.log(e);
      this.handleError();
    }

  }


  

  async onSubmit(){
    
    this.realizandoCounsulta = true;
    let valueForm = this.formBusqueda.value;
    let fechaDesde = valueForm.fechas.desde?new Date(valueForm.fechas.desde):null;
    let fechaHasta = valueForm.fechas.hasta?new Date(valueForm.fechas.hasta):null;
    let respServ;
    try{
      if(this.tipoConsulta == 'gestion'){
        respServ = await this.consultasMejoramientoService.consultaGeneralGestion(valueForm.pk_id_calzada,
          valueForm.id_zona, valueForm.id_localidad?valueForm.id_localidad.id_tipo:null, valueForm.id_barrio, valueForm.id_upz?valueForm.id_upz.id_upla:null,
          valueForm.id_programa, valueForm.id_persona?valueForm.id_persona.id_usuario?valueForm.id_persona.id_usuario:null:null, valueForm.id_actividad, fechaDesde?fechaDesde.getTime():null,
          fechaHasta?fechaHasta.getTime():null);
      }else
      if(this.tipoConsulta == 'seguimiento'){
        respServ = await this.consultasMejoramientoService.consultaSeguimiento(valueForm.pk_id_calzada,
          valueForm.id_zona, valueForm.id_localidad?valueForm.id_localidad.id_tipo:null, valueForm.id_barrio, valueForm.id_upz?valueForm.id_upz.id_upla:null,
          valueForm.id_programa, valueForm.id_persona?valueForm.id_persona.id_usuario?valueForm.id_persona.id_usuario:null:null, valueForm.id_actividad, fechaDesde?fechaDesde.getTime():null,
          fechaHasta?fechaHasta.getTime():null);
      }else
      if(this.tipoConsulta == 'seguimiento-ult'){
        respServ = await this.consultasMejoramientoService.consultaUltimoSeguimiento(valueForm.pk_id_calzada,
          valueForm.id_zona, valueForm.id_localidad?valueForm.id_localidad.id_tipo:null, valueForm.id_barrio, valueForm.id_upz?valueForm.id_upz.id_upla:null,
          valueForm.id_programa, valueForm.id_persona?valueForm.id_persona.id_usuario?valueForm.id_persona.id_usuario:null:null, valueForm.id_actividad, fechaDesde?fechaDesde.getTime():null,
          fechaHasta?fechaHasta.getTime():null);
      }
      if(respServ.codError == 0){
        this.operationSuccess();
        this.dataSourceConsulta = new MatTableDataSource(respServ.respuesta);
        this.dataSourceConsulta.paginator = this.paginator;
        this.dataSourceConsulta.sort = this.sort;
      }else{
        this.handleError();
      }
      this.realizandoCounsulta = false;
    }catch(e){
      console.log(e);
      this.handleError();
      this.realizandoCounsulta = false;
    }


  }
  clearDate(){
    this.formFechas.get('desde')?.setValue(null);
    this.formFechas.get('hasta')?.setValue(null);
  }

  operationSuccess(){
    this.snackBar.open('Consulta Realizada', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
    this.setStep(false);
  }

  handleError(){
    this.snackBar.open('Error al realizar la consulta', 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private filledOne(formGroup: FormGroup){
    for(let c in formGroup.controls){
      if(c == 'fechas'){
        if(formGroup.get(c)?.get('desde')?.value && formGroup.get(c)?.get('hasta')?.value){
          return null;
        }
      }else{

      let value = formGroup.get(c)?.value
      if(value){
        if(typeof value == "string"){
          if(value.length > 0){
            return null;
          }
        }else{
          return null;
        }

      }
    }
    }
    return {'ningunoDiligenciado':true};
  }

  limpiarCampos(){
    if(!this.formBusqueda){
      return;
    }
    this.dataSourceConsulta = new MatTableDataSource();
    for(let c in this.formBusqueda.controls){
      if(c == 'fechas'){
        this.formBusqueda.get(c)?.get('desde')?.setValue(null);
        this.formBusqueda.get(c)?.get('hasta')?.setValue(null);
      }else{
        this.formBusqueda.get(c)?.setValue(null);
      }
    }

    if(this.paginator){
      this.paginator.length = this.dataSourceConsulta.data.length;
      this.paginator.firstPage();
    }
  }

  exportar(){
    this.archivoEnProceso = true;
    const blob = new Blob(['\ufeff' + this.getFileData()], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    let filename = '';
    if(this.tipoConsulta == 'gestion'){
        filename = 'Consulta_general_gestion';
    }else if(this.tipoConsulta == 'seguimiento'){
        filename = 'Consulta_seguimiento';
    }else if(this.tipoConsulta == 'seguimiento-ult'){
        filename = 'Consulta_seguimiento_ult';
    }
    filename += '_' + new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    this.archivoEnProceso = false;

  }

  private getFileData() {
    let texto = '';
    let separador = ';';
    let saltoLinea = '\n';
    let campoNull = ' - ';
    let region = 'es-CO';

    for(let i =0;i<this.campos_columnas.length;i++){
      texto += this.campos_columnas[i] + separador;
    }
    texto = texto.replace(/.$/, saltoLinea);
    if(this.tipoConsulta == 'gestion'){
      for(let row of this.dataSourceConsulta.data){
        texto += (row.civ?this.obtenerTextoReporte(row.civ):campoNull) + separador;
        texto += (row.pk_id_calzada?this.obtenerTextoReporte(row.pk_id_calzada):campoNull) + separador;
        texto += (row.descripcion_elemento?this.obtenerTextoReporte(row.descripcion_elemento):campoNull) + separador;
        texto += (row.descripcion_localidad?this.obtenerTextoReporte(row.descripcion_localidad):campoNull) + separador;
        texto += (row.descripcion_barrio?this.obtenerTextoReporte(row.descripcion_barrio):campoNull) + separador;
        texto += (row.eje_vial?this.obtenerTextoReporte(row.eje_vial):campoNull) + separador;
        texto += (row.desde?this.obtenerTextoReporte(row.desde):campoNull) + separador;
        texto += (row.hasta?this.obtenerTextoReporte(row.hasta):campoNull) + separador;
        texto += (row.fecha_inicio?this.obtenerTextoReporte(new Date(row.fecha_inicio).toLocaleDateString(region)):campoNull) + separador;
        texto += (row.fecha_fin?this.obtenerTextoReporte(new Date (row.fecha_fin).toLocaleDateString(region)):campoNull) + separador;
        texto += (row.fecha_visita_tecnica?this.obtenerTextoReporte(new Date(row.fecha_visita_tecnica).toLocaleDateString(region)):campoNull) + separador;
        texto += (row.km_carril_impacto?this.obtenerTextoReporte(row.km_carril_impacto):campoNull) + separador;
        texto += (row.valor_actividad?this.obtenerTextoReporte(row.valor_actividad):campoNull) + separador;
        texto += (row.actividad_agrupada?this.obtenerTextoReporte(row.actividad_agrupada):campoNull) + separador;
        texto += (row.observaciones_diagnostico?this.obtenerTextoReporte(row.observaciones_diagnostico):campoNull) + separador;
        texto += (row.observacion_gestion?this.obtenerTextoReporte(row.observacion_gestion):campoNull) + separador;
        texto += (row.nombre_responsable_visita?this.obtenerTextoReporte(row.nombre_responsable_visita):campoNull) + separador;
        texto += (row.actividad?this.obtenerTextoReporte(row.actividad):campoNull) + separador;
        texto += (row.nombre?this.obtenerTextoReporte(row.nombre):campoNull) + separador;
        texto += (row.descripcion_origen?this.obtenerTextoReporte(row.descripcion_origen):campoNull) + separador;
        texto += (row.descripcion_estado_pk?this.obtenerTextoReporte(row.descripcion_estado_pk):campoNull) + separador;
        texto += (row.descripcion_estado_gestion?this.obtenerTextoReporte(row.descripcion_estado_gestion):campoNull) + separador;
        texto += saltoLinea;
      }

    }
    else if(this.tipoConsulta == 'seguimiento' || this.tipoConsulta == 'seguimiento-ult'){
      for(let row of this.dataSourceConsulta.data){
        //texto += (row.idMantenimientoVial?this.obtenerTextoReporte(row.idMantenimientoVial):campoNull) + separador;
        texto += (row.descripcion_origen?this.obtenerTextoReporte(row.descripcion_origen):campoNull) + separador;
        texto += (row.descripcion_programa?this.obtenerTextoReporte(row.descripcion_programa):campoNull) + separador;
        texto += (row.descripcion_estado?this.obtenerTextoReporte(row.descripcion_estado):campoNull) + separador;
        texto += (row.civ?this.obtenerTextoReporte(row.civ):campoNull) + separador;
        texto += (row.pk_id_calzada?this.obtenerTextoReporte(row.pk_id_calzada):campoNull) + separador;
        texto += (row.descripcion_elemento?this.obtenerTextoReporte(row.descripcion_elemento):campoNull) + separador;
        texto += (row.descripcion_localidad?this.obtenerTextoReporte(row.descripcion_localidad):campoNull) + separador;
        texto += (row.descripcion_barrio?this.obtenerTextoReporte(row.descripcion_barrio):campoNull) + separador;
        texto += (row.eje_vial?this.obtenerTextoReporte(row.eje_vial):campoNull) + separador;
        texto += (row.desde?this.obtenerTextoReporte(row.desde):campoNull) + separador;
        texto += (row.hasta?this.obtenerTextoReporte(row.hasta):campoNull) + separador;
        texto += (row.fecha_fin? this.obtenerTextoReporte(new Date(row.fecha_fin).toLocaleDateString(region)):campoNull) + separador;
        //texto += '??' + separador; //es la intervención ejecutada que en le momento no es posible obtener
        texto += (row.descripcion_tipo_superficie?this.obtenerTextoReporte(row.descripcion_tipo_superficie):campoNull) + separador;
        texto += (row.consecutivo_mantenimiento?this.obtenerTextoReporte(row.consecutivo_mantenimiento):campoNull) + separador;
        texto += (row.pci?this.obtenerTextoReporte(row.pci):campoNull) + separador;
        texto += (row.fecha_visita_tecnica?this.obtenerTextoReporte(new Date(row.fecha_visita_tecnica).toLocaleDateString(region)):campoNull) + separador;
        texto += (row.actividad?this.obtenerTextoReporte(row.actividad):campoNull) + separador;
        texto += (row.actividad_agrupada?this.obtenerTextoReporte(row.actividad_agrupada):campoNull) + separador;
        texto += (row.observaciones_diagnostico?this.obtenerTextoReporte(row.observaciones_diagnostico):campoNull) + separador;
        texto += (row.nombre_responsable_visita?this.obtenerTextoReporte(row.nombre_responsable_visita):campoNull) + separador;
        let regesp = new RegExp(separador, 'g');
        let separadorListaCelda = ',';
        texto += (row.fallas?this.obtenerTextoReporte(row.fallas.replace(regesp,separadorListaCelda)):campoNull) + separador;
        texto += (row.otros_factores?this.obtenerTextoReporte(row.otros_factores.replace(regesp,separadorListaCelda)):campoNull) + separador;
        texto += saltoLinea;
      }
    }
    return texto;
  }

  obtenerTextoReporte(texto:any){
    if (typeof texto != "string") {
      return texto;
    }
    //si contiene ; o salto de linea encerrar el texto entre comillas y convertir las comillas del texto original en comillas dobles
    if(texto.includes(';') || texto.includes('\n')){
      return `"${texto.replace(/"/g,'""')}"`;
    }else{
      return texto;
    }

  }
  setStep(st:BooleanInput) {
    this.step = st;
  }
  change(e:any) {
    this.cargandoArchivo = true;
    let file = e.target.files.item(0);
    const reader = new FileReader();

    reader.readAsText(file);
      reader.onload = () => {
      let renglones = [];
      let lista = reader.result?.toString().split('\n');
      if(lista){
        for (let renglon of lista){
          let reng = Number(renglon);
          if(reng){
            renglones.push(reng);
          }
        }
      }


      this.consultarPorListaPks(renglones);
      this.cargandoArchivo = true;
    };

  }

  async consultarPorListaPks(pkIds: Array<number>){
    this.realizandoCounsulta = true;
    let serv;
    try{
    if(this.tipoConsulta == 'gestion'){
      serv = await this.consultasMejoramientoService.consultaGeneralGestion(pkIds.join(),
        null, null, null, null,
        null, null, null, null,
        null);

    }else
    if(this.tipoConsulta == 'seguimiento'){
      serv = await this.consultasMejoramientoService.consultaSeguimiento(pkIds.join(),
        null, null, null, null,
        null, null, null, null,
        null);
    }else
    if(this.tipoConsulta == 'seguimiento-ult'){
      serv = await this.consultasMejoramientoService.consultaUltimoSeguimiento(pkIds.join(),
        null, null, null, null,
        null, null, null, null,
        null);
    }

    if(serv.codError == 0){
      this.dataSourceConsulta = new MatTableDataSource(serv.respuesta);
      this.dataSourceConsulta.paginator = this.paginator;
      this.dataSourceConsulta.sort = this.sort;
      this.realizandoCounsulta = false;
    }else{
      this.handleError();
      this.realizandoCounsulta = false;
    }
  }catch(e){
    console.log(e);
    this.handleError();
    this.realizandoCounsulta = false;
  }

  }

  async localidadSelected(){
    console.log(this.formBusqueda.get('id_localidad')?.value);
    
    this.formBusqueda.get('id_upz')?.setValue(null);
    this.formBusqueda.get('id_barrio')?.setValue(null);
    if(!this.formBusqueda.get('id_localidad')?.value){
      return;
    }
    this.consultaDivTerritorial = true;
    let respServ = await this.utilitariosService.consultarDivTerritorial(this.formBusqueda.get('id_localidad')?.value.valor, null, null, null);
    if(respServ.codError == 0){
      this.upz = [];
      this.barrios = [];
      this.consultaDivTerritorial = false;


      let upzDict = {} as any;
      let barriosDict = {} as any;
      for(let a of respServ.respuesta){
        if(!upzDict[String(a.id_upla)]){
          upzDict[String(a.id_upla)] = a;
        }
        if(!barriosDict[String(a.id_barrio)]){
          barriosDict[String(a.id_barrio)] = a;
        }
      }
      for(let key in upzDict){
        this.upz.push(upzDict[key]);
      }
      this.upz.sort((a:any,b:any) => (a.cod_upl > b.cod_upl) ? 1 : ((b?.cod_upl > a.cod_upl) ? -1 : 0));
      for(let key in barriosDict){
        this.barrios.push(barriosDict[key]);
      }
      this.barrios.sort((a:any,b:any) => (a.nom_sector > b.nom_sector) ? 1 : ((b?.nom_sector > a.nom_sector) ? -1 : 0));
    }else{
      this.handleError();
      this.consultaDivTerritorial = false;
    }
  }

  async upzSelected(){
    console.log('la UPZ: ' , this.formBusqueda.get('id_upz')?.value);
    this.consultaDivTerritorial = true;
    this.formBusqueda.get('id_barrio')?.setValue(null);
      let respServ = await this.utilitariosService.consultarDivTerritorial(this.formBusqueda.get('id_localidad')?.value.valor, null, this.formBusqueda.get('id_upz')?.value.cod_upl, null);
      if(respServ.codError == 0){
        this.barrios = [];
        let barriosDict = {} as any;
        for(let a of respServ.respuesta){
          if(!barriosDict[String(a.id_barrio)]){
            barriosDict[String(a.id_barrio)] = a;
          }
        }
        for(let key in barriosDict){
          this.barrios.push(barriosDict[key]);
        }
        this.barrios.sort((a:any,b:any) => (a.nom_sector > b.nom_sector) ? 1 : ((b?.nom_sector > a.nom_sector) ? -1 : 0));
        this.consultaDivTerritorial = false;
      }else{
        this.handleError();
        this.consultaDivTerritorial = false;
      }



    this.consultaDivTerritorial = false;
  }

  public displayContactFn(contact?: any): string  {
    return contact ? contact.nombre : ''
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.personas.filter(persona => persona.nombre.toLowerCase().indexOf(filterValue) != -1);
  }

  public paginatorEvt(){
    
  }

  public getArrayfallas(fallas:string){
    
    let objFallas = {} as any;
    for(let falla of fallas.split('; ')){
      objFallas[falla] = objFallas[falla]?objFallas[falla]+1:1;
    }

    let res = [];
    for(let k in objFallas){
      res.push('- '+k + ' ('+objFallas[k]+')');
    }
    return res.join(' \n ');
  }

  public getArrayOtrosFactores(otrosFactores:string){
    let res = [];
    for(let of of otrosFactores.split('; ')){
      res.push('- '+of);
    }
    return res.join(' \n ');
  }

  public scroll(amount:number){

    if(this.keepscrolling){
      this.tableContainer.nativeElement.scrollLeft += amount;
      setTimeout(()=>{this.scroll(amount)}, 1);
    }
    return;
  }



}
