import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorFotosRoutingModule } from './visor-fotos-routing.module';
import { VisorFotosComponent } from './visor-fotos.component';


@NgModule({
  declarations: [VisorFotosComponent],
  imports: [
    CommonModule,
    VisorFotosRoutingModule
  ]
})
export class VisorFotosModule { }
