import {
  Injectable,
} from '@angular/core';

import {
  QuickNoteDraft,
} from '../components/quick-note/quick-note.model';

import {
  RewardDraft,
} from '../components/reward-sheet/reward-sheet.model';

import {
  RecentEventItemViewModel,
} from '../components/recent-events/recent-events.model';

@Injectable({
  providedIn: 'root',
})
export class RecentEventFactory {
  createQuickNote(
    note: QuickNoteDraft,
  ): RecentEventItemViewModel {
    return {
      id: crypto.randomUUID(),
      type: 'note',
      title: this.createQuickNoteTitle(note),
      content: note.content,
      timeLabel: 'Most',
      icon: 'add-note',
    };
  }

  createReward(
    reward: RewardDraft,
  ): RecentEventItemViewModel {
    return {
      id: crypto.randomUUID(),
      type: 'reward',
      title:
        `${reward.recipientName} ${reward.amount} ${reward.rewardLabel} jutalmat kapott`,
      content:
        `${reward.recipientName} jutalma: ${reward.amount} × ${reward.rewardLabel}.`,
      timeLabel: 'Most',
      icon: 'reward-gift',
    };
  }

  private createQuickNoteTitle(
    note: QuickNoteDraft,
  ): string {
    const prefix =
      this.getQuickNoteTypeLabel(note.type);

    const maximumLength = 72;

    const shortenedContent =
      note.content.length > maximumLength
        ? `${note.content
            .slice(0, maximumLength)
            .trimEnd()}…`
        : note.content;

    return `${prefix}: ${shortenedContent}`;
  }

  private getQuickNoteTypeLabel(
    type: QuickNoteDraft['type'],
  ): string {
    switch (type) {
      case 'general':
        return 'Jegyzet';

      case 'clue':
        return 'Új nyom';

      case 'npc':
        return 'Szereplőjegyzet';

      case 'secret':
        return 'Titkos jegyzet';
    }
  }
}