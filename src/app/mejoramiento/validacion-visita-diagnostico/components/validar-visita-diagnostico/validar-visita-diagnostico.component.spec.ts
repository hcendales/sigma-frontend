import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarVisitaDiagnosticoComponent } from './validar-visita-diagnostico.component';

describe('ValidarVisitaDiagnosticoComponent', () => {
  let component: ValidarVisitaDiagnosticoComponent;
  let fixture: ComponentFixture<ValidarVisitaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidarVisitaDiagnosticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidarVisitaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
