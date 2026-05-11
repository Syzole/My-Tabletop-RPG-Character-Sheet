import { useState } from "react";
import { Item, ItemType, getItemType } from "@/types/item";
import useCharacterStore from "@/stores/CharacterStore";
import NewItemForm from "@/components/charBox/newItemForm";
import useFocusStore from "@/stores/FocusStore";
import { calculateAC } from "@/utils/character";

export default function InventoryBox() {
    const { character, updateCharacterField } = useCharacterStore();
    const { setFocusItem } = useFocusStore();
    const [ showNewItemForm, setShowNewItemForm ] = useState(false);

    if (character == null) return <></>;

    function handleAddItem(name: string, item: Item) {
        if (!character) return;
        updateCharacterField("equipment", { ...character.equipment, [ name ]: item });
        setShowNewItemForm(false);
    }

    if (showNewItemForm) {
        return (
            <NewItemForm
                onSave={ handleAddItem }
                onCancel={ () => setShowNewItemForm(false) }
            />
        );
    }

    return (
        <div>
            <button className="btn" onClick={ () => setShowNewItemForm(true) }>
                Add Item
            </button>

            <table style={ { width: "100%", borderCollapse: "collapse" } }>
                <thead>
                    <tr>
                        <th style={ { textAlign: "left", padding: "0.1rem", borderBottom: "1px solid #ccc" } }>Equipped</th>
                        <th style={ { textAlign: "left", padding: "0.1rem", borderBottom: "1px solid #ccc" } }>Name</th>
                        <th style={ { textAlign: "left", padding: "0.1rem", borderBottom: "1px solid #ccc" } }>Qty</th>
                        <th style={ { textAlign: "left", padding: "0.1rem", borderBottom: "1px solid #ccc" } }>Weight</th>
                        <th style={ { textAlign: "left", padding: "0.1rem", borderBottom: "1px solid #ccc" } }>Cost(GP)</th>
                        <th style={ { textAlign: "left", padding: "0.1rem", borderBottom: "1px solid #ccc" } }>Notes</th>
                        <th style={ { textAlign: "left", padding: "0.1rem", borderBottom: "1px solid #ccc" } }></th>
                    </tr>
                </thead>
                <tbody>
                    { Object.entries(character?.equipment ?? {}).map(([ itemKey, item ]) => {
                        const typedItem = {
                            ...item,
                            itemType: (item as any).itemType || "miscellaneous"
                        } as ItemType;

                        return (
                            <tr key={ item.name ?? itemKey } >
                                <td style={ { padding: "0.5rem", borderBottom: "1px solid #eee" } }>
                                    { "equipped" in item ? (
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={ !!item.equipped }
                                            onChange={ () => {
                                                const isArmor = (item as any).armorClass !== undefined && (item as any).type !== "shield";

                                                if (isArmor) {
                                                    if (!item.equipped) {
                                                        // Equipping this armor - unequip all other armors first
                                                        const updatedEquipment = { ...character.equipment };

                                                        // Unequip all other armors in equipment
                                                        Object.keys(updatedEquipment).forEach(key => {
                                                            const eqItem = updatedEquipment[ key ];
                                                            if ((eqItem as any).armorClass !== undefined && (eqItem as any).type !== "shield" && eqItem.equipped) {
                                                                updatedEquipment[ key ] = { ...eqItem, equipped: false };
                                                            }
                                                        });

                                                        // Equip this armor
                                                        updatedEquipment[ itemKey ] = { ...item, equipped: true };
                                                        updateCharacterField("equipment", updatedEquipment);
                                                        updateCharacterField("armor", { ...item, equipped: true });
                                                    } else {
                                                        // Unequipping this armor
                                                        updateCharacterField("equipment", {
                                                            ...character.equipment,
                                                            [ itemKey ]: { ...item, equipped: false }
                                                        });
                                                        updateCharacterField("armor", undefined);
                                                    }
                                                } else {
                                                    // Toggle regular item
                                                    updateCharacterField("equipment", {
                                                        ...character.equipment,
                                                        [ itemKey ]: { ...item, equipped: !item.equipped }
                                                    });
                                                }
                                            } }
                                        />
                                    ) : (
                                        <span style={ { color: "#999" } }>—</span>
                                    ) }
                                </td>
                                <td style={ { padding: "0.5rem", borderBottom: "1px solid #eee" } } className="cursor-pointer" onClick={ () => setFocusItem(typedItem, itemKey) }>
                                    { item.name ?? itemKey }
                                </td>
                                <td style={ { padding: "0.5rem", borderBottom: "1px solid #eee", color: "#666", fontSize: "0.95em", display: "flex", alignItems: "center", gap: "0.25rem" } }>
                                    <button
                                        style={ { padding: "0 0.4em", cursor: "pointer" } }
                                        aria-label="Decrease quantity"
                                        className="btn"
                                        disabled={ item.quantity === 1 || item.quantity === undefined }
                                        onClick={ () => {
                                            if (item.quantity && item.quantity > 1) {
                                                updateCharacterField("equipment", {
                                                    ...character.equipment,
                                                    [ itemKey ]: { ...item, quantity: item.quantity - 1 }
                                                });
                                            }
                                        } }
                                    >-</button>
                                    { item.quantity !== undefined ? `x${item.quantity}` : "" }
                                    <button
                                        style={ { padding: "0 0.4em", cursor: "pointer" } }
                                        aria-label="Increase quantity"
                                        className="btn"
                                        onClick={ () => {
                                            updateCharacterField("equipment", {
                                                ...character.equipment,
                                                [ itemKey ]: { ...item, quantity: (item.quantity ?? 1) + 1 }
                                            });
                                        } }
                                    >+</button>
                                </td>
                                <td style={ { padding: "0.5rem", borderBottom: "1px solid #eee", color: "#666", fontSize: "0.95em" } }>
                                    { item.weight !== undefined ? `${item.weight} lb` : "" }
                                </td>
                                <td style={ { padding: "0.5rem", borderBottom: "1px solid #eee", color: "#666", fontSize: "0.95em" } }>
                                    { item.value !== undefined ? `${item.value} gp` : "" }
                                </td>
                                <td style={ { padding: "0.5rem", borderBottom: "1px solid #eee", color: "#888", fontSize: "0.95em", fontStyle: "italic" } }>
                                    { item.notes || "" }
                                </td>
                                <td style={ { padding: "0.5rem", borderBottom: "1px solid #eee" } }>
                                    <button
                                        style={ { color: "#c00", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" } }
                                        aria-label="Remove item"
                                        onClick={ () => {
                                            if (confirm(`Are you sure you want to delete ${itemKey}?`)) {
                                                const { [ itemKey ]: _, ...remainingEquipment } = character.equipment;
                                                updateCharacterField("equipment", remainingEquipment);
                                            }
                                        } }
                                    >✕</button>
                                </td>
                            </tr>
                        );
                    }) }
                </tbody>
            </table>
        </div >
    );
}
