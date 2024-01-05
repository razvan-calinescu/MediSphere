import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateDoctorDialogComponent } from './allocate-doctor-dialog.component';

describe('AllocateDoctorDialogComponent', () => {
  let component: AllocateDoctorDialogComponent;
  let fixture: ComponentFixture<AllocateDoctorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocateDoctorDialogComponent]
    });
    fixture = TestBed.createComponent(AllocateDoctorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
