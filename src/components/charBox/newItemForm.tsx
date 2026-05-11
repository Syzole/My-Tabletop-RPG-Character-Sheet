import React, { useState } from "react";
import { Item, Weapon, Armor, Consumable, itemRarity } from "@/types/item";
import { Weapons, WeaponType } from "@/types/weapon";
import { capitalizeFirstLetter } from "@/utils/text";
import { WeaponProperties } from "@/types/weapon";
import { formatPropertyKey } from "@/utils/text";
import { AttackType, DamageType } from "@/types/damage";
import { armorType } from "@/types/armor";

type ItemCategory =
    | "weapon"
    | "armor"
    | "shield"
    | "consumable"
    | "tool"
    | "container"
    | "wondrous";

interface NewItemFormProps {
    onSave: (name: string, item: Item) => void;
    onCancel: () => void;
}

export default function NewItemForm({ onSave, onCancel }: NewItemFormProps) {
    const [ category, setCategory ] = useState<ItemCategory>("weapon");
    const [ itemName, setItemName ] = useState<string>("");

    const [ item, setItem ] = useState<Partial<Item>>({
        description: [""],
        quantity: 1,
        weight: 0,
        value: 0,
        rarity: itemRarity.Common,
        notes: "",
        equipped: false,
    });

    const [ weaponData, setWeaponData ] = useState<Partial<Weapon>>({
        damage: { diceCount: 1, diceValue: 6, type: DamageType.Slashing },
        attackType: AttackType.Melee,
        weaponType: undefined,
        category: "simple",
    });

    const [ armorData, setArmorData ] = useState<Partial<Armor>>({
        armorClass: 12,
        type: armorType.Light,
    });

    const [ consumableData, setConsumableData ] = useState<Partial<Consumable>>({
        effect: "",
        uses: 1,
        maxUses: 1,
        consumableType: "potion",
    });

    function handleBaseChange<K extends keyof Item>(field: K, value: Item[ K ]) {
        setItem((prev) => ({ ...prev, [ field ]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let fullItem: Item;

        // Validation: ensure name is provided
        if (!itemName || itemName.trim() === "") {
            alert("Please enter an item name.");
            return;
        }

        // Validation: if creating a weapon, ensure a weapon is selected
        if (category === "weapon" && !(weaponData.weaponType && weaponData.weaponType !== undefined)) {
            // simple client-side feedback
            alert("Please select a weapon from the dropdown.");
            return;
        }

        switch (category) {
            case "weapon":
                fullItem = { ...item, ...weaponData } as Weapon;
                break;
            case "armor":
            case "shield":
                fullItem = { ...item, ...armorData } as Armor;
                break;
            case "consumable":
                fullItem = { ...item, ...consumableData } as Consumable;
                break;
            default:
                fullItem = { ...item } as Item;
        }

        onSave(itemName.trim(), fullItem);
    }

    return (
        <form
            onSubmit={ handleSubmit }
            className="max-w-full mx-auto p-6 rounded-xl bg-base-200/60 border border-base-300 shadow-xl space-y-6"
        >
            <div className="space-y-1">
                <h2 className="text-2xl font-bold">Create New Item</h2>
                <p className="text-sm text-base-content/70">Quickly scaffold weapons, armor, consumables, and more.</p>
            </div>

            {/* Category Selector */ }
            <div className="space-y-3 pb-4 border-b border-base-300">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold">Item Type</p>
                        <p className="text-xs text-base-content/70">Switching will reveal the right fields.</p>
                    </div>
                </div>
                <select
                    className="select select-bordered w-full max-w-xs px-4 h-12"
                    value={ category }
                    onChange={ (e) => setCategory(e.target.value as ItemCategory) }
                >
                    <option value="weapon">Weapon</option>
                    <option value="armor">Armor</option>
                    <option value="shield">Shield</option>
                    <option value="consumable">Consumable</option>
                    <option value="tool">Tool</option>
                    <option value="container">Container</option>
                    <option value="wondrous">Wondrous Item</option>
                </select>
            </div>

            {/* Base Fields */ }
            <div className="space-y-4 pb-4 border-b border-base-300">
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Name</span></label>
                    <input
                        type="text"
                        className="input input-bordered bg-base-100 h-12 px-4"
                        placeholder="Item name"
                        value={ itemName }
                        onChange={ (e) => setItemName(e.target.value) }
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Description</span></label>
                    <textarea
                        className="textarea textarea-bordered w-full bg-base-100 px-4 py-3"
                        placeholder="Item description"
                        value={ item.description || "" }
                        onChange={ (e) => handleBaseChange("description", e.target.value.split("\n") as string[]) }
                    />
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="form-control">
                        <label className="label pb-2"><span className="label-text">Quantity</span></label>
                        <input
                            type="number"
                            className="input input-bordered bg-base-100 h-12 px-4"
                            value={ item.quantity || 1 }
                            onChange={ (e) => handleBaseChange("quantity", Number(e.target.value)) }
                            min={ 1 }
                        />
                    </div>
                    <div className="form-control">
                        <label className="label pb-2"><span className="label-text">Weight (lb)</span></label>
                        <input
                            type="number"
                            className="input input-bordered bg-base-100 h-12 px-4"
                            value={ item.weight || 0 }
                            onChange={ (e) => handleBaseChange("weight", Number(e.target.value)) }
                            step="0.1"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="form-control">
                        <label className="label pb-2"><span className="label-text">Value (gp)</span></label>
                        <input
                            type="number"
                            className="input input-bordered bg-base-100 h-12 px-4"
                            value={ item.value || 0 }
                            onChange={ (e) => handleBaseChange("value", Number(e.target.value)) }
                            step="0.01"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label pr-2 pb-2"><span className="label-text">Rarity</span></label>
                        <select
                            className="select select-bordered bg-base-100 px-4 h-12"
                            value={ item.rarity || "common" }
                            onChange={ (e) => handleBaseChange("rarity", e.target.value as Item[ "rarity" ]) }
                        >
                            <option value="none">None</option>
                            <option value="common">Common</option>
                            <option value="uncommon">Uncommon</option>
                            <option value="rare">Rare</option>
                            <option value="very rare">Very Rare</option>
                            <option value="legendary">Legendary</option>
                            <option value="artifact">Artifact</option>
                        </select>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Notes</span></label>
                    <textarea
                        className="textarea textarea-bordered w-full bg-base-100 px-4 py-3"
                        placeholder="Extra notes"
                        value={ item.notes || "" }
                        onChange={ (e) => handleBaseChange("notes", e.target.value) }
                    />
                </div>
            </div>

            {/* Weapon Fields */ }
            { category === "weapon" && (
                <div className="space-y-4 pb-4 border-b border-base-300">
                    <div className="form-control ">
                        <label className="label"><span className="label-text pr-2">Weapon</span></label>
                        <select
                            className="select select-bordered bg-base-100 px-4 h-12"
                            value={ weaponData.weaponType || "" }
                            onChange={ (e) =>
                                setWeaponData((prev) => ({
                                    ...prev,
                                    weaponType: e.target.value as WeaponType,
                                }))
                            }
                            required
                        >
                            <option value="" disabled>-- Select a weapon --</option>
                            { (Object.values(Weapons) as WeaponType[]).sort().map((w) => (
                                <option key={ w } value={ w }>{ capitalizeFirstLetter(w) }</option>
                            )) }
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-base-100 border border-base-300 p-4">
                        <span className="text-sm font-semibold text-base-content/80 pr-2">Damage</span>
                        <input
                            type="number"
                            className="input input-bordered w-16 text-center h-11"
                            placeholder="1"
                            min={ 1 }
                            value={ weaponData.damage?.diceCount || 1 }
                            onChange={ (e) =>
                                setWeaponData((prev) => ({
                                    ...prev,
                                    damage: { ...prev.damage!, diceCount: Number(e.target.value) },
                                }))
                            }
                        />
                        <span className="font-bold">d</span>
                        <input
                            type="number"
                            className="input input-bordered w-16 text-center h-11"
                            placeholder="6"
                            min={ 2 }
                            value={ weaponData.damage?.diceValue || 6 }
                            onChange={ (e) =>
                                setWeaponData((prev) => ({
                                    ...prev,
                                    damage: { ...prev.damage!, diceValue: Number(e.target.value) },
                                }))
                            }
                        />
                        <div>
                            <span className="text-sm">Damage Type:</span>
                            <div className="flex flex-wrap gap-2 ml-auto">
                                { [DamageType.Slashing, DamageType.Piercing, DamageType.Bludgeoning].map((type) => (
                                    <label key={ type } className="flex items-center gap-2 text-xs bg-base-200 px-3 py-1.5 rounded">
                                        <input
                                            type="radio"
                                            checked={ weaponData.damage?.type === type }
                                            onChange={ (e) => setWeaponData((prev) => ({ ...prev, damage: { ...prev.damage!, type: type as typeof DamageType.Slashing | typeof DamageType.Piercing | typeof DamageType.Bludgeoning } })) }
                                        />
                                        { capitalizeFirstLetter(type) }
                                    </label>
                                )) }
                            </div>
                        </div>
                    

                        <div>
                            <span className="text-sm">Properties:</span>
                            <div className="flex flex-wrap gap-2 ml-auto">
                                { [
                                    WeaponProperties.Ammunition,
                                    WeaponProperties.Finesse,
                                    WeaponProperties.Heavy,
                                    WeaponProperties.Light,
                                    WeaponProperties.Loading,
                                    WeaponProperties.Range,
                                    WeaponProperties.Reach,
                                    WeaponProperties.Thrown,
                                    WeaponProperties.TwoHanded,
                                    WeaponProperties.Versatile,
                                    WeaponProperties.ImprovisedWeapons,
                                    WeaponProperties.SilveredWeapons,
                                    WeaponProperties.SpecialWeapons,
                                ].map((prop: WeaponProperties) => (
                                    <label key={ prop } className="flex items-center gap-2 text-xs bg-base-200 px-3 py-1.5 rounded">
                                        <input
                                            type="checkbox"
                                            checked={
                                                Array.isArray(weaponData.properties)
                                                    ? weaponData.properties.includes(prop as WeaponProperties)
                                                    : weaponData.properties instanceof Set
                                                        ? weaponData.properties.has(prop as WeaponProperties)
                                                        : false
                                            }
                                            onChange={ (e) => {
                                                setWeaponData((prev) => {
                                                    let properties: Set<WeaponProperties>;
                                                    if (prev.properties instanceof Set) {
                                                        properties = new Set(prev.properties);
                                                    } else {
                                                        properties = new Set();
                                                    }
                                                    if (e.target.checked) {
                                                        properties.add(prop as WeaponProperties);
                                                    } else {
                                                        properties.delete(prop as WeaponProperties);
                                                    }
                                                    return { ...prev, properties };
                                                });
                                            } }
                                        />
                                        { formatPropertyKey(prop) }
                                    </label>
                                )) }
                            </div>
                                                </div>
                        </div>

                    <div className="form-control">
                        <label className="label pr-2"><span className="text-sm">Attack Type</span></label>
                        <select
                            className="select select-bordered bg-base-100 px-4 h-12"
                            value={ weaponData.attackType || AttackType.Melee }
                            onChange={ (e) =>
                                setWeaponData((prev) => ({
                                    ...prev,
                                    attackType: e.target.value as AttackType,
                                }))
                            }
                        >
                            <option value={ AttackType.Melee }>Melee</option>
                            <option value={ AttackType.Ranged }>Ranged</option>
                        </select>
                        {/* weaponProperties.Range is checked, show the range fields */}
                        { weaponData.properties?.has(WeaponProperties.Range) && ( 
                            <div>
                                <div className="form-control pt-2"> {/* This normal range */}
                                    <label className="label pr-4"><span className="text-sm">Range (ft)</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered bg-base-100 h-12 px-4"
                                        placeholder="Range (ft)"
                                        value={ weaponData.range?.normal || 0 }
                                        onChange={ (e) => setWeaponData((prev) => ({ ...prev, range: { ...prev.range!, normal: Number(e.target.value) } })) }
                                    />
                                </div>
                            </div>
                        ) }
                        
                    </div>
                </div>
            ) }

            {/* Armor / Shield Fields */ }
            { (category === "armor" || category === "shield") && (
                <div className="space-y-4 pb-4 border-b border-base-300">
                    <input
                        type="number"
                        className="input input-bordered bg-base-100 h-12 px-4"
                        placeholder="Armor Class"
                        value={ armorData.armorClass || 10 }
                        onChange={ (e) => setArmorData((prev) => ({ ...prev, armorClass: Number(e.target.value) })) }
                    />
                    { category === "armor" && (
                        <select
                            className="select select-bordered bg-base-100 px-4 h-12"
                            value={ armorData.type || armorType[ "Light" ] }
                            onChange={ (e) =>
                                setArmorData((prev) => ({ ...prev, type: e.target.value as typeof armorType[ "Light" ] | typeof armorType[ "Medium" ] | typeof armorType[ "Heavy" ] }))
                            }
                        >
                            <option value={ armorType[ "Light" ] }>Light</option>
                            <option value={ armorType[ "Medium" ] }>Medium</option>
                            <option value={ armorType[ "Heavy" ] }>Heavy</option>
                        </select>
                    ) }
                </div>
            ) }

            {/* Consumable Fields */ }
            { category === "consumable" && (
                <div className="space-y-4 pb-4 border-b border-base-300">
                    <input
                        type="text"
                        className="input input-bordered bg-base-100 h-12 px-4"
                        placeholder="Effect"
                        value={ consumableData.effect || "" }
                        onChange={ (e) => setConsumableData((prev) => ({ ...prev, effect: e.target.value })) }
                    />
                    <input
                        type="number"
                        className="input input-bordered bg-base-100 h-12 px-4"
                        placeholder="Uses"
                        value={ consumableData.uses || 1 }
                        onChange={ (e) => setConsumableData((prev) => ({ ...prev, uses: Number(e.target.value) })) }
                    />
                    <select
                        className="select select-bordered bg-base-100 px-4 h-12"
                        value={ consumableData.consumableType || "potion" }
                        onChange={ (e) =>
                            setConsumableData((prev) => ({
                                ...prev,
                                consumableType: e.target.value as "potion" | "scroll" | "ammunition" | "other",
                            }))
                        }
                    >
                        <option value="potion">Potion</option>
                        <option value="scroll">Scroll</option>
                        <option value="ammunition">Ammunition</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            ) }

            {/* Buttons */ }
            <div className="flex flex-wrap gap-3 mt-4 justify-end">
                <button type="button" className="btn" onClick={ onCancel }>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Item</button>
            </div>
        </form>
    );
}
