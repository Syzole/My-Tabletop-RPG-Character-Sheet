"use client";

import React, { useState } from "react";
import { Feature } from "@/lib/types";  // Import the Feature type

interface FeatureCardProps {
    feature?: Feature;
    className?: string; // Allow dynamic class name for positioning or styling
    onClick?: () => void; // Optional click handler
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, className, onClick }) => {

    if (!feature) {
        return (
            <div className={ `mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10 ${className}` }>
                <p>No feature selected.</p>
            </div>
        );
    }

    return (
        <div
            className={ `relative max-w-max ${className}` }
            onClick={ onClick }
        >

            {/* Hover card with feature details */ }
            { (
                <div className={ `left-0 w-64 bg-white p-4 rounded-lg shadow-lg z-10` }>
                    <h3 className="text-lg font-semibold text-indigo-600">
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

                    {/* Optional properties */ }
                    { feature.properties && Object.keys(feature.properties).length > 0 && (
                        <div className="text-sm text-gray-600 mt-2">
                            <h4 className="text-indigo-600 font-semibold">Properties</h4>
                            <ul>
                                { Object.entries(feature.properties).map(([ key, value ]) => (
                                    <li key={ key }>
                                        <strong>{ key }</strong>:{ " " }
                                        { typeof value === "object"
                                            ? Array.isArray(value)
                                                ? value.join(", ") // Join arrays with commas
                                                : JSON.stringify(value, null, 2) // Format objects
                                            : value }
                                    </li>
                                )) }
                            </ul>
                        </div>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default FeatureCard;
