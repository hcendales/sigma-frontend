import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';

import { RegistroProgramacionDiariaRoutingModule } from './registro-programacion-diaria-routing.module';

import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { TabSeccionesComponent } from './components/tab-secciones/tab-secciones.component';
import { SeccionProgramacionDiariaComponent } from './components/seccion-programacion-diaria/seccion-programacion-diaria.component';
import { SeccionInspeccionYOficialCuadrillaComponent } from './components/seccion-inspeccion-y-oficial-cuadrilla/seccion-inspeccion-y-oficial-cuadrilla.component';
import { SeccionPersonalComponent } from './components/seccion-personal/seccion-personal.component';
import { SeccionMaquinariaComponent } from './components/seccion-maquinaria/seccion-maquinaria.component';
import { SeccionMaterialComponent } from './components/seccion-material/seccion-material.component';
import { SeccionEquipoPortatilComponent } from './components/seccion-equipo-portatil/seccion-equipo-portatil.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { MsgErrorDirective } from './directives/msg-error.directive';
import { MapComponent } from './components/map/map.component';


@NgModule({
  declarations: [
    RegistroDiarioComponent,
    TabSeccionesComponent,
    SeccionProgramacionDiariaComponent,
    SeccionInspeccionYOficialCuadrillaComponent,
    SeccionPersonalComponent,
    SeccionMaquinariaComponent,
    SeccionMaterialComponent,
    SeccionEquipoPortatilComponent,
    DialogConfirmComponent,
    MsgErrorDirective,
    MapComponent,
    
  ],
  imports: [
    CommonModule, 
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    RegistroProgramacionDiariaRoutingModule,
    SharedModule,
  ]
})
export class RegistroProgramacionDiariaModule { }
