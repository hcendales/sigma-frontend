import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionMezclaAsfalticasConcretosComponent } from './seccion-mezcla-asfalticas-concretos.component';

describe('SeccionMezclaAsfalticasConcretosComponent', () => {
  let component: SeccionMezclaAsfalticasConcretosComponent;
  let fixture: ComponentFixture<SeccionMezclaAsfalticasConcretosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionMezclaAsfalticasConcretosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionMezclaAsfalticasConcretosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
