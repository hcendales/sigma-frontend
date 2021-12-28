import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarDisenoComponent } from './revisar-diseno.component';

describe('RevisarDisenoComponent', () => {
  let component: RevisarDisenoComponent;
  let fixture: ComponentFixture<RevisarDisenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisarDisenoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisarDisenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
