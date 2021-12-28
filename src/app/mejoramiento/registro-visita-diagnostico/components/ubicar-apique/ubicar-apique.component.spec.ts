import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicarApiqueComponent } from './ubicar-apique.component';

describe('UbicarApiqueComponent', () => {
  let component: UbicarApiqueComponent;
  let fixture: ComponentFixture<UbicarApiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbicarApiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicarApiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
