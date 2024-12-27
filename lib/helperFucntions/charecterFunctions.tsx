import DnDCharacter from "../DnDCharacter";
import { Feature, Item } from "../types";


export function shortRest(character: DnDCharacter) {
    let classFeatures = Object.values(character.features);

    //loop through all features and if the properties has a recharge: short, reset the chargesUsed to 0

    classFeatures.forEach(feature => {
        if (feature.properties && feature.properties.recharge === "Short") {
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.features[ feature.feature_name ] = feature; //update the character object
        }
    });



    let raceFeatures = Object.values(character.race?.features || {});

    //loop through all features and if the properties has a recharge: short, reset the chargesUsed to 0

    raceFeatures.forEach(feature => {
        if (feature.properties && feature.properties.recharge === "Short" && character.race) { //really should make race a required field eventually
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.race.features.set(feature.feature_name, feature); //update the character object
        }
    });

}

export function longRest(character: DnDCharacter) {

    character.hp = character.maxHp; //reset hit points to max

    let classFeatures = Object.values(character.features);

    //loop through all features and if the properties has a recharge: long, reset the chargesUsed to 0

    classFeatures.forEach(feature => {
        if (feature.properties && feature.properties.recharge === "Long") {
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.features[ feature.feature_name ] = feature; //update the character object
        }
    });

    let raceFeatures = Object.values(character.race?.features || {});

    //loop through all features and if the properties has a recharge: short, reset the chargesUsed to 0

    raceFeatures.forEach(feature => {

        if (feature.properties && feature.properties.recharge === "Long" && character.race) { //really should make race a required field eventually
            feature.properties.chargesUsed = 0; //reset chargesUsed to 0
            character.race.features.set(feature.feature_name, feature); //update the character object
        }
    });
}

export function getAllCharecterFeatures(character: DnDCharacter): Feature[] {
    const charecterFeatures = Object.values(character.features); //Get features from the character.features

    const raceFeatures = Object.values(character.race?.features || {}); //Get features from the character.race

    const itemFeatures = Object.values(character.items).map((value): Feature[] | undefined => { //Get features from the character.items
        const item = value as Item;
        return item.features;
    }).flat().filter((value): value is Feature => value !== undefined); //Filter out undefined values

    const totalFeatures = [ ...charecterFeatures, ...raceFeatures, ...itemFeatures ];

    return totalFeatures;
}