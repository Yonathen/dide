import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceGroupComponent } from './preference-group.component';

describe('PreferenceGroupComponent', () => {
  let component: PreferenceGroupComponent;
  let fixture: ComponentFixture<PreferenceGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
