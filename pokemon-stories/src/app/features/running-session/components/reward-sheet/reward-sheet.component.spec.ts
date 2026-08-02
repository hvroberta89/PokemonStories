import { ComponentFixture, TestBed } from '@angular/core/testing';

import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PreparedReward } from '../../../../domain/reward/models/prepared-reward';
import type { PreparedRewardProps } from '../../../../domain/reward/models/prepared-reward';
import { RewardSheetComponent } from './reward-sheet.component';
import type { RewardDraft } from './reward-sheet.model';

describe('RewardSheetComponent', () => {
  let component: RewardSheetComponent;
  let fixture: ComponentFixture<RewardSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RewardSheetComponent);
    fixture.componentRef.setInput('recipients', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates one grant for every participant when everyone is selected', async () => {
    fixture.componentRef.setInput('recipients', [
      { id: 'character-1', name: 'Emma' },
      { id: 'character-2', name: 'Marci' },
    ]);
    let saved: readonly { recipientId?: string; rewardLabel: string }[] = [];
    component.saved.subscribe((drafts) => (saved = drafts));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector<HTMLInputElement>('input');
    input!.value = 'Erdei segítő jelvény';
    input!.dispatchEvent(new Event('input'));
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('button')];
    buttons.find((button) => button.textContent?.trim() === 'Mindenki')!.click();
    fixture.detectChanges();
    buttons.find((button) => button.textContent?.includes('Jutalom feloldása'))!.click();
    await fixture.whenStable();

    expect(saved).toHaveLength(2);
    expect(saved.map((draft) => draft.recipientId)).toEqual(['character-1', 'character-2']);
    expect(saved[0]?.rewardLabel).toBe('Erdei segítő jelvény');
  });

  it('preserves the prepared reward link when it is unlocked for a participant', async () => {
    fixture.componentRef.setInput('recipients', [{ id: 'character-1', name: 'Emma' }]);
    const preparedReward = PreparedReward.create({
      id: 'prepared-reward-1',
      projectId: projectId('project-1'),
      adventureId: adventurePlanId('adventure-1'),
      type: 'badge',
      label: 'Erdei segítő jelvény',
      amount: 2,
      physicalStatus: 'skipped',
    }).value;
    fixture.componentRef.setInput('preparedRewards', [preparedReward]);
    let saved: readonly RewardDraft[] = [];
    component.saved.subscribe((drafts) => (saved = drafts));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Erdei segítő jelvény');
    const rewardSheet = component as unknown as {
      selectPreparedReward(reward: PreparedRewardProps): void;
      selectRecipient(id: string): void;
      save(): void;
    };
    rewardSheet.selectPreparedReward(preparedReward);
    rewardSheet.selectRecipient('character-1');
    rewardSheet.save();
    await fixture.whenStable();

    expect(saved).toEqual([
      expect.objectContaining({
        preparedRewardId: 'prepared-reward-1',
        rewardType: 'badge',
        rewardLabel: 'Erdei segítő jelvény',
        amount: 2,
        physicalStatus: 'skipped',
        recipientId: 'character-1',
      }),
    ]);
  });
});
