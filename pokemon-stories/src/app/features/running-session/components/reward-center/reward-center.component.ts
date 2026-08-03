import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { toJpeg, toPng } from 'html-to-image';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { RewardQueueComponent } from '../reward-queue/reward-queue.component';
import type { RewardQueueItemViewModel } from '../reward-queue/reward-queue.model';
import type { RewardCenterTab } from './reward-center.model';
import { RewardHistoryComponent } from '../reward-history/reward-history.component';
import { RewardHistoryItemViewModel } from '../reward-history/reward-history.model';

type PrintableRewardViewModel = Pick<
  RewardQueueItemViewModel,
  'id' | 'recipientName' | 'rewardType' | 'rewardLabel' | 'amount' | 'icon'
>;

type RewardImageFormat = 'jpeg' | 'png';

@Component({
  selector: 'app-reward-center',
  standalone: true,
  imports: [PsIconComponent, RewardQueueComponent, RewardHistoryComponent],
  templateUrl: './reward-center.component.html',
  styleUrl: './reward-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardCenterComponent {
  readonly items = input.required<readonly RewardQueueItemViewModel[]>();

  readonly historyItems = input.required<readonly RewardHistoryItemViewModel[]>();

  readonly closed = output<void>();

  readonly markedAsGiven = output<string>();

  readonly markedAsPrinted = output<string>();

  readonly markedAsPrintedBatch = output<readonly string[]>();

  protected readonly activeTab = signal<RewardCenterTab>('queue');

  protected readonly title = computed(() => {
    switch (this.activeTab()) {
      case 'queue':
        return 'Átadásra vár';

      case 'print':
        return 'Nyomtatás';

      case 'history':
        return 'Előzmények';
    }
  });

  protected readonly icon = computed(() => {
    switch (this.activeTab()) {
      case 'queue':
        return 'queue-box';

      case 'print':
        return 'printer';

      case 'history':
        return 'achievement-star';
    }
  });

  protected readonly printableItems = computed(() =>
    this.items().filter((item) => item.physicalStatus === 'queued'),
  );

  protected readonly previewedItems = signal<readonly PrintableRewardViewModel[]>([]);

  protected readonly hasPreview = computed(() => this.previewedItems().length > 0);

  protected readonly isExporting = signal(false);

  protected readonly exportError = signal<string | null>(null);

  private readonly previewElements = viewChildren<ElementRef<HTMLElement>>('printPreview');

  protected selectTab(tab: RewardCenterTab): void {
    this.activeTab.set(tab);
  }

  protected openPreview(item: RewardQueueItemViewModel): void {
    this.previewedItems.set([item]);
  }

  protected openBatchPreview(): void {
    this.previewedItems.set(this.printableItems());
  }

  protected markAllAsPrinted(): void {
    this.markedAsPrintedBatch.emit(this.printableItems().map((item) => item.id));
  }

  protected openReprintPreview(item: RewardHistoryItemViewModel): void {
    this.previewedItems.set([item]);
  }

  protected closePreview(): void {
    this.previewedItems.set([]);
    this.exportError.set(null);
  }

  protected printPreview(): void {
    window.print();
  }

  protected async exportPreview(format: RewardImageFormat): Promise<void> {
    const elements = this.previewElements();
    const items = this.previewedItems();
    if (elements.length === 0 || items.length === 0) return;

    this.isExporting.set(true);
    this.exportError.set(null);
    try {
      for (const [index, element] of elements.entries()) {
        const imageDataUrl = await this.createImage(element.nativeElement, format);
        this.downloadImage(imageDataUrl, items[index], format);
      }
    } catch {
      this.exportError.set('A kép exportálása nem sikerült. Próbáld újra.');
    } finally {
      this.isExporting.set(false);
    }
  }

  private createImage(element: HTMLElement, format: RewardImageFormat): Promise<string> {
    const options = { backgroundColor: '#f6cf69', pixelRatio: 2 };
    return format === 'png' ? toPng(element, options) : toJpeg(element, options);
  }

  private downloadImage(
    imageDataUrl: string,
    item: PrintableRewardViewModel | undefined,
    format: RewardImageFormat,
  ): void {
    if (!item) return;
    const link = document.createElement('a');
    link.download = `pokemon-stories-${item.id}.${format === 'jpeg' ? 'jpg' : format}`;
    link.href = imageDataUrl;
    link.click();
  }
}
