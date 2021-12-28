import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaVincularComponent } from './tabla-vincular.component';

describe('TablaVincularComponent', () => {
  let component: TablaVincularComponent;
  let fixture: ComponentFixture<TablaVincularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaVincularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaVincularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
