import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionProgramacionDiariaComponent } from './seccion-programacion-diaria.component';

describe('SeccionProgramacionDiariaComponent', () => {
  let component: SeccionProgramacionDiariaComponent;
  let fixture: ComponentFixture<SeccionProgramacionDiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionProgramacionDiariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionProgramacionDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
