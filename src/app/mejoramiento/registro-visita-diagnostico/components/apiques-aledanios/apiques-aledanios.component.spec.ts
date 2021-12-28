import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiquesAledaniosComponent } from './apiques-aledanios.component';

describe('ApiquesAledaniosComponent', () => {
  let component: ApiquesAledaniosComponent;
  let fixture: ComponentFixture<ApiquesAledaniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiquesAledaniosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiquesAledaniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
