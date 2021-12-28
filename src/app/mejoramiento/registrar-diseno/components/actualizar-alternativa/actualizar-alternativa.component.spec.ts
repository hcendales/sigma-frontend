import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarAlternativaComponent } from './actualizar-alternativa.component';

describe('ActualizarAlternativaComponent', () => {
  let component: ActualizarAlternativaComponent;
  let fixture: ComponentFixture<ActualizarAlternativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarAlternativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarAlternativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
