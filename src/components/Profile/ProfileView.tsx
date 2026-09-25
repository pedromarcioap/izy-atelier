import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Award, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { ArtistProfile } from '../../types';
import { BadgeIcon } from '../Badges/BadgeIcon';
import { ContributionHeatmap } from './ContributionHeatmap';

interface ProfileViewProps {
  profile: ArtistProfile;
  onOpenStudy: (title: string) => void;
  onOpenBadgesModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onOpenStudy,
  onOpenBadgesModal
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage for before/after comparison

  const { attributeScores, badges, dailyMissions, level, currentXp, nextLevelXp, currentStreakDays, longestStreakDays } = profile;
  const unlockedBadges = badges.filter((b) => b.unlocked);

  // Radar chart mathematical points computation (6 axes, SVG polygon)
  const center = 140;
  const radius = 100;
  const axes = [
    { label: 'Proporção', score: attributeScores.proporcao, angle: 0 },
    { label: 'Perspectiva', score: attributeScores.perspectiva, angle: 60 },
    { label: 'Valores', score: attributeScores.valores, angle: 120 },
    { label: 'Traço', score: attributeScores.traco, angle: 180 },
    { label: 'Cores', score: attributeScores.cores, angle: 240 },
    { label: 'Velocidade', score: attributeScores.velocidade, angle: 300 },
  ];

  // Convert polar coordinates to Cartesian
  const getCoordinates = (angleDeg: number, value: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    };
  };

  const polygonPoints = axes
    .map((axis) => {
      const { x, y } = getCoordinates(axis.angle, axis.score);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div id="profile-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header (Swiss Editorial) */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-neutral-900 shadow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-neutral-900">
                {profile.name}
              </h1>
              <span className="px-2 py-0.5 bg-neutral-900 text-white rounded font-mono-code text-[10px] uppercase">
                Ateliê Pro Nv.{level}
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-mono-code block mt-0.5">
              {profile.handle}
            </span>
            <p className="text-xs text-neutral-600 mt-2 max-w-xl leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Strava Streak & Badges Widget */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-stretch md:self-auto">
          {/* Streak Card */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg flex-1 sm:flex-initial">
            <div className="p-2 bg-amber-500 text-white rounded-md">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl text-amber-950 block leading-tight">
                {currentStreakDays} dias
              </span>
              <span className="text-[11px] font-mono-code text-amber-800 uppercase tracking-wide">
                Sequência Ativa ({longestStreakDays} max)
              </span>
            </div>
          </div>

          {/* Badges Counter CTA */}
          <button
            id="profile-open-badges-btn"
            onClick={onOpenBadgesModal}
            className="flex items-center justify-between gap-3 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-3 rounded-lg shadow-xs transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-neutral-800 text-amber-300 rounded-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl block leading-tight">
                  {unlockedBadges.length} / {badges.length}
                </span>
                <span className="text-[11px] font-mono-code text-neutral-300 uppercase tracking-wide">
                  Badges & Conquistas
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Strava Athlete Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Clock className="w-4 h-4 text-neutral-700" />
            <span className="text-[11px] font-mono-code uppercase">Horas Acumuladas</span>
          </div>
          <span className="font-display font-bold text-2xl text-neutral-900">
            {profile.totalPracticeHours} h
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono-code">
            +3.5h nesta semana
          </span>
        </div>

        <div className="bg-white border border-neutral-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-mono-code uppercase">Estudos Concluídos</span>
          </div>
          <span className="font-display font-bold text-2xl text-neutral-900">
            {profile.studiesCompleted}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono-code">
            Auditados pelo Vision AI
          </span>
        </div>

        <div className="bg-white border border-neutral-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-mono-code uppercase">Redlines Oferecidas</span>
          </div>
          <span className="font-display font-bold text-2xl text-neutral-900">
            {profile.peerReviewsGiven}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono-code">
            Colaboração comunitária
          </span>
        </div>

        <div className="bg-white border border-neutral-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] font-mono-code uppercase">Média Técnica Global</span>
          </div>
          <span className="font-display font-bold text-2xl text-neutral-900">
            83 / 100
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono-code">
            Nível Sólido / Avançado
          </span>
        </div>
      </div>

      {/* Badges Showcase & Daily Missions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badges Showcase (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-0.5">
                  Conquistas em Destaque
                </span>
                <h3 className="font-display font-bold text-base text-neutral-900">
                  Insígnias & Marcos de Ateliê
                </h3>
              </div>
              <button
                onClick={onOpenBadgesModal}
                className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 font-mono-code"
              >
                <span>Ver Todos ({unlockedBadges.length}/{badges.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 mb-4">
              Cada insígnia representa horas dedicadas na prancheta, superação de metas técnicas e contribuições de redline.
            </p>

            {/* Badges Grid Carousel / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.slice(0, 8).map((b) => (
                <div
                  key={b.id}
                  onClick={onOpenBadgesModal}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                    b.unlocked
                      ? 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-400 hover:bg-white'
                      : 'bg-neutral-50/30 border-neutral-100 opacity-60'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <BadgeIcon badge={b} size="md" />
                  </div>
                  <h4 className="text-[11px] font-bold text-neutral-900 truncate">
                    {b.title}
                  </h4>
                  <span className="text-[9px] font-mono-code text-neutral-500 block mt-0.5">
                    {b.unlocked ? `+${b.xpReward} XP` : `${b.progress}/${b.maxProgress}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono-code text-neutral-500">
            <span>Sequência atual: {currentStreakDays} dias seguidos</span>
            <button
              onClick={onOpenBadgesModal}
              className="font-bold text-neutral-900 hover:underline"
            >
              Explorar Coleção Completa →
            </button>
          </div>
        </div>

        {/* Daily Missions & Weekly Tracker (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-0.5">
                  Metas Diárias & Semanais
                </span>
                <h3 className="font-display font-bold text-base text-neutral-900">
                  Missões de Hoje
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono-code text-xs font-bold">
                {dailyMissions.filter((m) => m.completed).length}/{dailyMissions.length} Concluídas
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {dailyMissions.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded border text-xs flex items-start justify-between gap-2 ${
                    m.completed
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
                      : 'bg-white border-neutral-200 text-neutral-600'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`font-semibold block ${m.completed ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                        {m.title}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        {m.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-code font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded flex-shrink-0">
                    +{m.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between text-[11px] font-mono-code text-neutral-500 mb-1.5">
              <span>Nível de Ateliê: Nv.{level}</span>
              <span>{currentXp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 rounded-full"
                style={{ width: `${Math.round((currentXp / nextLevelXp) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GitHub/Strava-Style Annual Studio Practice Contribution Heatmap & Historical Streaks */}
      <ContributionHeatmap
        contributions={profile.annualContributions}
        historicalStreaks={profile.historicalStreaks}
        currentStreak={profile.currentStreakDays}
        longestStreak={profile.longestStreakDays}
      />

      {/* Main Grid: Radar Chart & Before/After Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart: Technical Attributes (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
              Polígono de Habilidades // 6 Eixos
            </span>
            <h3 className="font-display font-bold text-base text-neutral-900">
              Radar de Maestria Técnica
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Média ponderada baseada nos diagnósticos automatizados do AI Vision Core.
            </p>
          </div>

          {/* SVG Radar Visualization */}
          <div className="py-4 flex justify-center items-center">
            <svg width="280" height="280" className="overflow-visible">
              {/* Concentric Reference Circles (20%, 40%, 60%, 80%, 100%) */}
              {[20, 40, 60, 80, 100].map((level) => (
                <circle
                  key={level}
                  cx={center}
                  cy={center}
                  r={(level / 100) * radius}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray={level === 100 ? 'none' : '3 3'}
                />
              ))}

              {/* Axis Spoke Lines */}
              {axes.map((axis) => {
                const { x, y } = getCoordinates(axis.angle, 100);
                return (
                  <line
                    key={axis.label}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#D1D5DB"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data Filled Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(24, 24, 27, 0.15)"
                stroke="#18181B"
                strokeWidth="2"
              />

              {/* Axis Points & Labels */}
              {axes.map((axis) => {
                const { x, y } = getCoordinates(axis.angle, axis.score);
                const labelCoord = getCoordinates(axis.angle, 122);
                return (
                  <g key={axis.label}>
                    {/* Node Dot */}
                    <circle cx={x} cy={y} r="4" fill="#18181B" />

                    {/* Label Text */}
                    <text
                      x={labelCoord.x}
                      y={labelCoord.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono-code text-[10px] fill-neutral-700 font-semibold"
                    >
                      {axis.label} ({axis.score})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Attribute Scores Pills */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-neutral-100 text-center font-mono-code text-[10px]">
            {axes.map((a) => (
              <div key={a.label} className="p-1.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block">{a.label}</span>
                <span className="font-bold text-neutral-900">{a.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Before & After Slider: 8-Week Evolution (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                  Linha do Tempo de Evolução
                </span>
                <h3 className="font-display font-bold text-base text-neutral-900">
                  Comparativo Antes vs Depois (Evolução Contínua)
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono-code text-xs font-bold">
                +28 Pontos de Ganho Técnico
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              Arraste a barra central para comparar o estudo da Semana 1 com a prancha recente após aplicar o método Loomis.
            </p>
          </div>

          {/* Interactive Split Comparison Stage */}
          <div className="relative my-4 aspect-[16/10] bg-neutral-950 rounded-lg overflow-hidden select-none border border-neutral-800">
            {/* Base "After" Image (Right side) */}
            <img
              src={profile.beforeAfter.afterImageUrl}
              alt="Depois"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-2 py-1 bg-neutral-900/90 text-white rounded font-mono-code text-[11px]">
              Depois: {profile.beforeAfter.afterDate} (Score: {profile.beforeAfter.afterScore})
            </div>

            {/* Clipped "Before" Image (Left side) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={profile.beforeAfter.beforeImageUrl}
                alt="Antes"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-neutral-900/90 text-white rounded font-mono-code text-[11px]">
                Antes: {profile.beforeAfter.beforeDate} (Score: {profile.beforeAfter.beforeScore})
              </div>
            </div>

            {/* Slider Dividing Bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-white text-neutral-950 flex items-center justify-center font-bold text-xs shadow-xl border border-neutral-300">
                ↔
              </div>
            </div>

            {/* Invisible Range Input for Smooth Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono-code text-neutral-500 pt-2 border-t border-neutral-100">
            <span>← {profile.beforeAfter.beforeTitle}</span>
            <span>{profile.beforeAfter.afterTitle} →</span>
          </div>
        </div>
      </div>

      {/* Practice Logbook / Recent Activities History */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-0.5">
              Logbook Diário de Treinos
            </span>
            <h3 className="font-display font-bold text-base text-neutral-900">
              Histórico de Sessões Recentes
            </h3>
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          {profile.recentActivities.map((act) => (
            <div
              key={act.id}
              className="py-3 flex items-center justify-between hover:bg-neutral-50/70 px-2 rounded transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-mono-code text-xs font-bold">
                  {act.score}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 leading-tight">
                    {act.title}
                  </h4>
                  <span className="text-[11px] text-neutral-500 font-mono-code">
                    {act.medium} • {act.durationMinutes} minutos na prancheta
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-400 font-mono-code">
                  {act.date}
                </span>
                <button
                  onClick={() => onOpenStudy(act.title)}
                  className="p-1 text-neutral-400 hover:text-neutral-900"
                  title="Abrir no Estúdio"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
