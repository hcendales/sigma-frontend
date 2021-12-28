import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFranjaComponent } from './listar-franja.component';

describe('ListarFranjaComponent', () => {
  let component: ListarFranjaComponent;
  let fixture: ComponentFixture<ListarFranjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarFranjaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarFranjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
