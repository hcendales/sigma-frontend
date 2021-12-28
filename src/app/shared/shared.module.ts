import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaVisitaDiagnosticoComponent } from './components/consulta-visita-diagnostico/consulta-visita-diagnostico.component';
import { ListaPendientesComponent} from './components/lista-pendientes/lista-pendientes.component';
import { ListaSeguimientoComponent } from './components/lista-seguimiento/lista-seguimiento.component';
import { AvanceMantenimientoComponent } from './components/avance-mantenimiento/avance-mantenimiento.component';
import { MapaUmvComponent } from './components/mapa-umv/mapa-umv.component';
import { BusquedaMantenimientosComponent } from './components/busqueda-mantenimientos/busqueda-mantenimientos.component';
import { CargueArchivoComponent } from './components/cargue-archivo/cargue-archivo.component';
// Servicios http
import { HttpClientModule } from '@angular/common/http';

// material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {​​​​​ FormsModule, ReactiveFormsModule }​​​​​ from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule} from '@angular/material/autocomplete';


import { GestionMasivaComponent } from './components/gestion-masiva/gestion-masiva.component';
import { ListaTransicionComponent } from './components/lista-transicion/lista-transicion.component';
import { AvanceMasivoMantenimientoComponent } from './components/avance-masivo-mantenimiento/avance-masivo-mantenimiento.component';

import { ListaLugarComponent } from './../administracion/components/lugar/lista-lugar/lista-lugar.component';
import { CreateLugarComponent } from './../administracion/components/lugar/create-lugar/create-lugar.component';
import { ListaMaquinariaEquiposComponent } from './components/lista-maquinaria-equipos/lista-maquinaria-equipos.component';
import { ListaContratosMqeqComponent } from './components/lista-contratos-mqeq/lista-contratos-mqeq.component';
import { ListaMaqEquVigentesComponent } from './components/lista-maq-equ-vigentes/lista-maq-equ-vigentes.component';
import { ListaFallosComponent } from './components/lista-fallos/lista-fallos.component';
import { TablaFiltrosComponent } from './components/tabla-filtros/tabla-filtros.component';
import { MatRadioModule } from '@angular/material/radio';
import { ListaMaqEquDisponiblesComponent } from './components/lista-maq-equ-disponibles/lista-maq-equ-disponibles.component';
import { ListaFranjasComponent } from './components/lista-franjas/lista-franjas.component';
import { ListaProgramacionPeriocidadComponent } from './components/lista-programacion-periocidad/lista-programacion-periocidad.component';
import { ListaPksActaComponent } from './components/lista-pks-acta/lista-pks-acta.component';
import { ListaPksAsociarComponent } from './components/lista-pks-asociar/lista-pks-asociar.component';
import { RegistrarInsumosComponent } from './components/registrar-insumos/registrar-insumos.component';
import { ConsultaVisitaEncabezadoComponent } from './components/consulta-visita-encabezado/consulta-visita-encabezado.component';
import { ConsultaDisenioComponent } from './components/consulta-disenio/consulta-disenio.component';
import { ListaProgramacionSinpmtComponent } from './components/lista-programacion-sinpmt/lista-programacion-sinpmt.component';
import { ListaRadicadosComponent } from './components/lista-radicados/lista-radicados.component';
import { ConsultaAlternativaComponent } from './components/consulta-alternativa/consulta-alternativa.component';
import { ListaAlternativaComponent } from './components/lista-alternativa/lista-alternativa.component';
import { ConsultarApiquesComponent } from './components/consultar-apiques/consultar-apiques.component';
import { RegistrarPriorizacionComponent } from './components/registrar-priorizacion/registrar-priorizacion.component';
import { VerParametrosDisenioComponent } from './components/ver-parametros-disenio/ver-parametros-disenio.component';
import { HistorialMantenimientoComponent } from './components/historial-mantenimiento/historial-mantenimiento.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';



@NgModule({
  declarations: [ConsultaVisitaDiagnosticoComponent,
                ListaPendientesComponent,
                 AvanceMantenimientoComponent,
                 BusquedaMantenimientosComponent,
                 GestionMasivaComponent,
                 ListaSeguimientoComponent,
                 ListaTransicionComponent,
                 AvanceMasivoMantenimientoComponent,
                 CargueArchivoComponent,
                 MapaUmvComponent,
                 ListaLugarComponent,
                 CreateLugarComponent,
                 ListaMaquinariaEquiposComponent,
                 ListaContratosMqeqComponent,
                 ListaMaqEquVigentesComponent,
                 ListaFallosComponent,
                 TablaFiltrosComponent,
                 ListaMaqEquDisponiblesComponent,
                 ListaFranjasComponent,
                 ListaProgramacionPeriocidadComponent,
                 ListaPksActaComponent,
                 ListaPksAsociarComponent,
                 RegistrarInsumosComponent,
                 ConsultaVisitaEncabezadoComponent,
                 ConsultaDisenioComponent,
                 ListaProgramacionSinpmtComponent,
                 ListaRadicadosComponent,
                 ConsultaAlternativaComponent,
                 ListaAlternativaComponent,
                 ConsultarApiquesComponent,
                 RegistrarPriorizacionComponent,
                 VerParametrosDisenioComponent,
                 HistorialMantenimientoComponent,
                 DialogConfirmComponent
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
    MatGridListModule,
    MatRadioModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatAutocompleteModule,
  ],
  exports: [
    ConsultaVisitaDiagnosticoComponent,
    AvanceMantenimientoComponent,
    ListaPendientesComponent,
    ListaSeguimientoComponent,
    CargueArchivoComponent,
    MapaUmvComponent,
    ListaLugarComponent,
    CreateLugarComponent,
    GestionMasivaComponent,
    AvanceMasivoMantenimientoComponent,
    ListaMaquinariaEquiposComponent,
    ListaContratosMqeqComponent,
    ListaMaqEquVigentesComponent,
    ListaFallosComponent,
    ListaMaqEquDisponiblesComponent,
    ListaFranjasComponent,
    ListaProgramacionPeriocidadComponent,
    ListaPksActaComponent,
    ListaPksAsociarComponent,
    RegistrarInsumosComponent,
    ConsultaVisitaEncabezadoComponent,
    ConsultaDisenioComponent,
    ListaProgramacionSinpmtComponent,
    ListaRadicadosComponent,
    ConsultaAlternativaComponent,
    ListaAlternativaComponent,
    ConsultarApiquesComponent,
    RegistrarPriorizacionComponent,
    VerParametrosDisenioComponent,
    HistorialMantenimientoComponent,
    DialogConfirmComponent
  ]
})
export class SharedModule { }
