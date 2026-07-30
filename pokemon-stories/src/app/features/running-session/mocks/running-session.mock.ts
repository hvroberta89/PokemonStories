import {
  RunningSessionViewModel,
} from '../models/running-session-view.model';

export const mockRunningSession:
  RunningSessionViewModel = {
    story: {
      locationName: 'Virágmező',
      narration:
        'A szél finoman megmozgatja a virágokat. A távolban valami aranyszínűen csillan.',
      imageUrl:
        '/images/story-cards/flower-meadow.png',
      imageAlt:
        'Színes virágokkal borított napsütötte rét',
      mood: 'exploration',
    },

    goal: {
      title:
        'Találjátok meg a Napviráglevelet',
      description:
        'Kövessétek az aranyszínű nyomokat a Virágmezőn.',
      status: 'active',
      progressLabel: '1 nyom megtalálva',
    },

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
  };