import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonaRoutingModule } from './persona-routing.module';
import { InsertarComponent } from './components/insertar/insertar.component';
import { ListarComponent } from './components/listar/listar.component';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { VerComponent } from './components/ver/ver.component';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {​​​​​ FormsModule, ReactiveFormsModule }​​​​​ from '@angular/forms';


@NgModule({
  declarations: [InsertarComponent, ListarComponent, ActualizarComponent, EliminarComponent, VerComponent],
  imports: [
    CommonModule,
    PersonaRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatListModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class PersonaModule { }
