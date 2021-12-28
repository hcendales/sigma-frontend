import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaVisitasComponent } from './agenda-visitas.component';

describe('AgendaVisitasComponent', () => {
  let component: AgendaVisitasComponent;
  let fixture: ComponentFixture<AgendaVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaVisitasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
