import { Session } from './session';

describe('Session', () => {
  it('moves from running through review to completed', () => {
    const started = Session.start({
      id: 'session-1',
      projectId: 'project-1',
      adventureId: 'adventure-1',
      startedAt: '2026-08-03T10:00:00.000Z',
    });
    if (!started.isSuccess) throw started.error;
    const review = started.value.finishGameplay('2026-08-03T11:00:00.000Z');
    if (!review.isSuccess) throw review.error;
    const completed = review.value.completeReview();

    expect(completed).toMatchObject({
      isSuccess: true,
      value: { status: 'completed', completedAt: '2026-08-03T11:00:00.000Z' },
    });
  });

  it('rejects completing a running Session without review', () => {
    const started = Session.start({
      id: 'session-1',
      projectId: 'project-1',
      adventureId: 'adventure-1',
      startedAt: '2026-08-03T10:00:00.000Z',
    });
    if (!started.isSuccess) throw started.error;

    expect(started.value.completeReview().isSuccess).toBe(false);
  });
});