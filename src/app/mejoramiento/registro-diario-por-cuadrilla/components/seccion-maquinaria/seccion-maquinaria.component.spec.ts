import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionMaquinariaComponent } from './seccion-maquinaria.component';

describe('SeccionMaquinariaComponent', () => {
  let component: SeccionMaquinariaComponent;
  let fixture: ComponentFixture<SeccionMaquinariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionMaquinariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionMaquinariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
