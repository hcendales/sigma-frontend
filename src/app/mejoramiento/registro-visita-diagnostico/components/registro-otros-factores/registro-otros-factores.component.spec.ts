import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroOtrosFactoresComponent } from './registro-otros-factores.component';

describe('RegistroOtrosFactoresComponent', () => {
  let component: RegistroOtrosFactoresComponent;
  let fixture: ComponentFixture<RegistroOtrosFactoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroOtrosFactoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroOtrosFactoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
