// Define a type for the action description keys
type ActionDescriptionKey = "All" | "Attack" | "Action" | "Bonus Action" | "Reaction" | "Other";

// Define the action descriptions with the specified keys
const actionDescriptions: Record<ActionDescriptionKey, string> = {
    All: "This tab displays all actions your character can take, including attacks, standard actions, bonus actions, reactions, and other special abilities or features.",
    Attack: "This tab shows all attacks your character can make, including melee and ranged weapon attacks as well as offensive spells. You can use these actions to damage enemies.",
    Action: `This tab lists standard actions your character can take on their turn. Some examples include: \n
    - **Dash**: You can double your movement speed for the current turn.\n
    - **Disengage**: Your movement doesn’t provoke opportunity attacks for the rest of the turn.\n
    - **Dodge**: Until the start of your next turn, any attack rolls against you are made with disadvantage.\n
    - **Hide**: You make a Dexterity (Stealth) check to hide from enemies.\n
    - **Help**: You can aid an ally, giving them advantage on their next ability check or attack.\n
    - **Ready**: You prepare an action to be performed later as a reaction (e.g., attacking when a creature enters your range).\n
    - **Search**: You can use your action to search for something actively (using Perception or Investigation).`,
    "Bonus Action": "Bonus actions are additional actions you can take on your turn, in addition to your main action. Some class abilities, spells, and feats allow you to perform certain actions as a bonus action.",
    Reaction: "Reactions are special actions you can take outside of your turn, typically in response to a trigger, like making an opportunity attack when a creature moves out of your reach.",
    Other: "This tab shows other abilities or features your character has, which might include passive traits, limited-use abilities, or other non-combat actions."
};




interface SubActionTableProps {
    selectedAction: string;  // The currently selected action
}

export default function SubActionTable({ selectedAction }: SubActionTableProps) {
    // Look up the description based on the selected action
    const descriptionKey = selectedAction as ActionDescriptionKey;
    const description = actionDescriptions[ descriptionKey ];

    return (
        <div className="p-4 bg-gray-100 rounded-md mt-4">
            { description ? (
                <>
                    <h3 className="text-lg font-bold">{ selectedAction }</h3>
                    <p
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={ {
                            __html: description.replace(/\n/g, '<br />')
                        } }
                    />
                </>
            ) : (
                <p className="text-sm text-gray-500">Select an action to see details.</p>
            ) }
        </div>
    );
}

