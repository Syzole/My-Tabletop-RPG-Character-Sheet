import { Class } from "../types/class";
import { Armor, Consumable, Container, itemRarity, Tool, Weapon } from "../types/item";
import { DamageType } from "../types/damage";
import { WeaponCategories, WeaponProperties, Weapons } from "../types/weapon";
import { armorType } from "@/types/armor";
import { AttackType } from "@/types/damage";
import { statName } from "@/types/stats";
import { SkillName } from "@/types/skills";
import { roguePHBFeatures } from "@/private-assets/data/classes/generated/rogue.phb.features";

export const rogue: Class = {
  name: "Rogue",
  hitDice: 8,
  startingInfo: {
    savingThrowProficiencies: new Set([statName.Dexterity, statName.Intelligence]),
    skillProficiencies: {
      choose: 4,
      from: new Set<SkillName>([
        "acrobatics",
        "athletics",
        "deception",
        "insight",
        "intimidation",
        "investigation",
        "perception",
        "performance",
        "persuasion",
        "sleightOfHand",
        "stealth",
      ]),
    },
    weaponProficiencies: new Set([
      WeaponCategories.Simple,
      Weapons.CrossbowHand,
      Weapons.Longsword,
      Weapons.Rapier,
      Weapons.Shortsword,
      Weapons.Shortbow,
    ]),
    toolProficiencies: new Set(["thieves' tools"]),
    armorProficiencies: new Set([armorType.Light]),

    startingEquipment: {
    automatic: {
      "Leather Armor": {
        items: [{
          armorClass: 11,
          type: armorType.Light,
          weight: 10,
          quantity: 1,
          equipped: false,
          rarity: itemRarity.Common,
        } satisfies Armor],
      },
      "Dagger": {
        items: [{
          attackType: AttackType.Melee,
          weaponType: "dagger",
          category: "simple",
          weight: 1,
          description: ["A small, sharp blade."],
          damage: { diceCount: 1, diceValue: 4, type: DamageType.Piercing },
          range: { normal: 20, long: 60 },
          quantity: 2,
          equipped: false,
          rarity: itemRarity.Common,
          requiresAttunement: false,
          properties: new Set([WeaponProperties.Finesse, WeaponProperties.Light, WeaponProperties.Thrown]),
        } satisfies Weapon],
      },
      "Thieves' Tools": {
        items: [{
          toolType: "thieves' tools",
          weight: 1,
          description: ["Used for lockpicking and disarming traps."],
          quantity: 1,
          equipped: false,
          rarity: itemRarity.Common,
          requiresAttunement: false,
        } satisfies Tool],
      },
    },

    choices: [
      {
        choose: 1,
        from: {
          "Rapier": {
            items: [{
              attackType: AttackType.Melee,
              weaponType: "rapier",
              category: "martial",
              weight: 2,
              description: ["A slender, sharply pointed sword."],
              damage: { diceCount: 1, diceValue: 8, type: DamageType.Piercing },
              quantity: 1,
              equipped: false,
              rarity: itemRarity.Common,
              requiresAttunement: false,
              properties: new Set([WeaponProperties.Finesse]),
            } satisfies Weapon],
          },
          "Shortsword": {
            items: [{
              attackType: AttackType.Melee,
              weaponType: "shortsword",
              category: "martial",
              weight: 2,
              description: ["A short, single-edged sword."],
              damage: { diceCount: 1, diceValue: 6, type: DamageType.Piercing },
              quantity: 1,
              equipped: false,
              rarity: itemRarity.Common,
              requiresAttunement: false,
              properties: new Set([WeaponProperties.Finesse, WeaponProperties.Light]),
            } satisfies Weapon],
          },
        }
      },
      {
        choose: 1,
        from: {
          Shortbow: {
            grants: {
              Shortbow: {
                items: [{
                  attackType: AttackType.Ranged,
                  weaponType: "shortbow",
                  category: "simple",
                  range: { normal: 80, long: 320 },
                  weight: 2,
                  description: ["A small bow for ranged attacks."],
                  damage: { diceCount: 1, diceValue: 6, type: DamageType.Piercing },
                  quantity: 1,
                  equipped: false,
                  rarity: itemRarity.Common,
                  requiresAttunement: false,
                  properties: new Set([
                    WeaponProperties.Ammunition,
                    WeaponProperties.TwoHanded
                  ]),
                } satisfies Weapon],
              },
              Arrows: {
                items: [{
                  consumableType: "ammunition",
                  effect: "Ammunition for ranged weapons",
                  uses: 20,
                  maxUses: 20,
                  quantity: 20,
                  weight: 0.05,
                  description: ["Arrows for use with bows."],
                  rarity: itemRarity.Common,
                  requiresAttunement: false,
                } satisfies Consumable],
              },
            },
          },
          Shortsword: {
            grants: {
              Shortsword: {
                items: [{
                  attackType: AttackType.Melee,
                  weaponType: "shortsword",
                  category: "martial",
                  weight: 2,
                  description: ["A short, single-edged sword."],
                  damage: { diceCount: 1, diceValue: 6, type: DamageType.Piercing },
                  quantity: 1,
                  equipped: false,
                  rarity: itemRarity.Common,
                  requiresAttunement: false,
                  properties: new Set([
                    WeaponProperties.Finesse,
                    WeaponProperties.Light
                  ]),
                } satisfies Weapon],
              },
            },
          },
        },
      },
      {
        choose: 1,
        from: {
          "Burglar's Pack": {
            items: [{
              weight: 46,
              description: [
                "Contains: a backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days rations, a tinderbox, and a waterskin.",
              ],
              quantity: 1,
              equipped: false,
              rarity: itemRarity.Common,
              requiresAttunement: false,
              capacity: 0,
            } satisfies Container],
          },
          "Dungeoneer's Pack": {
            items: [{
              weight: 61.5,
              description: [
                "Contains: a backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.",
              ],
              quantity: 1,
              equipped: false,
              rarity: itemRarity.Common,
              requiresAttunement: false,
              capacity: 0,
            } satisfies Container],
          },
          "Explorer's Pack": {
            items: [{
              weight: 59,
              description: [
                "Contains: a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.",
              ],
              quantity: 1,
              equipped: false,
              rarity: itemRarity.Common,
              requiresAttunement: false,
              capacity: 0,
            } satisfies Container],
          },
        }
      },
    ]
    },

    startingGold: "4d4 x 10 gp",
  },

  subclassLevel: 3,
  features: roguePHBFeatures,
};
