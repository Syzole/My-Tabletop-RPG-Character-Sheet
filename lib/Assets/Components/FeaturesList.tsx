import React from "react";
import Feature from "./Feature";
import { feature } from "@/lib/types";
;

interface FeaturesListProps {
    features: feature[];
}


const FeaturesList: React.FC<FeaturesListProps> = ({ features }) => {

    if (features.length === 0) {
        return <div>No features</div>;
    }

    return (
        <div className="space-y-4 flex-col flex">
            { features.map((feature, index) => (
                <Feature key={ index } feature={ feature } />
            )) }
        </div>
    );
};

export default FeaturesList;
