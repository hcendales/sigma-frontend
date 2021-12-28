import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCapaComponent } from './registro-capa.component';

describe('RegistroCapaComponent', () => {
  let component: RegistroCapaComponent;
  let fixture: ComponentFixture<RegistroCapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCapaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
