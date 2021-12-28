import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceMantenimientoComponent } from './avance-mantenimiento.component';

describe('AvanceMantenimientoComponent', () => {
  let component: AvanceMantenimientoComponent;
  let fixture: ComponentFixture<AvanceMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvanceMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
