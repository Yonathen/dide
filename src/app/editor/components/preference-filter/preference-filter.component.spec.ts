import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceFilterComponent } from './preference-filter.component';

describe('PreferenceFilterComponent', () => {
  let component: PreferenceFilterComponent;
  let fixture: ComponentFixture<PreferenceFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
