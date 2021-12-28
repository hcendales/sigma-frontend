import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionVisitaDiagnosticoComponent } from './validacion-visita-diagnostico.component';

describe('ValidacionVisitaDiagnosticoComponent', () => {
  let component: ValidacionVisitaDiagnosticoComponent;
  let fixture: ComponentFixture<ValidacionVisitaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacionVisitaDiagnosticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionVisitaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
