import React, { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  UploadCloud, 
  Clock, 
  Palette, 
  Check, 
  ChevronDown,
  Info,
  RotateCw
} from 'lucide-react';
import { StudioCanvas } from './StudioCanvas';
import { RubricsPanel } from './RubricsPanel';
import { ReanalysisModal } from './ReanalysisModal';
import { 
  AnalysisJob, 
  ArtworkAnalysisResult, 
  AIRedlineAnnotation, 
  UserRedlineStroke 
} from '../../types';
import { SAMPLE_ARTWORKS } from '../../data/mockData';

interface StudioViewProps {
  currentJob: AnalysisJob | null;
  onSelectSampleArtwork: (sampleId: string) => void;
  onOpenUpload: () => void;
  onSelectClass: (classId: string) => void;
  onPublishToCommunity: (analysis: ArtworkAnalysisResult, title: string, imageUrl: string, medium: string) => void;
  onReanalyzeJob?: (options: {
    focusArea: string;
    subjectCategory: string;
    customInstructions?: string;
    includeUserStrokes: boolean;
    userStrokesCount: number;
    evaluationRigor: 'standard' | 'strict_master';
  }) => void;
  onSelectJobVersion?: (versionIndex: number) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  currentJob,
  onSelectSampleArtwork,
  onOpenUpload,
  onSelectClass,
  onPublishToCommunity,
  onReanalyzeJob,
  onSelectJobVersion,
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<AIRedlineAnnotation | null>(null);
  const [userStrokes, setUserStrokes] = useState<UserRedlineStroke[]>([]);
  const [showSamplesDropdown, setShowSamplesDropdown] = useState(false);
  const [isReanalysisModalOpen, setIsReanalysisModalOpen] = useState(false);

  const isProcessing = currentJob && currentJob.status !== 'completed' && currentJob.status !== 'failed';
  const hasAnalysis = currentJob?.result !== undefined;

  const handleSelectSample = (id: string) => {
    onSelectSampleArtwork(id);
    setShowSamplesDropdown(false);
    setUserStrokes([]);
    setSelectedAnnotation(null);
  };

  const handleConfirmReanalysis = (options: {
    focusArea: string;
    subjectCategory: string;
    customInstructions?: string;
    includeUserStrokes: boolean;
    evaluationRigor: 'standard' | 'strict_master';
  }) => {
    if (onReanalyzeJob) {
      onReanalyzeJob({
        ...options,
        userStrokesCount: userStrokes.length
      });
    }
  };

  return (
    <div id="studio-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          {/* Artwork Selector Dropdown */}
          <div className="relative">
            <button
              id="artwork-selector-btn"
              onClick={() => setShowSamplesDropdown(!showSamplesDropdown)}
              className="flex items-center gap-2.5 px-3 py-2 bg-white border border-neutral-300 rounded-md text-xs sm:text-sm font-semibold text-neutral-900 hover:bg-neutral-50 shadow-sm transition-colors"
            >
              <Palette className="w-4 h-4 text-neutral-600" />
              <span className="max-w-[200px] sm:max-w-[300px] truncate">
                {currentJob?.artworkTitle || 'Estudo Selecionado'}
              </span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {/* Dropdown Menu */}
            {showSamplesDropdown && (
              <div className="absolute left-0 mt-1.5 w-72 bg-white border border-neutral-200 rounded-lg shadow-xl z-30 py-1.5 animate-in fade-in">
                <div className="px-3 py-1.5 border-b border-neutral-100 text-[10px] font-mono-code uppercase text-neutral-400">
                  Estudos Prontos para Teste Imediato
                </div>
                {SAMPLE_ARTWORKS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-neutral-100 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-neutral-900">{sample.title}</p>
                      <p className="text-[11px] text-neutral-500">{sample.medium}</p>
                    </div>
                    {currentJob?.artworkTitle === sample.title && (
                      <Check className="w-3.5 h-3.5 text-neutral-900" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden md:inline font-mono-code text-xs text-neutral-500">
            {currentJob?.medium || 'Grafite Tradicional'}
          </span>

          {currentJob?.isReanalysis && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-white font-mono-code text-[10px] uppercase font-bold rounded">
              <RotateCw className="w-2.5 h-2.5" />
              v{currentJob.reanalysisVersion || 2} Reanalisado
            </span>
          )}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          {hasAnalysis && !isProcessing && (
            <button
              id="top-reanalyze-btn"
              onClick={() => setIsReanalysisModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 text-neutral-800 rounded text-xs font-semibold hover:bg-neutral-50 shadow-xs transition-colors"
              title="Reanalisar a obra com novo foco, diretrizes ou calibração de categoria"
            >
              <RotateCw className="w-3.5 h-3.5 text-neutral-600" />
              <span>Reanálise da IA</span>
            </button>
          )}

          <button
            id="upload-new-artwork-btn"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Enviar Meu Desenho / Foto</span>
          </button>
        </div>
      </div>

      {/* Background Processing Banner (if active) */}
      {isProcessing && (
        <div 
          id="active-job-banner"
          className="bg-neutral-900 text-white p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-neutral-800 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-800 rounded">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-sm text-white">
                  {currentJob.statusMessage}
                </h3>
                <span className="font-mono-code text-[11px] px-1.5 py-0.5 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                  {currentJob.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Processamento assíncrono em fila de background. A prancheta continua interativa.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48">
            <div className="flex justify-between text-[11px] font-mono-code text-neutral-400 mb-1">
              <span>Progresso</span>
              <span>{currentJob.progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${currentJob.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Grid: Stage (Canvas) + Rubrics Panel */}
      {currentJob ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Column: Interactive Canvas Stage (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <StudioCanvas
              imageUrl={currentJob.imageUrl}
              artworkTitle={currentJob.artworkTitle}
              analysis={currentJob.result}
              userStrokes={userStrokes}
              onUserStrokesChange={setUserStrokes}
              selectedAnnotation={selectedAnnotation}
              onSelectAnnotation={setSelectedAnnotation}
            />
          </div>

          {/* Right Column: Swiss Editorial Technical Rubrics Panel (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 min-h-[500px]">
            {hasAnalysis ? (
              <RubricsPanel
                analysis={currentJob.result!}
                job={currentJob}
                onSelectClass={onSelectClass}
                onOpenReanalysis={() => setIsReanalysisModalOpen(true)}
                onSelectVersion={onSelectJobVersion}
                onPublishToCommunity={() => {
                  onPublishToCommunity(
                    currentJob.result!,
                    currentJob.artworkTitle,
                    currentJob.imageUrl,
                    currentJob.medium
                  );
                }}
              />
            ) : (
              <div className="bg-white border border-neutral-200 p-8 rounded-lg text-center flex flex-col items-center justify-center min-h-[360px]">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
                <h4 className="font-display font-semibold text-neutral-900 text-sm">
                  Aguardando Conclusão da Análise
                </h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Os eixos avaliativos de Loomis, convergência e histograma serão exibidos assim que o worker de visão computacional finalizar a inspeção.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-neutral-300 p-12 rounded-lg text-center">
          <Palette className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg text-neutral-900">
            Nenhuma Obra Ativa no Estúdio
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            Faça upload de uma foto de seu caderno de esboços ou selecione um dos estudos acadêmicos pré-carregados para testar o núcleo de visão computacional.
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold"
          >
            Enviar Obra Agora
          </button>
        </div>
      )}

      {/* Reanalysis Modal */}
      {currentJob && (
        <ReanalysisModal
          isOpen={isReanalysisModalOpen}
          onClose={() => setIsReanalysisModalOpen(false)}
          currentJob={currentJob}
          userStrokesCount={userStrokes.length}
          onConfirmReanalysis={handleConfirmReanalysis}
        />
      )}
    </div>
  );
};
