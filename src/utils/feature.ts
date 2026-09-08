import { Feature } from "@/types/feature";
import useCharacterStore from "@/stores/CharacterStore";
import { Character } from "@/types/character";
import {
  mergeFeaturesFromAllSources,
  updateFeatureInSources,
} from "@/constants/featureSources";
import { dedupeFeatureUpgrades } from "@/utils/featureUpgrades";

function saveFeature(feature: Feature) {
  const { character, setCharacter } = useCharacterStore.getState();
  if (!character) return;
  setCharacter(updateFeatureInSources(character, feature));
}

export function consumeCharge(feature: Feature) {
  if (!feature || feature.charges == null || feature.chargesUsed == null)
    return;

  const updatedFeature = { ...feature, chargesUsed: feature.chargesUsed + 1 };

  saveFeature(updatedFeature);
}

export function incrementCharge(feature: Feature) {
  if (!feature || feature.charges == null || feature.chargesUsed == null)
    return;

  const updatedFeature = { ...feature, chargesUsed: feature.chargesUsed - 1 };

  //check that it is not less than 0
  if (updatedFeature.chargesUsed < 0) {
    updatedFeature.chargesUsed = 0;
  }

  saveFeature(updatedFeature);
}

export function recharge(feature: Feature) {
  if (!feature || feature.charges == null || feature.chargesUsed == null)
    return;

  const updatedFeature = { ...feature, chargesUsed: 0 };

  saveFeature(updatedFeature);
}

//just is wrapper for dedupe and merge
export function getAllFeatures(character: Character): Record<string, Feature> {
  return dedupeFeatureUpgrades(mergeFeaturesFromAllSources(character));
}
