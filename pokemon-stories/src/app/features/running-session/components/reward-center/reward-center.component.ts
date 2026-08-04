import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
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
import { GameMasterLibraryStore } from '../../../game-master-library/services/game-master-library.store';
import { PsIconName } from '../../../../shared/ui/icon/ps-icon.registry';
import { RewardType } from '../../../../domain/reward/models/reward-grant';

type PrintableRewardViewModel = Pick<
  RewardQueueItemViewModel,
  'id' | 'recipientName' | 'rewardType' | 'rewardLabel' | 'amount' | 'icon'
  | 'referenceId' | 'referenceSection'
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
  private readonly library = inject(GameMasterLibraryStore);
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

  protected readonly pokemonArtworkByRewardId = signal<Readonly<Record<string, string>>>({});

  private readonly previewElements = viewChildren<ElementRef<HTMLElement>>('printPreview');

  protected selectTab(tab: RewardCenterTab): void {
    this.activeTab.set(tab);
  }

  protected openPreview(item: RewardQueueItemViewModel): void {
    this.previewedItems.set([item]);
    void this.loadPokemonArtwork([item]);
  }

  protected openBatchPreview(): void {
    this.previewedItems.set(this.printableItems());
    void this.loadPokemonArtwork(this.printableItems());
  }

  protected markAllAsPrinted(): void {
    this.markedAsPrintedBatch.emit(this.printableItems().map((item) => item.id));
  }

  protected openReprintPreview(item: RewardHistoryItemViewModel): void {
    this.previewedItems.set([item]);
    void this.loadPokemonArtwork([item]);
  }

  protected rewardIcon(item: PrintableRewardViewModel): PsIconName {
    const icons: Record<RewardType, PsIconName> = {
      pokemon: 'pokemon-sticker',
      item: 'items-potion',
      badge: 'badge-medal',
      outfit: 'clothing-shirt',
      achievement: 'achievement-star',
      'quest-item': 'quest-card',
      card: 'npc-card',
      sticker: 'reward-gift',
      narrative: 'timeline-scroll',
      custom: 'reward-box',
    };
    return icons[item.rewardType];
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

  private async loadPokemonArtwork(items: readonly PrintableRewardViewModel[]): Promise<void> {
    const pokemonRewards = items.filter((item) => item.rewardType === 'pokemon');
    if (pokemonRewards.length === 0) return;
    const entries = await this.library.entries('pokemon');
    const artwork = Object.fromEntries(
      pokemonRewards.flatMap((reward) => {
        const entry = entries.find((item) => item.id === reward.referenceId)
          ?? entries.find((item) => item.name.localeCompare(reward.rewardLabel, 'hu', { sensitivity: 'base' }) === 0);
        return entry?.artworkPath ? [[reward.id, entry.artworkPath]] : [];
      }),
    );
    this.pokemonArtworkByRewardId.update((current) => ({ ...current, ...artwork }));
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
