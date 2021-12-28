import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarDisenoComponent } from './validar-diseno.component';

describe('ValidarDisenoComponent', () => {
  let component: ValidarDisenoComponent;
  let fixture: ComponentFixture<ValidarDisenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidarDisenoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidarDisenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
