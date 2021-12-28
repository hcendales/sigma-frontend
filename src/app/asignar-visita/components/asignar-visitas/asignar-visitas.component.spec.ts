import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarVisitasComponent } from './asignar-visitas.component';

describe('AsignarVisitasComponent', () => {
  let component: AsignarVisitasComponent;
  let fixture: ComponentFixture<AsignarVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarVisitasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
