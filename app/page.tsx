import DnDCharacterStatsSheet from './Dnd 1.0 Sheet/DnDCharacterStatsSheet';
import DnDCharacterSpellsSheet from './Dnd 1.0 Sheet/DnDCharacterSpellSheet';

export default function Page() {
	return (
		<div>
			<DnDCharacterStatsSheet />
			
			<DnDCharacterSpellsSheet />
		</div>
	);
}
