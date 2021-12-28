import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesApiquesAforosComponent } from './solicitudes-apiques-aforos.component';

describe('SolicitudesApiquesAforosComponent', () => {
  let component: SolicitudesApiquesAforosComponent;
  let fixture: ComponentFixture<SolicitudesApiquesAforosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesApiquesAforosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesApiquesAforosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
