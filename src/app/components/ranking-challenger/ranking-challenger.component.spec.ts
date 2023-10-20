import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingChallengerComponent } from './ranking-challenger.component';

describe('RankingChallengerComponent', () => {
  let component: RankingChallengerComponent;
  let fixture: ComponentFixture<RankingChallengerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingChallengerComponent]
    });
    fixture = TestBed.createComponent(RankingChallengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
