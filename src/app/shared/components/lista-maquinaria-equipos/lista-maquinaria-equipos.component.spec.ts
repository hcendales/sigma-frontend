import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMaquinariaEquiposComponent } from './lista-maquinaria-equipos.component';

describe('ListaMaquinariaEquiposComponent', () => {
  let component: ListaMaquinariaEquiposComponent;
  let fixture: ComponentFixture<ListaMaquinariaEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaMaquinariaEquiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMaquinariaEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
