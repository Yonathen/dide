import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupMemberComponent } from './manage-group-member.component';

describe('ManageGroupMemberComponent', () => {
  let component: ManageGroupMemberComponent;
  let fixture: ComponentFixture<ManageGroupMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGroupMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
