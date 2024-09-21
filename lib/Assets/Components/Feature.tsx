import React, { useState } from "react";
import { feature } from "@/lib/types";

interface FeatureProps {
    feature: feature;
}

const Feature: React.FC<FeatureProps> = ({ feature }) => {
    const [ isHovered, setIsHovered ] = useState(false);

    return (
        <div
            className="relative inline-block max-w-max"
            onMouseEnter={ () => setIsHovered(true) }
            onMouseLeave={ () => setIsHovered(false) }
        >
            {/* Feature name */ }
            <p className="text-xs font-semibold text-gray-800 cursor-pointer">
                { feature.feature_name }
            </p>

            {/* Hover card with feature details */ }
            { isHovered && (
                <div className="absolute left-0 mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10 grow-0">
                    <h3 className="text-base font-semibold text-indigo-600">
                        { feature.feature_name }
                    </h3>
                    <p className="text-sm text-gray-600">
                        <strong>Source:</strong> { feature.source_name }
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Level:</strong> { feature.level }
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Type:</strong> { feature.type }
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{ feature.description }</p>
                </div>
            ) }
        </div>
    );
};

export default Feature;
