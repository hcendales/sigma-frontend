import { NgModule } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

import { InformeDetalleComponent } from './components/informe-detalle/informe-detalle.component';
import { ModalConfirmarComponent } from './components/modal-confirmar/modal-confirmar.component';
import { ModalListaEnsayosComponent } from './components/modal-lista-ensayos/modal-lista-ensayos.component';
import { ModalListaMaterialesComponent } from './components/modal-lista-materiales/modal-lista-materiales.component';
import { ModalTableAsociarComponent } from './components/modal-table-asociar/modal-table-asociar.component';
import { RegistrarServicioComponent } from './components/registrar-servicio/registrar-servicio.component';
import { ServicioApiquesComponent } from './components/servicio-apiques/servicio-apiques.component';
import { ServicioDensidadComponent } from './components/servicio-densidad/servicio-densidad.component';
import { ServicioFormulaComponent } from './components/servicio-formula/servicio-formula.component';
import { ServicioNucleoComponent } from './components/servicio-nucleo/servicio-nucleo.component';
import { ServicioOtrosComponent } from './components/servicio-otros/servicio-otros.component';
import { SolicitudEnsayoLaboratorioComponent } from './components/solicitud-ensayo-laboratorio/solicitud-ensayo-laboratorio.component';
import { SolicitudEnsayoLaboratorioRoutingModule } from './solicitud-ensayo-laboratorio-routing.module';
import { TableMantenimientosActivosComponent } from './components/table-mantenimientos-activos/table-mantenimientos-activos.component';
import { TableNomenclaturaApiqueComponent } from './components/table-nomenclatura-apique/table-nomenclatura-apique.component';


@NgModule({
  declarations: [
    InformeDetalleComponent,
    ModalConfirmarComponent,
    ModalListaEnsayosComponent,
    ModalListaMaterialesComponent,    
    ModalTableAsociarComponent,
    RegistrarServicioComponent,
    ServicioApiquesComponent,
    ServicioDensidadComponent,
    ServicioFormulaComponent,
    ServicioNucleoComponent,
    ServicioOtrosComponent,
    SolicitudEnsayoLaboratorioComponent,
    TableMantenimientosActivosComponent,
    TableNomenclaturaApiqueComponent,
    
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatTabsModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatListModule,
    MatSliderModule, 
    MatSlideToggleModule,
    MatGridListModule,
    SolicitudEnsayoLaboratorioRoutingModule,
  ],
  exports:[
    ServicioDensidadComponent,
    ServicioApiquesComponent,
    ServicioNucleoComponent,
    ServicioFormulaComponent,
    ServicioOtrosComponent,
  ]

})
export class SolicitudEnsayoLaboratorioModule { }
