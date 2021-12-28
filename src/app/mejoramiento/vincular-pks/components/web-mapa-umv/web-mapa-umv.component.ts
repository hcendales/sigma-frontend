import { loadModules } from 'esri-loader';
import esri = __esri;
import { Component, ElementRef, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
import { MantenimientoVial } from "../../../../core/models/mantenimiento-vial";
import { DominioItem } from "../../../../core/models/dominio-item";
import { SecurityService } from "../../../../core/security/services/security.service";
import { EntityTabMantenimientoVialService } from '../../../../core/services/entity-tab-mantenimiento-vial.service';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from '../../../../core/simple-dialog/simple-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'events'
};
@Component({
  selector: 'app-web-mapa-umv',
  templateUrl: './web-mapa-umv.component.html',
  styleUrls: ['./web-mapa-umv.component.scss']
})
export class WebMapaUmvComponent implements OnInit {
  private _zoom = 11;
  private _center = [-74.113, 4.667];
  private _basemap = '826eb0abceec4c30b4b26a2f722c13e0';
  //'dbbefea4ad994ff8ac4a96f984410f0c';

  solMant: MantenimientoVial | undefined;
  pkAutoprogamable: boolean | undefined;
  pkFueraRango: boolean | undefined;
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
  gestionesArray: any[];

  selectedFeaturesGL:any = []
  EsriSR!:any;

  pkMantArray:any[]=[];

  /**
  * @static
  */
  static self: WebMapaUmvComponent;
  elementos: any;

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
  @Output() addMant = new EventEmitter<any>();
  @Output() geoData = new EventEmitter<any>();
  @ViewChild('mapViewNode')
  private mapViewEl!: ElementRef;

  srWGS:any;

  anden!: any;
  cicloruta!: any;
  calzada!: any;
  separador!: any;
  bahia!: any;
  puente!: any;
  gestion!:any;

  constructor(private http: HttpClient,
              public router: Router,
              public entityMantenimientoService: EntityTabMantenimientoVialService,
              public tokenService: SecurityService,
              @Inject(LOCALE_ID)
               private locale: string,
              public dialog: MatDialog) {
                WebMapaUmvComponent.self = this;
                this.gestionesArray = [];
                this.tiposOrigen = [{ idTipo: 1401, valor: "1", descripcion: "PETICIONARIO"},
                  { idTipo: 1402, valor: "2", descripcion: "SEGUIMIENTO"},
                  { idTipo: 1403, valor: "3", descripcion: "MISIONAL"},
                  { idTipo: 1404, valor: "4", descripcion: "OTRO"}
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
   private pushPkMant(features:any,index:number){
     let label:any = this.get_field_label(index);
     features.forEach((feat:any)=>{
       let pkMant : any = {};
       pkMant['CIV'] = feat.attributes.CIV;
       pkMant['TIPOORIGEN'] = this.tiposOrigen[0].idTipo;
       pkMant['TIPOMALLA'] = feat.attributes.TIPOMALLA;
       pkMant['TIPOSUPERFICIE'] = feat.attributes.DES_TIPOSUPERFICIE;
       pkMant['DESCRIPCION_ELEMENTO'] = feat.attributes.DESCRIPCION_ELEMENTO;
       pkMant['NOM_LOCALIDAD'] = feat.attributes.NOM_LOCALIDAD;
       pkMant['NOM_SECTOR'] = feat.attributes.NOM_SECTOR;
       pkMant['NOM_UPL'] = feat.attributes.NOM_UPL;
       pkMant['NOM_ZONA'] = feat.attributes.NOM_ZONA;
       pkMant['EJE_VIAL'] = feat.attributes.EJE_VIAL;
       pkMant['DESDE'] = feat.attributes.DESDE;
       pkMant['HASTA'] = feat.attributes.HASTA;
       pkMant['PK_ID'] = feat.attributes[label["id"]];
       pkMant['ANCHO'] = feat.attributes[label["ancho"]];
       pkMant['LONGITUD'] = feat.attributes[label["longitud"]];
       this.pkMantArray.push(pkMant);
     });
   }

   private get_query_array(where?:string,geom?:any):any[]{
     let query_array = [];
     query_array.push(this.query_features(this.elementos,where,geom));
     /*query_array.push(this.query_features(this.anden,where,geom));
     query_array.push(this.query_features(this.cicloruta,where,geom));
     query_array.push(this.query_features(this.calzada,where,geom));
     query_array.push(this.query_features(this.separador,where,geom));
     query_array.push(this.query_features(this.bahia,where,geom));
     query_array.push(this.query_features(this.puente,where,geom));*/
     query_array.push(this.query_features(this.gestion,where,geom));
     return query_array;
   }

   private get_field_label(index:number){
     let label = {};
     switch(index) {
      case 0-6:
        label = {id:"PK_ID_ELEMENTO",ancho:"ANCHO",longitud:"LONGITUDHORIZONTAL"};
        break;
      }
      return label;
   }

   private query_features(layer:any,where?:string,geom?:any):Promise<any>{
     let query = layer.createQuery();
     query.outSpatialReference = this.srWGS;
     if(where && where != ''){query.where = where;}
     if(geom){query.geometry = geom;}
     return layer.queryFeatures(query);
   }

   private get_features(featureSet:any){
     return featureSet.features.map(function (graphic: { symbol: any; }) {
       graphic.symbol = {
         type: "simple-fill",
         style: "none",
         outline: {
           color: "#6600FF",
           width: 2
         }
       };
       return graphic;
     });
   }
   public goTo(where?:string,geom?:any){
     let query = this.elementos.createQuery();
     query.outSpatialReference = this.srWGS;
     if(where && where != ''){query.where = where;}
     if(geom){query.geometry = geom;}
     let scope = this;
     this.elementos.queryExtent(query).then((r:any)=>{
             scope.mapView.goTo(r.extent);
        });
   }
   workPK(): void {
     const scope = this;
     let pkId = scope.mapView.popup.selectedFeature;
     console.log("vamossss ",pkId);
     console.log(this.gestionesArray);
     let gestionFilter:any, tipo:string;
     let data = {
       titulo: 'Agregar PK',
       cancelar: true
     } as any;
     const pkMant = {} as any;
     pkMant['CIV'] = pkId.attributes.CIV;
     pkMant['PK_ID'] = pkId.attributes.PK_ID_ELEMENTO;
     pkMant['ANCHO'] = pkId.attributes.ANCHO;
     pkMant['LONGITUD'] = pkId.attributes.LONGITUDHORIZONTAL;
     gestionFilter = this.gestionesArray.filter(function(gest){
       return gest.attributes.PK_ID_ELEMENTO == pkMant['PK_ID'];
     });
     console.log("en seguimiento: ", gestionFilter);
     if(gestionFilter.length>0){
       let estado = gestionFilter[0].attributes.DESCRIPCION_ESTADO_PK;
       if(estado.indexOf('Terminado') == -1){
         data['contenido'] = 'Este PK tiene una gestión en curso.';
         data['aceptar'] = false;
       } else {
         data['contenido'] = 'Este PK tiene una gestión finalizada: "'+estado+'".\n ¿Desea adicionar para nueva gestión?';
         data['aceptar'] = true;
       }
       if(scope.fullscreen.viewModel.state == "active")
         scope.fullscreen.viewModel.exit();
       const dialogRef = this.dialog.open(SimpleDialogComponent,{
         data: data
       });
       dialogRef.afterClosed().subscribe(result => {
        if (result.action=='cancelar')
         scope.tipoOrigenSeleccionado = 0;
        else if (result.action=='aceptar'){
         console.log('V.origen',scope.tipoOrigenSeleccionado);
         let promis = scope.get_query_array('PK_ID_ELEMENTO = '+pkMant['PK_ID'].toString());
         console.log(promis);
         promis[0].then((p:any)=>{
           this.pkMantArray = [];
           let gestionFeatures = this.get_features(p[p.length - 1]);
           let gestionArray: any[] = [];
           gestionFeatures.forEach((v:any)=>{
             gestionArray.push(v.attributes.PK_ID_ELEMENTO);
           });
           p.forEach((v:any,i:number,array:any[])=>{
             if( i < array.length - 1){
               let features = scope.get_features(v);
               let label:any = scope.get_field_label(i);
               let filteredFeatures = features.filter((p:any)=>!gestionArray.includes(p.attributes[label["id"]]));
               scope.pushPkMant(filteredFeatures,i);
               scope.mapView.graphics.addMany(filteredFeatures);
             }
           });
           console.log(this.pkMantArray);
           this.addMant.emit(this.pkMantArray);
       });

     } else {
       console.log("Hagale",pkMant);
       let promis = scope.get_query_array('PK_ID_ELEMENTO = '+pkMant['PK_ID'].toString());
       promis[0].then((p:any)=>{
         this.pkMantArray = [];
         let gestionFeatures = this.get_features(p[p.length - 1]);
         let gestionArray: any[] = [];
         gestionFeatures.forEach((v:any)=>{
           gestionArray.push(v.attributes.PK_ID_ELEMENTO);
         });
         p.forEach((v:any,i:number,array:any[])=>{
           if( i < array.length - 1){
             let features = scope.get_features(v);
             let label:any = scope.get_field_label(i);
             let filteredFeatures = features.filter((p:any)=>!gestionArray.includes(p.attributes[label["id"]]));
             scope.pushPkMant(filteredFeatures,i);
             scope.mapView.graphics.addMany(filteredFeatures);
           }
         });
         console.log(this.pkMantArray);
         this.addMant.emit(this.pkMantArray);
       });
     }
   });
 }
}
   public ngOnInit() {
     this.initializeMap();
   }
   async initializeMap() {
     try {
        const [esriConfig, EsriWebMap, EsriMapView, EsriFullScreen, EsriLocator, EsriSearch, EsriLayerList, EsriLegend, EsriExp, Compass, EsriHome, EsriFL, EsriGL, EsriGraphic, EsriTL, EsriBasemap, EsriBasemapGallery, EsriSR, EsriDraw, EsriDrawAction, EsriExtent, DojoAll] = await loadModules([
          'esri/config',
          'esri/WebMap',
          'esri/views/MapView',
          'esri/widgets/Fullscreen',
          'esri/tasks/Locator',
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
          'esri/widgets/BasemapGallery','esri/geometry/SpatialReference',
          'esri/views/draw/Draw',
          'esri/views/draw/DrawAction',
          "esri/geometry/Extent",
          "dojo/promise/all"
        ]);
        const apiK = 'AAPKf16af59b117247ba95e1e7af7ef9d279wlVIqcYyfAhzwhtsKYtoHKLRErlzOMqew9bUCfe1ODUIMBnlQgl3Ycq-iey7V7hf';
        esriConfig.apiKey = apiK;
         let map: esri.Map = new EsriWebMap({
           portalItem: { id: this._basemap }
         });

         this.srWGS = new EsriSR(3857);
         this.elementos =  new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos_Agrupados/MapServer/0',
           outFields: ['*'],
           visible: false
         });
         this.anden = new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/0',
           outFields: ['*'],
           visible: false
         });
         this.cicloruta = new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/1',
           outFields: ['*'],
           visible: false
         });
         this.calzada = new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/2',
           outFields: ['*'],
           visible: false
         });
         this.separador = new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/3',
           outFields: ['*'],
           visible: false
         });
         this.bahia = new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/4',
           outFields: ['*'],
           visible: false
         });
         this.puente = new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/5',
           outFields: ['*'],
           visible: false
         });

         this.gestion = new EsriFL({
           url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Gestion/MapServer/0',
           outFields: ['*'],
           visible: false
         });

         this.selectedFeaturesGL = new EsriGL({
           title: 'selected Features'
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
                url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/2',
                outFields: ["*"]
              }),
              searchFields: ["PK_ID_CALZADA", "CIV"],
              suggestionTemplate: "{PK_ID_CALZADA}",
              displayField: "PK_ID_CALZADA",
              exactMatch: false,
              name: "Calzadas",
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
          let gestionFL: any;
          scope.mapView.when((A: { map: { allLayers: any[]; }; }) => {
            const layers = A.map.allLayers;
            const promises = layers.map(function(layer:any){
              return layer.load();
            });
            return Promise.all(promises);
          })
          .then(function(layers) {
            gestionFL = layers.find(function(layer: { title: string; }) {
              return layer.title === "Elementos";
            });
            gestionFL.allSublayers.items.forEach (( item: any ) => {
               item.popupTemplate.actions = [{
                 title: "Vincular",
                 id: "work-row",
                 className: "esri-icon-play-circled"
               }];
             });
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
            scope.gestionesArray = [];
         });

         let thisMV = WebMapaUmvComponent.self;
         // create DOM object
         //let recenterBtn = domConstruct.toDom("<div class='map-button esri-component esri-locate esri-widget--button esri-widget' role='button' title='Recenter'><span aria-hidden='true' role='presentation' class='esri-icon esri-icon-cursor-marquee'></span></div>");
         let createGraphic = function (event:any) {
         const vertices = event.vertices;
         thisMV.mapView.graphics.removeAll();
         let xmn = 0, xmx = 0;
         if (vertices[0][0] > vertices[1][0]) {
           xmn = vertices[1][0];
           xmx = vertices[0][0];
         } else {
           xmx = vertices[1][0];
           xmn = vertices[0][0];
         }
         const graphic = new EsriGraphic({
           geometry: new EsriExtent({
                 xmin: xmn,
                 xmax: xmx,
                 ymin: vertices[1][1],
                 ymax: vertices[0][1],
                 spatialReference: thisMV.mapView.spatialReference
               })
           ,
           symbol: {
           type: "simple-fill", // autocasts as new SimpleFillSymbol()
           color: [227, 139, 79, 0.8],
           outline: { // autocasts as new SimpleLineSymbol()
             color: [255, 255, 255],
             width: 1
           }
         }
         });
         thisMV.mapView.graphics.add(graphic);
       }

       let updateVertices = function (event:any) {
         // create a polyline from returned vertices
           if (event.vertices.length > 1) {
                 createGraphic(event);
           }
       }

         let draw = new EsriDraw({
                                  view: this.mapView
                                });

         this.mapView.on("hold",(event:any)=>{
           this.selectedFeaturesGL.removeAll();
           this.mapView.graphics.removeAll();
           console.log('Se ha activado el evento hold, debo activar para dibujar',event);
           let action = draw.create("rectangle");
           this.mapView.focus();
           //this.mapView.dispa
           action.on(
      [
        "vertex-add",
        "vertex-remove",
        "cursor-update",
        "redo",
        "undo"
      ],
      updateVertices
    );
         action.on("draw-complete",(e:any)=>{
           const vertices = e.vertices;
           this.mapView.graphics.removeAll();
           if(!vertices[0] || !vertices[1]){return;}
           let xmn = 0, xmx = 0;
           if (vertices[0][0] > vertices[1][0]) {
             xmn = vertices[1][0];
             xmx = vertices[0][0];
           } else {
             xmx = vertices[1][0];
             xmn = vertices[0][0];
           }
           console.log('xM: ', xmx);
           console.log('xm: ', xmn);
           let g = new EsriExtent({
                 xmin: xmn,
                 xmax: xmx,
                 ymin: vertices[1][1],
                 ymax: vertices[0][1],
                 spatialReference: this.mapView.spatialReference
               });
               let promises = DojoAll(this.get_query_array('',g));
               promises.then((p:any)=>{
                 this.pkMantArray = [];
                 let gestionFeatures = this.get_features(p[p.length - 1]);
                 let gestionArray: any[] = [];
                 gestionFeatures.forEach((v:any)=>{
                   gestionArray.push(v.attributes.PK_ID_ELEMENTO);
                 });
                 p.forEach((v:any,i:number,array:any[])=>{
                   if( i < array.length - 1){
                     let features = this.get_features(v);
                     let label:any = thisMV.get_field_label(i);
                     let filteredFeatures = features.filter((p:any)=>!gestionArray.includes(p.attributes[label["id"]]));
                     this.pushPkMant(filteredFeatures,i);
                     this.mapView.graphics.addMany(filteredFeatures);
                   }
                 });
                 console.log(this.pkMantArray);
                 this.addMant.emit(this.pkMantArray);
               });
               /*
               this.query_features(thisMV.anden,'',g).then((d:any)=>{
             console.log(d);
             let features = this.get_features(d);
             console.log(features);
             let arry:any[] = []
             features.forEach((v:any)=>{
               arry.push(v.attributes.PK_ID_ANDEN);
             });
             console.log(arry);
             //this.pkSelected.emit(arry);
             this.selectedFeaturesGL.addMany(features);
             this.mapView.graphics.addMany(features);
           });*/
         });
         });

         //this.mapView.map.add(this.selectedFeaturesGL);

         //final de la inicialización del mapa
     } catch (error) {
       console.log('We have an error: ' + error);
     }
   }
}
