import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAlternativaComponent } from './registro-alternativa.component';

describe('RegistroAlternativaComponent', () => {
  let component: RegistroAlternativaComponent;
  let fixture: ComponentFixture<RegistroAlternativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroAlternativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAlternativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
