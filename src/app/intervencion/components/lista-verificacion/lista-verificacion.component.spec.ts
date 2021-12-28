import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVerificacionComponent } from './lista-verificacion.component';

describe('ListaVerificacionComponent', () => {
  let component: ListaVerificacionComponent;
  let fixture: ComponentFixture<ListaVerificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaVerificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaVerificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
