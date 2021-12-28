import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerLugarComponent } from './ver-lugar.component';

describe('VerLugarComponent', () => {
  let component: VerLugarComponent;
  let fixture: ComponentFixture<VerLugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerLugarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
