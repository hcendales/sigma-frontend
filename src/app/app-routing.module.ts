import { ListaSeguimientoComponent } from './shared/components/lista-seguimiento/lista-seguimiento.component';
import { GestionMasivaComponent } from './shared/components/gestion-masiva/gestion-masiva.component';
import { ListaPendientesComponent } from './shared/components/lista-pendientes/lista-pendientes.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/security/login/login.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { NotAuthorizedComponent } from './core/not-authorized/not-authorized.component';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { AuthGuard } from './core/security/services/auth-guard';
import { LoginGuard } from './core/security/services/login.guard';

// Componente
//import { ValidarVisitaDiagnosticoComponent } from './mejoramiento/validar-visita-diagnostico/components/validar-visita-diagnostico/validar-visita-diagnostico.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[LoginGuard], canActivateChild:[LoginGuard],
    children:[
      { path: 'welcome', component: WelcomeComponent, canActivate:[AuthGuard]},
      { path: 'reportes', component: WelcomeComponent, canActivate:[AuthGuard]},
      { path: 'mejoramiento-reg-visita-diagnostico', canLoad:[AuthGuard],loadChildren: () => import('./mejoramiento/registro-visita-diagnostico/registro-visita-diagnostico.module').then(m => m.RegistroVisitaDiagnosticoModule) },
      { path: 'mejoramiento-revision-visita-diagnostico', canLoad:[AuthGuard],loadChildren: () => import('./mejoramiento/revision-visita-diagnostico/revision-visita-diagnostico.module').then(m => m.RevisionVisitaDiagnosticoModule) },
      { path: 'mejoramiento-revision-visita-disenio', canLoad:[AuthGuard],loadChildren: () => import('./mejoramiento/revisar-diseno/revisar-diseno.module').then(m => m.RevisarDisenoModule) },
      { path: 'mejoramiento-consultas', loadChildren: () => import('./mejoramiento/consultas-mejoramiento/consultas-mejoramiento.module').then(m => m.ConsultasMejoramientoModule) },
      { path: 'lista-pendientes/:idActividad', component: ListaPendientesComponent, canLoad: [AuthGuard]},
      { path: 'mejoramiento-cargues', loadChildren: () => import('./mejoramiento/cargues-mejoramiento/cargues-mejoramiento.module').then(m => m.CarguesMejoramientoModule) },
      { path: 'gestion-masiva/:idActividad', component: GestionMasivaComponent, canLoad: [AuthGuard] },
      { path: 'mejoramiento-validar-visita', loadChildren: () => import('./mejoramiento/validacion-visita-diagnostico/validacion-visita-diagnostico.module').then(m => m.ValidacionVisitaDiagnosticoModule) },
      { path: 'mejoramiento-gestion-masiva', loadChildren: () => import('./mejoramiento/gestion-misionalidad/gestion-misionalidad.module').then(m => m.GestionMisionalidadModule) },
      { path: 'mejoramiento-gestion-reserva', loadChildren: () => import('./mejoramiento/gestion-reserva/gestion-reserva.module').then(m => m.GestionReservaModule) },
      { path: 'mejoramiento-solicitud-ensayo-laboratorio', loadChildren: () => import('./mejoramiento/solicitud-ensayo-laboratorio/solicitud-ensayo-laboratorio.module').then(m => m.SolicitudEnsayoLaboratorioModule) },
      { path: 'mejoramiento-cargue-resultado-ensayo', loadChildren: () => import('./mejoramiento/cargue-resultado-ensayo/cargue-resultado-ensayo.module').then(m => m.CargueResultadoEnsayoModule) },
      { path: 'mejoramiento-diseno', loadChildren: () => import('./mejoramiento/registrar-diseno/registrar-diseno.module').then(m => m.RegistrarDisenoModule) },
      { path: 'mejoramiento-documentos-mantenimiento-vial', loadChildren: () => import('./mejoramiento/documentos-mantenimiento-vial/documentos-mantenimiento-vial.module').then(m => m.DocumentosMantenimientoVialModule) },
      { path: 'mejoramiento-registro-programacion-diaria/:idActividad', loadChildren: () => import('./mejoramiento/registro-programacion-diaria/registro-programacion-diaria.module').then(m => m.RegistroProgramacionDiariaModule) },
      // { path: 'mejoramiento-consolidado-trabajo-diario', loadChildren: () => import('./mejoramiento/consolidado-trabajo-diario/consolidado-trabajo-diario.module').then(m => m.ConsolidadoTrabajoDiarioModule) },
      { path: 'mejoramiento-registro-diario-cuadrilla/:idActividad', loadChildren: () => import('./mejoramiento/registro-diario-por-cuadrilla/registro-diario-por-cuadrilla.module').then(m => m.RegistroDiarioPorCuadrillaModule) },

      { path: 'mejoramiento-vincular-pks', loadChildren: () => import('./mejoramiento/vincular-pks/vincular-pks.module').then(m => m.VincularPksModule) },
      { path: 'administracion-equipos', loadChildren: () => import('./administracion/equipo/equipo.module').then(m => m.EquipoModule) },
      { path: 'administracion-lugares', loadChildren: () => import('./administracion/lugar/lugar.module').then(m => m.LugarModule) },
      { path: 'administracion-personas', loadChildren: () => import('./administracion/persona/persona.module').then(m => m.PersonaModule) },
      { path: 'administracion-recurso', loadChildren: () => import('./administracion/recurso/recurso.module').then(m => m.RecursoModule) },
      { path: 'administracion/recurso-semana', loadChildren: () => import('./administracion/recurso-semana/recurso-semana.module').then(m => m.RecursoSemanaModule) },
      { path: 'asignar-visita', loadChildren: () => import('./asignar-visita/asignar-visita.module').then(m => m.AsignarVisitaModule) },
      { path: 'produccion-mantenimiento', loadChildren: () => import('./produccion/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule) },
      { path: 'produccion-intervencion', loadChildren: () => import('./produccion/intervencion/intervencion.module').then(m => m.IntervencionModule) },
      { path: 'apiques-aforos', loadChildren: () => import('./mejoramiento/apiques-aforos/apiques-aforos.module').then(m => m.ApiquesAforosModule) },
      { path: 'aforos', loadChildren: () => import('./mejoramiento/aforos/aforos.module').then(m => m.AforosModule) },
      { path: 'intervencion', loadChildren: () => import('./intervencion/registro-visita-verificacion/registro-visita-verificacion.module').then(m => m.RegistroVisitaVerificacionModule) },
      { path: 'alcaldias', loadChildren: () => import('./alcaldias/alcaldias.module').then(m => m.AlcaldiasModule) },
    ]
  },
  { path: '', component: LoginComponent},
  { path: 'visorFotos', loadChildren: () => import('./visor-fotos/visor-fotos.module').then(m => m.VisorFotosModule) },
  { path: '**', redirectTo: '/not-found' }
 ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
