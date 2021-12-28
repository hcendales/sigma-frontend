import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTransicionComponent } from './lista-transicion.component';

describe('ListaTransicionComponent', () => {
  let component: ListaTransicionComponent;
  let fixture: ComponentFixture<ListaTransicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTransicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTransicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
