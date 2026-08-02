import { InjectionToken } from '@angular/core';
import { CharacterReader, CharacterRepository } from '../ports/character-repository';

export const CHARACTER_READER = new InjectionToken<CharacterReader>('CHARACTER_READER');
export const CHARACTER_REPOSITORY = new InjectionToken<CharacterRepository>('CHARACTER_REPOSITORY');
