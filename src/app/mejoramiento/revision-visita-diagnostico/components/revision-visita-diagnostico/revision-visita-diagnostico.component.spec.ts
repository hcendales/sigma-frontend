import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionVisitaDiagnosticoComponent } from './revision-visita-diagnostico.component';

describe('RevisionVisitaDiagnosticoComponent', () => {
  let component: RevisionVisitaDiagnosticoComponent;
  let fixture: ComponentFixture<RevisionVisitaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionVisitaDiagnosticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionVisitaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
