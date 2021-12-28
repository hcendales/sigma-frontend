import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNovedadComponent } from './listar-novedad.component';

describe('ListarNovedadComponent', () => {
  let component: ListarNovedadComponent;
  let fixture: ComponentFixture<ListarNovedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarNovedadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
