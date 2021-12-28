import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { RegistroVisitaVerificacionRoutingModule } from './registro-visita-verificacion-routing.module';
import { RegistroVisitaVerificacionComponent } from './registro-visita-verificacion.component';
import { AreaIntervencionComponent } from '../area-intervencion/area-intervencion.component';
import { NovedadadesIntervencionComponent } from '../components/novedadades-intervencion/novedadades-intervencion.component';
import { ListaVerificacionComponent } from '../components/lista-verificacion/lista-verificacion.component';

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
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
  declarations: [RegistroVisitaVerificacionComponent, AreaIntervencionComponent, NovedadadesIntervencionComponent,ListaVerificacionComponent],
  imports: [
    CommonModule,
    RegistroVisitaVerificacionRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    ​FormsModule,
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
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RegistroVisitaVerificacionModule { }
