import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { VincularPksRoutingModule } from './vincular-pks-routing.module'
import { VincularPeticionarioComponent } from './components/vincular-peticionario/vincular-peticionario.component';
import { WebMapaUmvComponent } from './components/web-mapa-umv/web-mapa-umv.component';
import { TablaVincularComponent } from './components/tabla-vincular/tabla-vincular.component';
import { GestionReservaModule } from '../gestion-reserva/gestion-reserva.module'
import {​​​​​ FormsModule, ReactiveFormsModule }​​​​​ from '@angular/forms';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GestionarPeticionarioComponent } from './components/gestionar-peticionario/gestionar-peticionario.component';
import { TablaRadicadoVinculadoComponent } from './components/tabla-radicado-vinculado/tabla-radicado-vinculado.component';
import { AsignarMisionalidadComponent } from './components/asignar-misionalidad/asignar-misionalidad.component';
import { AsignarSeguimientoComponent } from './components/asignar-seguimiento/asignar-seguimiento.component';
import { TablaSeguimientosComponent } from './components/tabla-seguimientos/tabla-seguimientos.component';
import { SegMapaUmvComponent } from './components/seg-mapa-umv/seg-mapa-umv.component';


@NgModule({
  declarations: [VincularPeticionarioComponent, WebMapaUmvComponent, TablaVincularComponent, GestionarPeticionarioComponent, TablaRadicadoVinculadoComponent, AsignarMisionalidadComponent, AsignarSeguimientoComponent, TablaSeguimientosComponent, SegMapaUmvComponent],
  imports: [
    CommonModule,
    SharedModule,
    VincularPksRoutingModule,
    GestionReservaModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ]
})
export class VincularPksModule { }
