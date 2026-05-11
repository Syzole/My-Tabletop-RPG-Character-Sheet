export function capitalizeFirstLetter(text: string): string {
	if (!text) return text;
	return text.charAt(0).toUpperCase() + text.slice(1);
}

// Utility function to format the property keys
export function formatPropertyKey(key: string): string {
	if (key === "ac") return "AC";
	if (key === "dmg1") return "Damage";
	if (key === "dmg2") return "Damage (2 handed)";
	return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase());
}
