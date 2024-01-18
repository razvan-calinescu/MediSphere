import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodResultsTableComponent } from './blood-results-table.component';

describe('BloodResultsTableComponent', () => {
  let component: BloodResultsTableComponent;
  let fixture: ComponentFixture<BloodResultsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BloodResultsTableComponent]
    });
    fixture = TestBed.createComponent(BloodResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
