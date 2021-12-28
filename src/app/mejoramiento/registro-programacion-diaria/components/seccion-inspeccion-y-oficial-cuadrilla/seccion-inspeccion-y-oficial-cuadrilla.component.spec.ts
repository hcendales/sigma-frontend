import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionInspeccionYOficialCuadrillaComponent } from './seccion-inspeccion-y-oficial-cuadrilla.component';

describe('SeccionInspeccionYOficialCuadrillaComponent', () => {
  let component: SeccionInspeccionYOficialCuadrillaComponent;
  let fixture: ComponentFixture<SeccionInspeccionYOficialCuadrillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionInspeccionYOficialCuadrillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionInspeccionYOficialCuadrillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
