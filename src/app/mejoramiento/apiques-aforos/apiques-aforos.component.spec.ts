import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiquesAforosComponent } from './apiques-aforos.component';

describe('ApiquesAforosComponent', () => {
  let component: ApiquesAforosComponent;
  let fixture: ComponentFixture<ApiquesAforosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiquesAforosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiquesAforosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
