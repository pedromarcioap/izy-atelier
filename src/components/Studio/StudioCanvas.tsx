import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Grid, 
  Maximize2, 
  Sliders, 
  Crosshair, 
  PenTool, 
  RotateCcw, 
  Trash2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { 
  ArtworkAnalysisResult, 
  AIRedlineAnnotation, 
  UserRedlineStroke 
} from '../../types';

interface StudioCanvasProps {
  imageUrl: string;
  artworkTitle: string;
  analysis?: ArtworkAnalysisResult;
  userStrokes: UserRedlineStroke[];
  onUserStrokesChange: (strokes: UserRedlineStroke[]) => void;
  selectedAnnotation: AIRedlineAnnotation | null;
  onSelectAnnotation: (anno: AIRedlineAnnotation | null) => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  imageUrl,
  artworkTitle,
  analysis,
  userStrokes,
  onUserStrokesChange,
  selectedAnnotation,
  onSelectAnnotation,
}) => {
  // Layer Toggles
  const [showHorizon, setShowHorizon] = useState(true);
  const [showLoomis, setShowLoomis] = useState(true);
  const [showTonalPosterizer, setShowTonalPosterizer] = useState(false);
  const [showAIPins, setShowAIPins] = useState(true);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [brushColor, setBrushColor] = useState('#EF4444'); // Crimson Red for classic redline
  const [brushWidth, setBrushWidth] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSplitCompare, setShowSplitCompare] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50); // percentage

  const isObjectSubject = 
    analysis?.subjectCategory === 'objeto_natureza_morta' || 
    Boolean(analysis?.subjectDetected && (
      analysis.subjectDetected.toLowerCase().includes('coroa') ||
      analysis.subjectDetected.toLowerCase().includes('objeto') ||
      analysis.subjectDetected.toLowerCase().includes('natureza morta') ||
      analysis.subjectDetected.toLowerCase().includes('flor') ||
      analysis.subjectDetected.toLowerCase().includes('vaso') ||
      analysis.subjectDetected.toLowerCase().includes('fruta')
    ));

  // Drawing Canvas Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // Render Redline Strokes onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    userStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const firstPoint = stroke.points[0];
      ctx.moveTo((firstPoint.x / 1000) * canvas.width, (firstPoint.y / 1000) * canvas.height);

      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo((pt.x / 1000) * canvas.width, (pt.y / 1000) * canvas.height);
      }
      ctx.stroke();
    });
  }, [userStrokes, zoomLevel]);

  // Handle Resize for Drawing Canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drawing Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 1000;

    isDrawingRef.current = true;
    currentStrokeRef.current = [{ x, y }];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 1000;

    currentStrokeRef.current.push({ x, y });

    // Live preview
    const ctx = canvas.getContext('2d');
    if (ctx && currentStrokeRef.current.length > 1) {
      const lastPoint = currentStrokeRef.current[currentStrokeRef.current.length - 2];
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo((lastPoint.x / 1000) * canvas.width, (lastPoint.y / 1000) * canvas.height);
      ctx.lineTo((x / 1000) * canvas.width, (y / 1000) * canvas.height);
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawingMode || !isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current.length > 1) {
      const newStroke: UserRedlineStroke = {
        id: `stroke-${Date.now()}`,
        color: brushColor,
        strokeWidth: brushWidth,
        points: [...currentStrokeRef.current]
      };
      onUserStrokesChange([...userStrokes, newStroke]);
    }
    currentStrokeRef.current = [];
  };

  const undoLastStroke = () => {
    if (userStrokes.length === 0) return;
    onUserStrokesChange(userStrokes.slice(0, -1));
  };

  const clearAllStrokes = () => {
    onUserStrokesChange([]);
  };

  const overlays = analysis?.overlays;
  const horizon = overlays?.horizonLine;
  const landmarks = overlays?.landmarks || [];
  const annotations = overlays?.annotations || [];

  return (
    <div id="studio-stage-container" className="flex flex-col bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden text-neutral-100 shadow-md">
      {/* Top Stage Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-neutral-950 border-b border-neutral-800 text-xs">
        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-neutral-500 font-mono-code text-[11px] uppercase mr-1">
            Camadas:
          </span>

          <button
            id="toggle-horizon-btn"
            onClick={() => setShowHorizon(!showHorizon)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
              showHorizon 
                ? 'bg-blue-950 border-blue-600 text-blue-300' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Exibir Linha do Horizonte e Pontos de Fuga"
          >
            <Grid className="w-3 h-3" />
            <span>Perspectiva</span>
          </button>

          <button
            id="toggle-loomis-btn"
            onClick={() => setShowLoomis(!showLoomis)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
              showLoomis 
                ? 'bg-emerald-950 border-emerald-600 text-emerald-300' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title={isObjectSubject ? "Exibir Linhas de Proporção e Eixos Estruturais" : "Exibir Linhas de Proporção e Três Terços Loomis"}
          >
            <Crosshair className="w-3 h-3" />
            <span>{isObjectSubject ? 'Guias & Eixos' : 'Proporções'}</span>
          </button>

          <button
            id="toggle-tonal-btn"
            onClick={() => setShowTonalPosterizer(!showTonalPosterizer)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
              showTonalPosterizer 
                ? 'bg-neutral-100 border-white text-neutral-900 font-semibold' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Modo Posterizado: 5 Valores de Cinza (Denman Ross)"
          >
            <Sliders className="w-3 h-3" />
            <span>5 Valores</span>
          </button>

          <button
            id="toggle-pins-btn"
            onClick={() => setShowAIPins(!showAIPins)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
              showAIPins 
                ? 'bg-amber-950 border-amber-500 text-amber-300' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Exibir Marcadores de Redline da IA"
          >
            <Sparkles className="w-3 h-3" />
            <span>Pins IA</span>
          </button>

          <button
            id="toggle-split-btn"
            onClick={() => setShowSplitCompare(!showSplitCompare)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
              showSplitCompare 
                ? 'bg-purple-950 border-purple-500 text-purple-300' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Comparador Split: Original vs Anotações"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Split View</span>
          </button>
        </div>

        {/* Drawing & Zoom Tools */}
        <div className="flex items-center gap-2">
          {/* Drawing Tool Activation */}
          <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-800">
            <button
              id="draw-mode-btn"
              onClick={() => setIsDrawingMode(!isDrawingMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                isDrawingMode
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
              title="Ativar Caneta de Redline Manual para Correções"
            >
              <PenTool className="w-3 h-3" />
              <span>Redline Manual</span>
            </button>

            {isDrawingMode && (
              <>
                {/* Color Selector */}
                <div className="flex items-center gap-1 pl-1 border-l border-neutral-700">
                  <button
                    onClick={() => setBrushColor('#EF4444')}
                    className={`w-4 h-4 rounded-full bg-red-500 ${brushColor === '#EF4444' ? 'ring-2 ring-white' : ''}`}
                    title="Vermelho Clássico"
                  />
                  <button
                    onClick={() => setBrushColor('#FFFFFF')}
                    className={`w-4 h-4 rounded-full bg-white ${brushColor === '#FFFFFF' ? 'ring-2 ring-red-500' : ''}`}
                    title="Branco Puro"
                  />
                  <button
                    onClick={() => setBrushColor('#3B82F6')}
                    className={`w-4 h-4 rounded-full bg-blue-500 ${brushColor === '#3B82F6' ? 'ring-2 ring-white' : ''}`}
                    title="Azul Guia"
                  />
                </div>

                {/* Undo / Clear */}
                <button
                  onClick={undoLastStroke}
                  disabled={userStrokes.length === 0}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                  title="Desfazer último traço"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={clearAllStrokes}
                  disabled={userStrokes.length === 0}
                  className="p-1 text-neutral-400 hover:text-red-400 disabled:opacity-30"
                  title="Limpar todos os traços"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 bg-neutral-900 p-0.5 rounded border border-neutral-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-1 text-neutral-400 hover:text-white"
              title="Reduzir Zoom"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="font-mono-code text-[10px] text-neutral-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
              className="p-1 text-neutral-400 hover:text-white"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="relative flex-1 min-h-[460px] max-h-[640px] bg-neutral-950 flex items-center justify-center overflow-hidden select-none"
      >
        {/* Workspace Canvas Transform Box */}
        <div 
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100"
        >
          {/* Main Artwork Image */}
          <img
            id="artwork-canvas-img"
            src={imageUrl}
            alt={artworkTitle}
            className={`max-h-[560px] max-w-full object-contain rounded shadow-2xl transition-all duration-300 pointer-events-none ${
              showTonalPosterizer 
                ? 'contrast-[180%] grayscale brightness-95' 
                : ''
            }`}
          />

          {/* Split Comparison Slider (if enabled) */}
          {showSplitCompare && (
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
            >
              <img
                src={imageUrl}
                alt={`${artworkTitle} Original`}
                className="max-h-[560px] max-w-full object-contain filter-none"
              />
              <div 
                className="absolute top-0 bottom-0 left-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            </div>
          )}

          {/* Horizon Line & Perspective Grid Overlay */}
          {showHorizon && horizon && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Horizon line */}
              <div
                className="absolute left-0 right-0 border-t-2 border-blue-400/80 border-dashed"
                style={{
                  top: `${horizon.yPercent}%`,
                  transform: `rotate(${horizon.tiltAngleDeg}deg)`
                }}
              >
                <span className="absolute left-2 -top-5 px-1.5 py-0.5 bg-blue-900/80 text-blue-200 font-mono-code text-[9px] rounded uppercase tracking-wider">
                  {horizon.label || (isObjectSubject ? `Plano da Mesa // Horizonte (${Math.round(horizon.yPercent)}%)` : `Nível dos Olhos // Horizonte (${Math.round(horizon.yPercent)}%)`)}
                </span>
              </div>

              {/* Converging Orthogonal Guide Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Left Vanishing Point Vectors */}
                <line 
                  x1="0%" 
                  y1={`${horizon.yPercent}%`} 
                  x2="50%" 
                  y2="20%" 
                  stroke="#60A5FA" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                  strokeOpacity="0.45" 
                />
                <line 
                  x1="0%" 
                  y1={`${horizon.yPercent}%`} 
                  x2="70%" 
                  y2="80%" 
                  stroke="#60A5FA" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                  strokeOpacity="0.45" 
                />
                {/* Right Vanishing Point Vectors */}
                <line 
                  x1="100%" 
                  y1={`${horizon.yPercent}%`} 
                  x2="30%" 
                  y2="15%" 
                  stroke="#60A5FA" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                  strokeOpacity="0.45" 
                />
                <line 
                  x1="100%" 
                  y1={`${horizon.yPercent}%`} 
                  x2="45%" 
                  y2="85%" 
                  stroke="#60A5FA" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                  strokeOpacity="0.45" 
                />
              </svg>
            </div>
          )}

          {/* Landmark & Symmetry Guides */}
          {showLoomis && landmarks.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {landmarks.map((lm) => {
                const isVertical = lm.type === 'symmetry_axis' || lm.type === 'third_vertical';
                if (isVertical) {
                  const posX = lm.xPercent !== undefined ? lm.xPercent : 50;
                  return (
                    <div
                      key={lm.id}
                      className="absolute top-0 bottom-0 border-l border-emerald-400/70 border-dashed"
                      style={{ left: `${posX}%` }}
                    >
                      <span className="absolute top-2 -left-12 px-1.5 py-0.5 bg-emerald-950/90 text-emerald-300 font-mono-code text-[9px] rounded border border-emerald-700 whitespace-nowrap shadow-sm">
                        - {lm.label}
                      </span>
                    </div>
                  );
                }

                const posY = lm.yPercent !== undefined ? lm.yPercent : 50;
                return (
                  <div
                    key={lm.id}
                    className="absolute left-0 right-0 border-t border-emerald-400/60 border-dashed"
                    style={{ top: `${posY}%` }}
                  >
                    <span className="absolute right-2 -top-4 px-1.5 py-0.5 bg-emerald-950/90 text-emerald-300 font-mono-code text-[9px] rounded border border-emerald-700 whitespace-nowrap shadow-sm">
                      - {lm.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Redline Annotation Pins */}
          {showAIPins && annotations.map((anno) => {
            const isSelected = selectedAnnotation?.id === anno.id;
            return (
              <button
                key={anno.id}
                id={`ai-pin-${anno.id}`}
                onClick={() => onSelectAnnotation(isSelected ? null : anno)}
                style={{ left: `${anno.xPercent}%`, top: `${anno.yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                {/* Pulsing ring */}
                <span className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping" />
                <div className={`relative flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-lg border ${
                  anno.severity === 'desvio_critico'
                    ? 'bg-red-600 border-white text-white'
                    : anno.severity === 'ajuste_fino'
                    ? 'bg-amber-500 border-white text-neutral-900'
                    : 'bg-blue-600 border-white text-white'
                }`}>
                  !
                </div>

                {/* Inline Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-30 w-56 p-2 bg-neutral-900 border border-neutral-700 text-left rounded shadow-xl text-neutral-100 pointer-events-none">
                  <p className="font-semibold text-xs text-white leading-tight mb-0.5">{anno.title}</p>
                  <p className="text-[11px] text-neutral-300 leading-snug">{anno.critique}</p>
                  <p className="text-[10px] text-amber-400 mt-1 font-mono-code">- {anno.correctionSuggestion}</p>
                </div>
              </button>
            );
          })}

          {/* Interactive User Redline Drawing Canvas */}
          <canvas
            ref={canvasRef}
            id="interactive-redline-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute inset-0 w-full h-full z-10 ${
              isDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'
            }`}
          />
        </div>

        {/* Selected Annotation Callout Card (Bottom Floating) */}
        {selectedAnnotation && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-md bg-neutral-900/95 border border-neutral-700 backdrop-blur-md p-3 rounded-lg shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono-code uppercase rounded">
                  {selectedAnnotation.category}
                </span>
                <h4 className="text-xs font-semibold text-white">
                  {selectedAnnotation.title}
                </h4>
              </div>
              <button
                onClick={() => onSelectAnnotation(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono-code px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              {selectedAnnotation.critique}
            </p>
            <div className="mt-2 pt-2 border-t border-neutral-800 flex items-start gap-1 text-[11px] text-amber-400">
              <span className="font-semibold text-neutral-400 shrink-0">Sugestão:</span>
              <span>{selectedAnnotation.correctionSuggestion}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Instructions / Swiss Grid Helper */}
      <div className="px-3 py-1.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono-code">
        <div className="flex items-center gap-2">
          <span>{artworkTitle}</span>
          <span>•</span>
          <span>{isDrawingMode ? 'Modo Redline Ativo (desenhe correções diretamente sobre a obra)' : 'Clique nos pins vermelhos para inspecionar diagnósticos'}</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span>Escala 1:1</span>
          <span>Grid Modular Ativo</span>
        </div>
      </div>
    </div>
  );
};
