import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAlternativaComponent } from './consulta-alternativa.component';

describe('ConsultaAlternativaComponent', () => {
  let component: ConsultaAlternativaComponent;
  let fixture: ComponentFixture<ConsultaAlternativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaAlternativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaAlternativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
