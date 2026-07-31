import {
  RunningSessionViewModel,
} from '../models/running-session-view.model';

export const mockRunningSession:
  RunningSessionViewModel = {
    story: {
      locationName: 'Virágmező',
      locationIcon: '🌺',
      narration: [
        'A szél finoman megmozgatja a virágokat. A távolban valami aranyszínűen csillan.',
        'A fű között apró lábnyomok vezetnek az öreg tölgyfa irányába.',
        'A bokrok mögül halk nesz hallatszik…',
      ],
      imageUrl:
        '/images/story-cards/flower-meadow.png',
      imageAlt:
        'Színes virágokkal borított napsütötte rét',
      mood: 'exploration',
      currentPage: 2,
      pageCount: 4,
    },

    goal: {
      title: 'Találjátok meg a Napviráglevelet',
      description:
        'Kövessétek az aranyszínű nyomokat a Virágmezőn.',
      status: 'active',
      progressLabel: '1 nyom megtalálva',
      actionLabel: 'Cél részleteinek megnyitása',
    },

    characters: {
      title: 'Kalandorok',
      countLabel: '3 játékos',
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
        {
          id: 'piko',
          name: 'Pikó',
          initials: 'PI',
          status: 'ready',
          statusLabel: 'Készen áll',
        },
      ],
    },
    recentEvents: {
      title: 'Legutóbbi események',
      newEventsLabel: '3 új esemény',
      detailsLabel:
        'Legutóbbi események megnyitása',
      events: [
        {
          id: 'pikachu-approached',
          type: 'encounter',
          title:
            'Pikachu volt általatok megközelítve.',
          timeLabel: '3 perce',
          icon: '◓',
        },
        {
          id: 'professor-conversation',
          type: 'conversation',
          title:
            'Beszélgettetek Elm professzorral.',
          timeLabel: '8 perce',
          icon: '💬',
        },
        {
          id: 'potion-reward',
          type: 'reward',
          title:
            '1 Potion került Marcihoz.',
          timeLabel: '12 perce',
          icon: '🧪',
        },
      ],
    },
    assistant: {
      title: 'Mi történjen most?',
      description:
        'Kérj gyors segítséget, ha a játékosok meglepnek, vagy új ötletre van szükséged.',

      options: [
        {
          action: 'unexpected-direction',
          title: 'Más irányba mentek',
          description:
            'Adj három ötletet az új helyzethez.',
          icon: '🧭',
        },
        {
          action: 'quick-npc',
          title: 'Új szereplő kell',
          description:
            'Találj ki gyorsan egy emlékezetes NPC-t.',
          icon: '🎭',
        },
        {
          action: 'pokemon-event',
          title: 'Pokémonnal találkoztak',
          description:
            'Készíts egy rövid eseményt vagy kihívást.',
          icon: '⚡',
        },
        {
          action: 'continue-story',
          title: 'Elakadtunk',
          description:
            'Javasolj három lehetséges folytatást.',
          icon: '✨',
        },
      ],
    },

    dock: {
      quickActionLabel: 'Gyors művelet',
      items: [
        {
          action: 'notes',
          label: 'Jegyzetek',
          icon: 'notes-scroll',
          badge: 2,
        },
        {
          action: 'rewards',
          label: 'Jutalmak',
          icon: 'reward-gift',
          badge: 1,
        },
        {
          action: 'assistant',
          label: 'AI segítő',
          icon: 'ai-crystal',
          active: true,
        },
        {
          action: 'inventory',
          label: 'Várólista',
          icon: 'print-queue',
          badge: 3,
        },
      ],
    },
  };