"use client";

import { Feature } from "@/types/feature";
import useFocusStore from "@/stores/FocusStore";
import useCharacterStore from "@/stores/CharacterStore";
import { consumeCharge, incrementCharge, recharge } from "@/utils/feature";
import { getAllFeatures } from "@/utils/feature";
import { getUnlockedFeaturesByLevel } from "@/utils/featureUnlocks";

export default function FeatureCard() {
  const { focusKey } = useFocusStore();
  const { character } = useCharacterStore();

  // Resolve from the same merged map used by the feature list so race/class/
  // background/item features all open consistently in the focus card.
  const allFeatures = character ? getAllFeatures(character) : {};
  const unlockedFeatures = character
    ? getUnlockedFeaturesByLevel(allFeatures, character.level)
    : {};

  const feature: Feature | null = focusKey
    ? (unlockedFeatures[focusKey] ?? null)
    : null;

  if (!feature) return null;

  const hasCharges =
    feature.charges !== undefined &&
    feature.chargesUsed !== undefined &&
    feature.chargesUsed < feature.charges;

  return (
    <div className="w-auto h-auto bg-base-100 p-4 rounded-lg shadow-lg z-10">
      <h3 className="text-lg font-semibold">{focusKey ?? "Feature"}</h3>

      {feature.source && (
        <p className="text-sm text-base-content/70">
          <strong>Source:</strong> {feature.source}
        </p>
      )}

      <p className="text-sm text-base-content">
        <strong>Type:</strong> {formatFeatureType(feature.type)}
      </p>

      <p className="text-sm text-base-content mt-2">{feature.description}</p>

      {feature.charges !== undefined && feature.chargesUsed !== undefined && (
        <div className="mt-2">
          <div className="text-sm text-base-content mb-2">
            <strong>Charges:</strong> {feature.chargesUsed} / {feature.charges}
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => consumeCharge(feature)}
              disabled={!hasCharges}
            >
              Use
            </button>
            <button
              className="btn btn-accent"
              onClick={() => incrementCharge(feature)}
              disabled={feature.chargesUsed === 0}
            >
              +
            </button>
            <button
              className="btn btn-primary"
              onClick={() => recharge(feature)}
              disabled={hasCharges}
            >
              Recharge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatFeatureType(type: string): string {
  return type.replace(/([a-z])([A-Z])/g, "$1 $2");
}
