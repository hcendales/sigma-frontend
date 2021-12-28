import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { rowsAnimation } from '../../animations/template.animations';
import { AforoDato }  from '../../models/AforoDato';
import { SecurityService } from '../../../../core/security/services/security.service';

@Component({
  selector: 'app-registro-datos-aforo',
  templateUrl: './registro-datos-aforo.component.html',
  styleUrls: ['./registro-datos-aforo.component.scss'],
  animations: [rowsAnimation],
})
export class RegistroDatosAforoComponent implements OnInit, AfterViewInit {

  @ViewChild('paginatorRegistros') paginator: any;

  public dataSourceRegistroAforos:MatTableDataSource<AforoDato>;
  public displayedColumnsRegistroAforos = ['hora', 'automoviles', 'busesBuseta','busesSitpAlimentadores', 'busesVan', 'camionesC2g', 'camionesC2p', 'camionesC3C4', 'camionesC5C5','controles_aforo_manual'];

  public ModoEdicion:boolean = true;

  @Input() 
  set datosAforo(data:any[]){
      console.log('ORDENA AFORODATO')
      data.sort(function (a, b) {
          let ahms = a.fechaHora.split(':');
          let bhms = b.fechaHora.split(':');
          let secondsa = (+ahms[0]) * 60 * 60 + (+ahms[1]) * 60; //+ (+ahms[2]); 
          let secondsb = (+bhms[0]) * 60 * 60 + (+bhms[1]) * 60; //+ (+bhms[2]); 
          if (secondsa > secondsb) {
              return 1;
          }
          if (secondsb > secondsa) {
              return -1;
          }
          return 0;
      });
      if(data.length == 0 && this.ModoEdicion == true){
        let aforodato:AforoDato = {
          idAforoDato: null,
          idAforo:null,
          fechaHora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
          automoviles: 0,
          busesVan: 0,
          busesBuseta: 0,
          busesSitpAlimentadores: 0,
          camionesC2p: 0,
          camionesC2g: 0,
          camionesC3C4: 0,
          camionesC5C5: 0,
          tpdParcial: 0,
          //auditoriausuario: '',
          //auditoriaFecha: new Date(),
        }
        data.push(aforodato);
      }
      this.dataSourceRegistroAforos.data = data;
  };
  
  constructor(private securityService:SecurityService) { 
    this.dataSourceRegistroAforos = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    //this.dataSourceRegistroAforos.paginator = (this.paginator as MatPaginator);
  }
  ngAfterViewInit() {
    this.dataSourceRegistroAforos.paginator = (this.paginator as MatPaginator);
  }

  agregarRegistro(index:number){
    let nuevoReg:AforoDato = {
      idAforoDato: null,
      idAforo:null,
      fechaHora: new Date(new Date("1970/01/01 " + this.dataSourceRegistroAforos.data[index].fechaHora).getTime() + (15 * 60000)).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
      automoviles: 0,
      busesVan: 0,
      busesBuseta: 0,
      busesSitpAlimentadores: 0,
      camionesC2p: 0,
      camionesC2g: 0,
      camionesC3C4: 0,
      camionesC5C5: 0,
      tpdParcial: 0,
     // auditoriausuario: this.securityService.userSession.login,
      //auditoriaFecha: new Date(),
    }
        
    if(this.dataSourceRegistroAforos.data.length > 0){
        nuevoReg.fechaHora = new Date(new Date("1970/01/01 " + this.dataSourceRegistroAforos.data[index].fechaHora).getTime() + (15 * 60000)).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    
    this.dataSourceRegistroAforos.data.splice(index+1, 0, nuevoReg );


    if(this.dataSourceRegistroAforos.data.length > this.paginator.pageSize){
        let newPagesizeIndex = this.paginator.pageSizeOptions.indexOf(this.paginator.pageSize)+1; 
        if(newPagesizeIndex < this.paginator.pageSizeOptions.length-1){               
            this.paginator.pageSize = this.paginator.pageSizeOptions[newPagesizeIndex];
            this.paginator._changePageSize(this.paginator.pageSizeOptions[newPagesizeIndex]);
        }
    }

    this.dataSourceRegistroAforos.data = [...this.dataSourceRegistroAforos.data];
  }

  quitarRegistro(index:number){
    this.dataSourceRegistroAforos.data.splice(index,1);
    this.dataSourceRegistroAforos.data = this.dataSourceRegistroAforos.data;
  }

  public getDatos(){
    return this.dataSourceRegistroAforos.data;
  }

}


