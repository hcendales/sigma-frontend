import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisTransitoComponent } from './analisis-transito.component';

describe('AnalisisTransitoComponent', () => {
  let component: AnalisisTransitoComponent;
  let fixture: ComponentFixture<AnalisisTransitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisisTransitoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisTransitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
