import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { ProgramacionService } from '../../../core/services/programacion.service';

import * as utilidades from '../utilidades';
import { VerGrupoComponent } from '../ver-grupo/ver-grupo.component';

@Component({
  selector: 'app-asignar-recurso',
  templateUrl: './asignar-recurso.component.html',
  styleUrls: ['./asignar-recurso.component.scss']
})
export class AsignarRecursoComponent implements OnInit {

  responsable:any;
  responsableName:any;
  theDate:any;
  modalAsignar: FormGroup;
  recursosLista : any[] = [];
  recursosUnicosLista : any[] = [];
  recursosDisponibilidadLista : any[] = [];
  public selectedRecursoDisponible:any;
  public selectedRecurso:any;
  resources: any;



  constructor(public dialogRf: MatDialogRef<AsignarRecursoComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private programacionService : ProgramacionService,  public dialog: MatDialog) {
      this.modalAsignar = this.fb.group({});
      this.modalAsignar.markAllAsTouched();
      this.responsable = data.responsable;
      this.responsableName = data.responsableName;
      this.theDate = data.iniDate;
      this.resources =  data.recursosAsig;
  }

  ngOnInit(){
    let toDate = new Date(this.theDate);
    toDate.setDate(this.theDate.getDate() + 1);
    this.programacionService.getDisponibilidadTotal(2,this.theDate,toDate).subscribe(d=>{
       this.recursosLista = d.respuesta;
       let rs = utilidades.distinct(d.respuesta,'id_recurso');
       rs.forEach((v:any)=>{
         let obj = d.respuesta.filter((p:any)=>p.id_recurso==v)[0];
        this.recursosUnicosLista.push(obj);
       });
    });
  }

  updateRecursosDisponibles(){
    this.recursosDisponibilidadLista = [];

    let rs = this.recursosLista.filter((p:any)=>p.id_recurso == this.selectedRecurso);
    rs.forEach((v:any)=>{
      let theStart = new Date(v.fecha_inicio);
      let theEnd = new Date(v.fecha_fin);
      let obj = {id:v.id_recurso_disponibilidad,label:theStart.toLocaleTimeString() + '-' + theEnd.toLocaleTimeString()}
      if(!(this.resources.filter((r:any)=>r.id_recurso_disponibilidad==obj.id)[0]))
        this.recursosDisponibilidadLista.push(obj);
    });
  }

  openGrupo(){
    let data = {
      recursoDisponibilidad:this.recursosDisponibilidadLista.filter((it)=>{return it.id == this.selectedRecursoDisponible})[0],
      recurso:this.recursosUnicosLista.filter((ti)=>{return ti.id_recurso == this.selectedRecurso})[0]
    }
    console.log('grupo:',data);
    const dialogRef = this.dialog.open(VerGrupoComponent,{
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result){return;}
     if (result.action=='close'){
       let result = {action:'close'} as any;
       this.dialogRf.close(result);
     }
    });
  }

}
