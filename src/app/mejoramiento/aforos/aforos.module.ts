import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort'; 
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button'; 
import {MatSelectModule} from '@angular/material/select'; 
import {MatIconModule} from '@angular/material/icon'; 
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip'; 

import { AforosRoutingModule } from './aforos-routing.module';
import { AforosComponent } from './aforos.component';
import { RegistroAforosComponent } from './components/registro-aforos/registro-aforos.component';
import { RegistroDatosAforoComponent } from './components/registro-manual-aforo/registro-datos-aforo.component';
import { ListaAforosComponent } from './components/lista-aforos/lista-aforos.component';
import { MapaSeleccionComponent } from './components/mapa-seleccion/mapa-seleccion.component';
import {MatStepperModule} from '@angular/material/stepper';
import { AnalisisTransitoComponent } from './components/analisis-transito/analisis-transito.component';




@NgModule({
  declarations: [AforosComponent, RegistroAforosComponent, RegistroDatosAforoComponent, ListaAforosComponent, MapaSeleccionComponent, AnalisisTransitoComponent],
  imports: [
    CommonModule,
    AforosRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatStepperModule,
    MatCheckboxModule,
    SharedModule,
    MatTooltipModule,
  ]
})
export class AforosModule { }
