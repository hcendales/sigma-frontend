import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GestionService } from '../../../core/services/gestion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl,ValidationErrors } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-avance-mantenimiento',
  templateUrl: './avance-mantenimiento.component.html',
  styleUrls: ['./avance-mantenimiento.component.scss']
})
export class AvanceMantenimientoComponent implements OnInit {
  @Input() idProcesoGestion:number;
  @Input() acciones: any[] = [];
  @Input() enviarCorreo:boolean = false;
  @Output() gestionRealizada: EventEmitter<any> = new EventEmitter();
  @Output() opcionSeleccionada: EventEmitter<any> = new EventEmitter();
  
  public actividadesDestino:Array<any>;
  public usuariosDestino:Array<any>;
  ready = false;
  loading = false;
  sending = false;
  formGestion: FormGroup;
  public filteredUsuarios:Observable<any[]> = new Observable<any[]>();

  public autocompleteObjectValidator(listaUsuario:any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let inList:any = listaUsuario.find((x:any) =>{return x.id_usuario == control.value});
      return inList?null:{ 'invalidAutocompleteObject': { value: control.value } }
    }
  }
  
  constructor(private gestionService:GestionService, private snackBar:MatSnackBar, private fb: FormBuilder) { 
    this.actividadesDestino = [];
    this.usuariosDestino = [];
    this.idProcesoGestion = 0;
    this.formGestion = this.fb.group({
      observaciones: ['']
    });
  }

  async ngOnInit(){
    try{
      //let respServ = await (this.gestionService.obtenerActividadesDestino(this.idProcesoGestion) as any);
      let respServ = await (this.gestionService.obtenerActividadesDestino(this.idProcesoGestion) as any);
      if(respServ.codError == 0){
          this.actividadesDestino = respServ.respuesta;
          if(this.actividadesDestino.length != 1){
            this.actividadesDestino.sort((a:any,b:any)=>a.nombre > b.nombre?1:a.nombre < b.nombre?-1:0);
            this.formGestion.addControl('actividadDestino',new FormControl('',Validators.required));
          }else{
            this.formGestion.addControl('actividadDestino',new FormControl('',[]));
            this.formGestion.get('actividadDestino')?.setValue(this.actividadesDestino[0]);
            this.actividadDestinoSelected(this.actividadesDestino[0]);
          }
          this.ready = true;
      }else{
        this.handleError(respServ.msgError);
      }
    }catch(error){
      this.handleError(error.error);
    }
  }

  async onSubmit(){
    this.sending = true;
    let actividadTransicion = this.formGestion.value.actividadDestino.id_actividad_transicion;
    let usuarioDestino = this.formGestion.value.usuarioDestino;
    let observacion = this.formGestion.value.observaciones;  
    
    try{
      let respServ = await this.gestionService.avanzarMantenimientoVial(this.idProcesoGestion, actividadTransicion,usuarioDestino,observacion,this.enviarCorreo);
      if(respServ.codError == 0){
        this.snackBar.open(respServ.msgError, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.sending = false;
        this.gestionRealizada.emit();
        
      }else{
        this.handleError(respServ.msgError);
      }
    }catch (error){
      console.log(error);
      this.handleError(error.error);
    }
    this.sending = false;
    
  }

  async actividadDestinoSelected(e:any){
    console.log('LAACTIVIDAD', e);
    if(e.permite_cambio_asignacion == 'SI'){ 
      try{
        this.loading = true;
        let respServ = await this.gestionService.obtenerUsuariosParaAsignarPorActividad(this.idProcesoGestion,e.id_actividad_transicion);
        if(respServ.codError == 0){
          
          this.usuariosDestino = respServ.respuesta;
          //ordena por numero de asignaciones y como segundo criterio nombre.
          this.usuariosDestino.sort((a:any,b:any)=>a.gestiones_asignadas > b.gestiones_asignadas?1:a.gestiones_asignadas < b.gestiones_asignadas?-1:a.nombre_usuario > b.nombre_usuario?1:a.nombre_usuario < b.nombre_usuario?-1:0);

          if(!this.formGestion.get('usuarioDestino')){
            this.formGestion.addControl('usuarioDestino',new FormControl('',Validators.compose([Validators.required, this.autocompleteObjectValidator(this.usuariosDestino)])));
            this.filteredUsuarios = this.formGestion.get('usuarioDestino')!.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value == null? '':value.descripcion),
              map(name => name ? this._filter(name) : this.usuariosDestino.slice())
            );

          }
          
        }else{
          this.handleError(respServ.msgError);
        }
        this.loading = false;
      }catch(error){
        this.handleError(error.error);
      }
    }else{
      this.usuariosDestino = [];
      this.formGestion.removeControl('usuarioDestino');
    }
  }

 handleError(msgError:string){
   
    this.snackBar.open(msgError, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  displayUsuarioFn(listaUsuarios:any[],id_usuario:number):string{
    let usuario = listaUsuarios?.find((x:any)=>{return x.id_usuario == id_usuario});
    return usuario ? usuario.nombre_usuario : ''
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.usuariosDestino.filter((usuario:any) => usuario.nombre_usuario.toLowerCase().indexOf(filterValue) != -1);
  }

}
