"use client";
import React from "react";

// eslint-disable-next-line no-unused-vars
import DnDCharacter from "./DnDCharacter";

import Statbox from "./Components/StatBox";
import StatRow from "./Components/StatRow";
import Skill from "./Components/Skill";
import StatBox2 from "./Components/StatBox2";
import DeathSave from "./Components/DeathSave";
import AttackTable from "./Components/AttackTable";
import Currency from "./Components/Currency";
import torvokData from "../../characters/John.json";
import {Proficiencies } from "./DnDCharacter";
import { allSkills } from "@/data/Definitions";

import "./dndstyles.css";

let torvok = new DnDCharacter();
Object.assign(torvok, torvokData);

interface IDnDCharacterStatsSheetProps {
	character?: DnDCharacter;
	defaultCharacter?: DnDCharacter;
	onCharacterChanged?: (character: DnDCharacter, changedField: string, newdefaultValue: any) => void;
}

interface IDnDCharacterStatsSheetState {
	character: DnDCharacter;
}

const initialState: IDnDCharacterStatsSheetState = {
	character: torvok,
};

class DnDCharacterStatsSheet extends React.Component<IDnDCharacterStatsSheetProps, IDnDCharacterStatsSheetState> {
	constructor(props: IDnDCharacterStatsSheetProps) {
		super(props);
		if (props.defaultCharacter) {
			initialState.character = props.defaultCharacter;
		}
		this.state = initialState;
	}

	updateCharacter(name: string, defaultValue: any) {
		const oldCharacter = this.getCharacter();
		const newCharacter: DnDCharacter = new DnDCharacter();
		Object.assign(newCharacter, oldCharacter);
		newCharacter[name] = defaultValue;

		if (!this.props.character) {
			// NOT CONTROLLED
			this.setState({ character: newCharacter });
		}

		if (typeof this.props.onCharacterChanged === "function") {
			this.props.onCharacterChanged(newCharacter, name, defaultValue);
		}
	}

	getCharacter() {
		// NOT CONTROLLED
		let character = this.state.character;
		if (this.props.character) {
			// CONTROLLED
			character = this.props.character;
		}
		return character;
	}

	formatProficiencies = (proficiencies: Proficiencies) => {
		if (!proficiencies) return "";

		// check if proficiencies is in the right format, if not return an empty string

		if (!proficiencies.armor || !proficiencies.weapons || !proficiencies.tools || !proficiencies.languages) {
			//make into a single string
			return proficiencies;
		}

		// Convert the proficiency object to a string
		return [
			"Armor: " + (proficiencies.armor.length > 0 ? proficiencies.armor.join(", ") : "None"),
			"Weapons: " + (proficiencies.weapons.length > 0 ? proficiencies.weapons.join(", ") : "None"),
			"Tools: " + (proficiencies.tools.length > 0 ? proficiencies.tools.join(", ") : "None"),
			"Languages: " + (proficiencies.languages.length > 0 ? proficiencies.languages.join(", ") : "None"),
		].join("\n");
	};

	render() {
		let character = this.getCharacter();

		return (
			<div className="d-and-d-character-sheet container-xl mt-5 mb-5 flex flex-col justify-center items-center">
				<div>
					<div className="row mb-4 flex justify-center items-center">
						<div className="col-md-3 pr-2 pl-2">
							<div className="d-and-d-page-title">D&D</div>
							<div className="d-and-d-attribute-collection char-name pr-3 pl-3">
								<input
									type="text"
									defaultValue={character.name ? character.name : ""}
									onChange={(e) => this.updateCharacter("name", e.target.defaultValue)}
								/>
							</div>
							<label
								style={{
									width: "100%",
									textAlign: "right",
									textTransform: "uppercase",
									fontSize: "11px",
								}}
							>
								Character Name
							</label>
						</div>
						<div className="col-md-9 pr-2 pl-2 flex ">
							<div className="d-and-d-attribute-collection pr-3 pl-3">
								<div className="row pl-3 pr-3 flex w-fit">
									<div className="col-md-3 col-6 pl-0 pr-0">
										<input
											type="text"
											defaultValue={character.classLevel ? character.classLevel : ""}
											onChange={(e) => this.updateCharacter("classLevel", e.target.defaultValue)}
										/>
										<label>Class & Level</label>
									</div>
									<div className="col-md-3 col-6 pl-0 pr-0">
										<input
											type="text"
											defaultValue={character.background ? character.background : ""}
											onChange={(e) => this.updateCharacter("background", e.target.defaultValue)}
										/>
										<label>Background</label>
									</div>
									<div className="col-md-3 col-6 pl-0 pr-0">
										<input
											type="text"
											defaultValue={character.playerName ? character.playerName : ""}
											onChange={(e) => this.updateCharacter("playerName", e.target.defaultValue)}
										/>
										<label>Player Name</label>
									</div>
									<div className="col-md-3 col-6 pl-0 pr-0">
										<input
											type="text"
											defaultValue={character.faction ? character.faction : ""}
											onChange={(e) => this.updateCharacter("faction", e.target.defaultValue)}
										/>
										<label>Faction</label>
									</div>
								</div>
								<div className="row pl-3 pr-3 flex">
									<div className="col-md-3 col-6 pl-0 pr-0 w-72">
										<input
											type="text"
											defaultValue={character.race ? character.race : ""}
											onChange={(e) => this.updateCharacter("race", e.target.defaultValue)}
										/>
										<label>Race</label>
									</div>
									<div className="col-md-3 col-6 pl-0 pr-0">
										<input
											type="text"
											defaultValue={character.alignment ? character.alignment : ""}
											onChange={(e) => this.updateCharacter("alignment", e.target.defaultValue)}
										/>
										<label>Alignment</label>
									</div>
									<div className="col-md-3 col-6 pl-0 pr-0">
										<input
											type="text"
											defaultValue={character.xp ? character.xp : ""}
											onChange={(e) => this.updateCharacter("xp", e.target.defaultValue)}
										/>
										<label>Experience Points</label>
									</div>
									<div className="col-md-3 col-6 pl-0 pr-0">
										<input
											type="text"
											defaultValue={character.dciNo ? character.dciNo : ""}
											onChange={(e) => this.updateCharacter("dciNo", e.target.defaultValue)}
										/>
										<label>DCI Number</label>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="row flex justify-center">
						<div className="col-md-4 pr-10 flex flex-col">
							<div className="row flex items-center justify-center">
								<div className="col-4 pr-6">
									<div className="d-and-d-box gray">
										<Statbox
											label="Strength"
											name="str"
											defaultValue={character.stats.str}
										/>
										<Statbox
											label="Dexterity"
											name="dex"
											defaultValue={character.stats.dex}
										/>
										<Statbox
											label="Constitution"
											name="con"
											defaultValue={character.stats.con}
										/>
										<Statbox
											label="Intelligence"
											name="int"
											defaultValue={character.stats.int}
										/>
										<Statbox
											label="Wisdom"
											name="wis"
											defaultValue={character.stats.wis}
										/>
										<Statbox
											label="Charisma"
											name="cha"
											defaultValue={character.stats.cha}
										/>
									</div>
								</div>
								<div className="col-8">
									<StatRow
										label="Inspiration"
										name="inspiration"
										defaultValue={character.inspiration}
									/>
									<StatRow
										classes="rounded"
										label="Proficiency Bonus"
										name="proficiencyBonus"
										defaultValue={character.proficiencyBonus}
									/>
									<div className="d-and-d-box">
										<div style={{ textAlign: "left" }}>
											<Skill
												label="Strength"
												name="strSave"
												defaultValue={character.calculateSavingThrowModifier("str")}
												checked={character.savingThrowProficiencies.str === "Proficient"}
											/>
											<Skill
												label="Dexterity"
												name="dexSave"
												defaultValue={character.calculateSavingThrowModifier("dex")}
												checked={character.savingThrowProficiencies.dex === "Proficient"}
											/>
											<Skill
												label="Constitution"
												name="conSave"
												defaultValue={character.calculateSavingThrowModifier("con")}
												checked={character.savingThrowProficiencies.con === "Proficient"}
											/>
											<Skill
												label="Intelligence"
												name="intSave"
												defaultValue={character.calculateSavingThrowModifier("int")}
												checked={character.savingThrowProficiencies.int === "Proficient"}
											/>
											<Skill
												label="Wisdom"
												name="wisSave"
												defaultValue={character.calculateSavingThrowModifier("wis")}
												checked={character.savingThrowProficiencies.wis === "Proficient"}
											/>
											<Skill
												label="Charisma"
												name="chaSave"
												defaultValue={character.calculateSavingThrowModifier("cha")}
												checked={character.savingThrowProficiencies.cha === "Proficient"}
											/>
										</div>
										<label
											className="d-and-d-title"
											style={{ marginTop: "10px" }}
										>
											Saving Throws
										</label>
									</div>
									<div className="d-and-d-box">
										<div style={{ textAlign: "left" }}>
											{allSkills.map((skill) => (
												<Skill
													label={skill}
													name={skill}
													defaultValue={character.calculateSkillModifier(skill.toString())}
													checked={character.skillProficiencies[skill] === "Proficient"}
												/>
											))}
										</div>
										<label
											className="d-and-d-title"
											style={{ marginTop: "10px" }}
										>
											Skills
										</label>
									</div>
								</div>
							</div>
							<div className="mt-2">
								<StatRow
									classes="rounded rounded-sides"
									label="Passive Wisdom (Perception)"
									name="passivePerception"
									defaultValue={character.calculateSkillModifier("perception") + 10}
								/>
							</div>
							<div className="d-and-d-box mt-4 flex flex-col grow">
								<textarea
									defaultValue={character.proficiencies ? (this.formatProficiencies(character.proficiencies) as string) : ""}
									rows={12}
									className="flex-grow"
								/>
								<label
									className="d-and-d-title"
									style={{ marginTop: "10px" }}
								>
									Other Proficiencies & Languages
								</label>
							</div>
						</div>

						<div className="col-md-4 pr-6 w-1/3 flex flex-col">
							<div className="d-and-d-box gray grow">
								<div className="row flex">
									<div className="col-4 pr-2">
										<StatBox2
											classes="shield"
											labelTop="Armour"
											label="Class"
											name="ac"
											defaultValue={character.ac}
										/>
									</div>
									<div className="col-4 pr-2 pl-2">
										<StatBox2
											label="Initiative"
											name="init"
											defaultValue={"+" + character.getInitiative()}
										/>
									</div>
									<div className="col-4 pl-2">
										<StatBox2
											label="Speed"
											name="speed"
											defaultValue={character.speed}
										/>
									</div>
								</div>

								<div
									className="d-and-d-box white"
									style={{
										borderRadius: "8px 8px 0 0",
										marginBottom: "5px",
										paddingBottom: "5px",
									}}
								>
									<div className="d-and-d-gray-text">
										<label style={{ width: "95px" }}>Hit Point Maximum</label>
										<input
											type="text"
											style={{ width: "calc(100% - 95px)" }}
											className="d-and-d-linput"
											defaultValue={character.maxHp ? character.maxHp : ""}
											onChange={(e) => this.updateCharacter("maxHp", e.target.defaultValue)}
										/>
									</div>
									<input
										type="text"
										className="d-and-d-cinput"
										defaultValue={character.hp ? character.hp : ""}
										onChange={(e) => this.updateCharacter("hp", e.target.defaultValue)}
									/>
									<label
										className="d-and-d-title"
										style={{ marginTop: "5px" }}
									>
										Current Hit Points
									</label>
								</div>
								<div
									className="d-and-d-box white mb-2"
									style={{ borderRadius: "0 0 8px 8px", paddingBottom: "5px" }}
								>
									<input
										type="text"
										className="d-and-d-cinput"
										defaultValue={character.tempHp ? character.tempHp : ""}
										onChange={(e) => this.updateCharacter("tempHp", e.target.defaultValue)}
									/>
									<label
										className="d-and-d-title"
										style={{ marginTop: "5px" }}
									>
										Temporary Hit Points
									</label>
								</div>

								<div className="row mt-1 flex">
									<div className="col-6 pr-1">
										<div
											className="d-and-d-box white mb-0"
											style={{ paddingBottom: "5px" }}
										>
											<div className="d-and-d-gray-text">
												<label style={{ width: "25px" }}>Total</label>
												<input
													type="text"
													style={{ width: "calc(100% - 25px)" }}
													className="d-and-d-linput"
													defaultValue={character.hitDiceMax ? character.hitDiceMax : ""}
													onChange={(e) => this.updateCharacter("hitDiceMax", e.target.defaultValue)}
												/>
											</div>
											<input
												type="text"
												className="d-and-d-cinput"
												defaultValue={character.hitDice ? character.hitDice : ""}
												onChange={(e) => this.updateCharacter("hitDice", e.target.defaultValue)}
											/>
											<label
												className="d-and-d-title"
												style={{ marginTop: "5px" }}
											>
												Hit Dice
											</label>
										</div>
									</div>
									<div className="col-6 pl-1 flex-1 text-center">
										<div
											className="d-and-d-box white mb-0"
											style={{ paddingBottom: "5px" }}
										>
											<DeathSave
												classes="d-and-d-save-success"
												label="Successes"
												name="deathsaveSuccesses"
												defaultValue={character.deathsaveSuccesses}
												onChange={(name: string, defaultValue: any) => {
													this.updateCharacter(name, defaultValue);
												}}
											/>
											<DeathSave
												classes="d-and-d-save-failure"
												label="Failures"
												name="deathsaveFailures"
												defaultValue={character.deathsaveFailures}
												onChange={(name: string, defaultValue: any) => {
													this.updateCharacter(name, defaultValue);
												}}
											/>
											<label
												className="d-and-d-title"
												style={{ marginTop: "6px" }}
											>
												Death Saves
											</label>
										</div>
									</div>
								</div>
							</div>

							<div className="d-and-d-box mt-3 text-center flex flex-col">
								<AttackTable
									rows={3}
									name="attacks"
									defaultValue={character.attacks}
									
								/>
								<textarea
									defaultValue={character.attacksText ? character.attacksText : ""}
									onChange={(e) => this.updateCharacter("attacksText", e.target.defaultValue)}
									rows={6}
								/>
								<label
									className="d-and-d-title"
									style={{ marginTop: "10px" }}
								>
									Attacks & Spellcasting
								</label>
							</div>

							<div className="d-and-d-box mt-4 text-center">
								<div className="columns-2 flex flex-row">
									<div
										className="col flex flex-col"
										style={{ width: "100px", paddingRight: "125px" }}
									>
										<Currency
											label="CP"
											name="cp"
											defaultValue={character.cp}
											onChange={(name: string, defaultValue: any) => {
												this.updateCharacter(name, defaultValue);
											}}
										/>
										<Currency
											label="SP"
											name="sp"
											defaultValue={character.sp}
											onChange={(name: string, defaultValue: any) => {
												this.updateCharacter(name, defaultValue);
											}}
										/>
										<Currency
											label="EP"
											name="ep"
											defaultValue={character.ep}
											onChange={(name: string, defaultValue: any) => {
												this.updateCharacter(name, defaultValue);
											}}
										/>
										<Currency
											label="GP"
											name="gp"
											defaultValue={character.gp}
											onChange={(name: string, defaultValue: any) => {
												this.updateCharacter(name, defaultValue);
											}}
										/>
										<Currency
											label="PP"
											name="pp"
											defaultValue={character.pp}
											onChange={(name: string, defaultValue: any) => {
												this.updateCharacter(name, defaultValue);
											}}
										/>
									</div>
									<div className="size-full">
										<textarea
											className="d-and-d-equipment-indent"
											defaultValue={character.equipment ? character.equipment : ""}
											onChange={(e) => this.updateCharacter("equipment", e.target.defaultValue)}
											rows={14}
										/>
									</div>
								</div>
								<label
									className="d-and-d-title"
									style={{ marginTop: "10px" }}
								>
									Equipment
								</label>
							</div>
						</div>

						<div className="col-md-4 flex flex-col">
							<div
								className="d-and-d-box gray"
								style={{ marginBottom: "17px" }}
							>
								<div
									className="d-and-d-box white"
									style={{
										borderRadius: "8px 8px 0 0",
										marginBottom: "5px",
										paddingTop: "1px",
										paddingBottom: "5px",
									}}
								>
									<textarea
										defaultValue={character.personalityTraits ? character.personalityTraits : ""}
										onChange={(e) => this.updateCharacter("personalityTraits", e.target.defaultValue)}
										rows={3}
									/>
									<label className="d-and-d-title">Personality Traits</label>
								</div>
								<div
									className="d-and-d-box white"
									style={{
										borderRadius: "0 0 0 0",
										marginBottom: "5px",
										paddingTop: "1px",
										paddingBottom: "5px",
									}}
								>
									<textarea
										defaultValue={character.ideals ? character.ideals : ""}
										onChange={(e) => this.updateCharacter("ideals", e.target.defaultValue)}
										rows={3}
									/>
									<label className="d-and-d-title">Ideals</label>
								</div>
								<div
									className="d-and-d-box white"
									style={{
										borderRadius: "0 0 0 0",
										marginBottom: "5px",
										paddingTop: "1px",
										paddingBottom: "5px",
									}}
								>
									<textarea
										defaultValue={character.bonds ? character.bonds : ""}
										onChange={(e) => this.updateCharacter("bonds", e.target.defaultValue)}
										rows={2}
									/>
									<label className="d-and-d-title">Bonds</label>
								</div>
								<div
									className="d-and-d-box white"
									style={{
										borderRadius: "0 0 8px 8px",
										marginBottom: "0px",
										paddingTop: "1px",
										paddingBottom: "4px",
									}}
								>
									<textarea
										defaultValue={character.flaws ? character.flaws : ""}
										onChange={(e) => this.updateCharacter("flaws", e.target.defaultValue)}
										rows={2}
									/>
									<label className="d-and-d-title">Flaws</label>
								</div>
							</div>
							<div className="d-and-d-box mt-3 text-center grow">
								<textarea
									style={{ paddingBottom: "5px" }}
									defaultValue={character.featuresTraits ? character.featuresTraits : ""}
									onChange={(e) => this.updateCharacter("featuresTraits", e.target.defaultValue)}
									rows={27}
								/>
								<label
									className="d-and-d-title"
									style={{ marginTop: "10px" }}
								>
									Features & Traits
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DnDCharacterStatsSheet;
