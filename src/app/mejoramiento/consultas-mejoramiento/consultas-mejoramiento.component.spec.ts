import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasMejoramientoComponent } from './consultas-mejoramiento.component';

describe('ConsultasMejoramientoComponent', () => {
  let component: ConsultasMejoramientoComponent;
  let fixture: ComponentFixture<ConsultasMejoramientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultasMejoramientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasMejoramientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
