import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutoprogramarComponent } from './modal-autoprogramar.component';

describe('ModalAutoprogramarComponent', () => {
  let component: ModalAutoprogramarComponent;
  let fixture: ComponentFixture<ModalAutoprogramarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAutoprogramarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAutoprogramarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
