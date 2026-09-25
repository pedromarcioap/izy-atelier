import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';
import { AnnualContributionDay, HistoricalStreak } from '../../types';

interface ContributionHeatmapProps {
  contributions: AnnualContributionDay[];
  historicalStreaks: HistoricalStreak[];
  currentStreak: number;
  longestStreak: number;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  contributions,
  historicalStreaks,
  currentStreak,
  longestStreak
}) => {
  const [hoveredDay, setHoveredDay] = useState<AnnualContributionDay | null>(null);
  const [selectedStreakFilter, setSelectedStreakFilter] = useState<string>('all');
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [activeIntensityFilter, setActiveIntensityFilter] = useState<number | null>(null);

  // Group 365 days into 52/53 columns of 7 days (Sunday = 0 to Saturday = 6)
  const { weeks, monthLabels, stats } = useMemo(() => {
    if (!contributions || contributions.length === 0) {
      return { weeks: [], monthLabels: [], stats: { totalActiveDays: 0, totalHours: 0, totalStudies: 0, consistencyPct: 0 } };
    }

    const weeksArray: (AnnualContributionDay | null)[][] = [];
    let currentWeek: (AnnualContributionDay | null)[] = [];

    // Identify first day's day of week to pad initial week
    const firstDate = new Date(`${contributions[0].date}T12:00:00Z`);
    const startDayOfWeek = firstDate.getUTCDay(); // 0 is Sun

    // Pad before first date
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    const monthPositions: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    contributions.forEach((day, index) => {
      const dateObj = new Date(`${day.date}T12:00:00Z`);
      const month = dateObj.getUTCMonth();

      if (month !== lastMonth) {
        lastMonth = month;
        const monthShort = dateObj.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' })
          .replace('.', '')
          .toUpperCase();
        monthPositions.push({
          label: monthShort,
          weekIndex: weeksArray.length
        });
      }

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArray.push(currentWeek);
    }

    // Compute annual stats
    let totalActiveDays = 0;
    let totalMinutes = 0;
    let totalStudies = 0;

    contributions.forEach((d) => {
      if (d.intensity > 0) {
        totalActiveDays++;
        totalMinutes += d.durationMinutes;
        totalStudies += d.count;
      }
    });

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const consistencyPct = Math.round((totalActiveDays / contributions.length) * 100);

    return {
      weeks: weeksArray,
      monthLabels: monthPositions,
      stats: {
        totalActiveDays,
        totalHours,
        totalStudies,
        consistencyPct,
        avgMinutes: totalActiveDays > 0 ? Math.round(totalMinutes / totalActiveDays) : 0
      }
    };
  }, [contributions]);

  // Color mapping matching Swiss minimalist aesthetic with clear emerald graduation
  const getIntensityColor = (intensity: number, isFilteredOut: boolean) => {
    if (isFilteredOut) return 'bg-neutral-100 opacity-25';
    switch (intensity) {
      case 1:
        return 'bg-emerald-200 hover:bg-emerald-300 border-emerald-300/40';
      case 2:
        return 'bg-emerald-400 hover:bg-emerald-500 border-emerald-500/40';
      case 3:
        return 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700/40';
      case 4:
        return 'bg-emerald-800 hover:bg-emerald-900 border-emerald-900/40';
      default:
        return 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200/60';
    }
  };

  const formatFullDate = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const getIntensityLabel = (intensity: number) => {
    switch (intensity) {
      case 1: return 'Sessão Rápida (15-40 min)';
      case 2: return 'Prática Regular (40-60 min)';
      case 3: return 'Estudo Aprofundado (60-90 min)';
      case 4: return 'Imersão de Ateliê (90+ min)';
      default: return 'Sem registro de prancheta';
    }
  };

  return (
    <div id="contribution-heatmap-section" className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header & Metrics Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider">
              Consistência de Ateliê // 365 Dias
            </span>
            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono-code text-[10px] font-bold">
              {stats.consistencyPct}% de Frequência
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neutral-800" />
            Mapa Anual de Prática e Horas na Prancheta
          </h3>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
            Cada célula representa um dia de desenho e pintura auditado pela IA. A intensidade da cor reflete o tempo dedicado e a complexidade do exercício.
          </p>
        </div>

        {/* Quick Annual Highlights */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-left">
            <span className="text-[10px] font-mono-code text-neutral-500 uppercase block">Dias Ativos</span>
            <span className="text-base font-display font-bold text-neutral-900">{stats.totalActiveDays} / 365</span>
          </div>
          <div className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-left">
            <span className="text-[10px] font-mono-code text-neutral-500 uppercase block">Horas Totais</span>
            <span className="text-base font-display font-bold text-neutral-900">{stats.totalHours} h</span>
          </div>
          <div className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-left">
            <span className="text-[10px] font-mono-code text-neutral-500 uppercase block">Estudos</span>
            <span className="text-base font-display font-bold text-neutral-900">{stats.totalStudies} pranchas</span>
          </div>
        </div>
      </div>

      {/* GitHub-Style Contribution Heatmap Matrix */}
      <div className="space-y-2">
        {/* Heatmap Outer Container with Horizontal Scroll for Small Screens */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="min-w-[780px]">
            {/* Month Labels Header */}
            <div className="flex text-[10px] font-mono-code text-neutral-400 mb-1.5 pl-7 select-none">
              {monthLabels.map((m, i) => (
                <div 
                  key={`${m.label}-${i}`} 
                  style={{ width: `${(100 / weeks.length) * 4.2}%` }}
                  className="truncate"
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid with Weekday Labels on Left */}
            <div className="flex gap-1.5 items-start">
              {/* Day of Week Labels (Seg, Qua, Sex) */}
              <div className="flex flex-col justify-between text-[9px] font-mono-code text-neutral-400 h-[98px] pr-1 select-none pt-2">
                <span>Seg</span>
                <span>Qua</span>
                <span>Sex</span>
              </div>

              {/* 52 Columns (Weeks) */}
              <div className="flex gap-1 flex-1">
                {weeks.map((week, weekIdx) => (
                  <div key={`week-${weekIdx}`} className="flex flex-col gap-1 flex-1">
                    {week.map((day, dayIdx) => {
                      if (!day) {
                        return (
                          <div 
                            key={`empty-${weekIdx}-${dayIdx}`} 
                            className="w-full aspect-square rounded-[2px] opacity-0"
                          />
                        );
                      }

                      const isFilteredOut = activeIntensityFilter !== null && day.intensity !== activeIntensityFilter;

                      return (
                        <div
                          key={day.date}
                          onMouseEnter={(e) => {
                            setHoveredDay(day);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                          }}
                          onMouseLeave={() => {
                            setHoveredDay(null);
                            setTooltipPos(null);
                          }}
                          className={`w-full aspect-square rounded-[2.5px] border cursor-pointer transition-transform hover:scale-125 hover:z-10 ${getIntensityColor(
                            day.intensity,
                            isFilteredOut
                          )}`}
                          title={`${day.date}: ${day.count} estudos (${day.durationMinutes}m)`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="font-mono-code text-[11px] text-neutral-500">Filtrar Intensidade:</span>
            <button
              onClick={() => setActiveIntensityFilter(null)}
              className={`px-2 py-0.5 rounded font-mono-code text-[10px] transition-colors ${
                activeIntensityFilter === null 
                  ? 'bg-neutral-900 text-white font-bold' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Todos
            </button>
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveIntensityFilter(activeIntensityFilter === lvl ? null : lvl)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-mono-code text-[10px] border transition-colors ${
                  activeIntensityFilter === lvl
                    ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-[1.5px] ${getIntensityColor(lvl, false)}`} />
                <span>Nvl {lvl}</span>
              </button>
            ))}
          </div>

          {/* Color Intensity Legend */}
          <div className="flex items-center gap-1.5 font-mono-code text-[11px] text-neutral-500">
            <span>Menos</span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-neutral-100 border border-neutral-200" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-200 border border-emerald-300" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-500" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 border border-emerald-700" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800 border border-emerald-900" />
            <span>Mais tempo</span>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card Preview (Hover Details) */}
      {hoveredDay && (
        <div className="bg-neutral-900 text-white p-3.5 rounded-lg text-xs font-mono-code shadow-xl border border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-bold text-neutral-100 capitalize">
                {formatFullDate(hoveredDay.date)}
              </span>
              <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                {getIntensityLabel(hoveredDay.intensity)}
              </span>
            </div>
            {hoveredDay.studies && hoveredDay.studies.length > 0 ? (
              <p className="text-neutral-300 text-[11px] font-sans">
                {hoveredDay.studies.join(' • ')}
              </p>
            ) : (
              <p className="text-neutral-400 text-[11px] font-sans">
                Dia de descanso ou estudo teórico sem upload de prancha.
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 text-right sm:border-l sm:border-neutral-700 sm:pl-4">
            <div>
              <span className="text-[10px] text-neutral-400 block">Tempo</span>
              <span className="font-bold text-white text-sm">{hoveredDay.durationMinutes} min</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">Pranchas</span>
              <span className="font-bold text-white text-sm">{hoveredDay.count}</span>
            </div>
          </div>
        </div>
      )}

      {/* Historical Streaks Tracker Section */}
      <div className="pt-4 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-0.5">
              Registro Histórico // Hall de Consistência
            </span>
            <h4 className="font-display font-bold text-base text-neutral-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              Sequências Históricas de Prancheta
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-500">
            <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-bold">
              Recorde: {longestStreak} dias
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded font-bold">
              Atual: {currentStreak} dias
            </span>
          </div>
        </div>

        {/* Historical Streaks Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {historicalStreaks.map((streak) => {
            const isActive = streak.status === 'active';
            const isRecord = streak.lengthDays === longestStreak;

            return (
              <div
                key={streak.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                    : isRecord
                    ? 'bg-purple-50/30 border-purple-200'
                    : 'bg-neutral-50/50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1.5 rounded ${
                      isActive 
                        ? 'bg-amber-500 text-white' 
                        : isRecord 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      <Flame className={`w-3.5 h-3.5 ${isActive ? 'fill-white' : ''}`} />
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm text-neutral-900 block leading-tight">
                        {streak.lengthDays} Dias Consecutivos
                      </span>
                      <span className="text-[10px] font-mono-code text-neutral-500">
                        {streak.startDate} - {streak.endDate}
                      </span>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded font-mono-code text-[9px] uppercase font-bold tracking-wider">
                      Ativa
                    </span>
                  ) : isRecord ? (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 rounded font-mono-code text-[9px] font-bold">
                      Recorde
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-neutral-700 mb-2 font-medium">
                  Foco: <span className="text-neutral-900 font-semibold">{streak.primaryFocus}</span>
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono-code text-neutral-500 pt-2 border-t border-neutral-200/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {streak.totalHours}h na prancheta
                  </span>
                  <span>{streak.studiesCount} estudos</span>
                </div>

                {streak.highlightBadge && (
                  <div className="mt-2 text-[10px] font-mono-code text-neutral-600 flex items-center gap-1 bg-white px-2 py-1 rounded border border-neutral-200">
                    <Award className="w-3 h-3 text-amber-500" />
                    <span className="truncate">{streak.highlightBadge}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
