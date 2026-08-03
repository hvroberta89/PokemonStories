import { ComponentFixture, TestBed } from '@angular/core/testing';
import { toPng } from 'html-to-image';

import { RewardCenterComponent } from './reward-center.component';

vi.mock('html-to-image', () => ({
  toJpeg: vi.fn(),
  toPng: vi.fn(),
}));

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
    fixture.componentRef.setInput('items', [
      {
        id: 'reward-1',
        recipientName: 'Emma',
        rewardType: 'badge',
        rewardLabel: 'Erdei jelvény',
        amount: 1,
        icon: 'badge-medal',
        status: 'unlocked',
        physicalStatus: 'queued',
      },
    ]);
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

  it('opens a preview and invokes browser printing without completing the reward', () => {
    fixture.componentRef.setInput('items', [
      {
        id: 'reward-1',
        recipientName: 'Emma',
        rewardType: 'badge',
        rewardLabel: 'Erdei jelvény',
        amount: 1,
        icon: 'badge-medal',
        status: 'unlocked',
        physicalStatus: 'queued',
      },
    ]);
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    let printedRewardId: string | undefined;
    component.markedAsPrinted.subscribe((rewardId) => (printedRewardId = rewardId));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Nyomtatás')!
      .click();
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Előnézet'))!
      .click();
    fixture.detectChanges();

    expect(root.textContent).toContain('Erdei jelvény');
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('PDF mentése'))!
      .click();

    expect(printSpy).toHaveBeenCalledOnce();
    expect(printedRewardId).toBeUndefined();
  });

  it('exports a preview as PNG without completing the reward', async () => {
    fixture.componentRef.setInput('items', [
      {
        id: 'reward-1',
        recipientName: 'Emma',
        rewardType: 'badge',
        rewardLabel: 'Erdei jelvény',
        amount: 1,
        icon: 'badge-medal',
        status: 'unlocked',
        physicalStatus: 'queued',
      },
    ]);
    vi.mocked(toPng).mockResolvedValue('data:image/png;base64,reward');
    const downloadSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    let printedRewardId: string | undefined;
    component.markedAsPrinted.subscribe((rewardId) => (printedRewardId = rewardId));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Nyomtatás')!
      .click();
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Előnézet'))!
      .click();
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'PNG')!
      .click();
    await fixture.whenStable();

    expect(toPng).toHaveBeenCalledOnce();
    expect(downloadSpy).toHaveBeenCalledOnce();
    expect(printedRewardId).toBeUndefined();
  });

  it('opens every queued reward in a batch preview without updating their status', () => {
    fixture.componentRef.setInput('items', [
      {
        id: 'reward-1',
        recipientName: 'Emma',
        rewardType: 'badge',
        rewardLabel: 'Erdei jelvény',
        amount: 1,
        icon: 'badge-medal',
        status: 'unlocked',
        physicalStatus: 'queued',
      },
      {
        id: 'reward-2',
        recipientName: 'Marci',
        rewardType: 'item',
        rewardLabel: 'Bogyókosár',
        amount: 2,
        icon: 'items-potion',
        status: 'unlocked',
        physicalStatus: 'queued',
      },
    ]);
    let printedRewardId: string | undefined;
    component.markedAsPrinted.subscribe((rewardId) => (printedRewardId = rewardId));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Nyomtatás')!
      .click();
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Összes előnézete'))!
      .click();
    fixture.detectChanges();

    expect(root.querySelectorAll('.reward-center__print-preview')).toHaveLength(2);
    expect(root.textContent).toContain('Erdei jelvény');
    expect(root.textContent).toContain('Bogyókosár');
    expect(printedRewardId).toBeUndefined();
  });

  it('opens a delivered reward for reprinting without changing its status', () => {
    fixture.componentRef.setInput('historyItems', [
      {
        id: 'reward-1',
        recipientName: 'Emma',
        rewardType: 'badge',
        rewardLabel: 'Erdei jelvény',
        amount: 1,
        icon: 'badge-medal',
        givenAtLabel: 'Most',
        physicalStatus: 'printed',
      },
    ]);
    let printedRewardId: string | undefined;
    component.markedAsPrinted.subscribe((rewardId) => (printedRewardId = rewardId));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Előzmények'))!
      .click();
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Újranyomtatás'))!
      .click();
    fixture.detectChanges();

    expect(root.querySelectorAll('.reward-center__print-preview')).toHaveLength(1);
    expect(root.textContent).toContain('Erdei jelvény');
    expect(printedRewardId).toBeUndefined();
  });
});
