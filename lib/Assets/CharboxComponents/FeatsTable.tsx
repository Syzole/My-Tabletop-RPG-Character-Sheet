import DnDCharacter from "@/lib/DnDCharacter";

interface FeatsTableProps {
    character: DnDCharacter; // Correctly typing the character prop
    setFocusItem: (item: any) => void;
}

export default function FeatsTable({ character, setFocusItem }: FeatsTableProps) { // Destructure props

    let charecterFeatures = Object.values(character.features); // Convert the object to an array

    let raceFeatures = Object.values(character.race?.features || {}); // Convert the object to an array

    const feats = [ ...charecterFeatures, ...raceFeatures ]; // Combine the arrays

    // If there are no feats, return null
    if (!feats || feats.length === 0) {
        return null;
    }

    return (
        <div className="max-h-[525px] h-full max-w-[1000px] overflow-auto">
            <table className="table w-full ">
                <thead>
                    <tr>
                        <th>Feat</th>
                        <th>Effect</th>
                    </tr>
                </thead>
                <tbody>
                    { feats.map((feat, i) => (
                        <tr key={ i } onClick={ () => setFocusItem(feat) } className="cursor-pointer hover:bg-gray-300">
                            <td>{ feat.feature_name }</td>
                            <td>{ feat.description }</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    );
}
