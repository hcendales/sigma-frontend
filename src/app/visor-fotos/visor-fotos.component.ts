import { Component, OnInit } from '@angular/core';
import { EntityTabArchivoServiceService } from '../core/services/entity-tab-archivo-service.service';

@Component({
  selector: 'app-visor-fotos',
  templateUrl: './visor-fotos.component.html',
  styleUrls: ['./visor-fotos.component.scss']
})
export class VisorFotosComponent implements OnInit {

  constructor(private entityTabArchivoServiceService:EntityTabArchivoServiceService) { }

  ngOnInit(): void {
  }

}
