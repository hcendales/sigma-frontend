import { Equipo } from './../models/equipo';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../security/services/security.service';


@Injectable({
  providedIn: 'root'
})
export class EntityTabEquipoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private securityService: SecurityService, private http: HttpClient) { }
  list(condition: string) {
    const url = '/SIGMA-backend-desa/api/equipo/consultarXFiltro';
    const body = {
      usuario: this.securityService.userSession.login,
      filtro: condition
    };
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  insertar( entity: Equipo){
    const url = '/SIGMA-backend-desa/api/equipo/insertar';
    const body = {
      usuario: this.securityService.userSession.login,
      equipo: {
        numeroInterno: entity.numeroInterno,
        placaInventario: entity.placaInventario,
        placa: entity.placa,
        movil: entity.movil,
        idTipoClaseEquipo: entity.idTipoClaseEquipo,
        idTipoEquipo: entity.idTipoEquipo,
        picoYPlaca: entity.picoYPlaca,
        idTipoOrigenEquipo: entity.idTipoOrigenEquipo,
        plazoDiasMantenimiento: entity.plazoDiasMantenimiento,
        horasMantenimiento: entity.horasMantenimiento,
        kilometrosMantenimiento: entity.kilometrosMantenimiento,
        fechaUltimoMantenimiento: entity.fechaUltimoMantenimiento,
        fechaSiguienteMantenimiento: entity.fechaSiguienteMantenimiento,
        idTipoEstadoEquipo: entity.idTipoEstadoEquipo,
        idTipoMarcaEquipo: entity.idTipoMarcaEquipo,
        linea: entity.linea,
        cilindraje: entity.cilindraje,
        numeroMotor: entity.numeroMotor,
        numeroChasis: entity.numeroChasis,
        idTipoCombustible: entity.idTipoCombustible,
        modelo: entity.modelo,
        color: entity.color,
        idTipoArea: entity.idTipoArea,
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        toneladas: entity.toneladas,
        pasajeros: entity.pasajeros,
        numeroSerial: entity.numeroSerial,
        referencia: entity.referencia,
        descripcion: entity.descripcion,
        volumenM3: entity.volumenM3,
        idTipoUnidadUso: entity.idTipoUnidadUso,
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  actualizar( entity: Equipo){
    const url = '/SIGMA-backend-desa/api/equipo/actualizar';
    const body = {
      usuario: this.securityService.userSession.login,
      equipo: {
        idEquipo: entity.idEquipo,
        numeroInterno: entity.numeroInterno,
        placaInventario: entity.placaInventario,
        placa: entity.placa,
        movil: entity.movil,
        idTipoClaseEquipo: entity.idTipoClaseEquipo,
        idTipoEquipo: entity.idTipoEquipo,
        picoYPlaca: entity.picoYPlaca,
        idTipoOrigenEquipo: entity.idTipoOrigenEquipo,
        plazoDiasMantenimiento: entity.plazoDiasMantenimiento,
        horasMantenimiento: entity.horasMantenimiento,
        kilometrosMantenimiento: entity.kilometrosMantenimiento,
        fechaUltimoMantenimiento: entity.fechaUltimoMantenimiento,
        fechaSiguienteMantenimiento: entity.fechaSiguienteMantenimiento,
        idTipoEstadoEquipo: entity.idTipoEstadoEquipo,
        idTipoMarcaEquipo: entity.idTipoMarcaEquipo,
        linea: entity.linea,
        cilindraje: entity.cilindraje,
        numeroMotor: entity.numeroMotor,
        numeroChasis: entity.numeroChasis,
        idTipoCombustible: entity.idTipoCombustible,
        modelo: entity.modelo,
        color: entity.color,
        idTipoArea: entity.idTipoArea,
        fechaInicio: entity.fechaInicio,
        fechaFin: entity.fechaFin,
        toneladas: entity.toneladas,
        pasajeros: entity.pasajeros,
        numeroSerial: entity.numeroSerial,
        referencia: entity.referencia,
        descripcion: entity.descripcion,
        volumenM3: entity.volumenM3,
        idTipoUnidadUso: entity.idTipoUnidadUso,
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
  // Metodo para Actualizar una persona
  eliminar( idEntity: number){
    const url = '/SIGMA-backend-desa/api/equipo/eliminar';
    const body = {
      usuario: this.securityService.userSession.login,
      equipo: {
        idEquipo: idEntity
      },
    };
    console.log('el body', body);
    return this.http.post<any>(url, body , this.httpOptions).toPromise();
  }
}
