import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTerminalComponent } from './editor-terminal.component';

describe('EditorTerminalComponent', () => {
  let component: EditorTerminalComponent;
  let fixture: ComponentFixture<EditorTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
