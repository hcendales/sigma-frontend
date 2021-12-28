import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaIntervencionComponent } from './area-intervencion.component';

describe('AreaIntervencionComponent', () => {
  let component: AreaIntervencionComponent;
  let fixture: ComponentFixture<AreaIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
