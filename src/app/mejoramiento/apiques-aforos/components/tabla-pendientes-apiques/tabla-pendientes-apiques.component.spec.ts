import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPendientesApiquesComponent } from './tabla-pendientes-apiques.component';

describe('TablaPendientesApiquesComponent', () => {
  let component: TablaPendientesApiquesComponent;
  let fixture: ComponentFixture<TablaPendientesApiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaPendientesApiquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaPendientesApiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
