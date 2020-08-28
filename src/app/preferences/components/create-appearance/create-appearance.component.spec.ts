import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppearanceComponent } from './create-appearance.component';

describe('CreateAppearanceComponent', () => {
  let component: CreateAppearanceComponent;
  let fixture: ComponentFixture<CreateAppearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAppearanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
