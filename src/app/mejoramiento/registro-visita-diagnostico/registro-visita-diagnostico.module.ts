import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RegistroVisitaDiagnosticoRoutingModule } from './registro-visita-diagnostico-routing.module';
import { GestionReservaModule } from '../gestion-reserva/gestion-reserva.module'


//material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {​​​​​ FormsModule }​​​​​ from'@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
//components

//import { ModalCargandoComponent } from '../../core/modal-cargando/modal-cargando.component';
import { RegistroVisitaDiagnosticoComponent } from './registro-visita-diagnostico.component';
import { AutoprogramarVisitaComponent } from './components/autoprogramar-visita/autoprogramar-visita.component';
import { RegistroVisitaComponent } from './components/registro-visita/registro-visita.component';
import { RegistroUnidadMuestreoComponent } from './components/registro-unidad-muestreo/registro-unidad-muestreo.component';
import { RegistroFallasComponent } from './components/registro-fallas/registro-fallas.component';
import { RegistroOtrosFactoresComponent } from './components/registro-otros-factores/registro-otros-factores.component';
import { RegistroFotoComponent } from './components/registro-foto/registro-foto.component';
//services
import { FormUnidadesMuestreoGeneradorService } from './services/form-unidades-muestreo-generador.service';
import { FormFallasGeneradorService } from './services/form-fallas-generador.service';
import { ModalAutoprogramarComponent } from './components/modal-autoprogramar/modal-autoprogramar.component';
import { RegistroApiqueComponent } from './components/registro-apique/registro-apique.component';
import { UbicarApiqueComponent } from './components/ubicar-apique/ubicar-apique.component';

import { ListarApiquesComponent } from './components/listar-apiques/listar-apiques.component';
import { ActualizarApiquesComponent } from './components/actualizar-apiques/actualizar-apiques.component';
import { ApiquesAledaniosComponent } from './components/apiques-aledanios/apiques-aledanios.component';

@NgModule({
  declarations: [RegistroVisitaDiagnosticoComponent, AutoprogramarVisitaComponent, RegistroVisitaComponent, RegistroUnidadMuestreoComponent, RegistroFallasComponent, RegistroOtrosFactoresComponent, RegistroFotoComponent, ModalAutoprogramarComponent, RegistroApiqueComponent, UbicarApiqueComponent, ListarApiquesComponent, ActualizarApiquesComponent, ApiquesAledaniosComponent],
  imports: [
    CommonModule,
    RegistroVisitaDiagnosticoRoutingModule,
    GestionReservaModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    SharedModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatListModule,
    MatTableModule,
    MatGridListModule,
    MatAutocompleteModule
  ],
  providers: [
    FormUnidadesMuestreoGeneradorService,
    FormFallasGeneradorService,
  ],
  exports: [
    ModalAutoprogramarComponent
  ]
})
export class RegistroVisitaDiagnosticoModule { }
