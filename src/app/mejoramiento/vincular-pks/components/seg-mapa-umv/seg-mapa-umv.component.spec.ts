import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegMapaUmvComponent } from './seg-mapa-umv.component';

describe('SegMapaUmvComponent', () => {
  let component: SegMapaUmvComponent;
  let fixture: ComponentFixture<SegMapaUmvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegMapaUmvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegMapaUmvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
