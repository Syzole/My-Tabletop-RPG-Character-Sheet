import React from "react";
import ItemCard from "./ItemCard";

interface ItemsListProps {
    items: {
        name: string;
        source: string[];
        type: string;
        rarity?: string;
        value?: number;
        weight?: number;
        quantity?: number;
        properties: { [ key: string ]: any };
    }[];
}

const ItemsList: React.FC<ItemsListProps> = ({ items }) => {
    return (
        <div className="space-y-4 flex-col flex">
            { items.map((item, index) => (
                <ItemCard key={ index } item={ item } />
            )) }
        </div>
    );
};

export default ItemsList;
