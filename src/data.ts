import { StockAsset, SampleVideo, Project } from './types';

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: 'sample-green-screen',
    name: 'Chroma Presenter (Green Screen)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-in-front-of-a-green-screen-39912-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    duration: 12,
    description: 'Perfect for testing exact chroma-key color extraction with adjustable tolerance and similarity.'
  },
  {
    id: 'sample-vlogger',
    name: 'Studio Vlog (Human separation)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-smartphone-and-talking-41584-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    duration: 15,
    description: 'A vlogger presenting to their camera. Ideal for showcasing smart AI foreground separation.'
  },
  {
    id: 'sample-neon-dance',
    name: 'Neon Dancer (Aesthetic)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-dancing-34444-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80',
    duration: 18,
    description: 'Vibrant neon lighting. Test spill suppression and high-contrast masking.'
  },
  {
    id: 'sample-tech-office',
    name: 'Tech Desk Work',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-42247-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80',
    duration: 10,
    description: 'Close-up workspace context. Great for blending onto new backgrounds.'
  }
];

export const STOCK_BACKGROUNDS: StockAsset[] = [
  // --- IMAGES ---
  {
    id: 'bg-office-1',
    name: 'Executive Boardroom',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80',
    category: 'Professional',
    isPremium: false
  },
  {
    id: 'bg-office-2',
    name: 'Cozy Loft Office',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=200&q=80',
    category: 'Professional',
    isPremium: false
  },
  {
    id: 'bg-cyberpunk',
    name: 'Neon Cyberpunk Server Room',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=200&q=80',
    category: 'Creative',
    isPremium: true
  },
  {
    id: 'bg-cafe',
    name: 'Sunlit Coffee Shop',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80',
    category: 'Cozy',
    isPremium: false
  },
  {
    id: 'bg-library',
    name: 'Majestic Archive Library',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=200&q=80',
    category: 'Cozy',
    isPremium: true
  },
  {
    id: 'bg-beach',
    name: 'Maldives Turquoise Beach',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    category: 'Travel',
    isPremium: false
  },
  {
    id: 'bg-tokyo',
    name: 'Tokyo Shinjuku Streets',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=200&q=80',
    category: 'Travel',
    isPremium: true
  },
  {
    id: 'bg-gradient-1',
    name: 'Aura Purple Gradient',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=200&q=80',
    category: 'Abstract',
    isPremium: false
  },
  {
    id: 'bg-gradient-2',
    name: 'Solar Glow Abstract',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=200&q=80',
    category: 'Abstract',
    isPremium: true
  },

  // --- VIDEOS ---
  {
    id: 'bg-vid-stars',
    name: 'Twinkling Cosmic Space',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
    category: 'Motion Backdrops',
    isPremium: false
  },
  {
    id: 'bg-vid-tunnel',
    name: 'Cyber Neon Tunnel Loop',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32219-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
    category: 'Motion Backdrops',
    isPremium: true
  },
  {
    id: 'bg-vid-particles',
    name: 'Golden Dust Particles',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-golden-dust-particles-flowing-40432-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=200&q=80',
    category: 'Motion Backdrops',
    isPremium: false
  },
  {
    id: 'bg-vid-clouds',
    name: 'Serene Sunset Clouds',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-fast-during-sunset-34289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=200&q=80',
    category: 'Atmospheric',
    isPremium: true
  }
];

export const FONTS = [
  { id: 'font-inter', name: 'Inter', value: 'var(--font-sans), sans-serif' },
  { id: 'font-space-grotesk', name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { id: 'font-mono', name: 'JetBrains Mono', value: 'var(--font-mono), monospace' },
  { id: 'font-serif', name: 'Playfair Display', value: '"Playfair Display", serif' },
  { id: 'font-impact', name: 'Impact Modern', value: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' }
];

export const STICKERS = [
  '🔥', '✨', '🔥', '💯', '🚀', '⭐', '❤️', '👀', '🎉', '💡',
  '😎', '💻', '🎬', '💥', '🔔', '📣', '👇', '🎯', '🌈', '⚡',
  '👑', '🎨', '💼', '🏡', '🏖️', '🍿', '🎧', '👾', '🌍', '🐱'
];

export const createDefaultProject = (id: string, name: string, sample: SampleVideo): Project => ({
  id,
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  folderId: null,
  duration: sample.duration,
  resolution: '720p',
  aspectRatio: '16:9',
  videoUrl: sample.url,
  originalVideoName: sample.name,
  settings: {
    mode: sample.id === 'sample-green-screen' ? 'chroma' : 'ai',
    chromaKeyColor: '#0cbf12', // standard green key target
    chromaTolerance: 35,
    chromaSimilarity: 20,
    feather: 8,
    maskErode: 1,
    maskDilate: 1,
    backgroundType: 'image',
    backgroundValue: 'bg-office-1',
    blurStrength: 0,
    foregroundScale: 1.0,
    foregroundX: 0,
    foregroundY: 0,
    foregroundRotate: 0,
    trimStart: 0,
    trimEnd: sample.duration,
    textOverlays: [],
    stickerOverlays: []
  }
});
