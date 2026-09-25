import React from 'react';
import {
  Flame,
  Zap,
  Award,
  Sparkles,
  Target,
  Layers,
  PenTool,
  Users,
  Compass,
  Shield,
  Trophy,
  Lock
} from 'lucide-react';
import { ArtistBadge } from '../../types';

interface BadgeIconProps {
  badge: ArtistBadge;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLock?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  badge,
  size = 'md',
  showLock = true
}) => {
  const { iconName, tier, unlocked } = badge;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10'
  };

  // Swiss editorial tiered styling: clean, high contrast, subtle metallic accents
  const tierStyles = {
    bronze: unlocked
      ? 'bg-amber-100/90 text-amber-900 border-amber-300 ring-1 ring-amber-400/40'
      : 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-60',
    prata: unlocked
      ? 'bg-slate-100 text-slate-900 border-slate-300 ring-1 ring-slate-400/50 shadow-xs'
      : 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-60',
    ouro: unlocked
      ? 'bg-yellow-100/90 text-amber-950 border-amber-400 ring-1 ring-amber-500/60 shadow-xs'
      : 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-60',
    diamante: unlocked
      ? 'bg-neutral-900 text-white border-neutral-700 ring-2 ring-neutral-400/60 shadow-sm'
      : 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-60'
  };

  const renderIcon = () => {
    const iconClass = iconSizes[size];
    switch (iconName) {
      case 'flame':
        return <Flame className={iconClass} />;
      case 'zap':
        return <Zap className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'target':
        return <Target className={iconClass} />;
      case 'layers':
        return <Layers className={iconClass} />;
      case 'pen':
        return <PenTool className={iconClass} />;
      case 'users':
        return <Users className={iconClass} />;
      case 'compass':
        return <Compass className={iconClass} />;
      case 'shield':
        return <Shield className={iconClass} />;
      default:
        return <Trophy className={iconClass} />;
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <div
        className={`rounded-lg border flex items-center justify-center font-bold transition-all ${sizeClasses[size]} ${tierStyles[tier]}`}
      >
        {renderIcon()}
      </div>

      {!unlocked && showLock && (
        <div className="absolute -bottom-1 -right-1 p-0.5 bg-neutral-800 text-white rounded-full border border-white">
          <Lock className="w-2.5 h-2.5" />
        </div>
      )}
    </div>
  );
};
