import { Feature } from "@/types/feature";
import useCharacterStore from "@/stores/CharacterStore";
import { Character } from "@/types/character";
import { mergeFeaturesFromAllSources } from "@/constants/featureSources";
import { dedupeFeatureUpgrades } from "@/utils/featureUpgrades";
//due to reacts very fun nature of needs to make a new objec to re render that is what I must do
function saveFeature(feature: Feature) {
  const { character, updateCharacterField } = useCharacterStore.getState();
  updateCharacterField("features", {
    ...character?.features,
    [feature.name]: feature,
  });
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
