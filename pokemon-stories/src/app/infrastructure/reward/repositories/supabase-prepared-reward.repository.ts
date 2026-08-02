import { inject, Injectable } from '@angular/core';
import type { PreparedRewardRepository } from '../../../application/reward/ports/prepared-reward-repository';
import type { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { adventureSceneId } from '../../../domain/adventure/value-objects/adventure-scene-id';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import { PreparedReward } from '../../../domain/reward/models/prepared-reward';
import type { RewardType } from '../../../domain/reward/models/reward-grant';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

@Injectable()
export class SupabasePreparedRewardRepository implements PreparedRewardRepository {
  private readonly supabase = inject(SUPABASE_CLIENT);

  async save(reward: PreparedReward): Promise<void> {
    const value = reward.value;
    const { error } = await this.supabase.from('prepared_rewards').upsert({
      id: value.id, project_id: value.projectId, adventure_id: value.adventureId,
      scene_id: value.sceneId ?? null, reward_type: value.type, label: value.label,
      amount: value.amount, physical_status: value.physicalStatus, updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Could not save prepared reward: ${error.message}`);
  }

  async findByAdventure(projectId: ProjectId, adventureId: AdventurePlanId): Promise<readonly PreparedReward[]> {
    const { data, error } = await this.supabase.from('prepared_rewards')
      .select('id, scene_id, reward_type, label, amount, physical_status')
      .eq('project_id', projectId).eq('adventure_id', adventureId).is('unlocked_at', null).order('created_at');
    if (error) throw new Error(`Could not load prepared rewards: ${error.message}`);
    return (data ?? []).map((row) => PreparedReward.create({
      id: row.id, projectId, adventureId,
      sceneId: row.scene_id ? adventureSceneId(row.scene_id) : undefined,
      type: row.reward_type as RewardType, label: row.label, amount: row.amount,
      physicalStatus: row.physical_status as 'queued' | 'skipped',
    }));
  }

  async remove(projectId: ProjectId, rewardId: string): Promise<void> {
    const { error } = await this.supabase.from('prepared_rewards').delete().eq('project_id', projectId).eq('id', rewardId);
    if (error) throw new Error(`Could not remove prepared reward: ${error.message}`);
  }

  async markUnlocked(projectId: ProjectId, rewardIds: readonly string[], sessionId: string): Promise<void> {
    if (rewardIds.length === 0) return;
    const { error } = await this.supabase.from('prepared_rewards').update({
      unlocked_at: new Date().toISOString(), unlocked_session_id: sessionId, updated_at: new Date().toISOString(),
    }).eq('project_id', projectId).in('id', rewardIds);
    if (error) throw new Error(`Could not unlock prepared rewards: ${error.message}`);
  }
}
