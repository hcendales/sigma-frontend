import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionCantidadesDeObraComponent } from './seccion-cantidades-de-obra.component';

describe('SeccionCantidadesDeObraComponent', () => {
  let component: SeccionCantidadesDeObraComponent;
  let fixture: ComponentFixture<SeccionCantidadesDeObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionCantidadesDeObraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionCantidadesDeObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
