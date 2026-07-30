import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  CharactersStripComponent,
} from './characters-strip.component';
import {
  CharactersStripViewModel,
} from './characters-strip.model';

describe('CharactersStripComponent', () => {
  let fixture:
    ComponentFixture<CharactersStripComponent>;

  const strip: CharactersStripViewModel = {
    title: 'Kalandorok',
    countLabel: '2 játékos',
    addLabel: 'Új karakter hozzáadása',
    characters: [
      {
        id: 'lili',
        name: 'Lili',
        initials: 'LI',
        status: 'ready',
        statusLabel: 'Készen áll',
      },
      {
        id: 'marci',
        name: 'Marci',
        initials: 'MA',
        status: 'thinking',
        statusLabel: 'Gondolkodik',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersStripComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      CharactersStripComponent,
    );

    fixture.componentRef.setInput(
      'strip',
      strip,
    );

    fixture.detectChanges();
  });

  it('renders the adventurers', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Lili');
    expect(element.textContent).toContain('Marci');
    expect(element.textContent).toContain(
      '2 játékos',
    );
  });

  it('emits the selected character id', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.characterSelected,
      'emit',
    );

    const button =
      fixture.nativeElement.querySelector(
        '.character:not(.character--add)',
      ) as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith('lili');
  });

  it('emits the add event', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.addSelected,
      'emit',
    );

    const button =
      fixture.nativeElement.querySelector(
        '.character--add',
      ) as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });
});