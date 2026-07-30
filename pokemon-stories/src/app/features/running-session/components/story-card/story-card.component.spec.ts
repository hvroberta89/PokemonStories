import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCardComponent } from './story-card.component';
import { StoryCardViewModel } from './story-card.model';

describe('StoryCardComponent', () => {
  let fixture: ComponentFixture<StoryCardComponent>;

  const story: StoryCardViewModel = {
    locationName: 'Virágmező',
    locationIcon: '🌺',
    narration: [
      'A szél finoman megmozgatja a virágokat.',
      'A bokrok mögül halk nesz hallatszik.',
    ],
    imageUrl:
      '/images/story-cards/flower-meadow.png',
    imageAlt:
      'Színes virágokkal borított napsütötte rét',
    mood: 'exploration',
    currentPage: 2,
    pageCount: 4,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoryCardComponent);
    fixture.componentRef.setInput('story', story);
    fixture.detectChanges();
  });

  it('renders the current story', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain(
      'Virágmező',
    );

    expect(element.textContent).toContain(
      'A szél finoman megmozgatja a virágokat.',
    );

    expect(
      element.querySelectorAll(
        '.story-card__page-dot',
      ),
    ).toHaveLength(4);

    expect(
      element.querySelectorAll(
        '.story-card__page-dot--active',
      ),
    ).toHaveLength(1);
  });
});
