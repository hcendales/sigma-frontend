import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVisitaDiagnosticoComponent } from './registro-visita-diagnostico.component';

describe('RegistroVisitaDiagnosticoComponent', () => {
  let component: RegistroVisitaDiagnosticoComponent;
  let fixture: ComponentFixture<RegistroVisitaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroVisitaDiagnosticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVisitaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
