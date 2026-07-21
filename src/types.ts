export type Tier = 'free' | 'pro' | 'business';

export interface TextOverlay {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number; // 0 - 100 percent
  y: number; // 0 - 100 percent
  scale: number;
}

export interface StickerOverlay {
  id: string;
  emoji: string;
  x: number; // 0 - 100 percent
  y: number; // 0 - 100 percent
  scale: number;
}

export interface ProjectSettings {
  mode: 'ai' | 'chroma';
  chromaKeyColor: string; // hex string e.g. #00ff00
  chromaTolerance: number; // 0-100
  chromaSimilarity: number; // 0-100
  feather: number; // 0-50
  maskErode: number; // 0-10
  maskDilate: number; // 0-10
  backgroundType: 'color' | 'image' | 'video' | 'blur';
  backgroundValue: string; // color, asset url, asset id, or blob
  blurStrength: number; // 0-40 (px)
  foregroundScale: number; // 0.1 to 3.0
  foregroundX: number; // offset in percent (-100 to 100)
  foregroundY: number; // offset in percent (-100 to 100)
  foregroundRotate: number; // degrees (-180 to 180)
  trimStart: number; // seconds
  trimEnd: number; // seconds
  textOverlays: TextOverlay[];
  stickerOverlays: StickerOverlay[];
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  folderId: string | null;
  duration: number; // total duration in seconds
  resolution: '480p' | '720p' | '1080p' | '2k' | '4k';
  aspectRatio: '9:16' | '16:9' | '1:1';
  videoUrl: string; // can be blob url or sample video id
  originalVideoName: string;
  settings: ProjectSettings;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface StockAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  category: string;
  isPremium: boolean;
}

export interface SampleVideo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  description: string;
}
