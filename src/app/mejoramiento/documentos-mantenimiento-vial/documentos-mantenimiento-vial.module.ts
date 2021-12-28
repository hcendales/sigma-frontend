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


import { DocumentosMantenimientoVialRoutingModule } from './documentos-mantenimiento-vial-routing.module';
import { CargueDocumentosComponent } from './components/cargue-documentos/cargue-documentos.component';
import { TableDocumentosComponent } from './components/table-documentos/table-documentos.component';
import { DropZoneDocumentosComponent } from './components/drop-zone-documentos/drop-zone-documentos.component';
import { DetalleDocumentosComponent } from './components/detalle-documentos/detalle-documentos.component';
import { DndDirective } from './directives/dnd.directive';
import { ProgressComponent } from './components/progress/progress.component';
import { ModalConfirmarComponent } from './components/modal-confirmar/modal-confirmar.component';

@NgModule({
  declarations: [
    CargueDocumentosComponent, 
    DetalleDocumentosComponent, 
    DndDirective,
    DropZoneDocumentosComponent, 
    ModalConfirmarComponent,
    ProgressComponent,
    TableDocumentosComponent, 
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

    
    DocumentosMantenimientoVialRoutingModule
  ],
  bootstrap: [DropZoneDocumentosComponent]
})
export class DocumentosMantenimientoVialModule { }
