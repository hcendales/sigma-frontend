import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ConsultaListasService } from '../../../../core/services/consulta-listas.service';
import { EntityTabLugarService } from '../../../../core/services/entity-tab-lugar.service';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-create-lugar',
  templateUrl: './create-lugar.component.html',
  styleUrls: ['./create-lugar.component.scss']
})
export class CreateLugarComponent implements OnInit {
  // Formario
  public formEntity: FormGroup;
  public titulo = 'Crear Lugar';
  // Variable de validación
  public ready: boolean = false;
  public guardadoTodo: boolean = false;
  public listas: any;

  constructor(private activatedroute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private listasService: ConsultaListasService,
              private entityLugar: EntityTabLugarService,
              ) {
                this.formEntity = this.formBuilder.group({
                  idTipoLugar: ['', [Validators.required]],
                  idTipoOrigen: ['', [Validators.required]],
                  contactoNombre: ['',[Validators.maxLength(100)]],
                  contactoCorreoElectronico: ['', [Validators.email, Validators.maxLength(100)]],
                  contactoTelefono: ['', [Validators.maxLength(20)]],
                  direccion: ['', [Validators.maxLength(10)]],
                  idTipoEstadoLugar: ['', [Validators.required]],
                  nombre: ['', [Validators.required, Validators.maxLength(300)]],
                  descripcion: ['', [Validators.required, Validators.maxLength(300)]],
                });
               }

  ngOnInit(): void {}

  save(event: Event) {
    event.preventDefault();
    if (this.formEntity.valid){
      const value = this.formEntity.value;
      console.log(value);
      this.entityLugar.insertar(value);
    }else {
      this.formEntity.markAllAsTouched();
    }
  }
  cancel(event: Event) {
    event.preventDefault();
    console.log('click');
  }
  // Campos a validar Tipo Lugar
  get tipoLugarField(): any{
    return this.formEntity.get('idTipoLugar');
  }
  // Campo a validar Tipo Origen
  get tipoOrigenField(): any{
    return this.formEntity.get('idTipoOrigen');
  }
  // Campo a validar Contacto Nombre
  get contactoNombreField(){
    return this.formEntity.get('contactoNombre');
  }
  // Campo a validar nombre
  get nombreField(): any{
    return this.formEntity.get('nombre');
  }
  // Campo a validar descripción
  get descripcionField(): any{
    return this.formEntity.get('descripcion');
  }
  // Campo a validar direccion
  get direccionField(): any{
    return this.formEntity.get('direccion');
  }
  // Campo a valida contacto numero
  get contactoTelefonoField(): any{
    return this.formEntity.get('contactoTelefono');
  }
  // Campo a validar correo electronico
  get contactoCorreoField(): any{
    return this.formEntity.get('contactoCorreoElectronico');
  }
  // Campo a validar estado
  get estadoField(): any{
    return this.formEntity.get('idTipoEstadoLugar');
  }
}


