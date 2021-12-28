import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorFotosComponent } from './visor-fotos.component';

describe('VisorFotosComponent', () => {
  let component: VisorFotosComponent;
  let fixture: ComponentFixture<VisorFotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorFotosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
