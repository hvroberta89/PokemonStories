import { AdventureSceneId } from '../value-objects/adventure-scene-id';

export interface AdventureScene {
  readonly id: AdventureSceneId;
  readonly title: string;
  readonly description: string;
  readonly goal: string;
  readonly pokemonReferenceId?: string;
  readonly order: number;
  readonly isOpening: boolean;
}

export interface AddAdventureSceneProps {
  readonly id: AdventureSceneId;
  readonly title: string;
  readonly description: string;
  readonly goal: string;
  readonly pokemonReferenceId?: string;
}

export interface UpdateAdventureSceneProps {
  readonly title: string;
  readonly description: string;
  readonly goal: string;
  readonly pokemonReferenceId?: string;
}
