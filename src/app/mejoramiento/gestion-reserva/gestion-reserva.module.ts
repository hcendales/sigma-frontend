import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionReservaRoutingModule } from './gestion-reserva-routing.module';
import { GestionarReservaComponent } from './components/gestionar-reserva/gestionar-reserva.component';
import { BuscarRadicadoComponent } from './components/buscar-radicado/buscar-radicado.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablaGestionPendienteComponent } from './components/tabla-gestion-pendiente/tabla-gestion-pendiente.component';
import { ModalComponent } from '../../core/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [GestionarReservaComponent, BuscarRadicadoComponent, TablaGestionPendienteComponent, ModalComponent],
  imports: [
    CommonModule,
    GestionReservaRoutingModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    SharedModule
  ],
  exports: [
    BuscarRadicadoComponent
  ]
})
export class GestionReservaModule { }
