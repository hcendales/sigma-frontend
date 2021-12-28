import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcaldiasComponent } from './alcaldias.component';

describe('AlcaldiasComponent', () => {
  let component: AlcaldiasComponent;
  let fixture: ComponentFixture<AlcaldiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlcaldiasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcaldiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
