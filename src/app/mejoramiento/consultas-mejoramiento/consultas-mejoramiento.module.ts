import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {​​​​​ FormsModule }​​​​​ from'@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ConsultasMejoramientoRoutingModule } from './consultas-mejoramiento-routing.module';
import { ConsultasMejoramientoComponent } from './consultas-mejoramiento.component';
import { ConsultaGeneralGestionComponent } from './components/consulta-general-gestion/consulta-general-gestion.component';
import { ConsultaHistorialComponent } from './components/consulta-historial/consulta-historial.component';
import { SharedModule } from '../../shared/shared.module';
import { VerDetalleMantenimientoComponent } from './components/ver-detalle-mantenimiento/ver-detalle-mantenimiento.component';


@NgModule({
  declarations: [ConsultasMejoramientoComponent, ConsultaGeneralGestionComponent, ConsultaHistorialComponent, VerDetalleMantenimientoComponent],
  imports: [
    CommonModule,
    ConsultasMejoramientoRoutingModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatTooltipModule,
    SharedModule
  ]
})
export class ConsultasMejoramientoModule { }
