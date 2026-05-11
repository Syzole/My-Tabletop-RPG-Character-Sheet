export interface Speed {
	walk: number;
	fly?: number;
	swim?: number;
	climb?: number;
	burrow?: number;
}

export const defaultSpeed: Speed = { walk: 30 };
