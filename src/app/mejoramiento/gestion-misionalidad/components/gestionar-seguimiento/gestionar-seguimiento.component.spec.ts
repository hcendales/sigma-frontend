import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSeguimientoComponent } from './gestionar-seguimiento.component';

describe('GestionarSeguimientoComponent', () => {
  let component: GestionarSeguimientoComponent;
  let fixture: ComponentFixture<GestionarSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionarSeguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
