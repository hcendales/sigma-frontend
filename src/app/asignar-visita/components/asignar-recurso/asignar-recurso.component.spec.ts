import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRecursoComponent } from './asignar-recurso.component';

describe('AsignarRecursoComponent', () => {
  let component: AsignarRecursoComponent;
  let fixture: ComponentFixture<AsignarRecursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarRecursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
