import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {​​​​​ FormsModule }​​​​​ from'@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


import { AlcaldiasRoutingModule } from './alcaldias-routing.module';
import { AlcaldiasComponent } from './alcaldias.component';
import { CambioContraseniaComponent } from './components/cambio-contrasenia/cambio-contrasenia.component';



@NgModule({
  declarations: [AlcaldiasComponent, CambioContraseniaComponent],
  imports: [
    CommonModule,
    AlcaldiasRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class AlcaldiasModule { }
