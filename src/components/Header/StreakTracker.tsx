import React, { useState, useRef, useEffect } from 'react';
import {
  Flame,
  Award,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import { ArtistProfile } from '../../types';

interface StreakTrackerProps {
  profile: ArtistProfile;
  onOpenBadgesModal: () => void;
  onOpenProfile: () => void;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  profile,
  onOpenBadgesModal,
  onOpenProfile
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentStreakDays, longestStreakDays, weeklyActivity, badges } = profile;
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Positive reinforcement quotes rotation based on streak
  const getReinforcementMessage = (days: number) => {
    if (days >= 14) {
      return '14 dias consecutivos! Seu traço ganha firmeza geométrica e precisão visual a cada sessão.';
    }
    if (days >= 7) {
      return '1 semana de consistência! A memória muscular está se consolidando com excelência.';
    }
    return 'Cada dia na prancheta eleva sua percepção de proporção e valores tonais.';
  };

  const nextMilestone = currentStreakDays < 7 ? 7 : currentStreakDays < 14 ? 14 : currentStreakDays < 21 ? 21 : 30;
  const daysRemaining = nextMilestone - currentStreakDays;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Header Pill Button */}
      <button
        id="header-streak-tracker-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 text-amber-950 rounded-full transition-all group shadow-2xs active:scale-[0.98]"
        title="Sequência de Prancheta Ativa e Conquistas"
      >
        <div className="relative flex items-center justify-center">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-amber-950">
            {currentStreakDays}
          </span>
          <span className="text-[11px] font-mono-code font-semibold text-amber-800 hidden md:inline">
            dias
          </span>
        </div>

        {/* Mini 7-day dot indicators on wider screens */}
        <div className="hidden lg:flex items-center gap-1 pl-1 border-l border-amber-200/70">
          {weeklyActivity.slice(-5).map((day, idx) => (
            <span
              key={idx}
              title={`${day.dayName}: ${day.completed ? 'Prática Concluída' : 'Pendente'}`}
              className={`w-1.5 h-1.5 rounded-full ${
                day.completed
                  ? 'bg-amber-600'
                  : 'bg-amber-200'
              }`}
            />
          ))}
        </div>

        {/* Badge counter pill */}
        <div className="flex items-center gap-1 pl-1.5 border-l border-amber-200/70 text-amber-800 text-[10px] font-mono-code font-bold">
          <Award className="w-3 h-3 text-amber-700" />
          <span>{unlockedBadgesCount}</span>
        </div>
      </button>

      {/* Expanded Progress & Reinforcement Popover */}
      {isOpen && (
        <div
          id="streak-popover-panel"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-xl shadow-2xl z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          {/* Popover Header */}
          <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-white rounded-lg shadow-xs">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-neutral-900">
                    {currentStreakDays} Dias de Prancheta
                  </h3>
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-mono-code text-[10px] font-bold">
                    Ativo Hoje
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono-code">
                  Recorde pessoal: {longestStreakDays} dias seguidos
                </p>
              </div>
            </div>
          </div>

          {/* Positive Reinforcement Editorial Box */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-relaxed text-neutral-700 font-sans">
            <div className="flex items-center gap-1.5 text-neutral-900 font-semibold mb-1 font-mono-code text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Estímulo de Ateliê</span>
            </div>
            <p className="text-[11px] text-neutral-600">
              {getReinforcementMessage(currentStreakDays)}
            </p>
          </div>

          {/* Weekly Practice Track (7 Days) */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono-code text-neutral-500 mb-2">
              <span className="uppercase tracking-wider">Ciclo Semanal</span>
              <span className="text-neutral-700 font-semibold">7/7 dias concluídos</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weeklyActivity.map((day) => (
                <div
                  key={day.dayName}
                  className={`p-1.5 rounded border transition-all ${
                    day.isToday
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : day.completed
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                  }`}
                >
                  <span className="block text-[10px] font-mono-code font-bold uppercase">
                    {day.dayName}
                  </span>
                  <div className="mt-1 flex justify-center">
                    {day.completed ? (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${day.isToday ? 'text-amber-400' : 'text-emerald-600'}`} />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-300" />
                    )}
                  </div>
                  <span className="block text-[9px] font-mono-code mt-0.5 opacity-80">
                    {day.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Milestone Bar */}
          <div className="space-y-1.5 pt-1 border-t border-neutral-100">
            <div className="flex items-center justify-between text-[11px] font-mono-code">
              <span className="text-neutral-600">
                Próximo Marco: {nextMilestone} Dias
              </span>
              <span className="font-bold text-neutral-900">
                {daysRemaining === 0 ? 'Meta Atingida!' : `Faltam ${daysRemaining} dia${daysRemaining !== 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.min(100, (currentStreakDays / nextMilestone) * 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
            <button
              id="popover-view-badges-btn"
              onClick={() => {
                setIsOpen(false);
                onOpenBadgesModal();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Ver Badges ({unlockedBadgesCount}/{badges.length})</span>
            </button>

            <button
              id="popover-view-profile-btn"
              onClick={() => {
                setIsOpen(false);
                onOpenProfile();
              }}
              className="flex items-center gap-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-medium transition-colors"
              title="Abrir página de Evolução"
            >
              <TrendingUp className="w-3.5 h-3.5 text-neutral-600" />
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
