import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesDocumentComponent } from './properties-document.component';

describe('PropertiesDocumentComponent', () => {
  let component: PropertiesDocumentComponent;
  let fixture: ComponentFixture<PropertiesDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
