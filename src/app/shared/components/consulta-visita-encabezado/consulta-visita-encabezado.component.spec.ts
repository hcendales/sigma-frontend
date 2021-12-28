import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVisitaEncabezadoComponent } from './consulta-visita-encabezado.component';

describe('ConsultaVisitaEncabezadoComponent', () => {
  let component: ConsultaVisitaEncabezadoComponent;
  let fixture: ComponentFixture<ConsultaVisitaEncabezadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaVisitaEncabezadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaVisitaEncabezadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
