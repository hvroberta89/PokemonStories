import { inject, Injectable } from '@angular/core';

import type { SessionCloudRepository } from '../../../application/session/ports/session-cloud-repository';
import type {
  CompletedProjectSessionDetail,
  CompletedProjectSessionSummary,
  ProjectSessionSummary,
} from '../../../application/session/ports/project-session-reader';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import type { RunningSessionState } from '../../../features/running-session/models/running-session-state.model';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface SessionRow {
  readonly id: string;
  readonly project_id: string;
  readonly adventure_id: string;
  readonly status: RunningSessionState['status'];
  readonly started_at: string;
  readonly completed_at: string | null;
  readonly state: RunningSessionState;
}

@Injectable()
export class SupabaseSessionRepository implements SessionCloudRepository {
  private static readonly columns =
    'id, project_id, adventure_id, status, started_at, completed_at, state';
  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(state: RunningSessionState): Promise<void> {
    if (!state.projectId || !state.adventureId || !state.adventureTitle) return;
    const { error } = await this.supabase.from('sessions').upsert({
      id: state.sessionId,
      project_id: state.projectId,
      adventure_id: state.adventureId,
      status: state.status,
      started_at: state.startedAt,
      completed_at: state.completedAt,
      state,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Could not save session: ${error.message}`);
  }

  async findRestorable(): Promise<RunningSessionState | null> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(SupabaseSessionRepository.columns)
      .in('status', ['running', 'review-pending'])
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle<SessionRow>();
    if (error) throw new Error(`Could not restore session: ${error.message}`);
    return data?.state ?? null;
  }

  async findByProject(projectId: ProjectId): Promise<ProjectSessionSummary | null> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(SupabaseSessionRepository.columns)
      .eq('project_id', projectId)
      .in('status', ['running', 'review-pending'])
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle<SessionRow>();
    if (error) throw new Error(`Could not load active session: ${error.message}`);
    return data ? this.toActiveSummary(data) : null;
  }

  async listCompletedByProject(
    projectId: ProjectId,
  ): Promise<readonly CompletedProjectSessionSummary[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(SupabaseSessionRepository.columns)
      .eq('project_id', projectId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .returns<SessionRow[]>();
    if (error) throw new Error(`Could not load session history: ${error.message}`);
    return (data ?? []).map((row) => this.toCompletedSummary(row));
  }

  async findCompletedById(
    projectId: ProjectId,
    sessionId: string,
  ): Promise<CompletedProjectSessionDetail | null> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(SupabaseSessionRepository.columns)
      .eq('project_id', projectId)
      .eq('id', sessionId)
      .eq('status', 'completed')
      .maybeSingle<SessionRow>();
    if (error) throw new Error(`Could not load session: ${error.message}`);
    if (!data) return null;
    const state = data.state;
    return {
      ...this.toCompletedSummary(data),
      narration: state.viewModel.story.narration,
      sceneTitles: state.scenes?.map((scene) => scene.title) ?? [state.viewModel.story.locationName],
      events: state.viewModel.recentEvents.events.map(({ id, title, content, timeLabel }) => ({
        id,
        title,
        content,
        timeLabel,
      })),
      rewards: [...state.rewardHistory, ...state.rewardQueue].map(
        ({ id, recipientName, rewardLabel, amount }) => ({
          id,
          recipientName,
          rewardLabel,
          amount,
        }),
      ),
    };
  }

  private toActiveSummary(row: SessionRow): ProjectSessionSummary {
    const state = row.state;
    return {
      sessionId: row.id,
      projectId: row.project_id as ProjectId,
      adventureId: row.adventure_id,
      adventureTitle: state.adventureTitle!,
      currentSceneTitle: state.viewModel.story.locationName,
      currentGoal: state.viewModel.goal.title,
      startedAt: row.started_at,
      status: row.status as 'running' | 'review-pending',
    };
  }

  private toCompletedSummary(row: SessionRow): CompletedProjectSessionSummary {
    const state = row.state;
    return {
      sessionId: row.id,
      projectId: row.project_id as ProjectId,
      adventureId: row.adventure_id,
      adventureTitle: state.adventureTitle!,
      finalSceneTitle: state.viewModel.story.locationName,
      startedAt: row.started_at,
      completedAt: row.completed_at!,
      eventCount: state.viewModel.recentEvents.events.length,
      rewardCount: state.rewardHistory.length + state.rewardQueue.length,
      participantNames: state.participants?.map((participant) => participant.name) ?? [],
    };
  }
}
