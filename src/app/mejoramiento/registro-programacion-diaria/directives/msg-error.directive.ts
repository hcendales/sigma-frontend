import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[msg-error]'
})
export class MsgErrorDirective implements OnInit/*, OnChanges*/ {

  private _color: string = 'red';
  private _mensaje: string = 'Este campo es requerido';
  private _valor: any;

  @Input() set color(valor: string) {
    this._color = valor;
    this.setColor();
  }

  @Input() set mensaje(valor: string) {
    this._mensaje = valor;
    this.setMensaje();
  }

  @Input() set valido(valor: any) {
    this._valor = valor === 0 || valor === null || valor === "" || valor === undefined ? false : true
    this.setValido();
  }

  @Input() set hide(hide: boolean) {
    if (hide)this.htmlElement.nativeElement.classList.add('hide');
  }

  @Input() set errorRN(mostrar: string) {
    if (mostrar !== ""){
      if (mostrar.split('|')[1] === '001' && (mostrar.split('|')[0] === "horaDesde" || mostrar.split('|')[0] === "horaHasta")){
        this.htmlElement.nativeElement.classList.remove('hide');
        this._mensaje = mostrar.split('|')[2];
        this.setMensaje();
      } else if (mostrar.split('|')[1] === '002' && (mostrar.split('|')[0] === "listaJornada" || mostrar.split('|')[0] === "horaDesde" || mostrar.split('|')[0] === "horaHasta")) {
        this.htmlElement.nativeElement.classList.remove('hide');
        this._mensaje = mostrar.split('|')[2];
        this.setMensaje();
      }
    }else{
      this.htmlElement.nativeElement.classList.add('hide');
    }
  }

  htmlElement: ElementRef<any>
  constructor( private el: ElementRef<any>) {
    this.htmlElement = el
   }

  ngOnInit(): void {
    this.setEstilo();
    this.setColor();
    this.setMensaje();
  }

  setValido(): void{
    if (this._valor) {
      this.htmlElement.nativeElement.classList.add('hide');
    } else {
      this.htmlElement.nativeElement.classList.remove('hide');
    }
  }
  setEstilo(): void {
    this.htmlElement.nativeElement.classList.add('form-text');
  }
  setColor(): void {
    this.htmlElement.nativeElement.style.color = this._color;
  }
  setMensaje(): void {
    this.htmlElement.nativeElement.innerText = this._mensaje;
  }

}
