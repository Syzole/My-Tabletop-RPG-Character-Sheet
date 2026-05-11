import { Stats } from './stats';
import { Feature } from './feature';
import { Proficiencies } from './proficiencies';

export interface Race {
  name: string;
  speed: number;
  size: 'Small' | 'Medium' | 'Large';
  abilityScoreIncreases: Partial<Stats>;
  features: Set<Feature>;
  languages: Set<string>;
  proficiencies?: Proficiencies;
}
