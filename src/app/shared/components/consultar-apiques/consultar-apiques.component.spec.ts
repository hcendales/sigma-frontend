import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarApiquesComponent } from './consultar-apiques.component';

describe('ConsultarApiquesComponent', () => {
  let component: ConsultarApiquesComponent;
  let fixture: ComponentFixture<ConsultarApiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarApiquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarApiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
