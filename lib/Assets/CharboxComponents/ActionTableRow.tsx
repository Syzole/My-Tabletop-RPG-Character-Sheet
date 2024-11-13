import DnDCharacter from "@/lib/DnDCharacter";
import { Feature, Weapon, Item } from "@/lib/types";
import { calculateAttackBonus, calculateDamageBonus } from "@/lib/utils";


interface ActionTableRowProps {
    item: Feature | Item | Weapon;
    character: DnDCharacter;  // Add character prop
    setFocusItem?: (item: Feature | Weapon | Item) => void;
}

export default function ActionTableRow({ item, character, setFocusItem }: ActionTableRowProps) {
    if (!item) {
        return null; // Return null if no item is passed
    }

    const handleClick = () => {
        if (setFocusItem) {
            setFocusItem(item);
        }
    };

    const isWeapon = "name" in item;
    const displayName = isWeapon ? item.name : item.feature_name;
    let range = isWeapon && item.properties?.range ? `${item.properties.range}ft` : "-";

    // if the item is a weapon and has no range, set the range to melee
    if (isWeapon && !item.properties?.range) {
        range = "Melee";
    }

    // Calculate the hit/DC (attack bonus) for weapons
    const hitDC = isWeapon ? `+${calculateAttackBonus(character, item as Weapon)}` : "-";

    // Damage and notes
    const damage = isWeapon ? item.damage + ` + ${calculateDamageBonus(character, item as Weapon)}` : item.properties?.damage || "-";
    const notes = isWeapon ? item.properties?.property?.join(", ") || "-" : item.properties?.description || "-";

    return (
        <tr className="cursor-pointer hover:bg-gray-300" onClick={ handleClick }>
            <td className="px-4 py-2 font-bold">{ displayName }</td>
            <td className="px-4 py-2">{ range }</td>
            <td className="px-4 py-2">{ hitDC }</td>
            <td className="px-4 py-2">{ damage }</td>
            <td className="px-4 py-2">{ notes }</td>
        </tr>
    );
}

