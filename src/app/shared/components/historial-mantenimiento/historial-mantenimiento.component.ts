import { Component, OnInit, Input } from '@angular/core';
import { ConsultasMejoramientoService } from '../../../core/services/consultas-mejoramiento.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-historial-mantenimiento',
  templateUrl: './historial-mantenimiento.component.html',
  styleUrls: ['./historial-mantenimiento.component.scss']
})
export class HistorialMantenimientoComponent implements OnInit {

  @Input() idMantenimiento:number = -1;
  @Input() mostrarTitulo:boolean = true;
  @Input() mostrarUltimaGestion:boolean = false;
  @Input() scrollVertical:boolean = false;

  ready:boolean = false;
  gestionDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  gestionColumns: string[] = [
    'id_proceso_gestion', 'nombre_actividad', 'fecha_asignacion', 'fecha_vencimiento', 'nombre_usuario', 'observacion_gestion'
  ];

  constructor(private consultasMejoramientoService:ConsultasMejoramientoService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.ready = false;
    if(this.idMantenimiento == -1){
      return;
    }
    this.consultasMejoramientoService.getGestionesMantenimiento(this.idMantenimiento).then((resp: any) => {
      if(resp.codError == 0){
        this.gestionDataSource = new MatTableDataSource(resp.respuesta);
        this.gestionDataSource.data.sort((a:any,b:any) => (a.id_proceso_gestion > b.id_proceso_gestion) ? -1 : ((b?.id_proceso_gestion > a.id_proceso_gestion) ? 1 : 0));
        if(!this.mostrarUltimaGestion){
          this.gestionDataSource.data.shift();
        }
        this.ready = true;
      }else{  
        this.snackBar.open(resp.msgError, 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

}
