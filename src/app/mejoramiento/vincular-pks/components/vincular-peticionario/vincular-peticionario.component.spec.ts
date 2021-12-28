import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularPeticionarioComponent } from './vincular-peticionario.component';

describe('VincularPeticionarioComponent', () => {
  let component: VincularPeticionarioComponent;
  let fixture: ComponentFixture<VincularPeticionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VincularPeticionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularPeticionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
