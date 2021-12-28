import { Component, OnInit, ViewChild } from '@angular/core';

import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { ProgramacionService } from '../../../core/services/programacion.service';
import { AsignarRecursoComponent } from '../asignar-recurso/asignar-recurso.component';

import * as utilidades from '../utilidades';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { VerGrupoComponent } from '../ver-grupo/ver-grupo.component';

@Component({
  selector: 'app-agenda-visitas',
  templateUrl: './agenda-visitas.component.html',
  styleUrls: ['./agenda-visitas.component.scss']
})
export class AgendaVisitasComponent implements OnInit {

  tiles:any;
  tiles2:any;

  minDate!: Date;
  maxDate!: Date;

  responsableLista : any[] = [];
  responsableDetailLista : any[] = [];
  currentResponsable : any;
  theDate:any;
  currentDate:any;
  toDeleteItem:any;


  weekday : number = 0;
  mondayDate:any;
  thuesdayDate:any;
  wednesdayDate:any;
  thursdayDate:any;
  fridayDate:any;
  saturdayDate:any;

  searchTerm = '';
  idActividad:any;
  filteredResponsables : any[] = [];
  arrActividades: any[] = [];

  constructor(private programacionService:ProgramacionService, public dialog: MatDialog, private snackBar:MatSnackBar) {

    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.currentDate = new Date();
    this.idActividad = 0;
    this.arrActividades = [
      {id:3, text:'Registrar visita de diagnóstico'},
      {id:1500, text:'Registrar visita de diseño'},
      {id:13, text:'Registrar visita de pre-diseño'}
    ];
    this.tiles = [
    /*{text: 'Profesional', cols: 1, rows: 1, color: 'deepskyblue'},
    {text: 'Lunes', cols: 1, rows: 1, color: 'deepskyblue'},
    {text: 'Martes', cols: 1, rows: 1, color: 'deepskyblue'},
    {text: 'Miercoles', cols: 1, rows: 1, color: 'deepskyblue'},
    {text: 'Jueves', cols: 1, rows: 1, color: 'deepskyblue'},
    {text: 'Viernes', cols: 1, rows: 1, color: 'deepskyblue'},
    {text: 'Sábado', cols: 1, rows: 1, color: 'deepskyblue'}*/
  ];
  this.tiles2 = [
  {text: 'Profesional', cols: 1, rows: 1, color: 'deepskyblue'},
  {text: 'Lunes', cols: 1, rows: 1, color: 'deepskyblue'},
  {text: 'Martes', cols: 1, rows: 1, color: 'deepskyblue'},
  {text: 'Miercoles', cols: 1, rows: 1, color: 'deepskyblue'},
  {text: 'Jueves', cols: 1, rows: 1, color: 'deepskyblue'},
  {text: 'Viernes', cols: 1, rows: 1, color: 'deepskyblue'},
  {text: 'Sábado', cols: 1, rows: 1, color: 'deepskyblue'}
];
    this.updateDate();
  }

  ngOnInit(): void {
    this.obtenerDatosResponsables();
  }

  filterSunday(d: Date | null): boolean {
    let dd = moment(d);
    const day = d ? dd.day():1;
    return day !== 0 ;
  }

  clearFilter(){
    this.searchTerm = '';
    this.filteredResponsables = this.responsableDetailLista;
    this.setTiles();
  }
  openGrupo(){
    /*this.selectedRecursoDisponible = data.recursoDisponibilidad;
    this.selectedRecurso = data.recurso;
    this.idRecursoDisponibilidad = this.selectedRecursoDisponible.id;
    this.placa = this.selectedRecurso.placa_equipo;
    this.conductor = this.selectedRecurso.conductor;
    this.label = this.selectedRecursoDisponible.label;*/
    //console.log('grupoAg: ',this.toDeleteItem);
    let recurso = {
      placa_equipo: this.toDeleteItem.placa,
      conductor: this.toDeleteItem.conductor
    } as any;
    let recursoDisponible = {
      id: this.toDeleteItem.id_recurso_disponibilidad,
      label: this.toDeleteItem.elInicio,
    } as any;
    let data = {
      recursoDisponibilidad: recursoDisponible,
      recurso: recurso
    }
    console.log('grupo:',data);
    const dialogRef = this.dialog.open(VerGrupoComponent,{
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result){return;}
     if (result.action=='close'){
       let result = {action:'close'} as any;
       this.toDeleteItem = null;
     }
    });
  }
  filterActividad(){
    //console.log(this.searchTerm,this.tiles.filter((p:any)=>{return p.text == this.searchTerm;}));
    console.log('acys:',this.idActividad);
    if(!this.idActividad){
      this.filteredResponsables = this.responsableDetailLista;
      this.setTiles();
      return;
    }
    this.filteredResponsables = this.responsableDetailLista.filter((p:any)=>{
      if(this.idActividad){
        let filteredDetalle: any[] = [];
        if(p.detalle && p.detalle.length > 0)
          filteredDetalle = p.detalle.filter((q:any)=>{
            return q.nombre_actividad.indexOf(this.idActividad)!=-1;
          })
        return filteredDetalle.length>0;
      } else {
        return false;
      }
    });
    console.log(this.filteredResponsables);
    this.setTiles();
  }
  filterData(){
    //console.log(this.searchTerm,this.tiles.filter((p:any)=>{return p.text == this.searchTerm;}));
    if(this.searchTerm == ''){
      this.filteredResponsables = this.responsableDetailLista;
      this.setTiles();
      return;
    }
    this.filteredResponsables = this.responsableDetailLista.filter((p:any)=>{
      if(p.name && this.searchTerm){
        let val1 = p.name.toLowerCase().includes(this.searchTerm);
        let filteredDetalle: any[] = [];
        if(p.detalle && p.detalle.length > 0){
          filteredDetalle = p.detalle.filter((q:any)=>{
          return q.placa? q.placa.toLowerCase().includes(this.searchTerm) : false;
        }
        )
        }
        return val1 || filteredDetalle.length>0;
      }
      else{
        return false;
      }
    });
    //console.log(this.filteredResponsables);
    this.setTiles();
  }

  obtenerDatosResponsables(){
    this.programacionService.getAll()
     .subscribe(d=>{
       if(!d.respuesta){return;}
      this.responsableDetailLista = [];
      let data = d.respuesta;
      this.currentResponsable = data[0];
      this.responsableLista = utilidades.distinct(data,'id_persona_responsable_visita');
      this.responsableLista.forEach((v:any)=>{
        let obj:any = {};
        obj['id'] = v;
        let arrayObj : any[] = [];
        let responsableDetalles = data.filter((p:any)=>p.id_persona_responsable_visita==v);
        obj['name'] = responsableDetalles[0].nombre_responsable_visita;
        responsableDetalles.forEach((v:any)=>{
          let detail = v;
          detail['elInicio'] = (new Date(v.fecha_inicio)).toDateString();
          detail['elFin'] = (new Date(v.fecha_fin)).toDateString();
          arrayObj.push(detail);
        });
        obj['detalle'] = arrayObj;
        this.responsableDetailLista.push(obj);
      });
      this.filteredResponsables = this.responsableDetailLista;
      console.log(this.filteredResponsables);
      if(this.searchTerm)
        this.filterData();
      if(this.idActividad)
        this.filterActividad();
      if(!this.searchTerm && !this.idActividad)
        this.setTiles();
    });
  }

  setTiles(){
    this.tiles = [];//.length = 0;
    this.filteredResponsables.forEach((v:any)=>{
      let act:any[] = [];
      v.detalle.forEach((p:any)=>{
        act.push(p.nombre_actividad);
      });
      let obj2 = {
        text: v.name, cols: 1, rows: 1, color: 'lightgreen'
      } as any;
      if(act.length>0)
        obj2['acts'] = act;
      this.tiles.push(obj2);
      for(let i = 1 ; i < 7 ; i++){
        let theCurrentDate = this.getDateByIndex(i+1);
        let theCurrentDayDate = new Date(theCurrentDate);
        theCurrentDayDate.setHours(0, 0, 0, 0);
        let dT = new Date();
        let isDisabled : boolean = theCurrentDayDate < new Date();
        let obj = v.detalle.filter((p:any)=>{
          let dt = new Date(p.fecha_inicio);
          dt.setHours(0, 0, 0, 0);
          let dw = new Date(theCurrentDate);
          dw.setHours(0, 0, 0, 0);
          return dt.toLocaleString() == dw.toLocaleString();
        });
        obj.forEach((w:any)=>{
          //console.log('setting: ',w);
          let theStartDate = new Date(w.fecha_inicio);
          let theEndDate = new Date(w.fecha_fin);
          w["hora_inicio_text"] = theStartDate.toLocaleTimeString();
          w["hora_fin_text"] = theEndDate.toLocaleTimeString();
        });
        let dayObj = {
          text: i, cols: 1, rows: 1, color: 'lightblue',panel:obj,
          responsable : v.id, fecha : theCurrentDayDate, isDisabled : isDisabled,
          responsableName : v.name
        };
        this.tiles.push(dayObj);
      }
    });
  }

  getDateByIndex(index:number){
    let day : any = null;;
    switch (index) {
    case 1:
      day = this.mondayDate;
      break;
    case 2:
      day = this.thuesdayDate;
      break;
    case 3:
       day = this.wednesdayDate;
      break;
    case 4:
      day = this.thursdayDate;
      break;
    case 5:
      day = this.fridayDate;
      break;
    case 6:
      day = this.saturdayDate;
      break;
    }
    return day;
  }

  openDialog(item:any){
    //console.log(item);
    let data = {
      responsable:item.responsable,
      responsableName:item.responsableName,
      iniDate: item.fecha,
      recursosAsig: item.panel
    }
    const dialogRef = this.dialog.open(AsignarRecursoComponent,{
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(!result){return;}
     if (result.action=='save'){
       console.log('filtroPer:',this.searchTerm);
       console.log('filtroAct:',this.idActividad);
       this.programacionService.asignarVisita(item.responsable,result.value)
                 .subscribe(d=>{
                   this.snackBar.open('Se asignó la visita.', 'X', {
                     duration: 5000,
                     panelClass: ['success-snackbar']
                   });
                   this.obtenerDatosResponsables();
                 });
     } else if(result.action=='close')
        this.obtenerDatosResponsables();
    });
  }
  paraBorrar(obj:any){
    this.toDeleteItem = obj;
  }
  borrarAsignacion(){
    if(!this.toDeleteItem){return;}
    this.programacionService.desasignarVisita(this.toDeleteItem.id_persona_responsable_visita,this.toDeleteItem.id_recurso_disponibilidad)
             .subscribe(d=>{
               this.snackBar.open('Visita desasignada.', 'X', {
                 duration: 5000,
                 panelClass: ['error-snackbar']
               });
               this.obtenerDatosResponsables();
             });
  }

  updateDate(){
    this.weekday = moment(this.currentDate).day();
    this.mondayDate = moment(this.currentDate); //new Date(this.currentDate);
    this.thuesdayDate = moment(this.currentDate);
    this.wednesdayDate = moment(this.currentDate);
    this.thursdayDate = moment(this.currentDate);
    this.fridayDate = moment(this.currentDate);
    this.saturdayDate = moment(this.currentDate);
    this.mondayDate.add(1 - this.weekday,'days');
    this.thuesdayDate.add(2 - this.weekday,'days');
    this.wednesdayDate.add(3 - this.weekday,'days');
    this.thursdayDate.add(4 - this.weekday,'days');
    this.fridayDate.add(5 - this.weekday,'days');
    this.saturdayDate.add(6 - this.weekday,'days');
    this.tiles2[1]['dayLabel'] = this.mondayDate.format('YYYY-MM-DD').slice(-2);
    this.tiles2[2]['dayLabel'] = this.thuesdayDate.format('YYYY-MM-DD').slice(-2);
    this.tiles2[3]['dayLabel'] = this.wednesdayDate.format('YYYY-MM-DD').slice(-2);
    this.tiles2[4]['dayLabel'] = this.thursdayDate.format('YYYY-MM-DD').slice(-2);
    this.tiles2[5]['dayLabel'] = this.fridayDate.format('YYYY-MM-DD').slice(-2);
    this.tiles2[6]['dayLabel'] = this.saturdayDate.format('YYYY-MM-DD').slice(-2);
    this.setTiles();
  }

}
