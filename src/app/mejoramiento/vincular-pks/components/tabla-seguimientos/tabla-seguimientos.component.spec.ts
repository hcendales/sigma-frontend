import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSeguimientosComponent } from './tabla-seguimientos.component';

describe('TablaSeguimientosComponent', () => {
  let component: TablaSeguimientosComponent;
  let fixture: ComponentFixture<TablaSeguimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaSeguimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaSeguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
