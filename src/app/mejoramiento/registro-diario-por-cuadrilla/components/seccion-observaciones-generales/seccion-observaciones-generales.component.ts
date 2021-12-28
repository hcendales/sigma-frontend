import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { ProgramacionDiariaCuadrillaService } from 'src/app/core/services/programacion-diaria-cuadrilla.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-seccion-observaciones-generales',
  templateUrl: './seccion-observaciones-generales.component.html',
  styleUrls: ['./seccion-observaciones-generales.component.scss']
})
export class SeccionObservacionesGeneralesComponent implements OnInit {

 
  loading: boolean = false;
  idMantenimientoVial: number = 0;
  pkIdCalzada: number = 0;
  idCuadrilla: number = 0;

  @Input() listas: any;
  @Input() set idInforme(id: number) {
    if (id > 0) {
      this.loading = true;
      this.idCuadrilla = id;
      this.buscarDatos(this.idCuadrilla);
      this.formObservaciones.get("id_informe_diario_cuadrilla")?.setValue(id)
      console.log(this.idCuadrilla)
    }
  }

  formObservaciones: FormGroup = this.fb.group({
    id_infdiacua_observacion: [0, Validators.required],
    id_informe_diario_cuadrilla: [0, Validators.required],
    observaciones: ["", Validators.required],
  });

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public service: ProgramacionDiariaCuadrillaService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => { this.idMantenimientoVial = +params['id']; this.pkIdCalzada = +params['pk']; });
    this.formObservaciones.get("id_informe_diario_cuadrilla")?.setValue(this.idCuadrilla)
    console.log(">>", this.idCuadrilla, this.listas)
    
  }

  /**Busca los registros existentes asociados al id mantenimiento */
  buscarDatos(id: number = this.idCuadrilla) {

    let obs :string = "";
    let idx :number = 0;

    this.service.observacion_consultarXFiltro("id_informe_diario_cuadrilla = " + id).subscribe((res: any) => {
      console.log(res.respuesta, res.respuesta.length, res.respuesta !== [], res.respuesta !== null )
      if (res.codError === 0 && res.respuesta.length > 0){
        obs = res.respuesta[0].observaciones
        idx = res.respuesta[0].id_infdiacua_observacion
      }
    })
    this.formObservaciones.get("observaciones")?.setValue(obs);
    this.formObservaciones.get("id_infdiacua_observacion")?.setValue(idx);
    this.loading = false;
  }

  async guardaSolicitud() {
    if (this.formObservaciones.get("id_infdiacua_observacion")?.value === 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "G",
          mensaje: "Confirmar que desea Guardar"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.loading = true;
            this.service.observacion_insertar(this.formObservaciones.value).then((res: any) => {
              if (res.codError === 0) {
                this.buscarDatos();
                this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
              } else {
                this.snackBar.open("Error, no se logro complear la accion solicitada: " + res.msgError, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
              }
            });
          } catch (error) {
            this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          }
        }
      });

    } else {

      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          accion: "A",
          mensaje: "Confirmar que desea Actualizar la fila seleccionadas"
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          try {
            this.loading = true;
            this.service.observacion_actualizar(this.formObservaciones.value).then((res: any) => {
              if (res.codError === 0) {
                this.buscarDatos();
                this.snackBar.open('Información de sección Actualizada', 'X', { duration: 5000, panelClass: ['success-snackbar'] });
              } else {
                this.snackBar.open("Error, no se logro complear la accion solicitada: " + res.msgError, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
              }
            });
          } catch (error) {
            this.snackBar.open("Error, no se logro complear la accion solicitada: " + error, 'X', { duration: 5000, panelClass: ['error-snackbar'] });
          }
        }
      });
    }
  }
}
