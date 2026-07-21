import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import { Project, Folder, Tier } from './types';
import { SAMPLE_VIDEOS, createDefaultProject } from './data';

// --- Default Data for Cold Start Prevention ---
const DEFAULT_FOLDERS: Folder[] = [
  { id: 'folder-socials', name: '🎥 Social Content Marketing', createdAt: new Date().toISOString() }
];

const getDefaultProjects = (): Project[] => [
  {
    ...createDefaultProject('proj-default-green', 'Tutorial: Chroma Key Extraction', SAMPLE_VIDEOS[0]),
    folderId: 'folder-socials'
  },
  {
    ...createDefaultProject('proj-default-smart', 'Sandbox: AI Foreground Separation', SAMPLE_VIDEOS[1]),
    folderId: null
  }
];

export default function App() {
  // Global States
  const [currentTier, setCurrentTier] = useState<Tier>('free');
  const [projects, setProjects] = useState<Project[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load from local storage or set defaults
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('backdrop_shift_projects_v1');
      const storedFolders = localStorage.getItem('backdrop_shift_folders_v1');
      const storedTier = localStorage.getItem('backdrop_shift_tier_v1');

      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        const defProj = getDefaultProjects();
        setProjects(defProj);
        localStorage.setItem('backdrop_shift_projects_v1', JSON.stringify(defProj));
      }

      if (storedFolders) {
        setFolders(JSON.parse(storedFolders));
      } else {
        setFolders(DEFAULT_FOLDERS);
        localStorage.setItem('backdrop_shift_folders_v1', JSON.stringify(DEFAULT_FOLDERS));
      }

      if (storedTier) {
        setCurrentTier(storedTier as Tier);
      }
    } catch (e) {
      console.error('Failed to load storage state', e);
      // fallback
      setProjects(getDefaultProjects());
      setFolders(DEFAULT_FOLDERS);
    }
  }, []);

  // Save changes to localStorage on updates
  const saveProjectsToStorage = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('backdrop_shift_projects_v1', JSON.stringify(updatedProjects));
  };

  const saveFoldersToStorage = (updatedFolders: Folder[]) => {
    setFolders(updatedFolders);
    localStorage.setItem('backdrop_shift_folders_v1', JSON.stringify(updatedFolders));
  };

  // Tier switches
  const handleTierChange = (tier: Tier) => {
    setCurrentTier(tier);
    localStorage.setItem('backdrop_shift_tier_v1', tier);
  };

  // Add Project
  const handleAddProject = (newProject: Project) => {
    const updated = [newProject, ...projects];
    saveProjectsToStorage(updated);
    setSelectedProject(newProject); // automatically open newly added project!
  };

  // Update Project settings
  const handleUpdateProject = (updatedProject: Project) => {
    const updated = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    saveProjectsToStorage(updated);
    setSelectedProject(updatedProject);
  };

  // Delete Project
  const handleDeleteProject = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    saveProjectsToStorage(updated);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  // Folders management
  const handleAddFolder = (name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      createdAt: new Date().toISOString()
    };
    const updated = [...folders, newFolder];
    saveFoldersToStorage(updated);
  };

  const handleDeleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    saveFoldersToStorage(updatedFolders);

    // Re-route projects within that folder to "all" (unassigned)
    const updatedProjects = projects.map((p) => 
      p.folderId === folderId ? { ...p, folderId: null } : p
    );
    saveProjectsToStorage(updatedProjects);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="app-root-container">
      {/* Top Main Navigation Bar */}
      <Header 
        currentTier={currentTier} 
        onTierChange={handleTierChange} 
        projectCount={projects.length}
      />

      {/* Primary Workspace View Router */}
      <main className="flex-1 flex flex-col min-h-0">
        {selectedProject ? (
          <Workspace
            currentTier={currentTier}
            project={selectedProject}
            onBackToDashboard={() => setSelectedProject(null)}
            onUpdateProject={handleUpdateProject}
          />
        ) : (
          <Dashboard
            currentTier={currentTier}
            projects={projects}
            folders={folders}
            onSelectProject={setSelectedProject}
            onDeleteProject={handleDeleteProject}
            onAddProject={handleAddProject}
            onAddFolder={handleAddFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        )}
      </main>
    </div>
  );
}
