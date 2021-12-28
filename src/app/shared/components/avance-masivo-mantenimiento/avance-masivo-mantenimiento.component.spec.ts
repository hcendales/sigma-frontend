import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceMasivoMantenimientoComponent } from './avance-masivo-mantenimiento.component';

describe('AvanceMasivoMantenimientoComponent', () => {
  let component: AvanceMasivoMantenimientoComponent;
  let fixture: ComponentFixture<AvanceMasivoMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceMasivoMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvanceMasivoMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
