import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function numberWithCommas(x: number) {
	return x
		.toFixed(2)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getLocalcolumnVisibility = (token: string) => {
	// If window not present
	if (typeof window === "undefined") return {};

	// If data not present
	const local = localStorage.getItem(token);
	if (!local) return {};

	return JSON.parse(local) as { [x: string]: boolean };
};
