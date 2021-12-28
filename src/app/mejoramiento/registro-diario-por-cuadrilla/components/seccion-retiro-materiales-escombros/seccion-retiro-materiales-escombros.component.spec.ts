import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionRetiroMaterialesEscombrosComponent } from './seccion-retiro-materiales-escombros.component';

describe('SeccionRetiroMaterialesEscombrosComponent', () => {
  let component: SeccionRetiroMaterialesEscombrosComponent;
  let fixture: ComponentFixture<SeccionRetiroMaterialesEscombrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionRetiroMaterialesEscombrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionRetiroMaterialesEscombrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
