import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarVisitaDiagnosticoComponent } from './revisar-visita-diagnostico.component';

describe('RevisarVisitaDiagnosticoComponent', () => {
  let component: RevisarVisitaDiagnosticoComponent;
  let fixture: ComponentFixture<RevisarVisitaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisarVisitaDiagnosticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisarVisitaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
