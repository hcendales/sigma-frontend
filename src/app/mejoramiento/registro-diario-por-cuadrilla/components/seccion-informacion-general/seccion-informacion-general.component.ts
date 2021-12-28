import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Personas } from 'src/app/core/models/registro-diario-por-cuadrilla';
import { ProgramacionDiariaCuadrillaService } from 'src/app/core/services/programacion-diaria-cuadrilla.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-informacion-general',
  templateUrl: './seccion-informacion-general.component.html',
  styleUrls: ['./seccion-informacion-general.component.scss'],
  providers: [DatePipe]
})
export class SeccionInformacionGeneralComponent implements OnInit {

  @Input() listas: any;
  @Input() persona: any
  @Output() idInformeDiarioCuadrilla = new EventEmitter();
  loading: boolean = false;
  idMantenimientoVial: number = 0;
  pkIdCalzada: number = 0;

  personasAprueban: Observable<any[]> = new Observable<any[]>();
  listaPersonasAprobadores: any[] = [];  // Director de Obra
  
  personasElabora: Observable<any[]> = new Observable<any[]>();
  listaPersonasElabora: any[] = [];   // Inspector de Obra

  personasRevisores: Observable<any[]> = new Observable<any[]>();
  listaPersonasRevisores: any[] = [];    // Ingeniero de Apoyo / Residente de Obra

  /**
   * usado en el Dialogo
   * action "I" usa el servicio de insertar
   * action "U" usa el servicio de actualizar
   */
  action: string | undefined;
  wDialog: string = '25%';
  hDialog: string = '22%';

  formInformaGeneral: FormGroup = this.fb.group({
    actividad_dia_siguiente:       [, Validators.required],
    area_total_intervenida:        [, Validators.required],
    cantidad_delineadores:         [, Validators.required],
    cantidad_seniales:             [, Validators.required],
    fecha:                         [, Validators.required],
    hora_inicio_actividades:       [, Validators.required],
    horario_fin_actividades:       [, Validators.required],
    id_archivo_esquema:            [, ],
    id_informe_diario_cuadrilla:   [0, ],
    id_mantenimiento_vial:         [0, Validators.required],
    id_persona_aprueba:            [, Validators.required],
    id_persona_elabora:            [, Validators.required],
    id_persona_revisa:             [, Validators.required],
    id_tipo_clima_manana:          [, Validators.required],
    id_tipo_clima_noche:           [, Validators.required],
    id_tipo_clima_tarde:           [, Validators.required],
    id_tipo_estado_informe:        [, Validators.required],
    id_tipo_estado_obra:           [, Validators.required],
    id_tipo_jornada:               [, Validators.required],
    longitud_total_intervenida:    [, Validators.required],
    observaciones:                 [, ],
    porcentaje_avance_acum_obra:   [, Validators.required],
    porcentaje_avance_diario_obra: [, Validators.required],
    servicio_banio:                [, Validators.required],
    servicio_banio_horas:          [, ],
    servicio_vigilancia:           [, Validators.required],
    servicio_vigilancia_horas:     [, ],
  });

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public services: ProgramacionDiariaCuadrillaService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimientoVial = +params['id']; this.pkIdCalzada = +params['pk']; });
    this.formInformaGeneral.get("id_mantenimiento_vial")?.setValue(this.idMantenimientoVial);

    this.services.informeDiarioCuadrilla_consultarXFiltro("id_Mantenimiento_Vial = " + this.idMantenimientoVial).then((e:any) => {
      
      if (e.codError === 0 && e.respuesta.length > 0){
        this.cargarFormGroup(e.respuesta[0]);
        if (e.respuesta[0].id_informe_diario_cuadrilla > 0)
          this.idInformeDiarioCuadrilla.emit(e.respuesta[0].id_informe_diario_cuadrilla);
      }else{
        this.idInformeDiarioCuadrilla.emit(0);
        this.loading = false
      }
      this.cargarListas(e.respuesta[0]);
    }); 
  }

  cargarFormGroup(response: any){
    console.log("form ~>", response)
    this.formInformaGeneral.get('id_mantenimiento_vial')?.setValue(this.idMantenimientoVial);
    this.formInformaGeneral.get('fecha')?.setValue(this.datePipe.transform(response.fecha, 'dd-MM-yyyy') + 'T05:00:00.000Z');
    this.formInformaGeneral.patchValue(response);
  }

  cargarListas(response?: any){
    console.log("Listas ~>", response)

    this.listaPersonasAprobadores = this.listas[1].filter((e: Personas) => e.id_tipo_rol === 4770)
    this.listaPersonasElabora = this.listas[1].filter((e: Personas) => e.id_tipo_rol === 4781)
    this.listaPersonasRevisores = this.listas[1].filter((e: Personas) => e.id_tipo_rol === 4785 || e.id_tipo_rol === 4769 )


    this.personasAprueban = this.formInformaGeneral.get('id_persona_aprueba')!.valueChanges
    .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value == null ? '' : value.nombre),
        map(name => name ? this._filterAprueban(name) : this.listaPersonasAprobadores.slice())
        );

    
    this.personasElabora = this.formInformaGeneral.get('id_persona_elabora')!.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value == null ? '' : value.nombre),
        map(name => name ? this._filterElabora(name) : this.listaPersonasElabora.slice())
      );

    
    this.personasRevisores = this.formInformaGeneral.get('id_persona_revisa')!.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value == null ? '' : value.nombre),
        map(name => name ? this._filterRevisan(name) : this.listaPersonasRevisores.slice())
      );
            
    this.loading = false
  }

  private _filterAprueban(value: any): string[] {
    const filterAprueban = value.toLowerCase().trim();
    return this.listaPersonasAprobadores.filter(persona => persona.nombre.toLowerCase().indexOf(filterAprueban) != -1);
  }

  public displayPersonaAprueba(contact?: any): string {
    return contact ? contact.nombre : ''
  }

  private _filterRevisan(value: any): string[] {
    const filterRevisan = value.toLowerCase().trim();
    return this.listaPersonasRevisores.filter(persona => persona.nombre.toLowerCase().indexOf(filterRevisan) != -1);
  }
  public displayPersonaRevisa(contact?: any): string {
    return contact ? contact.nombre : ''
  }
  
  private _filterElabora(value: any): string[] {
    const filterElabora = value.toLowerCase().trim();
    return this.listaPersonasElabora.filter(persona => persona.nombre.toLowerCase().indexOf(filterElabora) != -1);
  }

  public displayPersonaElabora(contact?: any): string {
    return contact ? contact.nombre : ''
  }

  isInvalid(name: string) {
    let control = this.formInformaGeneral.controls[name];
      return control.invalid && control.touched;
  }



  async guardaSolicitud() {

    const accion = isNaN(this.formInformaGeneral.get('id_informe_diario_cuadrilla')?.value) || this.formInformaGeneral.get('id_informe_diario_cuadrilla')?.value === 0 ? "G" : "A"
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: this.wDialog,
      height: this.hDialog,
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { accion: accion, mensaje: "Desea registrar los cambios?" }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;

        try {
          if (accion === "G"){
            this.services.informeDiarioCuadrilla_insertar(this.formInformaGeneral.value).then((r) => {
              if (r.codError === 0) {
                this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
                this.idInformeDiarioCuadrilla.emit(r.respuesta[0][":b1"])
              }
            }).catch((error) => {
              this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
            })
          }else{
            this.services.informeDiarioCuadrilla_actualizar(this.formInformaGeneral.value).then((r) => {
              if (r.codError === 0) {
                this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
                this.idInformeDiarioCuadrilla.emit(r.respuesta[0].id_informe_diario_cuadrilla)
              }
            }).catch((error) => {
              this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
            })
          }
        } catch (error) {
          this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
        }

        this.loading = false;
      }
    });
  }


}
