export const DamageType = {
    Slashing: "slashing",
    Piercing: "piercing",
    Bludgeoning: "bludgeoning",
    Acid: "acid",
    Cold: "cold",
    Fire: "fire",
    Force: "force",
    Lightning: "lightning",
    Necrotic: "necrotic",
    Poison: "poison",
    Psychic: "psychic",
    Radiant: "radiant",
    Thunder: "thunder",
} as const;

export type DamageType = (typeof DamageType)[keyof typeof DamageType];

export const AttackType = {
    Melee: "melee",
    Ranged: "ranged",
} as const;

export type AttackType = (typeof AttackType)[keyof typeof AttackType];