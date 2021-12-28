import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAforosComponent } from './registro-aforos.component';

describe('RegistroAforosComponent', () => {
  let component: RegistroAforosComponent;
  let fixture: ComponentFixture<RegistroAforosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroAforosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAforosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
