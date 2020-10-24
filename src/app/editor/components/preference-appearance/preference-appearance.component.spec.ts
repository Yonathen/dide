import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceAppearanceComponent } from './preference-appearance.component';

describe('PreferenceAppearanceComponent', () => {
  let component: PreferenceAppearanceComponent;
  let fixture: ComponentFixture<PreferenceAppearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceAppearanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
