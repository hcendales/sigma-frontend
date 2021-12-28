import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarMisionalidadComponent } from './asignar-misionalidad.component';

describe('AsignarMisionalidadComponent', () => {
  let component: AsignarMisionalidadComponent;
  let fixture: ComponentFixture<AsignarMisionalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarMisionalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarMisionalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
