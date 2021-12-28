import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionEquipoPortatilComponent } from './seccion-equipo-portatil.component';

describe('SeccionEquipoPortatilComponent', () => {
  let component: SeccionEquipoPortatilComponent;
  let fixture: ComponentFixture<SeccionEquipoPortatilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionEquipoPortatilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionEquipoPortatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
