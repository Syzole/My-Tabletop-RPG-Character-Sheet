import DnDCharacter from "@/lib/DnDCharacter";

interface FeatsTableProps {
    character: DnDCharacter; // Correctly typing the character prop
    setFocusItem: (item: any) => void;
}

export default function FeatsTable({ character, setFocusItem }: FeatsTableProps) { // Destructure props
    const feats = [ ...character.features, ...character.race?.features || [] ]; // Copy the feats array

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
