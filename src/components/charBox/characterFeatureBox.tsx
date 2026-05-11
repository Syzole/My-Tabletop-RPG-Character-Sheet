import useCharacterStore from "@/stores/CharacterStore";
import useFocusStore from "@/stores/FocusStore";
import { getAllFeatures } from "@/utils/feature";

export default function CharacterFeatureBox() {
    const { character } = useCharacterStore();

    if (!character) {
        return <div>No character selected.</div>;
    }
    
    const { setFocusItem } = useFocusStore();
    const features = getAllFeatures(character);
    
    const featureEntries = Object.entries(features);
    if (!character || featureEntries.length === 0) {
        return <div>No features available.</div>;
    }
    return (
        <table className="min-w-full border border-gray-300 dark:border-gray-600 border-collapse text-left">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600 font-semibold w-1/4">
                        Feature
                    </th>
                    <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600 font-semibold">
                        Description
                    </th>
                </tr>
            </thead>
            <tbody>
                { featureEntries.map(([ name, feature ]) => (
                    <tr key={ name } className="hover:bg-gray-50 dark:hover:bg-gray-700" onClick={ () => setFocusItem(feature, name) }>
                        <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 align-top font-medium whitespace-nowrap">
                            { name }
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 align-top">
                            { feature.description }
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
    );
}