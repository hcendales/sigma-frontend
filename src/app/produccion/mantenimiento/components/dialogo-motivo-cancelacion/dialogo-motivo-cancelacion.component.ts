import { DialogData } from './dialog-data';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Componente: DialogoMotivoCancelacionComponent
 * 
 * Permite la salida de un componente de dialogo con 
 * controles. 
 * 
 * @version 1.0
 * @revision 07-07-21
 */
@Component({
  selector: 'app-dialogo-motivo-cancelacion',
  templateUrl: './dialogo-motivo-cancelacion.component.html',
  styleUrls: ['./dialogo-motivo-cancelacion.component.scss']
})
export class DialogoMotivoCancelacionComponent implements OnInit {
  
  /**
   * Define el contrucutor del componenete.
   * @param dialogRef Referencia al componente de dialogo.
   * @param data Campos enlasados del componente de
   *             dialogo. 
   */
  constructor(
    public dialogRef: MatDialogRef<DialogoMotivoCancelacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Metodo de carga del componente.
   */
  ngOnInit() {}
  
  /**
   * Metodo que oculta el componente.
   */
  cancelar() {
    this.dialogRef.close();
  }

}
