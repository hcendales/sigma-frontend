import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarSolicitudesComponent } from './realizar-solicitudes.component';

describe('RealizarSolicitudesComponent', () => {
  let component: RealizarSolicitudesComponent;
  let fixture: ComponentFixture<RealizarSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizarSolicitudesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
