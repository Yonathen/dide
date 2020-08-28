import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSolverComponent } from './create-solver.component';

describe('CreateSolverComponent', () => {
  let component: CreateSolverComponent;
  let fixture: ComponentFixture<CreateSolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSolverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
