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

import { TabSeccionesComponent } from './components/tab-secciones/tab-secciones.component';
import { RegistroDiarioPorCuadrillaRoutingModule } from './registro-diario-por-cuadrilla-routing.module';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { SeccionInformacionGeneralComponent } from './components/seccion-informacion-general/seccion-informacion-general.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { SeccionInformacionDelPersonalComponent } from './components/seccion-informacion-del-personal/seccion-informacion-del-personal.component';
import { MsgErrorDirective } from './msg-error.directive';
import { SeccionCantidadesDeObraComponent } from './components/seccion-cantidades-de-obra/seccion-cantidades-de-obra.component';
import { SeccionControlDeCalidadComponent } from './components/seccion-control-de-calidad/seccion-control-de-calidad.component';
import { SeccionMaterialesComponent } from './components/seccion-materiales/seccion-materiales.component';
import { SeccionMezclaAsfalticasConcretosComponent } from './components/seccion-mezcla-asfalticas-concretos/seccion-mezcla-asfalticas-concretos.component';
import { SeccionMaquinariaComponent } from './components/seccion-maquinaria/seccion-maquinaria.component';
import { SeccionRetiroMaterialesEscombrosComponent } from './components/seccion-retiro-materiales-escombros/seccion-retiro-materiales-escombros.component';
import { SeccionObservacionesGeneralesComponent } from './components/seccion-observaciones-generales/seccion-observaciones-generales.component';



@NgModule({
  declarations: [
    TabSeccionesComponent,
    RegistroDiarioComponent,
    SeccionInformacionGeneralComponent,
    DialogConfirmComponent,
    SeccionInformacionDelPersonalComponent,
    MsgErrorDirective,
    SeccionCantidadesDeObraComponent,
    SeccionControlDeCalidadComponent,
    SeccionMaterialesComponent,
    SeccionMezclaAsfalticasConcretosComponent,
    SeccionMaquinariaComponent,
    SeccionRetiroMaterialesEscombrosComponent,
    SeccionObservacionesGeneralesComponent,
    
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
    RegistroDiarioPorCuadrillaRoutingModule,
    SharedModule,
  ]
})
export class RegistroDiarioPorCuadrillaModule { }
