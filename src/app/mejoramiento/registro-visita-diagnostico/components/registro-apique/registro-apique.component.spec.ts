import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroApiqueComponent } from './registro-apique.component';

describe('RegistroApiqueComponent', () => {
  let component: RegistroApiqueComponent;
  let fixture: ComponentFixture<RegistroApiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroApiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroApiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
