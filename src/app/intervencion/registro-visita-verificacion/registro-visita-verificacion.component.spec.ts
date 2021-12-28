import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVisitaVerificacionComponent } from './registro-visita-verificacion.component';

describe('RegistroVisitaVerificacionComponent', () => {
  let component: RegistroVisitaVerificacionComponent;
  let fixture: ComponentFixture<RegistroVisitaVerificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroVisitaVerificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVisitaVerificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
