import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPreferencesComponent } from './admin-preferences.component';

describe('AdminPreferencesComponent', () => {
  let component: AdminPreferencesComponent;
  let fixture: ComponentFixture<AdminPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
