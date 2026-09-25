import React, { useState } from 'react';
import {
  X,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Target,
  Trophy,
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { ArtistProfile, ArtistBadge, DailyMission } from '../../types';
import { BadgeIcon } from './BadgeIcon';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ArtistProfile;
  onSelectTab?: (tab: 'studio' | 'lessons' | 'community' | 'profile') => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<ArtistBadge | null>(null);

  if (!isOpen) return null;

  const { badges, dailyMissions, level, currentXp, nextLevelXp, currentStreakDays, longestStreakDays } = profile;

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const unlockPercentage = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: 'all', label: 'Todos os Badges' },
    { id: 'streak', label: 'Sequência & Hábito' },
    { id: 'rubrics', label: 'Rubricas & IA' },
    { id: 'mastery', label: 'Mestria & Horas' },
    { id: 'community', label: 'Comunidade' },
    { id: 'lessons', label: 'Aulas & Missões' }
  ];

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  const xpPercentage = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        id="badges-collection-modal"
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-900 text-white rounded-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-neutral-900">
                  Coleção de Conquistas & Insígnias
                </h2>
                <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono-code font-bold uppercase rounded">
                  {unlockedCount}/{totalCount} Desbloqueados ({unlockPercentage}%)
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Reconhecimento por consistência diária, domínio técnico e colaboração
              </p>
            </div>
          </div>
          <button
            id="close-badges-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level & XP Strip */}
        <div className="px-6 py-3 bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-white text-neutral-950 font-display font-bold flex items-center justify-center text-sm shadow">
              Nv.{level}
            </div>
            <div>
              <span className="font-semibold block text-neutral-100">
                Artista de Ateliê Nível {level}
              </span>
              <span className="text-[11px] text-neutral-400 font-mono-code">
                {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP ({nextLevelXp - currentXp} XP para o Nível {level + 1})
              </span>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Daily Missions Widget */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-neutral-700" />
                <h3 className="font-display font-bold text-xs sm:text-sm text-neutral-900">
                  Missões Diárias de Prancheta
                </h3>
              </div>
              <span className="font-mono-code text-[11px] text-neutral-500">
                {dailyMissions.filter((m) => m.completed).length}/{dailyMissions.length} Concluídas Hoje
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dailyMissions.map((mission) => {
                const isDone = mission.completed;
                return (
                  <div
                    key={mission.id}
                    className={`p-3 rounded border transition-all ${
                      isDone
                        ? 'bg-white border-neutral-300 text-neutral-900'
                        : 'bg-white/80 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-neutral-300 flex-shrink-0" />
                        )}
                        <span className={`text-xs font-semibold ${isDone ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                          {mission.title}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 font-mono-code text-[10px] font-bold rounded flex-shrink-0">
                        +{mission.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 pl-6">
                      {mission.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBadges.map((badge) => {
              const isSelected = selectedBadge?.id === badge.id;
              const progressPct = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

              return (
                <div
                  key={badge.id}
                  id={`badge-card-${badge.id}`}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-neutral-900 ring-2 ring-neutral-900/10 bg-neutral-50/50'
                      : badge.unlocked
                      ? 'border-neutral-200 hover:border-neutral-300 bg-white shadow-xs'
                      : 'border-neutral-200/80 bg-neutral-50/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <BadgeIcon badge={badge} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {badge.title}
                        </h4>
                        <span className={`text-[10px] uppercase font-mono-code font-bold px-1.5 py-0.2 rounded ${
                          badge.tier === 'diamante'
                            ? 'bg-neutral-900 text-white'
                            : badge.tier === 'ouro'
                            ? 'bg-amber-100 text-amber-900'
                            : badge.tier === 'prata'
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}>
                          {badge.tier}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress & Status */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-[10px] font-mono-code">
                      <span className="text-neutral-500">
                        {badge.unlocked ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Desbloqueado ({badge.unlockedAt})
                          </span>
                        ) : (
                          <span className="text-neutral-600">
                            Progresso: {badge.progress}/{badge.maxProgress}
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-neutral-800">
                        +{badge.xpReward} XP
                      </span>
                    </div>

                    {!badge.unlocked && (
                      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Badge Detail Banner if clicked */}
          {selectedBadge && (
            <div className="p-4 bg-neutral-900 text-white rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <BadgeIcon badge={selectedBadge} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm text-white">
                      {selectedBadge.title}
                    </h4>
                    <span className="px-2 py-0.5 bg-white/20 text-neutral-200 text-[10px] font-mono-code uppercase rounded">
                      Nível {selectedBadge.tier}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {selectedBadge.description}
                  </p>
                  <p className="text-[11px] text-amber-300 font-mono-code mt-1">
                    Requisito: {selectedBadge.requirement}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {selectedBadge.unlocked ? (
                  <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Conquista Obtida
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs font-mono-code rounded border border-neutral-700">
                    Em Progresso ({Math.round((selectedBadge.progress / selectedBadge.maxProgress) * 100)}%)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-500 font-mono-code text-[11px]">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Sequência atual: {currentStreakDays} dias seguidos (Recorde: {longestStreakDays} dias)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded font-semibold transition-colors"
          >
            Fechar Coleção
          </button>
        </div>
      </div>
    </div>
  );
};
