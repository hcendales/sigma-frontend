import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-detalle-documentos',
  templateUrl: './detalle-documentos.component.html',
  styleUrls: ['./detalle-documentos.component.scss']
})
export class DetalleDocumentosComponent implements OnInit {


  actualizarArchivo : {} = {};
  notificador : boolean = false;

  constructor() { }

  ngOnInit(): void {}

  filaTabla(row:any){
    this.actualizarArchivo = row;
  }
  reCargar(even:boolean){
    this.notificador = even;
  }

}
