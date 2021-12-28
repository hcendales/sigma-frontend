import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionInformacionGeneralComponent } from './seccion-informacion-general.component';

describe('InformacionGeneralComponent', () => {
  let component: SeccionInformacionGeneralComponent;
  let fixture: ComponentFixture<SeccionInformacionGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionInformacionGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionInformacionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
