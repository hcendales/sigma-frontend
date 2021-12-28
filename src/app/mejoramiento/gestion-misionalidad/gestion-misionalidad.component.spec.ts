import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMisionalidadComponent } from './gestion-misionalidad.component';

describe('GestionMisionalidadComponent', () => {
  let component: GestionMisionalidadComponent;
  let fixture: ComponentFixture<GestionMisionalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionMisionalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMisionalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
