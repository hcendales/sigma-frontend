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
import { ngfModule } from 'angular-file';
import { MatBadgeModule } from '@angular/material/badge';

import { CargueResultadoEnsayoRoutingModule } from './cargue-resultado-ensayo-routing.module';
import { GestionSolicitudComponent } from './components/gestion-solicitud/gestion-solicitud.component';
import { InformeSolicitudComponent } from './components/informe-solicitud/informe-solicitud.component';
import { ModalCargueArchivoComponent } from './components/modal-cargue-archivo/modal-cargue-archivo.component';
import { ModalConfirmarComponent } from './components/modal-confirmar/modal-confirmar.component';
import { ModalDescargaArchivoComponent } from './components/modal-descarga-archivo/modal-descarga-archivo.component';
import { ModalVersionComponent } from './components/modal-version/modal-version.component';
import { ResultadoEnsayoComponent } from './components/resultado-ensayo/resultado-ensayo.component';
import { SolicitudEnsayoLaboratorioModule } from '../solicitud-ensayo-laboratorio/solicitud-ensayo-laboratorio.module';
import { TableEnsayoComponent } from './components/table-ensayo/table-ensayo.component';
import { TableInformeComponent } from './components/table-informe/table-informe.component';
import { TableVersionSolicitudComponent } from './components/table-version-solicitud/table-version-solicitud.component';
import { TabsDistribuidorComponent } from './components/tabs-distribuidor/tabs-distribuidor.component';


@NgModule({
  declarations: [
    GestionSolicitudComponent,
    InformeSolicitudComponent,
    ModalConfirmarComponent,
    ResultadoEnsayoComponent,
    TableEnsayoComponent,
    TableInformeComponent,
    TableVersionSolicitudComponent,
    TabsDistribuidorComponent,
    ModalCargueArchivoComponent,
    ModalDescargaArchivoComponent,
    ModalVersionComponent,
  ],
  imports: [
    CargueResultadoEnsayoRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatBadgeModule,
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
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    SharedModule,
    SolicitudEnsayoLaboratorioModule,
    ngfModule,

  ]
})
export class CargueResultadoEnsayoModule { }
