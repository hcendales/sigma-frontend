import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadadesIntervencionComponent } from './novedadades-intervencion.component';

describe('NovedadadesIntervencionComponent', () => {
  let component: NovedadadesIntervencionComponent;
  let fixture: ComponentFixture<NovedadadesIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovedadadesIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadadesIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
