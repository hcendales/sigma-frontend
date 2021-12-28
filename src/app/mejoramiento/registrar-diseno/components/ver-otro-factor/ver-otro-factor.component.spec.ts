import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOtroFactorComponent } from './ver-otro-factor.component';

describe('VerOtroFactorComponent', () => {
  let component: VerOtroFactorComponent;
  let fixture: ComponentFixture<VerOtroFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerOtroFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerOtroFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
