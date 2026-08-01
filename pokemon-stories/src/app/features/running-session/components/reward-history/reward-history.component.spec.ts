import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardHistoryComponent } from './reward-history.component';

describe('RewardHistoryComponent', () => {
  let component: RewardHistoryComponent;
  let fixture: ComponentFixture<RewardHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RewardHistoryComponent);
    fixture.componentRef.setInput('items', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
