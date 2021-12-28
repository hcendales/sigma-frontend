import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaApiquesComponent } from './consulta-apiques.component';

describe('ConsultaApiquesComponent', () => {
  let component: ConsultaApiquesComponent;
  let fixture: ComponentFixture<ConsultaApiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaApiquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaApiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
