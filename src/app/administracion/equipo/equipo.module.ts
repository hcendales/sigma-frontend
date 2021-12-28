import { MatNativeDateModule } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {​​​​​ FormsModule, ReactiveFormsModule }​​​​​ from '@angular/forms';

import { EquipoRoutingModule } from './equipo-routing.module';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { InsertarComponent } from './components/insertar/insertar.component';
import { ListarComponent } from './components/listar/listar.component';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { VerComponent } from './components/ver/ver.component';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSortModule} from '@angular/material/sort';



@NgModule({
  declarations: [EliminarComponent, InsertarComponent, ListarComponent, ActualizarComponent, VerComponent],
  imports: [
    CommonModule,
    EquipoRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule
  ]
})
export class EquipoModule { }
