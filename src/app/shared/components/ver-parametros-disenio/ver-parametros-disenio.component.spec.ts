import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerParametrosDisenioComponent } from './ver-parametros-disenio.component';

describe('VerParametrosDisenioComponent', () => {
  let component: VerParametrosDisenioComponent;
  let fixture: ComponentFixture<VerParametrosDisenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerParametrosDisenioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerParametrosDisenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
