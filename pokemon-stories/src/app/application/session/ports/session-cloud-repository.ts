import type { RunningSessionState } from '../../../features/running-session/models/running-session-state.model';
import type { ProjectSessionReader } from './project-session-reader';

export interface SessionCloudRepository extends ProjectSessionReader {
  save(state: RunningSessionState): Promise<void>;
  findRestorable(): Promise<RunningSessionState | null>;
}
