import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AforosComponent } from './aforos.component';

describe('AforosComponent', () => {
  let component: AforosComponent;
  let fixture: ComponentFixture<AforosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AforosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AforosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
