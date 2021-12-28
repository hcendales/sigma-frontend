import { loadModules } from 'esri-loader';
import esri = __esri;
import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MantenimientoVial } from "../../../../core/models/mantenimiento-vial";
import { DominioItem } from "../../../../core/models/dominio-item";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SecurityService } from "../../../../core/security/services/security.service";
import { formatDate } from "@angular/common";
import { Observable } from "rxjs";
import { EntityTabMantenimientoVialService } from '../../../../core/services/entity-tab-mantenimiento-vial.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAutoprogramarComponent } from '../modal-autoprogramar/modal-autoprogramar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleDialogComponent } from 'src/app/core/simple-dialog/simple-dialog.component';
import { environment } from '../../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'events'
};
@Component({
  selector: 'app-autoprogramar-visita',
  templateUrl: './autoprogramar-visita.component.html',
  styleUrls: ['./autoprogramar-visita.component.scss']
})
export class AutoprogramarVisitaComponent implements OnInit {
  private _zoom = 11;
  private _center = [-74.113, 4.667];
  private _basemap = 'aa125730846140f8985be779f68051cf';
  //private _basemap = '405f07b7707841a08460f26b839851fb'
  solMant: MantenimientoVial | undefined;
  pkAutoprogamable: boolean | undefined;
  pkFueraRango: boolean | undefined = false;
  mapView!: esri.MapView;
  fullscreen!: esri.Fullscreen;
  tiposOrigen: DominioItem[];
  tiposOrigenFiltrado!: DominioItem[];
  tipoOrigenSeleccionado!: number;

  idTipoProgramaAlcaldias = 579;
  idTipoEntidadAlcaldia = 1452;
  idTipoOrigenOtro = 374;

  idTipoProgramaSecMovilidad = 578;
  idTipoEntidadSecMovilidad = 1452; //mirar si hay que cambiar el valor
  idEntidadSecMovilidad = 3;
  entidadUsuario:number|null = null;
  gestionesArray!: any[];
  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: any[]) {
    this._center = center;
  }

  get center(): any[] {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  @Output() mapLoaded = new EventEmitter<boolean>();

  @ViewChild('mapViewNode')
  private mapViewEl!: ElementRef;
  //@ViewChild('buscarRadicado') private buscarRadicado: BuscarRadicadoComponent;
  //@ViewChild('buscarRadicado') private buscarRadicado: BuscarRadicadoComponent;

  tipoElemento:string = '';

  constructor(private http: HttpClient,
              public router: Router,
              public entityMantenimientoService: EntityTabMantenimientoVialService,
              public tokenService: SecurityService,
              @Inject(LOCALE_ID)
               private locale: string,
              public dialog: MatDialog,
              private snackBar:MatSnackBar)
  {
      this.tiposOrigen = [{ idTipo: 371, valor: "1", descripcion: "PETICIONARIO"},
        { idTipo: 372, valor: "2", descripcion: "SEGUIMIENTO"},
        { idTipo: 373, valor: "3", descripcion: "MISIONAL"},
        { idTipo: 374, valor: "4", descripcion: "OTRO"}
      ];
  }
  mostrarBotonOk(){
    if(this.pkAutoprogamable && this.pkFueraRango){
      return false;
    }
    if(!this.pkAutoprogamable){
      return false;
    }
    if (this.tipoOrigenSeleccionado == 371){
      return false;
    } else {
      return this.pkAutoprogamable && this.tipoOrigenSeleccionado != undefined;
    }
  }
  workPK(): void {
    const scope = this;
    let gestionFilter:any;

    let pkId = scope.mapView.popup.selectedFeature;
    console.log('wking',pkId);
    console.log("enSeguimiento: ", pkId.attributes);
    gestionFilter = this.gestionesArray.filter(function(gest){
      return gest.attributes.PK_ID_ELEMENTO == pkId.attributes.PK_ID_ELEMENTO;
    });
    console.log("en seguimiento: ", gestionFilter);
    let seg, estado;
    if(gestionFilter.length>0){

      this.tipoElemento = gestionFilter[0].attributes.DESCRIPCION_ELEMENTO;

      estado = gestionFilter[0].attributes.DESCRIPCION_ESTADO_PK;
      seg = gestionFilter[0].attributes.DESCRIPCION_ORIGEN == "SEGUIMIENTO"?'SI':'NO';
      if(estado.indexOf('Terminado') == -1){
        scope.pkAutoprogamable = false;
      } else {
        scope.pkAutoprogamable = true;
      }
    } else
      scope.pkAutoprogamable = true;
    if(scope.fullscreen.viewModel.state == "active")
        scope.fullscreen.viewModel.exit();
      //const dialogRf = this.dialog.open(SimpleDialogComponent,{
      //  data: data
      //});
    if(seg == 'SI'){
      this.tiposOrigenFiltrado = [];
      for(let o of this.tiposOrigen){
        console.log('seg',o);
        if (o.idTipo == 372){
          this.tiposOrigenFiltrado.push(o);
          break;
        }
      }
    }else{
      this.tiposOrigenFiltrado = [];
      for(let o of this.tiposOrigen){
        console.log('Noseg',o);
        if (o.idTipo != 372){
          this.tiposOrigenFiltrado.push(o);
        }
      }
    }
    let kmCI: number;
    if (pkId.attributes.TIPOMALLA == 'LO'){
      kmCI = Number(pkId.attributes.AREA1) / 3000;
    } else {
      kmCI = Number(pkId.attributes.AREA1) / 3500;
    }
    scope.solMant = new MantenimientoVial(pkId.attributes.PK_ID_ELEMENTO,
              pkId.attributes.ANCHO,
              pkId.attributes.AREA1,
              pkId.attributes.LONGITUDHORIZONTAL,
              pkId.attributes.CIV,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              Number(kmCI.toFixed(2)),
              pkId.attributes.EJE_VIAL,
              pkId.attributes.DESDE,
              pkId.attributes.HASTA,
              0//pkId.attributes.ID_TIPO_SUPERFICIE,

    );
    if(scope.fullscreen.viewModel.state == "active")
      scope.fullscreen.viewModel.exit();
    /*console.log('****************************');
    console.log(pkId.attributes.INTERVENCION_UMV);
    console.log('****************************');
    console.log(pkId.attributes);
    if (pkId.attributes.INTERVENCION_UMV == 0 || pkId.attributes.INTERVENCION_UMV == 2){
      scope.pkAutoprogamable = true;
    }
    else{
      scope.pkAutoprogamable = false;
    }*/


    //si el usuario no es de la entidad UMV
    console.log('idEntidad',this.tokenService.userSession.id_entidad);
    if(this.entidadUsuario != 1 && this.entidadUsuario != this.idEntidadSecMovilidad){
      this.tipoOrigenSeleccionado = this.idTipoOrigenOtro;
       //si el pk esta en la localidad de la entidad del usuario o si el usuario es movilidad
       console.log(this.tokenService.userSession);
       console.log(pkId.attributes);
       console.log(Number(pkId.attributes.COD_LOCALIDAD) + ' == ' + Number(this.tokenService.userSession.id_localidad));
       if (Number(pkId.attributes.COD_LOCALIDAD) == Number(this.tokenService.userSession.id_localidad) || this.tokenService.userSession.id_entidad == 3){
        this.pkFueraRango = false;
        }else{
          this.pkFueraRango = true;
        }

    }else{
      this.pkFueraRango = false;
    }

    let data:any = {
      solMant: scope.solMant,
      pkAutoprogamable: scope.pkAutoprogamable,
      pkFueraRango: this.pkFueraRango,
      entidadUsuario: this.entidadUsuario,
      origFilter: this.tiposOrigenFiltrado
    }


      const dialogRef = this.dialog.open(ModalAutoprogramarComponent,{
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
       if (result.action=='cancel')
        scope.tipoOrigenSeleccionado = 0;
       else if (result.action=='update'){
        scope.tipoOrigenSeleccionado = result.value
        console.log('rad',result);
        console.log('origen',scope.tipoOrigenSeleccionado);
        this.autoprogPK(result.radicado);
      }
      });


  }
  autoprogPK(rad:any) {
    const scope = this;

    //scope.modalCargando.mostrarPanel();
    let idMantenimiento: Number, idGestion: Number;
    if(scope.solMant){
      scope.solMant.idTipoOrigen = scope.tipoOrigenSeleccionado;
  /*
    if(this.userControllerService.getIdTipoEntidad() == this.idTipoEntidadAlcaldia){
      this.solMant.idTipoPrograma = this.userControllerService.getidEntidad() == this.idEntidadSecMovilidad?this.idTipoProgramaSecMovilidad:this.idTipoProgramaAlcaldias;
      //poner en "CERO los valores del modelo de priorización"
      /*
      this.solMant.idTipoImpactoSocial = 396;
      this.solMant.idTipoDeterminacionInterv = 131;
      this.solMant.idTipoCoordinacionInterinst = 136;
      this.solMant.idTipoAporteMetas = 146;

    }*/
// TODO: verificar el campo de radicado
    if(this.tipoOrigenSeleccionado == 371) {
      scope.solMant.numeroRadicadoEntrada = rad.radi_nume_radi;
      scope.solMant.solicitudRadicadoEntrada = rad.radi_nume_radi;
      scope.solMant.solicitudNombre = rad.radi_nomb + " " + rad.radi_prim_apel + " " + rad.radi_segu_apel;
      scope.solMant.solicitudFecha = rad.radi_fech_radi;
      scope.solMant.solicitudVencimiento = rad.fech_vcmto;
    } else {
      console.log('EL SOL MANT',scope.solMant);
      scope.solMant.idTipoEstadoPk = 19;
      scope.solMant.solicitudNombre = this.tokenService.userSession.nombre;
      scope.solMant.fecha = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
      scope.solMant.solicitudFecha = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
      scope.solMant.solicitudVencimiento = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
      if(this.entidadUsuario != 1 && this.entidadUsuario != this.idEntidadSecMovilidad){
        //si es un usuario de alcadías, se cambia el programa a alcaldías y se pone como origen otro
        scope.solMant.idTipoPrograma = 579;
        scope.solMant.idTipoOrigen = 374;
      }
    }
    let ret:Promise<any> = this.entityMantenimientoService.create(scope.solMant);
    ret.then(
      (val:any) => {

        let idMantenimiento = val.respuesta[0].id_mantenimiento_vial_evento;
        let idGestion = val.respuesta[0].id_proceso_gestion;

        let idDocumento = val.respuesta[0].id_documento;

        this.router.navigate([ '/dashboard/mejoramiento-reg-visita-diagnostico/registro/' + '', idMantenimiento ],{queryParams: { idDocumento: idDocumento,idGestion:idGestion,idActividad:this.entidadUsuario!=1 && this.entidadUsuario!=this.idEntidadSecMovilidad?43:3}});
      },
      error => {
        console.log('ERROR EN LA PETICION Y FINALIZO' + JSON.stringify(error));
        //scope.modalCargando.ocultarPanel();
      }
      /*,
      () => {
        //this.userControllerService.setIdMantenivientoVialGestionSeleccionado (idGestion);

        console.log('guarda mantV:', idMantenimiento);
        //scope.modalCargando.ocultarPanel();
      }*/
    );
   }
  }
  cancelarAutoprog() {
    this.solMant = undefined;
  }
  public ngOnInit() {
    this.entidadUsuario = this.tokenService.userSession.id_entidad;
    let scope = this;
    let timeout: boolean;
    let baseMap: any
    let request = new XMLHttpRequest();
    request.timeout = 10000;
    request.ontimeout = function () {
      console.log("Cambiando a WebMap UMV");
      scope._basemap = environment.WM_Hash;//'38d74e82d751495b8c30a5e3841c45c0';
      scope.initializeMap();
      timeout = true;
    }
    request.onloadend = function () {
      if (!timeout) {
        if (request.status !== 200) {
            console.log("Cambiando a WebMap UMV", environment.WM_Hash);
            baseMap = environment.WM_Hash;//'38d74e82d751495b8c30a5e3841c45c0';
        } else {
            let response = JSON.parse(request.response);
            if (response.error) {
                console.log("Cambiando a WebMap UMV");
                baseMap = environment.WM_Hash;//'38d74e82d751495b8c30a5e3841c45c0';
            } else {
                console.log("Cambiando a WebMap UMV", environment.WM_Hash);
                baseMap = environment.WM_Hash;//'aa125730846140f8985be779f68051cf';
            }
        }
        scope._basemap = baseMap;
        scope.initializeMap();
      }
    };
    try {
        request.open("get", "http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer" + "?f=json");
        request.send();
    }
    catch (error) {
        console.error(error);
    }
  }
  async initializeMap() {
    try {
       const [EsriWebMap, EsriMapView, EsriFullScreen, EsriLocator, EsriLocate, EsriSearch, EsriLayerList, EsriLegend, EsriExp, Compass, EsriHome, EsriFL, EsriGL, EsriGraphic, EsriTL, EsriBasemap, EsriBasemapGallery] = await loadModules([
         'esri/WebMap',
         'esri/views/MapView',
         'esri/widgets/Fullscreen',
         'esri/tasks/Locator',
         'esri/widgets/Locate',
         'esri/widgets/Search',
         'esri/widgets/LayerList',
         'esri/widgets/Legend',
         'esri/widgets/Expand',
         'esri/widgets/Compass',
         'esri/widgets/Home',
         'esri/layers/FeatureLayer',
         'esri/layers/GraphicsLayer',
         'esri/Graphic',
         'esri/layers/TileLayer',
         'esri/Basemap',
         'esri/widgets/BasemapGallery'
       ]);
       const apiK = 'AAPKf16af59b117247ba95e1e7af7ef9d279wlVIqcYyfAhzwhtsKYtoHKLRErlzOMqew9bUCfe1ODUIMBnlQgl3Ycq-iey7V7hf';
       /*const idecaBasemap = new EsriBasemap({
          baseLayers: [new EsriTL({ url: environment.urlWebMapIDECA })],
          title: "Mapa base IDECA",
          id: "ideca"
        });
        */
        let map: esri.Map = new EsriWebMap({
          portalItem: { id: this._basemap }
        });
         const mapViewProperties: esri.MapViewProperties = {
           container: this.mapViewEl.nativeElement,
           center: this._center,
           zoom: this._zoom,
           map: map
         };
         this.mapView = new EsriMapView(mapViewProperties);
         this.fullscreen = new EsriFullScreen({
           view: this.mapView
         });
         let locate = new EsriLocate({
           view: this.mapView
         });
         let filterActions = [{
           title: "PKs Asignados",
           id: "filter-pks",
           className: "esri-icon-filter"
         }];
         let search = new EsriSearch({
           view: this.mapView,
           includeDefaultSources: false,
           allPlaceholder: "Buscar ubicación",
           sources: [
             {
               name: "Geocodificador",
               placeholder: "Ejemplo: CL 33 17 56",
               apiKey: apiK,
               countryCode: "CO",
               city: "Bogotá, DC",
               singleLineFieldName: "SingleLine",
               locator: new EsriLocator({
                 url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer"
               })
             }, {
               layer: new EsriFL({
                 url: 'https://gis.umv.gov.co/server/rest/services/UMV/Geo_Elementos/MapServer/0',
                 outFields: ["*"]
               }),
               searchFields: ["PK_ID_ELEMENTO", "CIV"],
               suggestionTemplate: "{PK_ID_ELEMENTO}",
               displayField: "PK_ID_ELEMENTO",
               exactMatch: false,
               name: "Elementos viales",
               placeholder: "Buscar PK",
             }, {
               layer: new EsriFL({
               url: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_4686/MapServer/76',
               popupTemplate: {
                 title: "Localidad: {LOCNOMBRE}",
                 actions: filterActions,
                 content: [{
                   type: "fields",
                   fieldInfos: [{
                     fieldName: "LOCCODIGO",
                     label: "Código",
                     visible: true
                   }, {
                     fieldName: "LOCAADMINI",
                     label: "Acto admin.",
                     visible: true
                   }, {
                     fieldName: "LOCAREA",
                     label: "Área",
                     visible: true
                   }]
                 }]
               },
               outFields: ["*"]
             }),
             searchFields: ["LOCNOMBRE", "LOCCODIGO"],
             suggestionTemplate: "{LOCCODIGO}: {LOCNOMBRE}",
             displayField: "LOCNOMBRE",
             exactMatch: false,
             outFields: ["*"],
             name: "Localidades",
             placeholder: "Buscar Localidad",
           }, {
             layer: new EsriFL({
               url: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_4686/MapServer/75',
               popupTemplate: {
                 title: "Sector: {SCANOMBRE}",
                 actions: filterActions,
                 content: [{
                   type: "fields",
                   fieldInfos: [{
                     fieldName: "SCACODIGO",
                     label: "Código",
                     visible: true
                   }, {
                     fieldName: "SCATIPO",
                     label: "Tipo sector",
                     visible: true
                   }]
                 }]
               },
               outFields: ["*"]
             }),
             searchFields: ["SCANOMBRE", "SCACODIGO"],
             suggestionTemplate: "{SCANOMBRE}",
             displayField: "SCANOMBRE",
             exactMatch: false,
             outFields: ["*"],
             name: "Barrios",
             placeholder: "Buscar Barrio",
           }
           ]
         });
         this.mapView.ui.add(search, 'top-right');
         let homeView = new EsriHome({
           view: this.mapView
         });
         this.mapView.ui.add(homeView, 'top-left');
         let compass = new Compass({
           view: this.mapView
         });
         this.mapView.ui.add(compass, "top-left");
         this.mapView.ui.add(locate, 'top-left');
         this.mapView.ui.add(this.fullscreen, 'top-left');
         let bmGallery = new EsriBasemapGallery({
           view: this.mapView
         });
         //bmGallery.source.add(idecaBasemap);
         let basemapGallery = new EsriExp({
          content: bmGallery,
          view: this.mapView,
          expandIconClass: "esri-icon-basemap",
          expanded: false
        });
        this.mapView.ui.add(basemapGallery, "top-right");
         let layerList = new EsriExp({
          content: new EsriLayerList({
           view: this.mapView,
           label: "Capas"
          }),
          view: this.mapView,
          expandIconClass: "esri-icon-layers",
          expanded: false
        });
         this.mapView.ui.add(layerList, "bottom-right");
         let legend = new EsriExp({
          content: new EsriLegend({
            view: this.mapView,
            label: "Leyenda",
            style: "card"
          }),
          view: this.mapView,
          expandIconClass: "esri-icon-layer-list",
          expanded: false
        });
         const scope = this;
         scope.mapView.ui.add(legend, "bottom-left");

         scope.mapView.popup.on("trigger-action", function(event:any) {
           if (event.action.id === "work-row") {
             scope.workPK();
           }
         });
         let gestionFL, flGestionUmv: { popupTemplate: { actions: { title: string; id: string; className: string; }[]; }; }, flSinGestionUmv: any;
      scope.mapView.when((A: { map: { allLayers: any[]; }; }) => {
        const layers = A.map.allLayers;
        const promises = layers.map(function(layer:any){
          return layer.load();
        });
        return Promise.all(promises);
      })
      .then(function(layers) {
         gestionFL = layers.find(function(layer: any) {
         return layer.title === "Elementos";
         //return layer.title === "Gestion";
        });
        console.log('gestionAP:',gestionFL);

        let actions = [{
            title: "Trabajar",
            id: "work-row",
            className: "esri-icon-play-circled"
          }];
          gestionFL.allSublayers.items.forEach (
            (          item: any ) => {
              item.popupTemplate.actions = actions;
            }
          );
        //flSinGestionUmv.popupTemplate.actions = actions;
        //flGestionUmv.popupTemplate.actions = actions;
      });
      this.mapView.popup.watch("features", function(e:any){
         console.log("Pks sel: ",e);//.__accessor__.store.values);
         console.log("Pks sel: ",e);
         scope.gestionesArray = e.filter((result:any) => {
           return result.attributes.ACTIVIDAD_AGRUPADA?true:false;
         })
         console.log("gestiones:", scope.gestionesArray);
      });
      this.mapView.popup.watch("selectedFeature", function(e:any){
       scope.mapView.graphics.removeAll();
       if (e && e.geometry) {
         scope.mapView.graphics.add(
           new EsriGraphic({
             geometry: e.geometry,
             symbol: {
               type: "simple-fill",
               style: "none",
               outline: {
                 color: "#6600FF",
                 width: 2
               }
             }
           })
         );
       }
      });
      this.mapView.popup.watch("close", function(e:any){
         scope.mapView.graphics.removeAll();
      });
    } catch (error) {
      console.log('We have an error: ' + error);
    }
  }
}
