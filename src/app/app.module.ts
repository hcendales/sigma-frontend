// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
// services
import { SecurityService } from './core/security/services/security.service';
import { AuthGuard } from './core/security/services/auth-guard';
import { AuthInterceptor } from './core/security/http-interceptors/auth-interceptor';
// material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTabsModule } from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import {ScrollingModule} from '@angular/cdk/scrolling';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './core/security/login/login.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { NotAuthorizedComponent } from './core/not-authorized/not-authorized.component';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { MenuItemComponent } from './core/menu-item/menu-item.component';
import { SimpleDialogComponent } from './core/simple-dialog/simple-dialog.component';
import { EnEsperaComponent } from './core/en-espera/en-espera.component';
import { RevisionVisitaDiagnosticoComponent } from './mejoramiento/revision-visita-diagnostico/components/revision-visita-diagnostico/revision-visita-diagnostico.component';
import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';




// import { ModalComponent } from './core/modal/modal.component';
// import { ModalCargandoComponent } from './core/modal-cargando/modal-cargando.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    NotAuthorizedComponent,
    WelcomeComponent,
    DashboardComponent,
    MenuItemComponent,
    SimpleDialogComponent,
    EnEsperaComponent,
    RevisionVisitaDiagnosticoComponent, 

    //ValidarVisitaDiagnosticoComponent,
    // ModalComponent,
    // ModalCargandoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatTableModule,
    MatSliderModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    SharedModule,
    MatCheckboxModule,
    MatTableExporterModule,
    ScrollingModule,
    MatTabsModule,
    MatGridListModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MomentDateModule,
  ],
  providers: [SecurityService,
              AuthInterceptor,
              AuthGuard,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true
              }

            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
