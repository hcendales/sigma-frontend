import { loadModules } from 'esri-loader';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

import { PopupTemplate } from './map-settings';

@Component({
  selector: 'app-mapa-umv',
  templateUrl: './mapa-umv.component.html',
  styleUrls: ['./mapa-umv.component.scss']
})
export class MapaUmvComponent implements OnInit {

  private _zoom = 10;
  private _center = [4, -74];
  private _basemap = 'streets'; // environment.webMapAllPKsId;
  flagPKFeat: boolean = false;
  notFoundPK: number = 0;
  PksFL!: any;
  ResultsGL: any;
  selectedFeaturesGL:any = []
  selFeatures:any = []
  homeView: any;
  fullSc: any;
  srWGS: any;//esri.SpatialReference | undefined;
  mapView!: any;//esri.MapView;
  search: any;

  /**
  * @static
  */
  static self: MapaUmvComponent;


  //@HostListener('document:webkitfullscreenchange', ['$event'])
  //@HostListener('document:mozfullscreenchange', ['$event'])
  //@HostListener('document:MSFullscreenChange', ['$event'])
  @HostListener('document:fullscreenchange', ['$event']) onFS(event: Event) {
    if (this.fullSc.viewModel.state == "active")
      this.fullSc.viewModel.exit();
  }
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

  @Input()
  parent: any;

  @Output() mapLoaded = new EventEmitter<boolean>();

  @Output() pkSelected = new EventEmitter<any>();
  @Output() pkRemoved = new EventEmitter<number>();

  @Output() pkClicked = new EventEmitter<any>();

  @Output() ready = new EventEmitter();

  @Output() filterPK = new EventEmitter();
  @Output() clearFilters = new EventEmitter();
  @ViewChild('mapViewNode')
  private mapViewEl!: ElementRef;

  constructor() {
    MapaUmvComponent.self = this;
  }

  public queryFeatures(list: string): void {
    let rs;
    let scope = this;
    //console.log('PKs: ' + list);
    this.PksFL.definitionExpression = list;
    this.PksFL.visible = true;
    this.PksFL.popupTemplate = PopupTemplate.template;
    this.goTo(list);


    /*
    this.queryPKs(list)
      .then(
        ( results: any) => {
          rs = results;
          // console.log('Results: ' + JSON.stringify(rs));
          this.ResultsGL.removeAll();
          let color;
          var features = rs.features.map(function (graphic: { symbol: { type: string; width: number; color: string; }; popupTemplate: { title: string; content: { type: string; fieldInfos: { fieldName: string; label: string; visible: boolean; }[]; }[]; actions: { title: string; id: string; className: string; }[]; }; }) {
            /  if(graphic.getAttribute('DESCRIPCION_ORIGEN') == 'PETICIONARIO')
              color = 'green';
            else if(graphic.getAttribute('DESCRIPCION_ORIGEN') == 'SEGUIMIENTO')
                color = 'yellow';
            else if(graphic.getAttribute('DESCRIPCION_ORIGEN') == 'MISIONAL')
                color = 'red';
            else if(graphic.getAttribute('DESCRIPCION_ORIGEN') == 'OTRO')
                color = 'gray';
            else{
              color = 'white';
            }* /
            color = 'white';
            graphic.symbol = {
              type: "simple-fill",
              width: 2.5,
              color: color
            };
            graphic.popupTemplate = {
              title: "Calzada PK: {PK_ID_ELEMENTO} (Asignación)",
              content: [{
                type: "fields",
                fieldInfos: [{
                  fieldName: "CIV",
                  label: "C.I.V",
                  visible: true
                }, {
                  fieldName: "TIPOMALLA",
                  label: "Tipo malla",
                  visible: true
                }, {
                  fieldName: "DESCRIPCION_ORIGEN",
                  label: "Origen",
                  visible: true
                }]
              }],
              actions: [{
                title: "Ver Registro",
                id: "show-row",
                className: "esri-icon-filter"
              }]
            };
            // TODO: Verificar desde donde se accede el mapa
            /*if (getActividadActual()) {
              if (scope.userControllerService.getActividadActual().idActividad <= 9 && scope.userControllerService.getActividadActual().idActividad >= 11) {
                graphic.popupTemplate.actions.push({
                  title: "Eliminar Registro",
                  id: "remove-pk",
                  className: "esri-icon-close-circled"
                });
              }
            }* /
            return graphic;
          });
         // console.log('Don Mapa: ' + features);
          this.ResultsGL.addMany(features);
          let extent = features[0].geometry.extent.clone();
          let extents = "";
          let i: number;

          for (i = 0; i < features.length; i++) {
            extent = extent.union(features[i].geometry.extent);
          }

          //this.mapView.goTo(features[0].geometry.extent);
          this.mapView.goTo(extent);
          //console.log(extents);
          /*this.mapView.popup.open({
            features: features,
            updateLocationEnabled: true
          });* /
        }
      );*/
  }
  clearFeatures(): void {
    this.ResultsGL.removeAll();
    this.homeView.go();
    this.search.clear();
  }
  cerrarModalEvt() {
    this.flagPKFeat = false;
  }

  public getFeatExtent(pkId: number): string {
    let feat = null;
    const feats = this.ResultsGL.graphics;
    let i: number;
    for (i = 0; i < feats.length; i++) {
      if (feats.items[i].attributes.PK_ID_ELEMENTO === pkId) {
        feat = feats.items[i];
      }
    }
    let ext: any;
    if (feat) {
      ext = feat.geometry.extent.clone().expand(1.7);
      ext = "export?bbox=" + ext.xmin.toString() + "," + ext.ymin.toString() + "," + ext.xmax.toString() + "," + ext.ymax.toString() + "&bboxSR=" + ext.spatialReference.wkid.toString() + "&size=560,300&format=jpg&f=image";
    } else {
      ext = "export?bbox=-8281812.2,496938.2,-8219704.1,539396.1&bboxSR=102100&size=560,300&format=jpg&f=image";
    }
    return encodeURI(ext);
  }
  public gotoFeat(pkId: number): void {
    let feat = null;
    const feats = this.PksFL.source;
    console.log('feat: ', feats);
    let i: number;
    console.log("Feats:" + feats.length + " - Sel:" + pkId); //+ " - Object:" feats.items[0]);
    for (i = 0; i < feats.length; i++) {
      if (feats.items[i].attributes.PK_ID_ELEMENTO === pkId) {
        feat = feats.items[i];
      }
    }

    if (feat) {
      this.mapView.goTo(feat.geometry.extent.expand(7));
      this.mapView.popup.close();
      this.mapView.popup.open({
        features: [feat],
        updateLocationEnabled: true
      });
    } else {
      this.flagPKFeat = true;
      this.notFoundPK = pkId;
    }

  }
  /*
  private queryPKs(list: string) {
    let query = this.PksFL.createQuery();
    query.outSpatialReference = this.srWGS;
    query.where = list;

    const results = this.PksFL.queryFeatures(query);
    // alert(results);
    return results;
  }*/
  private query_features(where?:string,geom?:any):Promise<any>{
    let query = this.PksFL.createQuery();
    query.outSpatialReference = this.srWGS;
    if(where && where != ''){query.where = where;}
    if(geom){query.geometry = geom;}

    return this.PksFL.queryFeatures(query);
  }

  public goTo(where?:string,geom?:any){
    let query = this.PksFL.createQuery();
    query.outSpatialReference = this.srWGS;
    if(where && where != ''){query.where = where;}
    if(geom){query.geometry = geom;}
    let scope = this;
    this.PksFL.queryExtent(query).then((r:any)=>{
            scope.mapView.goTo(r.extent);
       });
  }

  private get_features(featureSet:any){
    return featureSet.features.map(function (graphic: { symbol: { type: string; width: number; color: string;}; }) {

      let color = 'yellow';
      graphic.symbol = {
        type: "simple-fill",
        width: 2.5,
        color: color
      };
      return graphic;
    });
  }

  public selectFeatures(whereClause:string,g?:any){
    let thisMV = MapaUmvComponent.self;
    MapaUmvComponent.self.query_features(whereClause,g).then((d:any)=>{
      thisMV.selectedFeaturesGL.removeAll();
      thisMV.selectedFeaturesGL.addMany(thisMV.get_features(d));
      let arry:any[] = []
      thisMV.get_features(d).forEach((v:any)=>{
        arry.push(v.attributes.PK_ID_ELEMENTO);
      });
      thisMV.pkSelected.emit(arry);
    });
  }

  private showRowPk(): void {
    let pkId = this.mapView.popup.selectedFeature;
    console.log('FiltroPK:',pkId.attributes.PK_ID_ELEMENTO);
    this.filterPK.emit(pkId.attributes.PK_ID_ELEMENTO);
    //this.parent.search2?.setValue(pkId.__accessor__.store._values.attributes.PK_ID_ELEMENTO);
    this.parent.search2?.setValue(pkId.attributes.PK_ID_ELEMENTO);
  }
  private removePk(): void {
    let pkId = this.mapView.popup.selectedFeature;
    this.pkRemoved.emit(pkId.attributes.PK_ID_ELEMENTO);
  }
  public filterPKs(): void {
    let resultFeat = this.mapView.popup.selectedFeature.geometry;
    //let transformation = this.projectionEng.getTransformation(resultExtent.spatialReference, this.srWGS, resultExtent.extent);
    //resultExtent = this.projectionEng.project(resultExtent, this.srWGS, this.transformation)[0];
    const feats = this.ResultsGL.graphics;
    let arrFeats = new Array();
    let extent: any;//esri.Extent = new esri.Extent();
    let i: number;
    let firstExt: boolean = true;
    for (i = 0; i < feats.length; i++) {
      if (resultFeat.extent.intersects(feats.items[i].geometry)) {
        if (firstExt) {
          extent = feats.items[i].geometry.extent;
          firstExt = false;
        }
        arrFeats.push(feats.items[i]);
        extent = extent.union(feats.items[i].geometry.extent)
      }
    }
    if (arrFeats.length > 0) {
      this.mapView.goTo(extent);
      this.mapView.popup.close();
      this.mapView.popup.open({
        features: arrFeats,
        updateLocationEnabled: true
      });
    } else {
      this.mapView.popup.content = "No hay PKs asignados en esta ubicación.";
    }
  }
  public ngOnInit() {
    //this.geoData.emit('Vamos bien');
    loadModules([
      'esri/Map',
      'esri/Basemap',
      'esri/views/MapView',
      'esri/widgets/Fullscreen',
      'esri/widgets/Search',
      'esri/widgets/Home',
      'esri/widgets/Compass',
      'esri/widgets/Locate',
      'esri/widgets/Legend',
      'esri/widgets/Directions',
      'esri/layers/TileLayer',
      'esri/layers/FeatureLayer',
      'esri/layers/GraphicsLayer',
      'esri/geometry/SpatialReference',
      'esri/widgets/Expand',
      'esri/widgets/BasemapGallery',
      'esri/core/watchUtils',
      'esri/views/draw/Draw',
      'esri/views/draw/DrawAction',
      "esri/Graphic",
      "esri/geometry/Extent",
      'esri/tasks/Locator'
    ]).then(
      ([EsriMap,
        EsriBasemap, EsriMapView, EsriFullScreen,
        EsriSearch, EsriHome, Compass, EsriLocate,
        EsriLegend, EsriDirections, EsriTL, EsriFL,
        EsriGL, EsriSR, EsriExp, EsriBasemapGallery,
        watchUtils, EsriDraw, EsriDrawAction, EsriGraphic,
        EsriExtent,EsriLocator
      ]) => {
        const idecaBasemap = new EsriBasemap({
          baseLayers: [new EsriTL({ url: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer' })],
          title: "Mapa base IDECA",
          id: "ideca"
        });
        const apiK = 'AAPKf16af59b117247ba95e1e7af7ef9d279wlVIqcYyfAhzwhtsKYtoHKLRErlzOMqew9bUCfe1ODUIMBnlQgl3Ycq-iey7V7hf';
        const mapProperties = {
          basemap: this._basemap//idecaBasemap
        };
        let map = new EsriMap(mapProperties);
        this.PksFL = new EsriFL({
          url: 'https://gis.umv.gov.co/server/rest/services/UMV/Geo_Elementos/MapServer/0',
          outFields: ['*'],
          //spatialReference: new EsriSR(3857),
          visible: false
        });

        //console.log(this.PksFL);
        this.PksFL.maxScale = 0;
        this.PksFL.minScale = 0;

        //this.ready.emit();

        this.ResultsGL = new EsriGL({
          title: 'PKs Asignados'
        });
        this.selectedFeaturesGL = new EsriGL({
          title: 'selected Features'
        })
        map.addMany([/*this.ResultsGL*/this.PksFL,this.selectedFeaturesGL]);
        this.srWGS = new EsriSR(3857);
        const mapViewProperties = {
          container: this.mapViewEl.nativeElement,
          center: this._center,
          zoom: this._zoom,
          //spatialReference: this.srWGS,
          map: map
        };
        this.mapView = new EsriMapView(mapViewProperties);
        this.fullSc = new EsriFullScreen({
          view: this.mapView
        });
        let filterActions = [{
          title: "PKs Asignados",
          id: "filter-pks",
          className: "esri-icon-filter"
        }];
        this.search = new EsriSearch({
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
          }, /*{
            layer: new EsriFL({
              url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos/MapServer/2',
              outFields: ["*"]
            }),
            searchFields: ["PK_ID_CALZADA"],
            suggestionTemplate: "{PK_ID_CALZADA}",
            displayField: "PK_ID_CALZADA",
            exactMatch: false,
            name: "Calzadas",
            placeholder: "Buscar PK",
            ---
            layer: new EsriFL({
            url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Elementos_Agrupados/MapServer/0',
            outFields: ["*"]
          }),
          },*/
          {
            layer: this.PksFL,
            searchFields: ["PK_ID_ELEMENTO"],
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
        this.homeView = new EsriHome({
          view: this.mapView
        });
        let compass = new Compass({
          view: this.mapView
        });
        let locate = new EsriLocate({
          view: this.mapView
        });
        /*const directionsWidget = new EsriDirections({
          view: this.mapView,
          apiKey: apiK,
          routeServiceUrl: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
        });*/
        this.mapView.ui.add(this.homeView, 'top-left');
        this.mapView.ui.add(this.fullSc, 'bottom-left');
        //this.mapView.ui.add(directionsWidget, 'bottom-right');
        this.mapView.ui.add(this.search, 'top-right');
        this.mapView.ui.add(compass, "top-left");
        this.mapView.ui.add(locate, 'top-left');
        let bmGallery = new EsriBasemapGallery({
          view: this.mapView
        });
        let basemapGallery = new EsriExp({
         content: bmGallery,
         view: this.mapView,
         expandIconClass: "esri-icon-basemap",
         expanded: false
       });
       this.mapView.ui.add(basemapGallery, "top-right");
       let scope = this;
       this.mapView.popup.on("trigger-action", (event: { action: { id: string; }; }) => {
          if (event.action.id === "show-row") {
            scope.showRowPk();
          } else if (event.action.id === "filter-pks") {
            console.log('acá si?')
            scope.filterPKs();
          } else if (event.action.id === "remove-pk") {
            scope.removePk();
          }
        });
        watchUtils.whenTrue(this.mapView.popup,'visible', function(){
            watchUtils.whenFalseOnce(scope.mapView.popup,'visible', function(){
               //scope.parent.search2?.setValue('');
               scope.clearFilters.emit(true);
             })
        });
        const thisMV = this;
        this.search.on("search-clear", function(event: any){
          console.log("Search input textbox was cleared.");
        });
        this.search.on("search-complete", function(event: any){
          // The results are stored in the event Object[]
          console.log('se',event);
          if(event['results'][0]['results'][0].feature.attributes.PK_ID_ELEMENTO){
              console.log("Yendo",event['results'][0]['results'][0].feature.attributes);
              //scope.parent.formBusqueda?.get('PK_ID_ELEMENTO')?.setValue(event['results'][0]['results'][0].feature.__accessor__.store._values.attributes.PK_ID_ELEMENTO);
              scope.gotoFeat(Number(event['results'][0]['results'][0].feature.attributes.PK_ID_ELEMENTO));
              scope.ready.emit();
          }else if(event['results'][0]['results'][0].feature.attributes.LOCNOMBRE){
            scope.parent.formBusqueda?.get('id_localidad')?.setValue(event['results'][0]['results'][0].feature.__accessor__.store._values.attributes.LOCCODIGO);
          }/*else if(event['results'][0]['results'][0].feature.__accessor__.store._values.attributes.SCANOMBRE){
            scope.parent.formBusqueda?.get('id_barrio')?.setValue(event['results'][0]['results'][0].feature.__accessor__.store._values.attributes.SCANOMBRE);
          }*/
          //SCANOMBRE
        });
        this.mapView.when(() => {

          // All the resources in the MapView and the map have loaded. Now execute additional processes

          if(!idecaBasemap.loaded){
            console.log('No cargó el basemap del ideca');
            //console.log('Error basemapa :' + idecaBasemap.loadError.message);
          }

          let draw = new EsriDraw({
                                   view: this.mapView
                                 });

          let updateVertices = function (event:any) {
            // create a polyline from returned vertices
              if (event.vertices.length > 1) {
                    createGraphic(event);
              }
          }

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
      // a graphic representing the polyline that is being drawn
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
          thisMV.mapView.on("key-down",(event:any)=>{
            if(event.key=="Delete"){
              thisMV.selectedFeaturesGL.removeAll();
              thisMV.pkSelected.emit([]);
            }
          });
          thisMV.mapView.on("hold",(event:any)=>{
            thisMV.selFeatures = [];
            for(let i=0;i<thisMV.selectedFeaturesGL.graphics.length;i++){
              thisMV.selectedFeaturesGL.graphics._items[i].__accessor__.store._values.forEach(
                (obj:any)=>{
                  if(obj?.hasOwnProperty('PK_ID_ELEMENTO'))
                    thisMV.selFeatures.push(obj.PK_ID_ELEMENTO);
              });

            }
            console.log('Se ha activado el evento hold, debo activar para dibujar',event);
            let action = draw.create("rectangle");
            thisMV.mapView.focus();
            thisMV.mapView.dispa
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
            thisMV.mapView.graphics.removeAll();
            if(!vertices[0] || !vertices[1]){return;}
            let xmn = 0, xmx = 0;
            if (vertices[0][0] > vertices[1][0]) {
              xmn = vertices[1][0];
              xmx = vertices[0][0];
            } else {
              xmx = vertices[1][0];
              xmn = vertices[0][0];
            }
            let g = new EsriExtent({
                  xmin: xmn,
                  xmax: xmx,
                  ymin: vertices[1][1],
                  ymax: vertices[0][1],
                  spatialReference: thisMV.mapView.spatialReference
                });
            thisMV.query_features('',g).then((d:any)=>{
              let features = thisMV.get_features(d);
              console.log('selected: ',thisMV.selFeatures);
              features.forEach((v:any, index:number)=>{
                let feature = thisMV.selFeatures.filter((gr:any, ix:number)=>{
                  return gr == v.attributes.PK_ID_ELEMENTO;
                });
                if(feature.length>0){
                  thisMV.selFeatures.splice(thisMV.selFeatures.indexOf(feature[0]),1);
                } else {
                        this.selFeatures.push(v.attributes.PK_ID_ELEMENTO);
                }
              });
              //console.log(arry);
              //thisMV.pkSelected.emit(arry);
              //thisMV.selectedFeaturesGL.addMany(features);
              this.selectFeatures( 'PK_ID_ELEMENTO in (' + this.selFeatures.toString() + ')');
            });
          });


          });

          thisMV.mapView.on("click", (event:any) => {
              console.log(event,event.native.ctrlKey);
              if(event.native.ctrlKey){
                console.log('Debe salir');return;
                //this.selectedFeatureList.push();
              }
              console.log('pero no salio');
              let screenPoint = {
                x: event.x,
                y: event.y
              };

              //*****************************************
              //*****  ESTO QUE HACE? PROBAR
              //*****************************************
              thisMV.mapView.hitTest(screenPoint).then((response: { results: any[]; }) => {

                if (response.results.length) {
                  //console.log('****REEEES', );
                  thisMV.pkClicked.emit(response.results[0].graphic.attributes);
                }
                /*
                  if (response.results.length) {
                    var graphic = response.results.filter(function(result) {
                      // check if the graphic belongs to the layer of interest
                      return result.graphic.layer === thisMV.ResultsGL;
                    })[0].graphic;
                    console.log("Pk Click: ",graphic.attributes["PK_ID_ELEMENTO"]);
                    thisMV.pkClicked.emit(graphic);
                  }
                  */
                });
            });
          this.mapLoaded.emit(true);
        });
      })
      .catch(err => {
        console.error(err);
      });

  } // ngOnInit


}
