import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionObservacionesGeneralesComponent } from './seccion-observaciones-generales.component';

describe('SeccionObservacionesGeneralesComponent', () => {
  let component: SeccionObservacionesGeneralesComponent;
  let fixture: ComponentFixture<SeccionObservacionesGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionObservacionesGeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionObservacionesGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
