import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardCenterComponent } from './reward-center.component';

describe('RewardCenterComponent', () => {
  let component: RewardCenterComponent;
  let fixture: ComponentFixture<RewardCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardCenterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RewardCenterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
