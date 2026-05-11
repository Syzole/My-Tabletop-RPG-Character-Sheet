import { CharacterSpellEntry, CharacterSpellcasting } from "@/types/spellcasting";
import useCharacterStore from "@/stores/CharacterStore";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	calculateSpellAttackBonus,
	calculateSpellSaveDC,
	castSpell,
	restoreLeveledSpellSlot,
	restorePactSpellSlot,
} from "@/utils/spell";
import { castingTimeType, Spell, SpellLevel } from "@/types/spell";
import { capitalizeFirstLetter } from "@/utils/text";
import { statName } from "@/types/stats";

function ordinalSpellLevel(level: number): string {
	const ordinals = [ "", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th" ];
	return ordinals[ level ] ?? `${level}th`;
}

function formatCastingTime(spell: Spell): string {
	const { type, amount } = spell.castingTime;
	if (type === castingTimeType.Minute && amount != null) {
		return `${amount} min`;
	}
	if (type === castingTimeType.Hour && amount != null) {
		return `${amount} hr`;
	}
	return type;
}

function formatSpellRange(spell: Spell): string {
	const { distance } = spell.range;
	switch (distance.type) {
		case "feet":
			return distance.amount != null ? `${distance.amount} ft` : "ft";
		case "touch":
			return "Touch";
		case "self":
			return "Self";
		case "sight":
			return "Sight";
		case "unlimited":
			return "Unlimited";
		case "miles":
			return distance.amount != null ? `${distance.amount} mi` : "miles";
		case "custom":
			return "Special";
		default:
			return capitalizeFirstLetter(distance.type);
	}
}

function formatSaveAbility(saveAbility: statName): string {
	const saveAbilities: Record<statName, string> = {
		[statName.Strength]: "STR",
		[statName.Dexterity]: "DEX",
		[statName.Constitution]: "CON",
		[statName.Intelligence]: "INT",
		[statName.Wisdom]: "WIS",
		[statName.Charisma]: "CHA",
	}
	return saveAbilities[saveAbility];
}

function formatHitOrDC(spell: Spell): string {
	if (spell.isAttackRoll === "ranged") return `+ ${calculateSpellAttackBonus(spell.name)}`;
	if (spell.isAttackRoll === "melee") return `+ ${calculateSpellAttackBonus(spell.name)}`;
	if (spell.saveAbility) {
		return `${formatSaveAbility(spell.saveAbility)} ${calculateSpellSaveDC(spell.name)}`;
	}
	return "—";
}

function formatSpellEffect(spell: Spell): string {
	if (!spell.damage) return "—";
	const t = spell.damage.type ? ` ${capitalizeFirstLetter(spell.damage.type)}` : "";
	return `${spell.damage.diceCount}d${spell.damage.diceValue}${t}`;
}

type SpellRow = { spellKey: string; entry: CharacterSpellEntry };

// Reusable slot-dot row for either standard spell slots or pact slots.
// Filled dots represent expended slots; clicking one restores exactly 1.
function SpellSlotBoxes({
	slotLevel,
	maxSlots,
	usedSlots,
	filledClassName,
	onRestore,
	labelPrefix,
}: {
	slotLevel: number;
	maxSlots: number;
	usedSlots: number;
	filledClassName: string;
	onRestore: () => void;
	labelPrefix: string;
}) {
	const indices = Array.from({ length: maxSlots }, (_, i) => i);

	return (
		<div
			className="flex flex-wrap items-center"
			role="group"
			aria-label={ `${labelPrefix} (${ordinalSpellLevel(slotLevel)}): ${usedSlots} of ${maxSlots} expended` }
		>
			{ indices.map((i) => {
				const filled = i < usedSlots;
				return (
					<button
						key={ i }
						type="button"
						disabled={ !filled }
						title={ filled ? `Restore 1 ${labelPrefix.toLowerCase()}` : "Available slot" }
						aria-label={
							filled
								? `Expended slot ${i + 1} of ${maxSlots}, click to restore`
								: `Available slot ${i + 1} of ${maxSlots}`
						}
						onClick={ () => {
							if (filled) {
								onRestore();
							}
						} }
						className={ [
							"h-4 w-4 shrink-0 rounded-sm border transition-colors mr-1",
							filled
								? `cursor-pointer ${filledClassName}`
								: "cursor-default border-base-300 bg-base-100 opacity-80",
						].join(" ") }
					/>
				);
			}) }
		</div>
	);
}

export default function SpellBox({ classname }: { classname?: string }) {
	const { character } = useCharacterStore();
	if (!character) {
		return <></>;
	}

	const spellcasting = character.spellcasting;
	const spellsMap = spellcasting?.spells;
	const spellEntries = Object.entries(spellsMap ?? {}) as [ string, CharacterSpellEntry ][];

	const cantripRows: SpellRow[] = spellEntries
		.filter(([ , e ]) => e.spell.level === 0)
		.map(([ spellKey, entry ]) => ({ spellKey, entry }))
		.sort((a, b) => a.entry.spell.name.localeCompare(b.entry.spell.name));

	const leveledSlots = spellcasting?.leveledSlots ?? {};
	const pactSlots = spellcasting?.pactSlots;
	const hasPactSlots = (pactSlots?.max ?? 0) > 0;
	const slotLevelsWithSlots = Object.keys(leveledSlots)
		.map(Number)
		.filter((lv) => (leveledSlots[ lv ]?.max ?? 0) > 0)
		.sort((a, b) => a - b);
	// Render one section per slot level, merging standard + pact display
	// when pact slots happen to be at the same level.
	const displaySlotLevels = Array.from(
		new Set([
			...slotLevelsWithSlots,
			...(hasPactSlots && pactSlots ? [ pactSlots.slotLevel ] : []),
		]),
	).sort((a, b) => a - b);

	function rowsForSlotTier(slotLevel: number): SpellRow[] {
		return spellEntries
			.filter(([ , e ]) => e.spell.level >= 1 && e.spell.level <= slotLevel)
			.map(([ spellKey, entry ]) => ({ spellKey, entry }))
			.sort((a, b) => {
				if (a.entry.spell.level !== b.entry.spell.level) {
					return a.entry.spell.level - b.entry.spell.level;
				}
				return a.entry.spell.name.localeCompare(b.entry.spell.name);
			});
	}

	const leveledKnown = spellEntries.filter(([ , e ]) => e.spell.level > 0);
	const spellsByBaseLevel = leveledKnown.reduce(
		(acc: Record<number, SpellRow[]>, [ spellKey, entry ]) => {
			const lv = entry.spell.level;
			acc[ lv ] = [ ...(acc[ lv ] ?? []), { spellKey, entry } ];
			return acc;
		},
		{},
	);
	const baseLevelsSorted = Object.keys(spellsByBaseLevel)
		.map(Number)
		.sort((a, b) => a - b);

	const hasAnyContent =
		cantripRows.length > 0 || leveledKnown.length > 0;

	const useSlotTiers = displaySlotLevels.length > 0;

	if (!hasAnyContent) {
		return (
			<div className={ `spell-box ${classname ?? ""}` }>
				<p className="rounded-lg border border-base-300 bg-base-200/30 px-4 py-8 text-center text-sm opacity-70">
					No spells on this character.
				</p>
			</div>
		);
	}

	if (!spellcasting) {
		return (
			<div className={ `spell-box ${classname ?? ""}` }>
				<p className="rounded-lg border border-base-300 bg-base-200/30 px-4 py-8 text-center text-sm opacity-70">
					No spellcasting data.
				</p>
			</div>
		);
	}

	return (
		<div className={ `spell-box flex flex-col gap-5 w-full min-w-0 ${classname ?? ""}` }>
			{ cantripRows.length > 0 && (
				<section
					key="cantrips"
					className="rounded-xl border border-base-300 bg-base-100 shadow-sm min-w-0"
				>
					<div className="border-b border-base-300 bg-base-200/40 px-4 py-2.5">
						<h2 className="text-sm font-semibold tracking-wide text-base-content/90">
							Cantrips
						</h2>
						<p className="mt-0.5 text-xs text-base-content/50">
							{ cantripRows.length } spell{ cantripRows.length === 1 ? "" : "s" }
						</p>
					</div>
					<div className="overflow-x-auto overflow-y-visible">
						<SpellTable
							rows={ cantripRows }
							spellcasting={ spellcasting }
							slotContext={ null }
							castSlotLevel={ null }
						/>
					</div>
				</section>
			) }

			{ useSlotTiers
				? displaySlotLevels.map((slotLevel) => {
					const tierRows = rowsForSlotTier(slotLevel);
					const title = `${ordinalSpellLevel(slotLevel)}-level slots`;
					const leveledPool = leveledSlots[ slotLevel ];
					const pactPoolAtLevel =
						pactSlots && pactSlots.slotLevel === slotLevel ? pactSlots : null;

					return (
						<section
							key={ `slot-${slotLevel}` }
							className="rounded-xl border border-base-300 bg-base-100 shadow-sm min-w-0"
						>
							<div className="border-b border-base-300 bg-base-200/40 px-4 py-2.5">
								<h2 className="text-sm font-semibold tracking-wide text-base-content/90">
									{ title }
								</h2>
								{ (leveledPool || pactPoolAtLevel) && (
									<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
										{ leveledPool && (
											<div className="flex items-center gap-2">
												<span className="text-xs font-medium text-base-content/70">Spell Slots</span>
												<SpellSlotBoxes
													slotLevel={ slotLevel }
													maxSlots={ leveledPool.max }
													usedSlots={ leveledPool.used }
													filledClassName="border-primary bg-primary hover:bg-primary/90"
													labelPrefix="Spell slots"
													onRestore={ () => restoreLeveledSpellSlot(spellcasting, slotLevel) }
												/>
											</div>
										) }
										{ pactPoolAtLevel && (
											<div className="flex items-center gap-2">
												<span className="text-xs font-medium text-base-content/70">Pact Slots</span>
												<SpellSlotBoxes
													slotLevel={ slotLevel }
													maxSlots={ pactPoolAtLevel.max }
													usedSlots={ pactPoolAtLevel.used }
													filledClassName="border-accent bg-accent hover:bg-accent/90"
													labelPrefix="Pact slots"
													onRestore={ () => restorePactSpellSlot(spellcasting) }
												/>
											</div>
										) }
									</div>
								) }
							</div>
							<div className="overflow-x-auto overflow-y-visible">
								{ tierRows.length === 0 ? (
									<p className="px-4 py-6 text-center text-sm opacity-60">
										No spells of {ordinalSpellLevel(slotLevel) } level or lower known.
									</p>
								) : (
									<SpellTable
										rows={ tierRows }
										spellcasting={ spellcasting }
										slotContext={ slotLevel }
										castSlotLevel={ slotLevel }
									/>
								) }
							</div>
						</section>
					);
				})
				: baseLevelsSorted.map((baseLevel) => {
					const rows = [ ...(spellsByBaseLevel[ baseLevel ] ?? []) ].sort((a, b) =>
						a.entry.spell.name.localeCompare(b.entry.spell.name),
					);
					const title = `${ordinalSpellLevel(baseLevel)} spells`;

					return (
						<section
							key={ `base-${baseLevel}` }
							className="rounded-xl border border-base-300 bg-base-100 shadow-sm min-w-0"
						>
							<div className="border-b border-base-300 bg-base-200/40 px-4 py-2.5">
								<h2 className="text-sm font-semibold tracking-wide text-base-content/90">
									{ title }
								</h2>
								<p className="mt-0.5 text-xs text-base-content/50">
									{ rows.length } spell{ rows.length === 1 ? "" : "s" } · add spell-slot
									tracking to group by slot tier
								</p>
							</div>
							<div className="overflow-x-auto overflow-y-visible">
								<SpellTable
									rows={ rows }
									spellcasting={ spellcasting }
									slotContext={ null }
									castSlotLevel={ baseLevel }
								/>
							</div>
						</section>
					);
				}) }
		</div>
	);
}

function canConsumeSlot(
	spellcasting: CharacterSpellcasting,
	castSlotLevel: number,
	entry: CharacterSpellEntry,
): boolean {
	if (entry.spell.level === SpellLevel.Cantrip) return true;
	const pool = spellcasting.leveledSlots?.[ castSlotLevel ];
	return !!(pool && pool.used < pool.max);
}

// Pact slots are only valid in the tier that matches pact.slotLevel.
function canConsumePactSlot(
	spellcasting: CharacterSpellcasting,
	entry: CharacterSpellEntry,
	castSlotLevel: number,
): boolean {
	if (entry.spell.level === SpellLevel.Cantrip) return true;
	const pact = spellcasting.pactSlots;
	return !!(
		pact &&
		pact.used < pact.max &&
		pact.slotLevel === castSlotLevel &&
		entry.spell.level <= pact.slotLevel
	);
}

function CastButton({
	spellcasting,
	spellKey,
	entry,
	levelToConsume,
}: {
	spellcasting: CharacterSpellcasting;
	spellKey: string;
	entry: CharacterSpellEntry;
	levelToConsume: number;
}) {
	const [ showPicker, setShowPicker ] = useState(false);
	const pickerRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [ pickerPos, setPickerPos ] = useState<{ top: number; left: number } | null>(null);
	const isCantrip = entry.spell.level === SpellLevel.Cantrip;
	const canUseLeveled = canConsumeSlot(spellcasting, levelToConsume, entry);
	const canUsePact = canConsumePactSlot(spellcasting, entry, levelToConsume);
	// Only show choice UI when both pools are valid for this exact cast tier.
	const needsChoice = !isCantrip && canUseLeveled && canUsePact;
	const enabled = isCantrip || canUseLeveled || canUsePact;

	function positionPicker() {
		if (!buttonRef.current) return;
		const rect = buttonRef.current.getBoundingClientRect();
		// Keep the popover fixed to viewport coordinates so table/card layout
		// never expands when the chooser is opened.
		setPickerPos({
			top: rect.bottom + 4,
			left: Math.max(8, rect.right - 176),
		});
	}

	useEffect(() => {
		if (!showPicker) return;
		positionPicker();
		function handleOutsideClick(event: MouseEvent) {
			const target = event.target as Node;
			if (!pickerRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
				setShowPicker(false);
			}
		}
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setShowPicker(false);
			}
		}
		function handleReposition() {
			// Re-anchor on scroll/resize so it stays aligned to the Cast button.
			positionPicker();
		}
		window.addEventListener("mousedown", handleOutsideClick);
		window.addEventListener("keydown", handleEscape);
		window.addEventListener("resize", handleReposition);
		window.addEventListener("scroll", handleReposition, true);
		return () => {
			window.removeEventListener("mousedown", handleOutsideClick);
			window.removeEventListener("keydown", handleEscape);
			window.removeEventListener("resize", handleReposition);
			window.removeEventListener("scroll", handleReposition, true);
		};
	}, [ showPicker ]);

	function castWith(method: "slots" | "pact") {
		const selectedLevel =
			method === "pact" ? (spellcasting.pactSlots?.slotLevel ?? levelToConsume) : levelToConsume;
		castSpell(spellcasting, method, spellKey, selectedLevel);
		setShowPicker(false);
		setPickerPos(null);
	}

	return (
		<div className="relative inline-flex justify-end" ref={ pickerRef }>
			<button
				ref={ buttonRef }
				type="button"
				className="btn btn-sm btn-primary"
				disabled={ !enabled }
				onClick={ () => {
					if (!needsChoice) {
						const fallbackMethod: "slots" | "pact" = canUseLeveled || isCantrip ? "slots" : "pact";
						castWith(fallbackMethod);
						return;
					}
					if (showPicker) {
						setShowPicker(false);
						setPickerPos(null);
						return;
					}
					positionPicker();
					setShowPicker(true);
				} }
			>
				Cast
			</button>
			{ showPicker && needsChoice && pickerPos && createPortal(
				// Portal to document.body prevents clipping by table/card overflow.
				<div
					ref={ pickerRef }
					className="fixed z-[9999] min-w-44 rounded-md border border-base-300 bg-base-100 p-1 shadow-lg"
					style={ { top: pickerPos.top, left: pickerPos.left } }
				>
					<button
						type="button"
						className="btn btn-ghost btn-xs w-full justify-start"
						onClick={ () => castWith("slots") }
					>
						Use spell slot ({ ordinalSpellLevel(levelToConsume) })
					</button>
					<button
						type="button"
						className="btn btn-ghost btn-xs w-full justify-start"
						onClick={ () => castWith("pact") }
					>
						Use pact slot ({ ordinalSpellLevel(spellcasting.pactSlots?.slotLevel ?? levelToConsume) })
					</button>
				</div>,
				document.body,
			) }
		</div>
	);
}

function SpellTable({
	rows,
	spellcasting,
	slotContext,
	castSlotLevel,
}: {
	rows: SpellRow[];
	spellcasting: CharacterSpellcasting;
	slotContext: number | null;
	/** Slot level to expend; null cantrips use cast with 0 (no slot). Base fallback: spell level. */
	castSlotLevel: number | null;
}) {
	return (
		<table className="table table-fixed w-full">
			<colgroup>
				<col className="w-[22%]" />
				<col className="w-[15%]" />
				<col className="w-[13%]" />
				<col className="w-[15%]" />
				<col className="w-[20%]" />
				<col className="w-[15%]" />
			</colgroup>
			<thead>
				<tr className="border-base-200 [&>th]:font-medium [&>th]:text-xs [&>th]:uppercase [&>th]:tracking-wide [&>th]:text-base-content/60">
					<th className="px-3 py-2">Name</th>
					<th className="px-2 py-2">Time</th>
					<th className="px-2 py-2">Range</th>
					<th className="px-2 py-2">Hit / DC</th>
					<th className="px-2 py-2">Effect</th>
					<th className="px-3 py-2 text-right">Cast</th>
				</tr>
			</thead>
			<tbody>
				{ rows.map(({ spellKey, entry }, index) => {
					const spell = entry.spell;
					const base = spell.level;

					const levelToConsume =
						base === 0
							? 0
							: castSlotLevel ?? base;

					return (
						<tr
							key={ `${slotContext ?? "c"}-${spellKey}-${index}` }
							className="border-base-200 hover:bg-base-200/30"
						>
							<td className="px-3 py-2 align-top">
								<div className="font-medium">{ spell.name }</div>
							</td>
							<td className="px-2 py-2 align-top text-sm text-base-content/90">
								{ formatCastingTime(spell) }
							</td>
							<td className="px-2 py-2 align-top text-sm text-base-content/90">
								{ formatSpellRange(spell) }
							</td>
							<td className="px-2 py-2 align-top text-sm text-base-content/90">
								{ formatHitOrDC(spell) }
							</td>
							<td className="px-2 py-2 align-top text-sm text-base-content/90 tabular-nums">
								{ formatSpellEffect(spell) }
							</td>
							<td className="px-3 py-2 text-right align-top">
								<CastButton
									spellcasting={ spellcasting }
									spellKey={ spellKey }
									entry={ entry }
									levelToConsume={ levelToConsume }
								/>
							</td>
						</tr>
					);
				}) }
			</tbody>
		</table>
	);
}
