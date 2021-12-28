import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-ver-visita-disenio',
  templateUrl: './dialog-ver-visita-disenio.component.html',
  styleUrls: ['./dialog-ver-visita-disenio.component.scss']
})
export class DialogVerVisitaDisenioComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
