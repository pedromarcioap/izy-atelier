import React, { useState } from 'react';
import { 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Eye, 
  Layers, 
  PenTool, 
  Share2, 
  BookOpen, 
  ArrowUpRight,
  Sliders,
  RotateCw
} from 'lucide-react';
import { ArtworkAnalysisResult, RubricEvaluation, AnalysisJob } from '../../types';

interface RubricsPanelProps {
  analysis: ArtworkAnalysisResult;
  job?: AnalysisJob | null;
  onSelectClass: (classId: string) => void;
  onPublishToCommunity: () => void;
  onOpenReanalysis?: () => void;
  onSelectVersion?: (versionIndex: number) => void;
}

export const RubricsPanel: React.FC<RubricsPanelProps> = ({
  analysis,
  job,
  onSelectClass,
  onPublishToCommunity,
  onOpenReanalysis,
  onSelectVersion,
}) => {
  const [activeTab, setActiveTab] = useState<'rubrics' | 'plan' | 'values'>('rubrics');
  const [expandedAxis, setExpandedAxis] = useState<string>('proportion');

  const { rubrics, overallScore, technicalSummary, overlays, actionPlan } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const isObjectSubject = 
    analysis.subjectCategory === 'objeto_natureza_morta' || 
    Boolean(analysis.subjectDetected && (
      analysis.subjectDetected.toLowerCase().includes('coroa') ||
      analysis.subjectDetected.toLowerCase().includes('objeto') ||
      analysis.subjectDetected.toLowerCase().includes('natureza morta') ||
      analysis.subjectDetected.toLowerCase().includes('flor') ||
      analysis.subjectDetected.toLowerCase().includes('vaso') ||
      analysis.subjectDetected.toLowerCase().includes('fruta') ||
      analysis.subjectDetected.toLowerCase().includes('botânica')
    ));

  const axisList = [
    {
      id: 'proportion',
      title: isObjectSubject ? 'Proporção & Composição Estrutural' : 'Proporção & Anatomia',
      data: rubrics.proportionAnatomy,
      icon: Compass,
      desc: isObjectSubject
        ? 'Relações de escala, blocagem de massas, eixos de simetria/equilíbrio e proporções áureas.'
        : 'Cálculo de desvios dimensionais, eixos de Loomis e proporções áureas.'
    },
    {
      id: 'perspective',
      title: 'Perspectiva & Enquadramento',
      data: rubrics.perspectiveFraming,
      icon: Layers,
      desc: 'Pontos de fuga, linhas de horizonte, convergência ortogonal e regra dos terços.'
    },
    {
      id: 'values',
      title: 'Valores Tonais & Iluminação',
      data: rubrics.tonalValuesLighting,
      icon: Sliders,
      desc: 'Escala de 5 valores, contraste, oclusão e hierarquia luz vs sombra.'
    },
    {
      id: 'lines',
      title: 'Linhas, Textura & Pincelada',
      data: rubrics.lineGestureTexture,
      icon: PenTool,
      desc: 'Espessura de traço (line weight), continuidade de gesto e hachuras volumétricas.'
    },
    {
      id: 'composition',
      title: 'Composição & Narrativa',
      data: rubrics.colorComposition,
      icon: Eye,
      desc: 'Equilíbrio de massas visuais, pontos focais e espaço negativo.'
    }
  ];

  return (
    <div id="rubrics-panel-container" className="flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm h-full">
      {/* Top Score Banner (Swiss Typography) */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
              Diagnóstico de Visão Computacional
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 tracking-tight">
              Veredito Técnico do Ateliê
            </h2>
            {analysis.subjectDetected && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono-code font-semibold bg-neutral-900 text-white">
                  - Sujeito: {analysis.subjectDetected}
                </span>
                {analysis.mediumDetected && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono-code bg-neutral-200/80 text-neutral-700">
                    - Mídia: {analysis.mediumDetected}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end">
            <div className={`px-3 py-1.5 rounded border font-mono-code font-bold text-base sm:text-lg ${getScoreColor(overallScore)}`}>
              {overallScore} / 100
            </div>
            <span className="text-[10px] font-mono-code text-neutral-400 mt-1 uppercase">
              Índice Global de Maestria
            </span>
          </div>
        </div>

        {/* Technical Summary */}
        <p className="mt-3 text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal border-l-2 border-neutral-900 pl-3">
          {technicalSummary}
        </p>

        {/* Version Switcher & Re-analysis Bar */}
        <div className="mt-3 pt-2.5 pb-0.5 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-2">
          {job?.versions && job.versions.length > 1 ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider">
                Versão:
              </span>
              <div className="flex items-center gap-1 bg-neutral-200/60 p-0.5 rounded border border-neutral-200">
                {job.versions.map((ver, idx) => {
                  const isSelected = (job.selectedVersionIndex ?? (job.versions!.length - 1)) === idx;
                  return (
                    <button
                      key={ver.version}
                      id={`btn-version-select-${ver.version}`}
                      onClick={() => onSelectVersion?.(idx)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono-code transition-colors ${
                        isSelected
                          ? 'bg-neutral-900 text-white font-bold shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                      }`}
                      title={ver.focusArea ? `Foco: ${ver.focusArea}` : undefined}
                    >
                      {ver.label || `v${ver.version}`} ({ver.result.overallScore} pts)
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="font-mono-code text-[11px] text-neutral-500">
                - Versão 1.0 (Análise Inicial)
              </span>
            </div>
          )}

          {onOpenReanalysis && (
            <button
              id="rubrics-panel-reanalyze-btn"
              onClick={onOpenReanalysis}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
              title="Solicitar nova auditoria com foco específico ou correção de parâmetros"
            >
              <RotateCw className="w-3 h-3 text-neutral-200" />
              <span>Reanálise da IA</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-200 text-xs">
          <button
            id="tab-btn-rubrics"
            onClick={() => setActiveTab('rubrics')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'rubrics'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-200/60'
            }`}
          >
            Eixos Avaliativos (5)
          </button>

          <button
            id="tab-btn-plan"
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'plan'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-200/60'
            }`}
          >
            Plano de Ação Diário
          </button>

          <button
            id="tab-btn-values"
            onClick={() => setActiveTab('values')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'values'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-200/60'
            }`}
          >
            Histograma Tonal
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Tab 1: Rubrics Accordion */}
        {activeTab === 'rubrics' && (
          <div className="space-y-3">
            {axisList.map((axis) => {
              const Icon = axis.icon;
              const isExpanded = expandedAxis === axis.id;
              const evaluation: RubricEvaluation = axis.data;

              return (
                <div
                  key={axis.id}
                  id={`rubric-card-${axis.id}`}
                  className={`border rounded-lg transition-all ${
                    isExpanded 
                      ? 'border-neutral-900 bg-white shadow-sm' 
                      : 'border-neutral-200 bg-neutral-50/40 hover:bg-neutral-100/50'
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => setExpandedAxis(isExpanded ? '' : axis.id)}
                    className="w-full p-3.5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded border ${
                        isExpanded ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-display font-semibold text-sm text-neutral-900 block leading-tight">
                          {axis.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono-code">
                          Nível: {evaluation.level}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono-code font-semibold border ${getScoreColor(evaluation.score)}`}>
                        {evaluation.score}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-3.5 pb-4 pt-1 border-t border-neutral-100 space-y-3 text-xs text-neutral-700">
                      {/* Technical Diagnosis */}
                      <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                        <span className="font-mono-code text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                          Diagnóstico Analítico:
                        </span>
                        <p className="leading-relaxed font-normal text-neutral-800">
                          {evaluation.technicalDiagnosis}
                        </p>
                      </div>

                      {/* Strengths */}
                      {evaluation.strengths.length > 0 && (
                        <div>
                          <span className="font-mono-code text-[11px] font-semibold text-emerald-800 flex items-center gap-1 mb-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Pontos Fortes Identificados:
                          </span>
                          <ul className="space-y-1 pl-4 text-[11px] list-disc list-outside text-neutral-600">
                            {evaluation.strengths.map((str, idx) => (
                              <li key={idx}>- {str}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Deviations */}
                      {evaluation.deviations.length > 0 && (
                        <div>
                          <span className="font-mono-code text-[11px] font-semibold text-amber-800 flex items-center gap-1 mb-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Desvios a Calibrar:
                          </span>
                          <ul className="space-y-1 pl-4 text-[11px] list-disc list-outside text-neutral-600">
                            {evaluation.deviations.map((dev, idx) => (
                              <li key={idx}>- {dev}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommended Drill */}
                      <div className="pt-2 border-t border-neutral-100 flex items-start gap-1.5 text-neutral-900 font-medium">
                        <span className="font-mono-code text-[10px] uppercase text-neutral-400 shrink-0">
                          Drill Recomendado:
                        </span>
                        <span className="text-[11px] text-neutral-800 font-normal">
                          {evaluation.recommendedDrill}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Action Plan */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <div className="bg-neutral-900 text-white p-4 rounded-lg">
              <span className="font-mono-code text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                Prescrição de Treino // Próximos Passos
              </span>
              <h3 className="font-display font-bold text-base mb-2">
                Correção Imediata na Prancheta
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                {actionPlan.immediateCorrection}
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-800 rounded font-mono-code text-[11px] text-neutral-200">
                <span>Tempo recomendado: {actionPlan.practiceDurationMinutes} minutos</span>
              </div>
            </div>

            <div className="border border-neutral-200 p-4 rounded-lg bg-neutral-50/50 space-y-3">
              <div>
                <span className="font-mono-code text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                  Estudo Complementar Recomendado
                </span>
                <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                  {actionPlan.nextStudyExercise}
                </p>
              </div>

              <button
                id="btn-goto-lesson"
                onClick={() => onSelectClass(actionPlan.suggestedClassId)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-medium text-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Assistir Aula Relacionada</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Tonal Histogram */}
        {activeTab === 'values' && (
          <div className="space-y-4">
            <div className="border border-neutral-200 p-4 rounded-lg bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-code text-[11px] font-semibold text-neutral-700 uppercase">
                  Distribuição Tonal (Chave de Luz)
                </span>
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 font-mono-code text-[10px] rounded border border-neutral-200">
                  {overlays?.tonalHistogramSummary?.dominantKey || 'Chave Média'}
                </span>
              </div>

              {/* Graphical Value Bars */}
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] font-mono-code mb-1">
                    <span className="text-neutral-600">Sombras (Valores 7-9)</span>
                    <span className="font-semibold">{overlays?.tonalHistogramSummary?.shadows || 25}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-900 rounded-full" 
                      style={{ width: `${overlays?.tonalHistogramSummary?.shadows || 25}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono-code mb-1">
                    <span className="text-neutral-600">Meios-Tons (Valores 4-6)</span>
                    <span className="font-semibold">{overlays?.tonalHistogramSummary?.midtones || 55}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-500 rounded-full" 
                      style={{ width: `${overlays?.tonalHistogramSummary?.midtones || 55}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono-code mb-1">
                    <span className="text-neutral-600">Luzes & Brilhos (Valores 1-3)</span>
                    <span className="font-semibold">{overlays?.tonalHistogramSummary?.highlights || 20}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-300 rounded-full" 
                      style={{ width: `${overlays?.tonalHistogramSummary?.highlights || 20}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* 5-Step Value Swatch Reference */}
              <div className="mt-5 pt-4 border-t border-neutral-200">
                <span className="font-mono-code text-[10px] text-neutral-500 uppercase tracking-wider block mb-2">
                  Referência: Escala de 5 Valores de Denman Ross
                </span>
                <div className="grid grid-cols-5 gap-1 text-center font-mono-code text-[9px]">
                  <div className="h-8 bg-black rounded-sm flex items-center justify-center text-white">1. Sombra</div>
                  <div className="h-8 bg-neutral-700 rounded-sm flex items-center justify-center text-white">2. Meia-Sombra</div>
                  <div className="h-8 bg-neutral-400 rounded-sm flex items-center justify-center text-neutral-900 font-bold">3. Meio-Tom</div>
                  <div className="h-8 bg-neutral-200 rounded-sm flex items-center justify-center text-neutral-900 border border-neutral-300">4. Luz</div>
                  <div className="h-8 bg-white rounded-sm flex items-center justify-center text-neutral-900 border border-neutral-300 font-bold">5. Highlight</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Peer-Review CTA */}
      <div className="p-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
        <button
          id="btn-publish-peer-review"
          onClick={onPublishToCommunity}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold shadow-sm transition-all active:scale-[0.99]"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Publicar no Feed para Peer-Review (Redlines)</span>
        </button>
      </div>
    </div>
  );
};
