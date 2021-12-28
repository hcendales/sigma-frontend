import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgramacionService } from 'src/app/core/services/programacion.service';

@Component({
  selector: 'app-ver-grupo',
  templateUrl: './ver-grupo.component.html',
  styleUrls: ['./ver-grupo.component.scss']
})
export class VerGrupoComponent implements OnInit {
  placa:string;
  conductor:string;
  label:string;
  idRecursoDisponibilidad:number;
  modalGrupo: FormGroup;
  recursosLista : any[] = [];
  recursosUnicosLista : any[] = [];
  recursosDisponibilidadLista : any[] = [];
  public selectedRecursoDisponible:any;
  public selectedRecurso:any;
  toDeleteItem: any;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private programacionService : ProgramacionService, private snackBar:MatSnackBar) {
      this.modalGrupo = this.fb.group({});
      this.modalGrupo.markAllAsTouched();
      this.selectedRecursoDisponible = data.recursoDisponibilidad;
      this.selectedRecurso = data.recurso;
      this.idRecursoDisponibilidad = this.selectedRecursoDisponible.id;
      this.placa = this.selectedRecurso.placa_equipo;
      this.conductor = this.selectedRecurso.conductor;
      this.label = this.selectedRecursoDisponible.label;
  }

  ngOnInit(): void {
    this.obtenerDatosResponsables();
  }
  obtenerDatosResponsables(){
    this.programacionService.getDisponibilidadAsignada(this.idRecursoDisponibilidad)
    .subscribe(d=>{
      this.recursosLista = d.respuesta;
      this.recursosLista.forEach((v:any)=>{
        let obj = d.respuesta.filter((p:any)=>p.id_persona_responsable_visita==v)[0];
        this.recursosUnicosLista.push(obj);
      });
    });
  }
  paraBorrar(item:any){
    this.toDeleteItem = item;
  }
  borrarAsignacion(){
    if(!this.toDeleteItem){return;}
    this.programacionService.desasignarVisita(this.toDeleteItem.id_persona_responsable_visita,this.toDeleteItem.id_recurso_disponibilidad)
             .subscribe(d=>{
               this.snackBar.open('Visita desasignada.', 'X', {
                 duration: 5000,
                 panelClass: ['error-snackbar']
               });
               this.toDeleteItem = null;
               this.obtenerDatosResponsables();
             });
  }}
