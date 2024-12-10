"use client";

import React, { useEffect, useState } from "react";
import { Feature } from "@/lib/types";
import { formatPropertyKey } from "../Components/ItemCard";
import DnDCharacter from "@/lib/DnDCharacter";

interface FeatureCardProps {
    feature?: Feature;
    className?: string; // Allow dynamic class name for positioning or styling
    onClick?: () => void; // Optional click handler
    updateCharacter?: (key: string, value: any) => void;
    charecter?: DnDCharacter;
}

let keysWeDontWantToDisplay = [ "charges", "chargesUsed", "dynamic" ];

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, className, onClick, updateCharacter, charecter }) => {
    const [ isUpdated, setIsUpdated ] = useState(false);

    useEffect(() => {
        if (feature && feature.properties && feature.properties.dynamic && charecter && !isUpdated) { // If the feature has dynamic properties, update them
            let updatedFeature = { ...feature };

            console.log("FeatureCard useEffect", feature.properties.dynamic);

            for (const [ key, value ] of Object.entries(feature.properties.dynamic)) {
                updatedFeature.properties![ key ] = charecter[ value ];
            }

            const updatedCharecter = { ...charecter, features: { ...charecter.features } };
            updatedCharecter.features[ feature.feature_name ] = updatedFeature;

            if (updateCharacter) {
                updateCharacter("features", updatedCharecter.features);
            }

            setIsUpdated(true);
        } else {
            setIsUpdated(true);
        }
    }, [ feature, charecter, updateCharacter ]);


    if (!feature) {
        return (
            <div className={ `mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10 ${className}` }>
                <p>No feature selected.</p>
            </div>
        );
    }

    if (!isUpdated) {
        return null; // or a loading spinner, etc.
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
                        { feature.feature_name }
                    </h3>
                    <p className="text-sm text-gray-600">
                        <strong>Source:</strong> { feature.source_name }
                    </p>
                    { feature.level && (
                        <p className="text-sm text-gray-600">
                            <strong>Level:</strong> { feature.level }
                        </p>
                    )
                    }
                    <p className="text-sm text-gray-600">
                        <strong>Type:</strong> { formatFeatureType(feature.type) }
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{ feature.description }</p>

                    {/* Optional properties */ }
                    { feature.properties && Object.keys(feature.properties).length > 0 && (
                        <div className="text-sm text-gray-600 mt-2">
                            <h4 className="text-indigo-600 font-semibold">Properties</h4>
                            <ul>
                                { Object.entries(feature.properties)
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

                    { (feature.properties && feature.properties.charges) && ( // Show charge controls if feature has charges
                        <div className="text-sm text-gray-600 mt-2">
                            <strong>Charges:</strong> { feature.properties.chargesUsed } / { feature.properties.charges }
                        </div>
                    ) }
                    { (feature.properties && feature.properties.charges) && ( // Show charge controls if feature has charges
                        <div>
                            <div className="justify-between mb-2">
                                <button className="btn btn-primary mr-2"
                                    onClick={ () => consumeCharge(feature) }
                                    disabled={ !hasCharges }
                                >Use</button>
                                <button className="btn btn-accent"
                                    onClick={ () => incrementCharge(feature) }
                                    disabled={ !(feature.properties.chargesUsed! > 0) }
                                >+</button>
                            </div>
                            <button className="btn btn-primary"
                                onClick={ () => recharge(feature) }
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
