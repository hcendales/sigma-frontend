import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoprogramarVisitaComponent } from './autoprogramar-visita.component';

describe('AutoprogramarVisitaComponent', () => {
  let component: AutoprogramarVisitaComponent;
  let fixture: ComponentFixture<AutoprogramarVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoprogramarVisitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoprogramarVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
