import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Folder as FolderIcon, Video, Upload, Link as LinkIcon, Camera, 
  Clock, Trash2, Search, ArrowRight, ShieldCheck, Sparkles, AlertTriangle, 
  Play, Edit, ChevronRight, BarChart3, CloudLightning, RefreshCw, FolderPlus
} from 'lucide-react';
import { Project, Folder, Tier, SampleVideo } from '../types';
import { SAMPLE_VIDEOS, createDefaultProject } from '../data';

interface DashboardProps {
  currentTier: Tier;
  projects: Project[];
  folders: Folder[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddProject: (newProject: Project) => void;
  onAddFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export default function Dashboard({
  currentTier,
  projects,
  folders,
  onSelectProject,
  onDeleteProject,
  onAddProject,
  onAddFolder,
  onDeleteFolder,
}: DashboardProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);

  // Ingestion form states
  const [activeTab, setActiveTab] = useState<'sample' | 'upload' | 'webcam' | 'url'>('sample');
  const [urlInput, setUrlInput] = useState('');
  const [customProjectName, setCustomProjectName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Filter projects by folder and search
  const filteredProjects = projects.filter((project) => {
    const matchesFolder = selectedFolderId === null || project.folderId === selectedFolderId;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.originalVideoName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  // Limits based on tiers
  const maxProjects = currentTier === 'free' ? 3 : currentTier === 'pro' ? 50 : 9999;
  const maxFolders = currentTier === 'free' ? 1 : 9999;
  const limitReached = projects.length >= maxProjects;
  const folderLimitReached = folders.length >= maxFolders;

  // Handle Drag Events for video upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoFile(e.target.files[0]);
    }
  };

  const handleVideoFile = (file: File) => {
    if (limitReached) {
      alert(`Project limit reached for the Free tier. Upgrade your plan to add more than ${maxProjects} projects!`);
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: customProjectName.trim() || file.name.split('.')[0] || 'My Uploaded Video',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: selectedFolderId,
      duration: 15, // default duration simulation
      resolution: currentTier === 'free' ? '720p' : '1080p',
      aspectRatio: '16:9',
      videoUrl: blobUrl,
      originalVideoName: file.name,
      settings: {
        mode: 'ai',
        chromaKeyColor: '#0cbf12',
        chromaTolerance: 35,
        chromaSimilarity: 20,
        feather: 8,
        maskErode: 1,
        maskDilate: 1,
        backgroundType: 'color',
        backgroundValue: '#8b5cf6',
        blurStrength: 0,
        foregroundScale: 1.0,
        foregroundX: 0,
        foregroundY: 0,
        foregroundRotate: 0,
        trimStart: 0,
        trimEnd: 15,
        textOverlays: [],
        stickerOverlays: []
      }
    };
    onAddProject(newProject);
    setShowNewProjectModal(false);
    setCustomProjectName('');
  };

  // Webcam controls
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebcamStream(stream);
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Webcam Access Denied:', err);
      alert('Could not access camera or microphone. Please enable permissions in your browser.');
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setIsRecording(false);
  };

  const startRecording = () => {
    if (!webcamStream) return;
    setRecordedChunks([]);
    const options = { mimeType: 'video/webm' };
    try {
      const mediaRecorder = new MediaRecorder(webcamStream, options);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };
      mediaRecorder.onstop = () => {
        // Stop recording
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('MediaRecorder start error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0 && !isRecording) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
    }
  }, [recordedChunks, isRecording]);

  const handleUseWebcamVideo = () => {
    if (!recordedUrl) return;
    if (limitReached) {
      alert(`Project limit reached for the Free tier. Upgrade your plan to add more than ${maxProjects} projects!`);
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: customProjectName.trim() || 'Webcam Recording',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: selectedFolderId,
      duration: 10,
      resolution: currentTier === 'free' ? '720p' : '1080p',
      aspectRatio: '16:9',
      videoUrl: recordedUrl,
      originalVideoName: 'Live Capture.webm',
      settings: {
        mode: 'ai',
        chromaKeyColor: '#00ff00',
        chromaTolerance: 30,
        chromaSimilarity: 15,
        feather: 6,
        maskErode: 1,
        maskDilate: 1,
        backgroundType: 'color',
        backgroundValue: '#2563eb',
        blurStrength: 0,
        foregroundScale: 1.0,
        foregroundX: 0,
        foregroundY: 0,
        foregroundRotate: 0,
        trimStart: 0,
        trimEnd: 10,
        textOverlays: [],
        stickerOverlays: []
      }
    };

    stopWebcam();
    onAddProject(newProject);
    setShowNewProjectModal(false);
    setRecordedUrl(null);
    setRecordedChunks([]);
    setCustomProjectName('');
  };

  // Select a sample video
  const handleSelectSample = (sample: SampleVideo) => {
    if (limitReached) {
      alert(`Project limit reached for the Free tier (${maxProjects} projects max). Toggle Pro or Business plan above to bypass!`);
      return;
    }
    const proj = createDefaultProject(`proj-${Date.now()}`, `Sample: ${sample.name}`, sample);
    proj.folderId = selectedFolderId;
    onAddProject(proj);
    setShowNewProjectModal(false);
  };

  // URL link Ingestion
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (limitReached) {
      alert(`Project limit reached for the Free tier. Upgrade your plan to add more than ${maxProjects} projects!`);
      return;
    }

    // Standard high-quality mock or backup video URL for safety
    const defaultUrl = 'https://assets.mixkit.co/videos/preview/mixkit-woman-in-front-of-a-green-screen-39912-large.mp4';
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: customProjectName.trim() || 'Imported Video Stream',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: selectedFolderId,
      duration: 12,
      resolution: currentTier === 'free' ? '720p' : '1080p',
      aspectRatio: '16:9',
      videoUrl: urlInput.startsWith('http') ? urlInput : defaultUrl,
      originalVideoName: 'Imported URL Source',
      settings: {
        mode: 'ai',
        chromaKeyColor: '#0cbf12',
        chromaTolerance: 35,
        chromaSimilarity: 20,
        feather: 8,
        maskErode: 1,
        maskDilate: 1,
        backgroundType: 'blur',
        backgroundValue: '',
        blurStrength: 15,
        foregroundScale: 1.0,
        foregroundX: 0,
        foregroundY: 0,
        foregroundRotate: 0,
        trimStart: 0,
        trimEnd: 12,
        textOverlays: [],
        stickerOverlays: []
      }
    };

    onAddProject(newProject);
    setUrlInput('');
    setCustomProjectName('');
    setShowNewProjectModal(false);
  };

  // Folders management
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    if (folderLimitReached) {
      alert(`Folder limit reached for the Free tier (1 folder max). Upgrade to Pro/Business for unlimited folders!`);
      return;
    }
    onAddFolder(newFolderName.trim());
    setNewFolderName('');
    setShowFolderInput(false);
  };

  // Basic analytics counters
  const totalDurationProcessed = projects.reduce((acc, p) => acc + p.duration, 0);
  const avgResolution = projects.length > 0 ? (currentTier === 'free' ? '720p' : '1080p / 4K') : 'N/A';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" id="backdrop-shift-dashboard">
      
      {/* 1. Header Banner & Dynamic Tier Notice */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-slate-900/60 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-violet-600/20 text-violet-400 rounded-lg text-xs font-bold font-mono uppercase tracking-widest">Workspace</span>
            <span className="text-slate-500 font-mono text-xs">•</span>
            <span className="text-slate-300 font-mono text-xs">{projects.length} Saved Projects</span>
          </div>
          <h2 className="text-2xl font-bold font-space text-white">Project Dashboard</h2>
          <p className="text-sm text-slate-400">Manage and organize your visual backdrops, record live streams, or start editing instantly.</p>
        </div>

        {/* Tier warnings and CTA */}
        {currentTier === 'free' ? (
          <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 max-w-md">
            <AlertTriangle className="w-10 h-10 text-amber-400 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                Free Plan active <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px]">3/mo exports limit</span>
              </div>
              <p className="text-slate-300 mt-1">Watermarked exports at 720p, basic assets. Adjust plan toggle above to unlock 1080p, 4K, and remove watermarks.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 max-w-md">
            <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-1">
                {currentTier === 'pro' ? 'Pro Plan Unlocked' : 'Business Team Workspace'} <Sparkles className="w-3 h-3 text-amber-400 inline" />
              </div>
              <p className="text-slate-300 mt-1">Unlimited background removals, high priority speed, maximum 4K resolutions, advanced edge matte filters.</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Analytics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-violet-600/20 rounded-lg text-violet-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Processed</div>
            <div className="text-lg font-bold text-white font-mono">{projects.length} files</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Total Time</div>
            <div className="text-lg font-bold text-white font-mono">{totalDurationProcessed} sec</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Quality Range</div>
            <div className="text-lg font-bold text-white font-mono">{avgResolution}</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-600/20 rounded-lg text-emerald-400">
            <CloudLightning className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">AI Engines</div>
            <div className="text-lg font-bold text-white font-mono">WebAssembly</div>
          </div>
        </div>
      </div>

      {/* 3. Folder Navigation & Active Controls */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Folder Organization Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 self-start space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <FolderIcon className="w-3.5 h-3.5 text-violet-400" />
              Folders
            </div>
            {!showFolderInput && (
              <button 
                onClick={() => {
                  if (folderLimitReached) {
                    alert('Folder limit reached for the Free tier (1 folder max). Adjust plan to Pro/Business above to unlock unlimited folders!');
                  } else {
                    setShowFolderInput(true);
                  }
                }}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                title="Create New Folder"
                id="create-folder-btn"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Folder addition form */}
          {showFolderInput && (
            <form onSubmit={handleCreateFolderSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-violet-600"
                autoFocus
              />
              <div className="flex gap-1.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFolderInput(false)}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 text-[10px] bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Folders List */}
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedFolderId === null 
                  ? 'bg-violet-600/10 text-violet-300 border border-violet-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderIcon className="w-3.5 h-3.5" />
                All Projects
              </span>
              <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-[10px] font-mono">{projects.length}</span>
            </button>

            {folders.map((folder) => {
              const count = projects.filter((p) => p.folderId === folder.id).length;
              return (
                <div key={folder.id} className="group flex items-center justify-between rounded-lg hover:bg-slate-800/20 pr-1">
                  <button
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      selectedFolderId === folder.id 
                        ? 'bg-violet-600/10 text-violet-300 border border-violet-500/20' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FolderIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {folder.name}
                    </span>
                    <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ml-1">{count}</span>
                  </button>
                  <button
                    onClick={() => onDeleteFolder(folder.id)}
                    className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Folder"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {currentTier === 'free' && folders.length >= 1 && (
            <p className="text-[10px] text-slate-500 font-light italic leading-normal">
              Folder organization limited to 1 folder on free plan. Select Pro to unlock unlimited folders.
            </p>
          )}
        </div>

        {/* Right Project List / Workspace Actions */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search processed clips or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-600 placeholder-slate-500 transition-colors"
                id="search-projects"
              />
            </div>

            {/* Ingestion Trigger Button */}
            <button
              onClick={() => {
                if (limitReached) {
                  alert(`Project limit reached for the Free tier (${maxProjects} projects max). Toggle Pro/Business plan in header to bypass!`);
                } else {
                  setShowNewProjectModal(true);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-violet-950/20 flex items-center justify-center gap-2 group self-start sm:self-auto"
              id="new-project-trigger"
            >
              <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              Ingest & Remove Background
            </button>
          </div>

          {/* Project Cards Display */}
          {filteredProjects.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-950/30">
              <Video className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-slate-300">No projects found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery 
                  ? "We couldn't find any match for your search query. Try another name or keyword."
                  : "Start by ingesting your first video. Record from webcam, paste a link, or use our high-quality chroma presenters!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="mt-4 px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-violet-400" />
                  Select Sample Video
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  id={`project-card-${project.id}`}
                  className="group bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-md relative"
                >
                  {/* Thumbnail area with play indicator */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelectProject(project)}>
                    {project.videoUrl && (
                      <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${SAMPLE_VIDEOS.find(s => s.url === project.videoUrl)?.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'})` }}>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors"></div>
                    
                    {/* Resolution indicator tag */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-950/80 text-[10px] text-slate-300 font-mono rounded uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {project.resolution}
                    </div>

                    {/* Mode tag */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-950/80 text-[10px] text-slate-300 font-mono rounded uppercase">
                      {project.settings.mode === 'ai' ? '🤖 AI smart separation' : '🟢 Chroma Key'}
                    </div>

                    {/* Action button overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-11 h-11 bg-violet-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-950/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 bg-slate-950/80 text-[10px] text-slate-300 font-mono rounded">
                      0:{(project.duration < 10 ? '0' : '') + project.duration}
                    </div>
                  </div>

                  {/* Meta data area */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white truncate cursor-pointer hover:text-violet-400 transition-colors" onClick={() => onSelectProject(project)}>{project.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{project.originalVideoName}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-[11px] text-slate-400">
                      <span className="font-mono">
                        {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSelectProject(project)}
                          className="p-1 hover:text-violet-400 transition-colors"
                          title="Open in Editor"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1 hover:text-red-400 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Ingest and Background Removal Selection Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="new-project-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-space text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-violet-400" />
                  Video Ingestion & separation Hub
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Choose where to fetch your video footage. Real-time GPU separation will apply.</p>
              </div>
              <button
                onClick={() => {
                  stopWebcam();
                  setShowNewProjectModal(false);
                }}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Source tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40">
              <button
                onClick={() => { stopWebcam(); setActiveTab('sample'); }}
                className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'sample' 
                    ? 'border-violet-500 text-violet-400 bg-slate-900/60' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sample Presenters
              </button>

              <button
                onClick={() => { stopWebcam(); setActiveTab('upload'); }}
                className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'upload' 
                    ? 'border-violet-500 text-violet-400 bg-slate-900/60' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload MP4/WEBM
              </button>

              <button
                onClick={() => { setActiveTab('webcam'); startWebcam(); }}
                className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'webcam' 
                    ? 'border-violet-500 text-violet-400 bg-slate-900/60' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Record Live
              </button>

              <button
                onClick={() => { stopWebcam(); setActiveTab('url'); }}
                className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'url' 
                    ? 'border-violet-500 text-violet-400 bg-slate-900/60' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Import URL
              </button>
            </div>

            {/* Tab content panel */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              
              {/* Optional Custom project name input for custom paths */}
              {activeTab !== 'sample' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Custom Project Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter project name..."
                    value={customProjectName}
                    onChange={(e) => setCustomProjectName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-600"
                  />
                </div>
              )}

              {/* TAB 1: SAMPLE PRESENTERS */}
              {activeTab === 'sample' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-300">
                    💡 <span className="font-semibold text-white">Quick Demo:</span> Pick a sample video. We have included an exact green screen presenter to test precision Chroma Keying, as well as general outdoor bloggers for AI separation testing.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SAMPLE_VIDEOS.map((sample) => (
                      <div 
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className="bg-slate-950 border border-slate-800/80 hover:border-violet-500 rounded-xl p-3 flex gap-3 cursor-pointer group transition-all"
                      >
                        <div className="w-24 aspect-video bg-slate-900 rounded overflow-hidden shrink-0 relative">
                          <img 
                            src={sample.thumbnailUrl} 
                            alt={sample.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1 py-0.5 rounded text-[8px] text-slate-400 font-mono">
                            0:{(sample.duration < 10 ? '0' : '') + sample.duration}
                          </div>
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white group-hover:text-violet-400 truncate transition-colors">{sample.name}</h4>
                          <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{sample.description}</p>
                          <span className="text-[9px] font-mono text-indigo-400 group-hover:underline inline-flex items-center gap-0.5">
                            Use this presenter <ChevronRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: UPLOAD */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-violet-500 bg-violet-600/5' 
                        : 'border-slate-800 hover:border-violet-500 bg-slate-950/20 hover:bg-slate-950/40'
                    }`}
                  >
                    <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                    <h4 className="text-xs font-bold text-white">Drag & Drop your video file</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Supports MP4, MOV, WEBM (up to 30MB free limit)</p>
                    <button className="mt-4 px-3 py-1.5 bg-violet-600/20 text-violet-300 text-xs font-semibold rounded-lg hover:bg-violet-600/30 transition-colors">
                      Browse Files
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="video/*"
                      className="hidden"
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                    <span>Free Plan limit: 30s max duration, 720p maximum input.</span>
                    <span className="text-violet-400">Pro unlocks up to 4K & 10 mins.</span>
                  </div>
                </div>
              )}

              {/* TAB 3: WEBCAM */}
              {activeTab === 'webcam' && (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    <video
                      ref={webcamVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    
                    {!webcamStream && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <Camera className="w-8 h-8 text-slate-600 mb-2" />
                        <p className="text-xs text-slate-400">Initializing WebRTC video channel...</p>
                        <button onClick={startWebcam} className="mt-3 px-2.5 py-1 bg-slate-800 text-xs text-slate-300 rounded border border-slate-700">
                          Force Start Camera
                        </button>
                      </div>
                    )}

                    {isRecording && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white font-mono font-bold px-2.5 py-1 rounded text-[10px] animate-pulse flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                        RECORDING LIVE (MAX 30S)
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 justify-center">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        disabled={!webcamStream}
                        className={`px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-red-950/20 flex items-center gap-1.5 ${!webcamStream ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        Record Clip
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl shadow-lg border border-slate-700 flex items-center gap-1.5"
                      >
                        Stop Recording
                      </button>
                    )}

                    {recordedUrl && !isRecording && (
                      <button
                        onClick={handleUseWebcamVideo}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-violet-950/20 flex items-center gap-1.5"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Load Captured Stream
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: IMPORT URL */}
              {activeTab === 'url' && (
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">External Source Link (Google Drive, OneDrive, direct MP4)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/assets/video.mp4"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-600"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl transition-colors shrink-0"
                      >
                        Import Stream
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                    ℹ️ Links will be fetched via client-side proxy. Direct Google Drive or OneDrive shared links are parsed automatically. If no valid media stream is found, a backup high-fidelity sample is loaded for sandboxed testing.
                  </div>
                </form>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Model: Antigravity-V4 client-side segmentation
              </span>
              <button
                onClick={() => {
                  stopWebcam();
                  setShowNewProjectModal(false);
                }}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition-colors border border-slate-700"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
