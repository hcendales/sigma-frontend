import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDatosAforoComponent } from './registro-datos-aforo.component';

describe('RegistroDatosAforoComponent', () => {
  let component: RegistroDatosAforoComponent;
  let fixture: ComponentFixture<RegistroDatosAforoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroDatosAforoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDatosAforoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
