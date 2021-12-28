import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionVisitaTecnicaComponent } from './programacion-visita-tecnica.component';

describe('ProgramacionVisitaTecnicaComponent', () => {
  let component: ProgramacionVisitaTecnicaComponent;
  let fixture: ComponentFixture<ProgramacionVisitaTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionVisitaTecnicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionVisitaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
