export const armorType = {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
} as const;

export type armorType = (typeof armorType)[keyof typeof armorType];