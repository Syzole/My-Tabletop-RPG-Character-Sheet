import { Item } from "@/lib/types";

interface InventoryItemCardProps {
    item: Item;
    onAddItem: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export default function InventoryItemCard({
    item,
    onAddItem,
    onMouseEnter,
    onMouseLeave,
}: InventoryItemCardProps) {
    return (
        <div
            className="py-1 border-b border-gray-200 flex justify-between items-center"
            onMouseEnter={ onMouseEnter }
            onMouseLeave={ onMouseLeave }
        >
            <span>{ item.name }</span>
            <button
                className="btn bg-blue-500 text-white px-2 py-1 rounded"
                onClick={ onAddItem }
            >
                Add
            </button>
        </div>
    );
}
