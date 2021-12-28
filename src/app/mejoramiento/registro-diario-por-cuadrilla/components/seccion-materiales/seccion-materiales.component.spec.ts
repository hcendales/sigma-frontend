import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionMaterialesComponent } from './seccion-materiales.component';

describe('SeccionMaterialesComponent', () => {
  let component: SeccionMaterialesComponent;
  let fixture: ComponentFixture<SeccionMaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionMaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
