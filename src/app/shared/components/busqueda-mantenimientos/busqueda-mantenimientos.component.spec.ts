import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaMantenimientosComponent } from './busqueda-mantenimientos.component';

describe('BusquedaMantenimientosComponent', () => {
  let component: BusquedaMantenimientosComponent;
  let fixture: ComponentFixture<BusquedaMantenimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaMantenimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaMantenimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
