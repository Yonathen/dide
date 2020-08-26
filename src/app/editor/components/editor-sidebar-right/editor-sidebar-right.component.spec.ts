import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSidebarRightComponent } from './editor-sidebar-right.component';

describe('EditorSidebarRightComponent', () => {
  let component: EditorSidebarRightComponent;
  let fixture: ComponentFixture<EditorSidebarRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSidebarRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSidebarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
