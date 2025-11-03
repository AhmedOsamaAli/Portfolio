import React from 'react';

// Asset definitions for portfolio images
export interface ImageAsset {
  file: string; // fallback file path in /public
  alt: string;
  sources?: { type: string; file: string }[];
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const assets = {
  headshot: {
    file: '/me.jpg',
    alt: 'Portrait of Ahmed Osama',
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
    file: '/dfki2.jpg',
    alt: 'DFKI logo',
    className: 'logo',
    loading: 'lazy'
  } as ImageAsset,
  dfki2: {
    file: '/dfki2.jpg',
    alt: 'DFKI logo',
    className: 'logo',
    loading: 'lazy'
  } as ImageAsset
};

export type AssetKey = 'headshot' | 'microsoft' | 'dfki' | 'dfki2';

export function Img({ asset, ...rest }: { asset: AssetKey } & React.ImgHTMLAttributes<HTMLImageElement>) {
  const data = assets[asset];
  return (
    <img
      src={data.file}
      alt={data.alt}
      className={[data.className, rest.className].filter(Boolean).join(' ')}
      loading={data.loading}
      {...rest}
    />
  );
}
