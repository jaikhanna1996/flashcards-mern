export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const h = hex.replace('#', '').trim();
	if (h.length === 3) {
		const r = parseInt(h[0] + h[0], 16);
		const g = parseInt(h[1] + h[1], 16);
		const b = parseInt(h[2] + h[2], 16);
		return { r, g, b };
	}
	if (h.length === 6) {
		const r = parseInt(h.slice(0, 2), 16);
		const g = parseInt(h.slice(2, 4), 16);
		const b = parseInt(h.slice(4, 6), 16);
		return { r, g, b };
	}
	return null;
}

function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
	const srgb = [r, g, b].map((v) => {
		const s = v / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(hex1: string, hex2: string): number {
	const rgb1 = hexToRgb(hex1);
	const rgb2 = hexToRgb(hex2);
	if (!rgb1 || !rgb2) return 1;
	const l1 = luminance(rgb1);
	const l2 = luminance(rgb2);
	const bright = Math.max(l1, l2);
	const dark = Math.min(l1, l2);
	return (bright + 0.05) / (dark + 0.05);
}

export function getContrastColor(hex: string): '#000000' | '#ffffff' {
	const blackContrast = contrastRatio(hex, '#000000');
	const whiteContrast = contrastRatio(hex, '#ffffff');
	return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}
