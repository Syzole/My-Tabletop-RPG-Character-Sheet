import { Feature, Weapon, Item } from "@/lib/types";
import DnDCharacter from "@/lib/DnDCharacter";

interface ActionTableRowProps {
    item: Feature | Item;
    setFocusItem?: (item: Feature | Weapon | Item) => void;
}

export default function ActionTableRow({ item, setFocusItem }: ActionTableRowProps) {

    // Check if the item is defined first to avoid issues
    if (!item) {
        return null;  // Return null if no item is passed
    }

    // Handler for clicking the row, which sets the focus item
    const handleClick = () => {
        if (setFocusItem) {
            setFocusItem(item);
        }
    };

    // Safely determine if the item is a Weapon, Item, or Feature
    const itemType = "value" in item ? "Weapon" : "Feature";

    // Use 'feature_name' for Feature items, 'name' for Weapon/Item
    const displayName = "feature_name" in item ? item.feature_name : item.name;

    return (
        <div
            className="flex justify-between items-center p-2 border-b border-gray-200 cursor-pointer"
            onClick={ handleClick }
        >
            <div className="flex-1">
                <h2 className="text-lg font-bold">{ displayName }</h2>
                <p className="text-sm text-gray-600">Type: { itemType }</p>
            </div>
        </div>
    );
}

function findWeaponToItem(target: Weapon, char: DnDCharacter) {
    let item = char.equippedWeapons[ char.equippedWeapons.findIndex((weapon) => weapon.name === target.name) ];
    return item;
}
