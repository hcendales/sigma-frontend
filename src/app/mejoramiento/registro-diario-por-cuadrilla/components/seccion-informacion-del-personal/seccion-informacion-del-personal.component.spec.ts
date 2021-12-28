import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionInformacionDelPersonalComponent } from './seccion-informacion-del-personal.component';

describe('SeccionInformacionDelPersonalComponent', () => {
  let component: SeccionInformacionDelPersonalComponent;
  let fixture: ComponentFixture<SeccionInformacionDelPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionInformacionDelPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionInformacionDelPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
