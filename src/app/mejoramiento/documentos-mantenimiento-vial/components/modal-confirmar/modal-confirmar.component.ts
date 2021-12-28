import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, } from '@angular/core';

export interface DialogData {
    action: string | undefined;
}

@Component({
    selector: 'app-modal-confirmar',
    templateUrl: './modal-confirmar.component.html',
    styleUrls: ['./modal-confirmar.component.scss']
})
export class ModalConfirmarComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ModalConfirmarComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    async ngOnInit() {}
    onNoClick(): void {
        this.dialogRef.close();
    }
}
