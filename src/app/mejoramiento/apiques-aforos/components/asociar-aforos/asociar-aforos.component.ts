import { Component, OnInit, Inject } from '@angular/core';
import { EntityTabAforoService } from '../../../../core/services/entity-tab-aforo.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-asociar-aforos',
  templateUrl: './asociar-aforos.component.html',
  styleUrls: ['./asociar-aforos.component.scss']
})
export class AsociarAforosComponent implements OnInit {

  displayedColumns: string[] = ['fecha_aforo', 'tipo_aforo', 'verDocus','vincular'];

  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();

  datos = [
    {fecha_aforo:'10/06/2021', tipo_aforo:'Digital'},
    {fecha_aforo:'5/01/2021', tipo_aforo:'Manual'},
    {fecha_aforo:'12/02/2020', tipo_aforo:'Manual'},
  ]
  constructor(private entityTabAforoService:EntityTabAforoService, 
              public dialogRef: MatDialogRef<AsociarAforosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.dataSource.data = this.datos;
              }

  ngOnInit(): void {
    this.entityTabAforoService.consultarXFiltro('PK_ID_CALZADA = ' + this.data.pk_id_calzada);
    
  }

  onVincularAforo(e:any){
    this.dialogRef.close();
  }

  onVerDocus(e:any){

  }

  cancelar(){
    this.dialogRef.close();
  }

}
