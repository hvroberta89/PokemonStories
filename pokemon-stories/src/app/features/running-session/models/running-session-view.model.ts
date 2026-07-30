import {
  CharacterStripItemViewModel,
} from '../components/characters-strip/characters-strip.model';
import {
  GoalCardViewModel,
} from '../components/goal-card/goal-card.model';
import {
  StoryCardViewModel,
} from '../components/story-card/story-card.model';

export interface RunningSessionViewModel {
  readonly story: StoryCardViewModel;
  readonly goal: GoalCardViewModel;
  readonly characters:
    readonly CharacterStripItemViewModel[];
}