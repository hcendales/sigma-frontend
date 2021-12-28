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

import { RevisarDisenoRoutingModule } from './revisar-diseno-routing.module';
import { RevisarDisenoComponent } from './components/revisar-diseno/revisar-diseno.component';


@NgModule({
  declarations: [RevisarDisenoComponent],
  imports: [
    CommonModule,
    RevisarDisenoRoutingModule,
    MatCardModule,
    MatExpansionModule,
    SharedModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    

  ]
})
export class RevisarDisenoModule {

 }
