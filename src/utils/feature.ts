import { Feature } from "@/types/feature";
import useCharacterStore from "@/stores/CharacterStore";
import { Character } from "@/types/character";
import { mergeFeaturesFromAllSources } from "@/constants/featureSources";
import { dedupeFeatureUpgrades } from "@/utils/featureUpgrades";

function saveFeature(feature: Feature) {
    const { character, updateCharacterField } = useCharacterStore.getState();
    updateCharacterField("features", {
        ...character?.features,
        [feature.name]: feature,
    });
}

export function consumeCharge(feature: Feature) {
    if (!feature || feature.charges == null || feature.chargesUsed == null) return;

    feature.chargesUsed++;

    saveFeature(feature);
}

export function incrementCharge(feature: Feature) {
    if (!feature || feature.charges == null || feature.chargesUsed == null) return;

    feature.chargesUsed--;

    //check that it is not less than 0
    if (feature.chargesUsed < 0) {
        feature.chargesUsed = 0;
    }

    saveFeature(feature);
}

export function recharge(feature: Feature) {
    if (!feature || feature.charges == null || feature.chargesUsed == null) return;

    feature.chargesUsed = 0;

    saveFeature(feature);
}

//just is wrapper for dedupe and merge
export function getAllFeatures(character: Character): Record<string, Feature> {
    return dedupeFeatureUpgrades(mergeFeaturesFromAllSources(character));
}