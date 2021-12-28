import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarApiquesComponent } from './actualizar-apiques.component';

describe('ActualizarApiquesComponent', () => {
  let component: ActualizarApiquesComponent;
  let fixture: ComponentFixture<ActualizarApiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarApiquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarApiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
