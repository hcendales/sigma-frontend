import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaHistorialComponent } from './consulta-historial.component';

describe('ConsultaHistorialComponent', () => {
  let component: ConsultaHistorialComponent;
  let fixture: ComponentFixture<ConsultaHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaHistorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
