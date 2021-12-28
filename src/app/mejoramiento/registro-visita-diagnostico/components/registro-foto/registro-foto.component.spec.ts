import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFotoComponent } from './registro-foto.component';

describe('RegistroFotoComponent', () => {
  let component: RegistroFotoComponent;
  let fixture: ComponentFixture<RegistroFotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroFotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
