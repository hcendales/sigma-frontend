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
  selector: 'app-seg-mapa-umv',
  templateUrl: './seg-mapa-umv.component.html',
  styleUrls: ['./seg-mapa-umv.component.scss']
})
export class SegMapaUmvComponent implements OnInit {
  private _zoom = 11;
  private _center = [-74.113, 4.667];
  private _basemap = 'dbbefea4ad994ff8ac4a96f984410f0c';
  //private _basemap = '826eb0abceec4c30b4b26a2f722c13e0';

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
  gestionFL: any;
  selectedFeaturesGL:any = [];
  srWGS: any;
  /**
  * @static
  */
  static self: SegMapaUmvComponent;
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
  @Output() pkSelected = new EventEmitter<any>();

  @ViewChild('mapViewNode')
  private mapViewEl!: ElementRef;

  constructor(private http: HttpClient,
              public router: Router,
              public entityMantenimientoService: EntityTabMantenimientoVialService,
              public tokenService: SecurityService,
              @Inject(LOCALE_ID)
               private locale: string,
              public dialog: MatDialog) {
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
   workPK(): void {
     const scope = this;
     let pkId = scope.mapView.popup.selectedFeature;
     let data = {
       titulo: 'Vincular Pks a peticionario',
       cancelar: true
     } as any;
     const pkMant = {} as any;
     pkMant['ID_MANTENIMIENTO_VIAL'] = pkId.attributes.ID_MANTENIMIENTO_VIAL;
     pkMant['FECHA_VISITA_TECNICA'] = pkId.attributes.FECHA_VISITA_TECNICA;
     pkMant['SEGUIMIENTOS'] = pkId.attributes.SEGUIMIENTOS;
     pkMant['ULTIMA_FECHA_SEGUIMIENTO'] = pkId.attributes.ULTIMA_FECHA_SEGUIMIENTO;
     pkMant['DIAS_ULTIMA_VISITA'] = pkId.attributes.DIAS_ULTIMA_VISITA;
       pkMant['PK_ID_ELEMENTO'] = pkId.attributes.PK_ID_ELEMENTO;

     console.log("Hagale");
     this.addMant.emit(pkMant);
   }

   public ngOnInit() {
     this.initializeMap();
   }
   async initializeMap() {
     try {
       const [esriConfig, EsriWebMap, EsriMapView, EsriFullScreen, EsriLocator, EsriSearch, EsriLayerList, EsriLegend, EsriExp, Compass, EsriHome, EsriFL, EsriGL, EsriGraphic, EsriTL, EsriBasemap, EsriBasemapGallery] = await loadModules([
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
         'esri/widgets/BasemapGallery'
       ]);
        const apiK = 'AAPKf16af59b117247ba95e1e7af7ef9d279wlVIqcYyfAhzwhtsKYtoHKLRErlzOMqew9bUCfe1ODUIMBnlQgl3Ycq-iey7V7hf';
        esriConfig.apiKey = apiK;
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
          //this.srWGS = new EsriSR(3857);
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

          scope.mapView.when((A: { map: { allLayers: any[]; }; }) => {
            const layers = A.map.allLayers;
            const promises = layers.map(function(layer:any){
              return layer.load();
            });
            return Promise.all(promises);
          })
          .then(function(layers) {
            scope.gestionFL = layers.find(function(layer: { title: string; }) {
              return layer.title === "Seguimientos Proximos";
            });
            scope.gestionFL.popupTemplate.actions = [{
                 title: "Vincular",
                 id: "work-row",
                 className: "esri-icon-play-circled"
             }];
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
     } catch (error) {
       console.log('We have an error: ' + error);
     }
   }
}
