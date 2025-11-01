import React from 'react';

// Centralized image asset registry and lightweight <Img> component implemented without JSX
// so this file can keep the .ts extension (avoids dual .ts/.tsx resolution issues).

export interface ImageAsset {
	file: string; // path under /public (served from root)
	alt: string;
	sources?: { type: string; file: string }[]; // optional for future <picture> enhancement
	width?: number;
	height?: number;
	className?: string;
	loading?: 'lazy' | 'eager';
}

export const assets = {
	headshot: {
		file: '/me.jpg',
		alt: 'Ahmed Osama headshot',
		className: 'headshot',
		loading: 'eager'
	} as ImageAsset,
	microsoft: {
		file: '/microsoft.png',
		alt: 'Microsoft logo',
		className: 'logo',
		loading: 'lazy'
	} as ImageAsset,
	dfki: {
		file: '/dfki.jpg',
		alt: 'DFKI logo',
		className: 'logo',
		loading: 'lazy'
	} as ImageAsset
};

export type AssetKey = keyof typeof assets;

export function Img(
	{ asset, ...rest }: { asset: AssetKey } & React.ImgHTMLAttributes<HTMLImageElement>
) {
	const data = assets[asset];
	return React.createElement('img', {
		src: data.file,
		alt: data.alt,
		className: [data.className, rest.className].filter(Boolean).join(' '),
		loading: data.loading,
		...rest
	});
}
