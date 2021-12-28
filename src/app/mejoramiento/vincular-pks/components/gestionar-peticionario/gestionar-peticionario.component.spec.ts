import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPeticionarioComponent } from './gestionar-peticionario.component';

describe('GestionarPeticionarioComponent', () => {
  let component: GestionarPeticionarioComponent;
  let fixture: ComponentFixture<GestionarPeticionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionarPeticionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarPeticionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
