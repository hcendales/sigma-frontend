import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarguesMejoramientoComponent } from './cargues-mejoramiento.component';

describe('CarguesMejoramientoComponent', () => {
  let component: CarguesMejoramientoComponent;
  let fixture: ComponentFixture<CarguesMejoramientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarguesMejoramientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarguesMejoramientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
