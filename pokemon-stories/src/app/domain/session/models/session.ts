import { failure, Outcome, success } from '../../shared/outcome/outcome';
import { InvalidSessionError } from '../errors/invalid-session.error';

export type SessionStatus = 'running' | 'review-pending' | 'completed';

export interface SessionProps {
  readonly id: string;
  readonly projectId: string;
  readonly adventureId: string;
  readonly status: SessionStatus;
  readonly startedAt: string;
  readonly completedAt: string | null;
}

export class Session {
  private constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly adventureId: string,
    public readonly status: SessionStatus,
    public readonly startedAt: string,
    public readonly completedAt: string | null,
  ) {
    Object.freeze(this);
  }

  static start(props: Omit<SessionProps, 'status' | 'completedAt'>): Outcome<Session, InvalidSessionError> {
    return this.restore({ ...props, status: 'running', completedAt: null });
  }

  static restore(props: SessionProps): Outcome<Session, InvalidSessionError> {
    if (!props.id || !props.projectId || !props.adventureId) {
      return failure(new InvalidSessionError('A Session azonositoi kotelezoek.'));
    }
    if (Number.isNaN(Date.parse(props.startedAt))) {
      return failure(new InvalidSessionError('A Session kezdete ervenytelen.'));
    }
    if (props.status === 'running' && props.completedAt !== null) {
      return failure(new InvalidSessionError('A futoban levo Sessionnek nincs befejezesi ideje.'));
    }
    if (props.status !== 'running' && (!props.completedAt || Number.isNaN(Date.parse(props.completedAt)))) {
      return failure(new InvalidSessionError('A lezart Session befejezesi ideje kotelezo.'));
    }
    return success(new Session(
      props.id,
      props.projectId,
      props.adventureId,
      props.status,
      props.startedAt,
      props.completedAt,
    ));
  }

  finishGameplay(completedAt: string): Outcome<Session, InvalidSessionError> {
    if (this.status !== 'running') {
      return failure(new InvalidSessionError('Csak futoban levo Session fejezheto be.'));
    }
    return Session.restore({ ...this, status: 'review-pending', completedAt });
  }

  completeReview(): Outcome<Session, InvalidSessionError> {
    if (this.status !== 'review-pending') {
      return failure(new InvalidSessionError('Csak attekintesre varo Session zarhato le.'));
    }
    return Session.restore({ ...this, status: 'completed', completedAt: this.completedAt });
  }
}