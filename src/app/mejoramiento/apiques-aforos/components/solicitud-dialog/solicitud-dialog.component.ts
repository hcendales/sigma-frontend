import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitud-dialog',
  templateUrl: './solicitud-dialog.component.html',
  styleUrls: ['./solicitud-dialog.component.scss']
})
export class SolicitudDialogComponent implements OnInit {
  prioridad:number = 10;
  constructor() { }

  ngOnInit(): void {
  }

}
