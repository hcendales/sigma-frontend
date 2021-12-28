import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionMaterialComponent } from './seccion-material.component';

describe('SeccionMaterialComponent', () => {
  let component: SeccionMaterialComponent;
  let fixture: ComponentFixture<SeccionMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
