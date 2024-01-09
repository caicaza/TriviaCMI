import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurvivorPersonalResultComponent } from './survivor-personal-result.component';

describe('SurvivorPersonalResultComponent', () => {
  let component: SurvivorPersonalResultComponent;
  let fixture: ComponentFixture<SurvivorPersonalResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurvivorPersonalResultComponent]
    });
    fixture = TestBed.createComponent(SurvivorPersonalResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
