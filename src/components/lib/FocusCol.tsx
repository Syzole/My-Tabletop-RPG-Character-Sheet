import React from "react";

import useFocusStore from "@/stores/FocusStore";
import ItemCard from "./ItemCard";
import { Feature } from "@/types/feature";
import { Item } from "@/types/item";
import FeatureCard from "./FeatureCard";

export default function FocusCol() {
    const { focusItem, setFocusItem } = useFocusStore();

    //first we check if we have a feature or an item


    const [ position, setPosition ] = React.useState({
        x: window.innerWidth - 360, // slightly left from the right edge
        y: window.innerHeight / 2,  // halfway down the viewport
    });
    const [ isDragging, setIsDragging ] = React.useState(false);
    const startPosition = React.useRef({ x: 0, y: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        startPosition.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        const newX = e.clientX - startPosition.current.x;
        const newY = e.clientY - startPosition.current.y;

        // Get the actual width and height of the component
        const componentWidth = containerRef.current?.offsetWidth || 320; // fallback to w-80 (320px)
        const componentHeight = containerRef.current?.offsetHeight || 200; // fallback height

        // Constrain x position to stay within viewport (left/right only)
        const minX = 0;
        const maxX = window.innerWidth - componentWidth;
        const constrainedX = Math.max(minX, Math.min(maxX, newX));

        // Constrain y position to stay within the full document height (not just viewport)
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
        const minY = 0;
        const maxY = documentHeight - componentHeight;
        const constrainedY = Math.max(minY, Math.min(maxY, newY));

        setPosition({
            x: constrainedX,
            y: constrainedY,
        });
    }, []);

    const handleMouseUp = React.useCallback(() => {
        setIsDragging(false);
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [ isDragging, handleMouseMove, handleMouseUp ]);

    // Handle window resize to keep component within bounds
    React.useEffect(() => {
        const handleResize = () => {
            const componentWidth = containerRef.current?.offsetWidth || 320;
            const componentHeight = containerRef.current?.offsetHeight || 200;

            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );

            setPosition(prev => ({
                x: Math.max(0, Math.min(window.innerWidth - componentWidth, prev.x)),
                y: Math.max(0, Math.min(documentHeight - componentHeight, prev.y)),
            }));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!focusItem) return null;

    // find out if focusItem is an Item or Feature
    const isFeature = (item: any): item is Feature => {
        return item && typeof item === "object" &&
            "type" in item &&
            [ "Passive", "Action", "Bonus Action", "Reaction", "Other" ].includes(item.type);
    };

    const isItem = (item: any): item is Item => {
        return !isFeature(item);
    };

    return (
        <div
            ref={ containerRef }
            className="absolute w-80 bg-base-200 border border-base-300 rounded-lg shadow-lg overflow-hidden "
            style={ {
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 50,
            } }
        >
            {/* Header / Drag Handle */ }
            <div
                className="flex items-center justify-between bg-base-300 px-4 py-2 cursor-move select-none rounded-t-lg"
                onMouseDown={ handleMouseDown }
            >
                <span className="text-base-content font-semibold text-sm">Info Card</span>
                <button
                    onClick={ () => setFocusItem(null) }
                    className="text-base-content/60 hover:text-base-content font-bold"
                >
                    ✕
                </button>
            </div>

            {/* If its an item use itemcard */ }
            { isItem(focusItem) &&
                <div className="p-4 text-base-content text-sm max-h-96 overflow-auto">
                    <ItemCard />
                </div>
            }

            {/* If its a feature show feature details */ }
            { isFeature(focusItem) &&
                <div className="p-4 text-base-content text-sm max-h-96 overflow-auto">
                    <FeatureCard />
                </div>
            }

        </div>
    );
}
