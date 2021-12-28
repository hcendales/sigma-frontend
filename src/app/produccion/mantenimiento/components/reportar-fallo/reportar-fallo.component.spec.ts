import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportarFalloComponent } from './reportar-fallo.component';

describe('ReportarFalloComponent', () => {
  let component: ReportarFalloComponent;
  let fixture: ComponentFixture<ReportarFalloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportarFalloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportarFalloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
