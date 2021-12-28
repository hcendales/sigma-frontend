import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaSeleccionComponent } from './mapa-seleccion.component';

describe('MapaSeleccionComponent', () => {
  let component: MapaSeleccionComponent;
  let fixture: ComponentFixture<MapaSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaSeleccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
