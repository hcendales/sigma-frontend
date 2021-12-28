import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPriorizacionComponent } from './registrar-priorizacion.component';

describe('RegistrarPriorizacionComponent', () => {
  let component: RegistrarPriorizacionComponent;
  let fixture: ComponentFixture<RegistrarPriorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarPriorizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPriorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
