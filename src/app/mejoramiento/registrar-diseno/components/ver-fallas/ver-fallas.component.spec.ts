import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFallasComponent } from './ver-fallas.component';

describe('VerFallasComponent', () => {
  let component: VerFallasComponent;
  let fixture: ComponentFixture<VerFallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerFallasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerFallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
