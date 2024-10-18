import DnDCharacter from "../DnDCharacter";


export function shortRest(character: DnDCharacter) {
    let classFeatures = Object.values(character.features);

    //loop through all features and if the properties has a recharge: short, reset the chargesUsed to 0

    classFeatures.forEach(feature => {
        if (feature.properties && feature.properties.recharge === "short") {
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.features[ feature.feature_name ] = feature; //update the character object
        }
    });



    let raceFeatures = Object.values(character.race?.features || {});

    //loop through all features and if the properties has a recharge: short, reset the chargesUsed to 0

    raceFeatures.forEach(feature => {
        if (feature.properties && feature.properties.recharge === "short" && character.race) { //really should make race a required field eventually
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.race.features[ feature.feature_name ] = feature; //update the character object
        }
    });

}

export function longRest(character: DnDCharacter) {

    character.currentHitPoints = character.maxHitPoints; //reset hit points to max

    let classFeatures = Object.values(character.features);

    //loop through all features and if the properties has a recharge: long, reset the chargesUsed to 0

    classFeatures.forEach(feature => {
        if (feature.properties && feature.properties.recharge === "long") {
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.features[ feature.feature_name ] = feature; //update the character object
        }
    });

    let raceFeatures = Object.values(character.race?.features || {});

    //loop through all features and if the properties has a recharge: short, reset the chargesUsed to 0

    raceFeatures.forEach(feature => {

        if (feature.properties && feature.properties.recharge === "long" && character.race) { //really should make race a required field eventually
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.race.features[ feature.feature_name ] = feature; //update the character object
        }
    });
}