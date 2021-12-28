import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapaUmvComponent } from 'src/app/shared/components/mapa-umv/mapa-umv.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() pk_id_calzada: number = 0;
  @ViewChild('mapa') mapElement!: MapaUmvComponent;
  mapCenter = [-74.113, 4.667];
  mapZoomLevel = 12;
  basemapType = 'gray';
  inArr: Array<any> = [];
  searchkey = '';

  
  

  constructor() { }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.pk_id_calzada > 0){
        console.log(this.pk_id_calzada);
        //this.mapElement.PksFL.load();
        //this.mapElement.queryFeatures('PK_ID_ELEMENTO in (' + this.pk_id_calzada + ")");
        //this.mapElement.queryFeatures('PK_ID_ELEMENTO in (' + this.pk_id_calzada.toString() + ")");
      }
    }, 500);
    
  }
}
