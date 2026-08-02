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
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('historyItems', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits a print-completion action for queued rewards', () => {
    fixture.componentRef.setInput('items', [{
      id: 'reward-1', recipientName: 'Emma', rewardType: 'badge',
      rewardLabel: 'Erdei jelvény', amount: 1, icon: 'badge-medal',
      status: 'unlocked', physicalStatus: 'queued',
    }]);
    let printedRewardId: string | undefined;
    component.markedAsPrinted.subscribe((rewardId) => (printedRewardId = rewardId));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Nyomtatás'))!
      .click();
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Nyomtatás kész'))!
      .click();

    expect(printedRewardId).toBe('reward-1');
  });
});
