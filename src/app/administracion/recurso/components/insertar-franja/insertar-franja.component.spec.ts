import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertarFranjaComponent } from './insertar-franja.component';

describe('InsertarFranjaComponent', () => {
  let component: InsertarFranjaComponent;
  let fixture: ComponentFixture<InsertarFranjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertarFranjaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertarFranjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
