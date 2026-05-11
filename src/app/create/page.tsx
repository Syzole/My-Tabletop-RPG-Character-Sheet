"use client";

import React, { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ALIGNMENTS } from "@/constants/alignments";
import {
	BACKGROUND_OPTIONS,
	CUSTOM_BACKGROUND_KEY,
	type BackgroundSelectionKey,
} from "@/constants/backgrounds";
import { CLASS_STARTING_INFO } from "@/data/classStartingInfo";
import { species as SPECIES_DATA } from "@/data/species";
import { CLASS_FEATURE_MAP, SUBCLASS_FEATURE_MAP } from "@/data/classes";
import useCharacterStore from "@/stores/CharacterStore";
import type { SkillName } from "@/types/skills";
import { defaultStats } from "@/types/stats";
import { createCharacter, type HpMode } from "@/utils/createCharacter";

const CLASS_OPTIONS = Object.keys(CLASS_FEATURE_MAP).sort();
const STAT_FIELDS = [
	["strength", "STR"],
	["dexterity", "DEX"],
	["constitution", "CON"],
	["intelligence", "INT"],
	["wisdom", "WIS"],
	["charisma", "CHA"],
] as const;

function formatChoiceLabel(value: string): string {
	return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
}

export default function CreateCharacterPage() {
	const router = useRouter();
	const setCharacter = useCharacterStore((s) => s.setCharacter);

	const [name, setName] = useState("");
	const [playerName, setPlayerName] = useState("");
	const [speciesName, setSpeciesName] = useState("Human");
	const [className, setClassName] = useState(() => CLASS_OPTIONS[0] ?? "");
	const [subclass, setSubclass] = useState("");
	const [level, setLevel] = useState(1);
	const [backgroundKey, setBackgroundKey] = useState<BackgroundSelectionKey>(
		BACKGROUND_OPTIONS[0]?.key ?? CUSTOM_BACKGROUND_KEY,
	);
	const [customBackgroundName, setCustomBackgroundName] = useState("");
	const [alignment, setAlignment] = useState("True Neutral");
	const [baseStats, setBaseStats] = useState({ ...defaultStats });
	const [selectedSkills, setSelectedSkills] = useState<SkillName[]>([]);
	const [classEquipmentSelections, setClassEquipmentSelections] = useState<Record<number, string>>({});
	const [hpMode, setHpMode] = useState<HpMode>("average");
	const [manualHpByLevel, setManualHpByLevel] = useState<number[]>([]);
	const [error, setError] = useState<string | null>(null);

	const speciesOptions = useMemo(() => Object.keys(SPECIES_DATA).sort(), []);
	const classStartingInfo = CLASS_STARTING_INFO[className];
	const extraHpLevels = Math.max(0, level - 1);

	const subclassOptions = useMemo(() => {
		const map = SUBCLASS_FEATURE_MAP[className];
		return map ? Object.keys(map).sort() : [];
	}, [className]);

	function toggleSkill(skill: SkillName) {
		if (!classStartingInfo) return;
		setSelectedSkills((prev) => {
			if (prev.includes(skill)) return prev.filter((entry) => entry !== skill);
			if (prev.length >= classStartingInfo.skillProficiencies.choose) return prev;
			return [...prev, skill];
		});
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			if (!className.trim()) {
				setError("Choose a class.");
				return;
			}
			if (classStartingInfo) {
				const requiredSkillCount = classStartingInfo.skillProficiencies.choose;
				if (selectedSkills.length !== requiredSkillCount) {
					setError(`Choose ${requiredSkillCount} skill proficiencies.`);
					return;
				}
				const missingEquipment = classStartingInfo.startingEquipment.choices.some(
					(choiceGroup, index) => choiceGroup.choose === 1 && !classEquipmentSelections[index],
				);
				if (missingEquipment) {
					setError("Choose all required class starting equipment.");
					return;
				}
				const unsupportedMultiChoice = classStartingInfo.startingEquipment.choices.some(
					(choiceGroup) => choiceGroup.choose !== 1,
				);
				if (unsupportedMultiChoice) {
					setError("This class has multi-pick equipment choices that are not supported yet.");
					return;
				}
			}
			const char = createCharacter({
				name,
				playerName,
				speciesName,
				classDisplayName: className.trim(),
				subclass: subclassOptions.length ? subclass || undefined : undefined,
				level,
				backgroundKey,
				background: customBackgroundName,
				alignment,
				baseStats,
				selectedSkills,
				classEquipmentSelections,
				hpMode,
				manualHpByLevel: manualHpByLevel.slice(0, extraHpLevels),
			});
			setCharacter(char);
			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create character.");
		}
	}

	if (CLASS_OPTIONS.length === 0) {
		return (
			<div className="container mx-auto max-w-lg px-4 py-10">
				<p className="mb-4">No migrated classes in CLASS_FEATURE_MAP. Run:</p>
				<code className="block rounded bg-base-200 p-3 text-sm">npm run convert:class</code>
				<Link href="/" className="btn btn-ghost mt-6 inline-block">
					Back
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-lg px-4 py-10">
			<h1 className="text-2xl font-semibold mb-6">Create character</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<label className="flex flex-col gap-1">
					<span className="text-sm opacity-80">Character name</span>
					<input
						className="input input-bordered w-full"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						autoComplete="off"
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm opacity-80">Player name</span>
					<input
						className="input input-bordered w-full"
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						autoComplete="off"
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm opacity-80">Species</span>
					<select
						className="select select-bordered w-full"
						value={speciesName}
						onChange={(e) => setSpeciesName(e.target.value)}
					>
						{speciesOptions.map((n) => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm opacity-80">Class</span>
					<select
						className="select select-bordered w-full"
						value={className}
						onChange={(e) => {
							setClassName(e.target.value);
							setSubclass("");
							setSelectedSkills([]);
							setClassEquipmentSelections({});
						}}
					>
						{CLASS_OPTIONS.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</label>
				{subclassOptions.length > 0 && (
					<label className="flex flex-col gap-1">
						<span className="text-sm opacity-80">Subclass</span>
						<select
							className="select select-bordered w-full"
							value={subclass}
							onChange={(e) => setSubclass(e.target.value)}
							required
						>
							<option value="">Choose subclass…</option>
							{subclassOptions.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>
					</label>
				)}
				<label className="flex flex-col gap-1">
					<span className="text-sm opacity-80">Level</span>
					<input
						type="number"
						min={1}
						max={20}
						className="input input-bordered w-full"
						value={level}
						onChange={(e) => setLevel(Number(e.target.value))}
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm opacity-80">Background</span>
					<select
						className="select select-bordered w-full"
						value={backgroundKey}
						onChange={(e) => setBackgroundKey(e.target.value as BackgroundSelectionKey)}
					>
						{BACKGROUND_OPTIONS.map((option) => (
							<option key={option.key} value={option.key}>
								{option.label}
							</option>
						))}
					</select>
				</label>
				{backgroundKey === CUSTOM_BACKGROUND_KEY && (
					<label className="flex flex-col gap-1">
						<span className="text-sm opacity-80">Custom background name</span>
						<input
							className="input input-bordered w-full"
							value={customBackgroundName}
							onChange={(e) => setCustomBackgroundName(e.target.value)}
							placeholder="Optional"
						/>
					</label>
				)}
				<label className="flex flex-col gap-1">
					<span className="text-sm opacity-80">Alignment</span>
					<select
						className="select select-bordered w-full"
						value={alignment}
						onChange={(e) => setAlignment(e.target.value)}
					>
						{ALIGNMENTS.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</label>
				<div className="flex flex-col gap-2">
					<span className="text-sm opacity-80">Base stats (1-20)</span>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{STAT_FIELDS.map(([key, label]) => (
							<label key={key} className="flex flex-col gap-1">
								<span className="text-xs opacity-70">{label}</span>
								<input
									type="number"
									min={1}
									max={20}
									className="input input-bordered w-full"
									value={baseStats[key]}
									onChange={(e) =>
										setBaseStats((prev) => ({
											...prev,
											[key]: Number(e.target.value),
										}))
									}
								/>
							</label>
						))}
					</div>
				</div>
				{classStartingInfo ? (
					<div className="flex flex-col gap-4 rounded border border-base-300 p-4">
						<div className="flex flex-col gap-2">
							<div>
								<h2 className="font-medium">Class proficiencies</h2>
								<p className="text-sm opacity-70">
									Choose {classStartingInfo.skillProficiencies.choose} skills. Saving throw,
									armor, weapon, and tool proficiencies are applied automatically.
								</p>
							</div>
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
								{Array.from(classStartingInfo.skillProficiencies.from)
									.sort()
									.map((skill) => {
										const checked = selectedSkills.includes(skill);
										const disabled =
											!checked &&
											selectedSkills.length >= classStartingInfo.skillProficiencies.choose;
										return (
											<label key={skill} className="flex items-center gap-2 text-sm">
												<input
													type="checkbox"
													className="checkbox checkbox-sm"
													checked={checked}
													disabled={disabled}
													onChange={() => toggleSkill(skill)}
												/>
												<span>{formatChoiceLabel(skill)}</span>
											</label>
										);
									})}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<div>
								<h2 className="font-medium">Class starting equipment</h2>
								<p className="text-sm opacity-70">
									Automatic class items are included. Choose one option from each group.
								</p>
							</div>
							{Object.keys(classStartingInfo.startingEquipment.automatic).length > 0 && (
								<p className="text-sm">
									<span className="opacity-70">Automatic: </span>
									{Object.keys(classStartingInfo.startingEquipment.automatic).join(", ")}
								</p>
							)}
							{classStartingInfo.startingEquipment.choices.map((choiceGroup, index) => (
								<label key={index} className="flex flex-col gap-1">
									<span className="text-sm opacity-80">
										Choice {index + 1}
										{choiceGroup.choose !== 1 ? ` (choose ${choiceGroup.choose})` : ""}
									</span>
									<select
										className="select select-bordered w-full"
										value={classEquipmentSelections[index] ?? ""}
										onChange={(e) =>
											setClassEquipmentSelections((prev) => ({
												...prev,
												[index]: e.target.value,
											}))
										}
										required={choiceGroup.choose === 1}
										disabled={choiceGroup.choose !== 1}
									>
										<option value="">Choose equipment...</option>
										{Object.keys(choiceGroup.from).map((optionName) => (
											<option key={optionName} value={optionName}>
												{optionName}
											</option>
										))}
									</select>
									{choiceGroup.choose !== 1 && (
										<span className="text-xs text-warning">
											Multi-pick equipment choices are not supported yet.
										</span>
									)}
								</label>
							))}
						</div>
					</div>
				) : (
					<p className="rounded border border-base-300 p-3 text-sm opacity-70">
						Starting setup data is not available for {className} yet.
					</p>
				)}
				{level > 1 && (
					<div className="flex flex-col gap-3 rounded border border-base-300 p-4">
						<div>
							<h2 className="font-medium">HP after level 1</h2>
							<p className="text-sm opacity-70">
								Level 1 uses max hit die + CON modifier automatically.
							</p>
						</div>
						<label className="flex flex-col gap-1">
							<span className="text-sm opacity-80">Additional HP mode</span>
							<select
								className="select select-bordered w-full"
								value={hpMode}
								onChange={(e) => setHpMode(e.target.value as HpMode)}
							>
								<option value="average">Average + CON per level</option>
								<option value="manual">Manual per level + CON</option>
							</select>
						</label>
						{hpMode === "manual" && (
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
								{Array.from({ length: extraHpLevels }, (_, index) => (
									<label key={index} className="flex flex-col gap-1">
										<span className="text-xs opacity-70">Level {index + 2}</span>
										<input
											type="number"
											min={1}
											className="input input-bordered w-full"
											value={manualHpByLevel[index] ?? 1}
											onChange={(e) => {
												const value = Number(e.target.value);
												setManualHpByLevel((prev) => {
													const next = [...prev];
													next[index] = value;
													return next;
												});
											}}
										/>
									</label>
								))}
							</div>
						)}
					</div>
				)}
				{error && <p className="text-error text-sm">{error}</p>}
				<div className="flex gap-3 pt-2">
					<button type="submit" className="btn btn-primary">
						Start sheet
					</button>
					<Link href="/" className="btn btn-ghost">
						Cancel
					</Link>
				</div>
			</form>
		</div>
	);
}
