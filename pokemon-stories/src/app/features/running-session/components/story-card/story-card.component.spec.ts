import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCardComponent } from './story-card.component';
import { StoryCardViewModel } from './story-card.model';

describe('StoryCardComponent', () => {
  let fixture: ComponentFixture<StoryCardComponent>;

  const story: StoryCardViewModel = {
    locationName: 'Flower meadow',
    locationIcon: 'environment-forest',
    narration: ['The wind gently moves the flowers.', 'A quiet rustle comes from the bushes.'],
    imageUrl: '/images/story-cards/flower-meadow.png',
    imageAlt: 'A sunny meadow covered in colourful flowers',
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
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Flower meadow');
    expect(element.textContent).toContain('The wind gently moves the flowers.');
    expect(element.querySelectorAll('.story-card__page-dot')).toHaveLength(4);
    expect(element.querySelectorAll('.story-card__page-dot--active')).toHaveLength(1);
  });

  it('requests the next scene from the parent', () => {
    const emitted = vi.fn();
    fixture.componentInstance.nextSelected.subscribe(emitted);

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.story-card__next')
      ?.click();

    expect(emitted).toHaveBeenCalledOnce();
  });
});
