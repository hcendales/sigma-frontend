import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAlternativaComponent } from './lista-alternativa.component';

describe('ListaAlternativaComponent', () => {
  let component: ListaAlternativaComponent;
  let fixture: ComponentFixture<ListaAlternativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaAlternativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAlternativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
