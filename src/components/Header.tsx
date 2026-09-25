import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Tv, 
  Users, 
  TrendingUp, 
  UploadCloud, 
  Loader2,
  Compass,
  Award
} from 'lucide-react';
import { AnalysisJob, ArtistProfile } from '../types';
import { StreakTracker } from './Header/StreakTracker';

interface HeaderProps {
  currentTab: 'studio' | 'lessons' | 'community' | 'profile';
  onTabChange: (tab: 'studio' | 'lessons' | 'community' | 'profile') => void;
  activeJob: AnalysisJob | null;
  onOpenUpload: () => void;
  profile: ArtistProfile;
  onOpenBadgesModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  activeJob,
  onOpenUpload,
  profile,
  onOpenBadgesModal
}) => {
  const isJobProcessing = activeJob && activeJob.status !== 'completed' && activeJob.status !== 'failed';

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <button 
            id="brand-logo-btn"
            onClick={() => onTabChange('studio')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center rounded-sm font-display font-bold text-sm tracking-tighter">
              A
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-neutral-900 block leading-tight">
                ATELIER
              </span>
              <span className="font-mono-code text-[10px] text-neutral-500 uppercase tracking-wider block">
                Strava para Artistas // AI Vision
              </span>
            </div>
          </button>

          {/* Background Job Progress Capsule */}
          {isJobProcessing && (
            <div 
              id="header-job-indicator"
              className="hidden xl:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-900"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span className="font-medium font-mono-code text-[11px]">
                {activeJob.statusMessage} ({activeJob.progressPercent}%)
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-studio"
            onClick={() => onTabChange('studio')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'studio'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Estúdio AI</span>
            <span className="sm:hidden">Estúdio</span>
          </button>

          <button
            id="nav-tab-lessons"
            onClick={() => onTabChange('lessons')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'lessons'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">Aulas & Trilhas</span>
            <span className="sm:hidden">Aulas</span>
          </button>

          <button
            id="nav-tab-community"
            onClick={() => onTabChange('community')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'community'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Comunidade</span>
            <span className="sm:hidden">Redlines</span>
          </button>

          <button
            id="nav-tab-profile"
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'profile'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Evolução</span>
            <span className="sm:hidden">Perfil</span>
          </button>
        </nav>

        {/* Right Section: Streak Tracker + Upload CTA */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Visual Progress & Streak Tracker Widget */}
          <StreakTracker
            profile={profile}
            onOpenBadgesModal={onOpenBadgesModal}
            onOpenProfile={() => onTabChange('profile')}
          />

          {/* Primary Action Button */}
          <button
            id="header-upload-cta"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs sm:text-sm font-medium rounded-md shadow-sm transition-all active:scale-[0.98]"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden md:inline">Enviar Obra</span>
            <span className="md:hidden">+</span>
          </button>
        </div>
      </div>
    </header>
  );
};

