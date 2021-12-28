import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociarAforosComponent } from './asociar-aforos.component';

describe('AsociarAforosComponent', () => {
  let component: AsociarAforosComponent;
  let fixture: ComponentFixture<AsociarAforosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsociarAforosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociarAforosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
