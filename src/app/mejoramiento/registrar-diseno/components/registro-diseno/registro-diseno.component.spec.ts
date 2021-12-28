import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDisenoComponent } from './registro-diseno.component';

describe('RegistroDisenoComponent', () => {
  let component: RegistroDisenoComponent;
  let fixture: ComponentFixture<RegistroDisenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroDisenoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDisenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
