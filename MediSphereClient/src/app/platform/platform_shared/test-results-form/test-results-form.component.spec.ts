import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultsFormComponent } from './test-results-form.component';

describe('TestResultsFormComponent', () => {
  let component: TestResultsFormComponent;
  let fixture: ComponentFixture<TestResultsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestResultsFormComponent]
    });
    fixture = TestBed.createComponent(TestResultsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
