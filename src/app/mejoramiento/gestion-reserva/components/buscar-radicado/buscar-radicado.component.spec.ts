import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarRadicadoComponent } from './buscar-radicado.component';

describe('BuscarRadicadoComponent', () => {
  let component: BuscarRadicadoComponent;
  let fixture: ComponentFixture<BuscarRadicadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarRadicadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarRadicadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
