import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SincroniacionSPIComponent } from './sincroniacion-spi.component';

describe('SincroniacionSPIComponent', () => {
  let component: SincroniacionSPIComponent;
  let fixture: ComponentFixture<SincroniacionSPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SincroniacionSPIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SincroniacionSPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
