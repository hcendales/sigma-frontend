import { BooleanInput } from '@angular/cdk/coercion';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConsultaListasService } from 'src/app/core/services/consulta-listas.service';
import { ConsultasMejoramientoService } from 'src/app/core/services/consultas-mejoramiento.service';
import { EntityTabPersonaService } from 'src/app/core/services/entity-tab-persona.service';
import { UtilitariosService } from 'src/app/core/services/utilitarios.service';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';

function autocompleteObjectValidator(): ValidatorFn {
 return (control: AbstractControl): { [key: string]: any } | null => {
   if (typeof control.value === 'string' && control.value != ''  ) {
     return { 'invalidAutocompleteObject': { value: control.value } }
   }
   return null  /* valid option selected */
 }
}
@Component({
  selector: 'app-consulta-historial',
  templateUrl: './consulta-historial.component.html',
  styleUrls: ['./consulta-historial.component.scss']
})
export class ConsultaHistorialComponent implements OnInit {
  @ViewChild('pag') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('buscarBtn') public buscarBtn:any;

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

  public consultaDivTerritorial:boolean = true;

  public filteredPersonas: Observable<any[]> = new Observable<any[]>();

  mapCenter = [-74.113, 4.667];
  basemapType = 'gray';//environment.webMapAllPKsId;
  mapZoomLevel = 12;
  @ViewChild('mapa')
  mapElement!: MapaUmvComponent;
  step: BooleanInput = true;

  constructor(
    public fb:FormBuilder,
    private listasService: ConsultaListasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consultasMejoramientoService:ConsultasMejoramientoService,
    private snackBar:MatSnackBar,
    private utilitariosService:UtilitariosService,
    private entityTabPersonaService:EntityTabPersonaService) {
    this.activatedRoute.params.subscribe(params => {
     //this.coso = false;
      this.tipoConsulta = params['tipoConsulta'];

      this.campos_columnas = ['ID_MANTENIMIENTO_VIAL', 'CIV', 'PK_ID', 'TIPO_ELEMENTO', 'LOCALIDAD', 'BARRIO',
        'EJE_VIAL', 'DESDE', 'HASTA', 'FECHA_DE_VISITA', 'KM-CARRIL_IMPACTO',
        'RESPONSABLE_DE_VISITA', 'ACTIVIDAD', 'RESPONSABLE ACTIVIDAD',
        'ORIGEN', 'ESTADO_PK', 'OBSERVACION', 'DETALLE'];

      this.dataSourceConsulta = new MatTableDataSource();

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

      let srvPersonasResp = await this.entityTabPersonaService.list('');
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
        respServ = await this.consultasMejoramientoService.consultaHistorialMejoramiento(valueForm.pk_id_calzada,
          valueForm.id_zona, valueForm.id_localidad, valueForm.id_barrio, valueForm.id_upz,
          valueForm.id_programa, valueForm.id_persona?valueForm.id_persona.id_usuario?valueForm.id_persona.id_usuario:null:null, valueForm.id_actividad, fechaDesde?fechaDesde.getTime():null,
          fechaHasta?fechaHasta.getTime():null);
      if(respServ.codError == 0){
        this.operationSuccess();
        this.dataSourceConsulta = new MatTableDataSource(respServ.respuesta);
        this.dataSourceConsulta.paginator = this.paginator;
        this.dataSourceConsulta.sort = this.sort;
        let inArr: Array<any> = [];
        let inStr = '';
        for(let row of this.dataSourceConsulta.data)
           inArr.filter(pk => pk == row.pk_id_calzada).length?0:inArr.push(row.pk_id_calzada);
        let count = 0, pos = 0;
        if(inArr.length>999){
          count = Math.ceil(inArr.length/1000);
          for (let i = 0; i<count; i++){
            pos = i*1000;
            if(i<count-1)
              inStr += 'PK_ID_ELEMENTO in (' + inArr.slice(pos,999+pos).toString() + ') OR ';
            else
              inStr += 'PK_ID_ELEMENTO in (' + inArr.slice(pos,999+pos).toString() + ')';
          }
        } else
          inStr += 'PK_ID_ELEMENTO in (' + inArr.toString() + ')';
        console.log('Filtro PKs: ', inStr);
        this.mapElement.queryFeatures(inStr);
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
  irAPk (pk: number) {
    let w = "PK_ID_ELEMENTO = " + pk.toString();
    console.log('histPk ',w);
    this.mapElement.goTo(w);
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
    this.dataSourceConsulta = new MatTableDataSource();
    this.mapElement.clearFeatures();
    for(let c in this.formBusqueda.controls){
      if(c == 'fechas'){
        this.formBusqueda.get(c)?.get('desde')?.setValue(null);
        this.formBusqueda.get(c)?.get('hasta')?.setValue(null);
      }else{
        this.formBusqueda.get(c)?.setValue(null);
      }
    }
  }
  onRegistroVisita(mantenimiento: any){
       console.log('el mant', mantenimiento);
      this.router.navigate(['dashboard/mejoramiento-consultas/ver-detalle/' + mantenimiento.id_mantenimiento_vial]);//, {queryParams: { idGestion: mantenimiento.id_proceso_gestion, idActividad: mantenimiento.id_actividad, idDocumento: mantenimiento.id_documento}});
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
    let filename = 'Consulta_historial_mejoramiento';
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
      serv = await this.consultasMejoramientoService.consultaHistorialMejoramiento(pkIds.join(),
        null, null, null, null,
        null, null, null, null,
        null);
    if(serv.codError == 0){
      this.dataSourceConsulta = new MatTableDataSource(serv.respuesta);
      this.dataSourceConsulta.paginator = this.paginator;
      this.dataSourceConsulta.sort = this.sort;
      this.realizandoCounsulta = false;
      let inArr: Array<any> = [];
      let inStr = '';
      for(let row of this.dataSourceConsulta.data)
         inArr.filter(pk => pk == row.pk_id_calzada).length?0:inArr.push(row.pk_id_calzada);
      let count = 0, pos = 0;
      if(inArr.length>999){
        count = Math.ceil(inArr.length/1000);
        for (let i = 0; i<count; i++){
          pos = i*1000;
          if(i<count-1)
            inStr += 'PK_ID_CALZADA in (' + inArr.slice(pos,999+pos).toString() + ') OR ';
          else
            inStr += 'PK_ID_CALZADA in (' + inArr.slice(pos,999+pos).toString() + ')';
        }
      } else
        inStr += 'PK_ID_CALZADA in (' + inArr.toString() + ')';
      console.log('Filtro PKs: ', inStr);
      this.mapElement.queryFeatures(inStr);
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
    this.consultaDivTerritorial = true;
    this.formBusqueda.get('id_upz')?.setValue(null);
    this.formBusqueda.get('id_barrio')?.setValue(null);
    let respServ = await this.utilitariosService.consultarDivTerritorial(this.formBusqueda.get('id_localidad')?.value, null, null, null);
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
    this.consultaDivTerritorial = true;
    this.formBusqueda.get('id_barrio')?.setValue(null);
      let respServ = await this.utilitariosService.consultarDivTerritorial(this.formBusqueda.get('id_localidad')?.value, null, this.formBusqueda.get('id_upz')?.value, null);
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
    return this.personas.filter(persona => persona.nombre.toLowerCase().indexOf(filterValue) === 0);
  }
}
