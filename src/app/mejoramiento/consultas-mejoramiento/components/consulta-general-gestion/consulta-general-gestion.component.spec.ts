import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaGeneralGestionComponent } from './consulta-general-gestion.component';

describe('ConsultaGeneralGestionComponent', () => {
  let component: ConsultaGeneralGestionComponent;
  let fixture: ComponentFixture<ConsultaGeneralGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaGeneralGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaGeneralGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
