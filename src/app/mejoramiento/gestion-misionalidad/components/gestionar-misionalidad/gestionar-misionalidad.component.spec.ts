import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarMisionalidadComponent } from './gestionar-misionalidad.component';

describe('GestionarMisionalidadComponent', () => {
  let component: GestionarMisionalidadComponent;
  let fixture: ComponentFixture<GestionarMisionalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionarMisionalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarMisionalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
