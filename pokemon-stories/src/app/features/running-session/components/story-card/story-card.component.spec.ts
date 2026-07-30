import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCardComponent } from './story-card.component';
import { StoryCardViewModel } from './story-card.model';

describe('StoryCardComponent', () => {
  let fixture: ComponentFixture<StoryCardComponent>;

  const story: StoryCardViewModel = {
    locationName: 'Virágmező',
    narration:
      'A szél finoman megmozgatja a virágokat. A távolban valami aranyszínűen csillan.',
    imageUrl: '/images/flower-meadow.webp',
    imageAlt: 'Színes virágokkal borított napsütötte rét',
    mood: 'exploration',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoryCardComponent);
    fixture.componentRef.setInput('story', story);
    fixture.detectChanges();
  });

  it('renders the current story scene', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Virágmező');
    expect(element.textContent).toContain('A távolban');
    expect(element.querySelector('img')?.getAttribute('src'))
      .toBe('/images/flower-meadow.webp');
  });
});
