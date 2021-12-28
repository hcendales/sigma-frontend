import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAlternativasComponent } from './listar-alternativas.component';

describe('ListarAlternativasComponent', () => {
  let component: ListarAlternativasComponent;
  let fixture: ComponentFixture<ListarAlternativasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarAlternativasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAlternativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
