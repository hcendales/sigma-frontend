import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAlternativaComponent } from './ver-alternativa.component';

describe('VerAlternativaComponent', () => {
  let component: VerAlternativaComponent;
  let fixture: ComponentFixture<VerAlternativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerAlternativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAlternativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
