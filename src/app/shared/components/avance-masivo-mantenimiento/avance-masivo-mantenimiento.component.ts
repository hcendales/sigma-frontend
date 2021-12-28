import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GestionService } from '../../../core/services/gestion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-avance-masivo-mantenimiento',
  templateUrl: './avance-masivo-mantenimiento.component.html',
  styleUrls: ['./avance-masivo-mantenimiento.component.scss']
})
export class AvanceMasivoMantenimientoComponent implements OnInit {

  public idsProcesoGestionAvanzar:number[] = [];

  @Input() set idsProcesoGestion(value: number[]) {
    this.idsProcesoGestionAvanzar = value;
    this.verificarCambioAsignacion();
  }

  @Input() acciones: any[] = [];
  @Input() actividadDestino: any = {} as any;
  @Output() gestionRealizada: EventEmitter<any> = new EventEmitter();
  @Output() opcionSeleccionada: EventEmitter<any> = new EventEmitter();

  public usuariosDestino:Array<any>;
  
  loading = false;
  sending = false;
  formGestion: FormGroup;
  enviarCorreo:boolean = false;

  constructor(private gestionService:GestionService, private snackBar:MatSnackBar, private fb: FormBuilder) {
    this.usuariosDestino = [];
    this.formGestion = this.fb.group({
      observaciones: ['']
    });
  }

  async ngOnInit() {
    console.log('Laactividad destino:',this.actividadDestino);
    //let respServ = await (this.gestionService.obtenerActividadesDestino(this.idProcesoGestion) as any);
    
  }

  async onSubmit(){
    if(this.idsProcesoGestionAvanzar.length == 0){
      this.snackBar.open('No hay registros para enviar', 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.sending = true;
    let usuarioDestino = null;
    if(this.formGestion.get('usuarioDestino')){
      usuarioDestino = this.formGestion.value.usuarioDestino;
    }
    let observacion = this.formGestion.value.observaciones;

    let respServ = await this.gestionService.avanzarMantenimientoMasivo(this.idsProcesoGestionAvanzar, this.actividadDestino.id_actividad_transicion, observacion, false, usuarioDestino);

    try{
      if(respServ.codError == 0){
        this.snackBar.open(respServ.msgError, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.sending = false;
        this.gestionRealizada.emit();
        
      }else{
        this.handleError(respServ.msgError);
        this.sending = false;
      }

    }catch(error){
      console.log(error);
      this.handleError(error.error);
      this.sending = false;
    }
        
  }

  handleError(msgError:string){
    this.snackBar.open(msgError, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  async verificarCambioAsignacion(){
    if(this.idsProcesoGestionAvanzar.length == 0){
      return;
    }
    let respServ = await (this.gestionService.obtenerActividadesDestino(this.idsProcesoGestionAvanzar[0]) as any);
    let actDestino = null;
    for(let actDest of respServ.respuesta){
      if(actDest.id_actividad == this.actividadDestino.id_actividad_destino){
        actDestino = actDest;
        break;
      }
    }    

    if(actDestino.permite_cambio_asignacion == 'SI'){ 
      try{
        this.loading = true;
        let respServ = await this.gestionService.obtenerUsuariosParaAsignarPorActividad(this.idsProcesoGestionAvanzar[0],this.actividadDestino.id_actividad_transicion);
        if(respServ.codError == 0){
          
          if(!this.formGestion.get('usuarioDestino')){
            this.formGestion.addControl('usuarioDestino',new FormControl('',Validators.required));
          }
          this.usuariosDestino = respServ.respuesta;
          //ordena por numero de asignaciones y como segundo criterio nombre.
          this.usuariosDestino.sort((a:any,b:any)=>a.gestiones_asignadas > b.gestiones_asignadas?1:a.gestiones_asignadas < b.gestiones_asignadas?-1:a.nombre_usuario > b.nombre_usuario?1:a.nombre_usuario < b.nombre_usuario?-1:0);
        }else{
          this.handleError(respServ.msgError);
        }
        this.loading = false;
      }catch(error){
        this.handleError(error.error);
      }
    } 
  }
  

}
