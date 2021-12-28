import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() titulo: any;
    @Input() btnOk: any;
    @Input() btnCancel: any;
    @Input() btnCerrar: any;
    @Input() maxSize: any;
    @Output() cerrar = new EventEmitter();
    @Output() cancel = new EventEmitter();
    constructor() {

    }

    ngOnInit() {
    }

    cerrarModal(){
    	this.cerrar.emit();
    }
    cancelModal(){
    	this.cancel.emit();
    }
  }
