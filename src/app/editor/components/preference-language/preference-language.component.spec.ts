import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceLanguageComponent } from './preference-language.component';

describe('PreferenceLanguageComponent', () => {
  let component: PreferenceLanguageComponent;
  let fixture: ComponentFixture<PreferenceLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
