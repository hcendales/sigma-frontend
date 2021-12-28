import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVisitaDiagnosticoComponent } from './consulta-visita-diagnostico.component';

describe('ConsultaVisitaDiagnosticoComponent', () => {
  let component: ConsultaVisitaDiagnosticoComponent;
  let fixture: ComponentFixture<ConsultaVisitaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaVisitaDiagnosticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaVisitaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
