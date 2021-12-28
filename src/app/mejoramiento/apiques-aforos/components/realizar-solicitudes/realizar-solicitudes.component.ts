import { Component, OnInit, Inject } from '@angular/core';
import { EntityTabAforoService } from '../../../../core/services/entity-tab-aforo.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-realizar-solicitudes',
  templateUrl: './realizar-solicitudes.component.html',
  styleUrls: ['./realizar-solicitudes.component.scss']
})
export class RealizarSolicitudesComponent implements OnInit {

  datos:any[] = [];
  totalApiques:number = 0;
  totalApiquesPrioritarios:number = 0;
  totalAforos:number = 0;
  totalAforosPrioritarios:number = 0;
  controlPrioridad:FormControl;
  esPrioritario:boolean = false;
  constructor(public dialogRef: MatDialogRef<RealizarSolicitudesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.datos = data;
      console.log('Los datos',this.datos);
      this.calcularTotales();

      this.controlPrioridad = new FormControl('');
    }

  ngOnInit(): void {
  }

  calcularTotales(){
    for(let dato of this.datos){
      if(dato.requiere_apiques == 'SI'){
        this.totalApiques +=1;
        if(dato.aux_esPrioritario){
          this.totalApiquesPrioritarios += 1;
        }
      }else if(dato.requiere_aforo == 'SI'){
        this.totalAforos +=1;
        if(dato.aux_esPrioritario){
          this.totalAforosPrioritarios += 1;
        }
      }
    }
  }

  cancelar(){
    this.dialogRef.close(null);
  }

  aceptar(){
    this.dialogRef.close({selected:this.datos,prioridad:this.esPrioritario?1:10});
  }

}
