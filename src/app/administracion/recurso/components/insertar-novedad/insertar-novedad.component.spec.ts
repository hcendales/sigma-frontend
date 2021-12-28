import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertarNovedadComponent } from './insertar-novedad.component';

describe('InsertarNovedadComponent', () => {
  let component: InsertarNovedadComponent;
  let fixture: ComponentFixture<InsertarNovedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertarNovedadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertarNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
