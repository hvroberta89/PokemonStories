import {
  CharactersStripViewModel,
} from '../components/characters-strip/characters-strip.model';
import {
  GoalCardViewModel,
} from '../components/goal-card/goal-card.model';
import { ImprovAssistantViewModel } from '../components/improv-assistant/improv-assistant.model';
import { RecentEventsViewModel } from '../components/recent-events/recent-events.model';
import {
  StoryCardViewModel,
} from '../components/story-card/story-card.model';

export interface RunningSessionViewModel {
  readonly story: StoryCardViewModel;
  readonly goal: GoalCardViewModel;
  readonly characters: CharactersStripViewModel;
  readonly recentEvents: RecentEventsViewModel;
  readonly assistant: ImprovAssistantViewModel;
}