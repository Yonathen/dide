import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePreferencesComponent } from './update-preferences.component';

describe('UpdatePreferencesComponent', () => {
  let component: UpdatePreferencesComponent;
  let fixture: ComponentFixture<UpdatePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
