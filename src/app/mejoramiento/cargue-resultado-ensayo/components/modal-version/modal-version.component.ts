import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, } from '@angular/core';
import { SolicitudEnsayoLaboratorio } from 'src/app/core/models/solicitud-ensayo-laboratorio';


@Component({
    selector: 'app-modal-version',
    templateUrl: './modal-version.component.html',
    styleUrls: ['./modal-version.component.scss']
})
export class ModalVersionComponent implements OnInit {

    title: string | null = "";

    constructor(
        public dialogRef: MatDialogRef<ModalVersionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SolicitudEnsayoLaboratorio) { }

    ngOnInit() {
        this.title = "Servicio " + this.data.desc_servicio + " ID SOLICITUD " + this.data.id_ensayo ;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
