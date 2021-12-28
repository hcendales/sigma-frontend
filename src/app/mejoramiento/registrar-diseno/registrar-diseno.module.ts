import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

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
import {MatStepperModule} from '@angular/material/stepper';
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { RegistrarDisenoRoutingModule } from './registrar-diseno-routing.module';
import { RegistroAlternativaComponent } from './components/registro-alternativa/registro-alternativa.component';
import { RegistroCapaComponent } from './components/registro-capa/registro-capa.component';
import { RegistroDisenoComponent } from './components/registro-diseno/registro-diseno.component';
import { RegistroInsumosComponent } from './components/registro-insumos/registro-insumos.component';
import { ConsultaApiquesComponent } from './components/consulta-apiques/consulta-apiques.component';
import { ListarAlternativasComponent } from './components/listar-alternativas/listar-alternativas.component';
import { ActualizarAlternativaComponent } from './components/actualizar-alternativa/actualizar-alternativa.component';
import { VerAlternativaComponent } from './components/ver-alternativa/ver-alternativa.component';
import { VerOtroFactorComponent } from './components/ver-otro-factor/ver-otro-factor.component';
import { VerFotosComponent } from './components/ver-fotos/ver-fotos.component';
import { VerFallasComponent } from './components/ver-fallas/ver-fallas.component';


@NgModule({
  declarations: [RegistroAlternativaComponent, RegistroCapaComponent, RegistroDisenoComponent, RegistroInsumosComponent, ConsultaApiquesComponent, ListarAlternativasComponent, ActualizarAlternativaComponent, VerAlternativaComponent, VerOtroFactorComponent, VerFotosComponent, VerFallasComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegistrarDisenoRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatListModule,
    MatTableModule,
    MatGridListModule,
    MatStepperModule,
    SharedModule,
    MatSortModule,
    MatDatepickerModule

  ]
})
export class RegistrarDisenoModule { }
