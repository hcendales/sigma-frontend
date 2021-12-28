import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionPersonalComponent } from './seccion-personal.component';

describe('SeccionPersonalComponent', () => {
  let component: SeccionPersonalComponent;
  let fixture: ComponentFixture<SeccionPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
