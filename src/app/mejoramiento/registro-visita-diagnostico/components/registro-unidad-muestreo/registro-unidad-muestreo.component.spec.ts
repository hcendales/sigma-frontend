import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUnidadMuestreoComponent } from './registro-unidad-muestreo.component';

describe('RegistroUnidadMuestreoComponent', () => {
  let component: RegistroUnidadMuestreoComponent;
  let fixture: ComponentFixture<RegistroUnidadMuestreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroUnidadMuestreoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroUnidadMuestreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
