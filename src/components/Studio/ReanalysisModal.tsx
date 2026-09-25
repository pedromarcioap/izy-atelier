import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  Sparkles, 
  Target, 
  Sliders, 
  PenTool, 
  CheckCircle2, 
  HelpCircle,
  Layers,
  Compass,
  AlertCircle
} from 'lucide-react';
import { AnalysisJob, ArtworkAnalysisResult } from '../../types';

interface ReanalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentJob: AnalysisJob;
  userStrokesCount: number;
  onConfirmReanalysis: (options: {
    focusArea: string;
    subjectCategory: string;
    customInstructions?: string;
    includeUserStrokes: boolean;
    evaluationRigor: 'standard' | 'strict_master';
  }) => void;
}

export const ReanalysisModal: React.FC<ReanalysisModalProps> = ({
  isOpen,
  onClose,
  currentJob,
  userStrokesCount,
  onConfirmReanalysis,
}) => {
  const currentResult: ArtworkAnalysisResult | undefined = currentJob.result;

  const [focusArea, setFocusArea] = useState<string>('Auditoria Completa Equilibrada');
  const [subjectCategory, setSubjectCategory] = useState<string>(
    currentResult?.subjectCategory || 'auto'
  );
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [includeUserStrokes, setIncludeUserStrokes] = useState<boolean>(userStrokesCount > 0);
  const [evaluationRigor, setEvaluationRigor] = useState<'standard' | 'strict_master'>('standard');

  if (!isOpen) return null;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReanalysis({
      focusArea,
      subjectCategory,
      customInstructions: customInstructions.trim() || undefined,
      includeUserStrokes: includeUserStrokes && userStrokesCount > 0,
      evaluationRigor
    });
    onClose();
  };

  const focusOptions = [
    {
      id: 'Auditoria Completa Equilibrada',
      title: 'Auditoria Completa',
      desc: 'Reavalia todos os eixos: proporção, perspectiva, valores, traço e composição.'
    },
    {
      id: 'Construção de Proporções e Anatomia',
      title: 'Proporção & Simetria',
      desc: 'Foco exclusivo em escala, simetria bilateral, eixos estruturais e eixos áureos.'
    },
    {
      id: 'Perspectiva e Pontos de Fuga',
      title: 'Perspectiva & Elipses',
      desc: 'Rigor em linhas ortogonais, horizonte, convergência e elipses cilíndricas.'
    },
    {
      id: 'Valores Tonais e Chiaroscuro',
      title: 'Valores & Chiaroscuro',
      desc: 'Diagnóstico da escala de 5 a 9 valores, sombras de oclusão e separação luz/sombra.'
    },
    {
      id: 'Qualidade de Traço e Texturas',
      title: 'Traço & Texturas',
      desc: 'Avaliação de modulação de linha, hachuras, acabamento tátil e transparências.'
    }
  ];

  const categoryOptions = [
    { id: 'auto', label: 'Automático (IA identifica o sujeito)' },
    { id: 'objeto_natureza_morta', label: 'Objeto / Natureza Morta / Flores / Metal' },
    { id: 'rosto_retrato', label: 'Rosto / Retrato Humano (Método Loomis)' },
    { id: 'figura_humana', label: 'Figura Humana / Gesto / Anatomia' },
    { id: 'cenario_perspectiva', label: 'Cenário / Arquitetura / Perspectiva Externa' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        id="reanalysis-modal"
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-900 text-white rounded">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-neutral-900">
                Reanálise Técnica da IA
              </h2>
              <p className="text-xs text-neutral-500">
                Reavalie a obra com parâmetros calibrados ou novo foco avaliativo
              </p>
            </div>
          </div>
          <button
            id="close-reanalysis-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Artwork Context Bar */}
        <div className="px-6 py-3 bg-neutral-100/70 border-b border-neutral-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 truncate">
            <img 
              src={currentJob.imageUrl} 
              alt={currentJob.artworkTitle}
              className="w-10 h-10 object-cover rounded border border-neutral-300 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="truncate">
              <span className="font-semibold text-neutral-900 block truncate">
                {currentJob.artworkTitle}
              </span>
              <span className="text-neutral-500 font-mono-code text-[11px]">
                {currentResult?.subjectDetected || currentJob.medium}
              </span>
            </div>
          </div>

          {currentResult && (
            <div className="flex items-center gap-2 flex-shrink-0 pl-3">
              <span className="text-[11px] text-neutral-500">Nota Atual:</span>
              <span className="px-2 py-0.5 bg-neutral-900 text-white font-mono-code font-bold text-xs rounded">
                {currentResult.overallScore}/100
              </span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleStart} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Subject Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800 uppercase font-mono-code tracking-wider">
              1. Classificação do Sujeito (Garante Rubricas Corretas)
            </label>
            <select
              id="reanalysis-category-select"
              value={subjectCategory}
              onChange={(e) => setSubjectCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-500">
              Selecione o sujeito específico para impedir a aplicação inadvertida de regras faciais (Loomis) sobre objetos, flores ou naturezas mortas.
            </p>
          </div>

          {/* Primary Focus Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-800 uppercase font-mono-code tracking-wider">
              2. Eixo de Foco Prioritário
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {focusOptions.map((opt) => {
                const isSelected = focusArea === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFocusArea(opt.id)}
                    className={`p-3 text-left rounded border transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-neutral-900">
                        {opt.title}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Notes / Artist Directives for AI */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800 uppercase font-mono-code tracking-wider">
              3. Diretrizes Específicas do Artista (Opcional)
            </label>
            <textarea
              id="reanalysis-custom-notes"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Ex: 'Avalie com rigor a elipse de base do vaso', 'Focar nas transições de chiaroscuro da peônia central', ou 'Verificar se o plano de apoio transmite ancoragem física'..."
              rows={2}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
            />
          </div>

          {/* Include User Redline Strokes (if drawn) */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-start gap-3">
            <input 
              type="checkbox"
              id="include-user-strokes-check"
              checked={includeUserStrokes && userStrokesCount > 0}
              disabled={userStrokesCount === 0}
              onChange={(e) => setIncludeUserStrokes(e.target.checked)}
              className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 disabled:opacity-40 cursor-pointer"
            />
            <div className="text-xs">
              <label 
                htmlFor="include-user-strokes-check"
                className="font-semibold text-neutral-900 block cursor-pointer"
              >
                Considerar Meus Traços de Redline Manual ({userStrokesCount} traço{userStrokesCount !== 1 ? 's' : ''})
              </label>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {userStrokesCount > 0
                  ? 'A IA avaliará a precisão das suas correções manuais desenhadas sobre a tela e atualizará o diagnóstico técnico.'
                  : 'Nenhum traço manual desenhado. Desenhe correções com a ferramenta "Redline Manual" para ativá-lo.'}
              </p>
            </div>
          </div>

          {/* Evaluation Rigor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800 uppercase font-mono-code tracking-wider">
              4. Rigor Avaliativo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEvaluationRigor('standard')}
                className={`px-3 py-2 text-left rounded border text-xs font-medium transition-colors ${
                  evaluationRigor === 'standard'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Padrão Didático
                <span className="block text-[10px] opacity-75 font-normal">
                  Feedback construtivo com foco em evolução contínua.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEvaluationRigor('strict_master')}
                className={`px-3 py-2 text-left rounded border text-xs font-medium transition-colors ${
                  evaluationRigor === 'strict_master'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Banca Acadêmica Rigorosa
                <span className="block text-[10px] opacity-75 font-normal">
                  Crítica de alta exigência formal e apontamento estrito de desvios.
                </span>
              </button>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              id="confirm-reanalysis-btn"
              className="flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Iniciar Reanálise da IA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
