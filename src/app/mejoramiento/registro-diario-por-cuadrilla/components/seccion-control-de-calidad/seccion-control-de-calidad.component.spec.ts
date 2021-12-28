import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionControlDeCalidadComponent } from './seccion-control-de-calidad.component';

describe('SeccionControlDeCalidadComponent', () => {
  let component: SeccionControlDeCalidadComponent;
  let fixture: ComponentFixture<SeccionControlDeCalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionControlDeCalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionControlDeCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
