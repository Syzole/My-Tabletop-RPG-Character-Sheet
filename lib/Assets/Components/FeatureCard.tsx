"use client";

import React, { useEffect, useState } from "react";
import { Feature } from "@/lib/types";
import { formatPropertyKey } from "../Components/ItemCard";
import DnDCharacter from "@/lib/DnDCharacter";

interface FeatureCardProps {
    feature: Feature;
    className?: string; // Allow dynamic class name for positioning or styling
    onClick?: () => void; // Optional click handler
    updateCharacter: (key: string, value: any) => void;
    charecter: DnDCharacter;
}

const keysWeDontWantToDisplay = [ "charges", "chargesUsed", "dynamic" ];

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, className, onClick, updateCharacter, charecter }) => {

    const processedFeature = feature && feature.properties && feature.properties.dynamic
        ? (() => {
            const updatedFeature = { ...feature };

            for (const [ key, value ] of Object.entries(feature.properties!.dynamic)) {
                updatedFeature.properties![ key ] = charecter[ value ];
            }

            return updatedFeature;
        })()
        : feature;


    if (!feature) {
        return (
            <div className={ `mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10 ${className}` }>
                <p>{ !feature ? "No Feature " : "Loading..." }</p>
            </div>
        );
    }

    const consumeCharge = (feature: Feature) => {
        if (feature.properties) {
            feature.properties.chargesUsed! += 1;
        }

        if (charecter && charecter.features) {
            charecter.features[ feature.feature_name ] = feature;
        }

        if (updateCharacter && charecter) {
            updateCharacter("features", charecter.features);
        }
    }

    const recharge = (feature: Feature) => {
        if (feature.properties) {
            feature.properties.chargesUsed! = 0;
        }

        if (charecter && charecter.features) {
            charecter.features[ feature.feature_name ] = feature;
        }

        if (updateCharacter && charecter) {
            updateCharacter("features", charecter.features);
        }
    }

    const incrementCharge = (feature: Feature) => {
        if (feature.properties) {
            feature.properties.chargesUsed! -= 1;
        }

        if (charecter && charecter.features) {
            charecter.features[ feature.feature_name ] = feature;
        }

        if (updateCharacter && charecter) {
            updateCharacter("features", charecter.features);
        }
    }

    let hasCharges = (feature.properties && feature.properties.charges) ? feature.properties.charges > feature.properties.chargesUsed! : false;

    return (
        <div
            className={ `relative max-w-max ${className}` }
            onClick={ onClick }
        >

            {/* Hover card with feature details */ }
            { (
                <div className={ `left-0 w-64 bg-white p-4 rounded-lg shadow-lg z-10` }>
                    <h3 className="text-lg font-semibold text-indigo-600">
                        { processedFeature.feature_name }
                    </h3>
                    <p className="text-sm text-gray-600">
                        <strong>Source:</strong> { processedFeature.source }
                    </p>
                    { processedFeature.level && (
                        <p className="text-sm text-gray-600">
                            <strong>Level:</strong> { processedFeature.level }
                        </p>
                    )
                    }
                    <p className="text-sm text-gray-600">
                        <strong>Type:</strong> { formatFeatureType(processedFeature.type) }
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{ processedFeature.description }</p>

                    {/* Optional properties */ }
                    { processedFeature.properties && Object.keys(processedFeature.properties).length > 0 && (
                        <div className="text-sm text-gray-600 mt-2">
                            <h4 className="text-indigo-600 font-semibold">Properties</h4>
                            <ul>
                                { Object.entries(processedFeature.properties)
                                    // Filter out "charges" and "chargesUsed"
                                    .filter(([ key ]) => !keysWeDontWantToDisplay.includes(key))
                                    .map(([ key, value ]) => (
                                        <li key={ key }>
                                            <strong>{ formatPropertyKey(key) }</strong>:{ " " }
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

                    { (processedFeature.properties && processedFeature.properties.charges) && ( // Show charge controls if processedFeature has charges
                        <div className="text-sm text-gray-600 mt-2">
                            <strong>Charges:</strong> { processedFeature.properties.chargesUsed } / { processedFeature.properties.charges }
                        </div>
                    ) }
                    { (processedFeature.properties && processedFeature.properties.charges) && ( // Show charge controls if processedFeature has charges
                        <div>
                            <div className="justify-between mb-2">
                                <button className="btn btn-primary mr-2"
                                    onClick={ () => consumeCharge(processedFeature) }
                                    disabled={ !hasCharges }
                                >Use</button>
                                <button className="btn btn-accent"
                                    onClick={ () => incrementCharge(processedFeature) }
                                    disabled={ !(processedFeature.properties.chargesUsed! > 0) }
                                >+</button>
                            </div>
                            <button className="btn btn-primary"
                                onClick={ () => recharge(processedFeature) }
                                disabled={ hasCharges } >Recharge</button>
                        </div>
                    ) }

                </div>
            ) }
        </div>
    );
};

export default FeatureCard;

function formatFeatureType(type: string): string { //so turn BonusAction into Bonus Action
    return type.replace(/([a-z])([A-Z])/g, "$1 $2");
}
