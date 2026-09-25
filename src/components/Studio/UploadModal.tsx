import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Clock, 
  Palette, 
  Target, 
  Sparkles,
  Camera
} from 'lucide-react';
import { SAMPLE_ARTWORKS } from '../../data/mockData';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitJob: (payload: {
    title: string;
    medium: string;
    timeSpentMinutes: number;
    imageUrl: string;
    focusArea: string;
    subjectCategory?: string;
  }) => void;
  onSelectSample: (sampleId: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmitJob,
  onSelectSample,
}) => {
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('Grafite 2B-6B no Papel Canson');
  const [timeSpent, setTimeSpent] = useState<number>(45);
  const [focusArea, setFocusArea] = useState('Construção de Proporções e Anatomia');
  const [subjectCategory, setSubjectCategory] = useState<string>('auto');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    onSubmitJob({
      title: title || 'Estudo Prático do Ateliê',
      medium,
      timeSpentMinutes: timeSpent,
      imageUrl: imagePreview,
      focusArea,
      subjectCategory: subjectCategory !== 'auto' ? subjectCategory : undefined
    });
    onClose();
  };

  const handleQuickSampleSelect = (sampleId: string) => {
    onSelectSample(sampleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        id="upload-artwork-modal"
        className="bg-white border border-neutral-200 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900">
              Registrar Treino & Submeter Obra à IA
            </h3>
            <span className="text-[11px] font-mono-code text-neutral-500 uppercase">
              Processamento Assíncrono em Fila de Visão Computacional
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick Select Preset Samples */}
          <div>
            <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-2">
              Opção Rápida: Testar com Estudo Acadêmico Pré-Carregado
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_ARTWORKS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleQuickSampleSelect(sample.id)}
                  className="p-2 border border-neutral-200 rounded-md text-left hover:border-neutral-900 hover:bg-neutral-50 transition-all flex flex-col sm:flex-row items-center gap-2 group"
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-10 h-10 object-cover rounded shrink-0 border border-neutral-200"
                  />
                  <div className="overflow-hidden w-full">
                    <p className="text-[11px] font-semibold text-neutral-900 truncate group-hover:text-neutral-950">
                      {sample.title}
                    </p>
                    <p className="text-[9px] text-neutral-500 font-mono-code truncate">
                      {sample.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="flex-shrink mx-3 text-neutral-400 text-[11px] font-mono-code uppercase">
              ou faça upload da sua foto / desenho
            </span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-neutral-900 bg-neutral-100'
                  : imagePreview
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-neutral-300 hover:border-neutral-500 bg-neutral-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 max-w-full object-contain rounded border border-neutral-300 shadow-sm"
                  />
                  <span className="text-xs font-medium text-emerald-800">
                    Imagem carregada com sucesso. Clique para trocar.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-3">
                  <div className="p-3 bg-white rounded-full border border-neutral-200 shadow-sm">
                    <UploadCloud className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-neutral-900">
                      Arraste a foto do seu desenho ou clique para selecionar
                    </p>
                    <p className="text-[11px] text-neutral-500 font-mono-code mt-0.5">
                      Formatos suportados: JPG, PNG, WEBP (até 25MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Título do Treino
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Estudo de Crânio Loomis 3/4"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Mídia / Material
                </label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 bg-white"
                >
                  <option value="Grafite 2B-6B no Papel Canson">Grafite Tradicional (2B a 6B)</option>
                  <option value="Nanquim e Canetas Fineliner">Nanquim / Bico de Pena</option>
                  <option value="Pintura Digital (Procreate/Photoshop)">Pintura Digital (Tablet)</option>
                  <option value="Pintura a Óleo sobre Tela">Pintura a Óleo</option>
                  <option value="Aquarela Tradicional">Aquarela Tradicional</option>
                  <option value="Carvão Vegetal e Sanguínea">Carvão Vegetal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Tempo Dedicado na Prancheta (minutos)
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Foco Técnico Principal
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 bg-white"
                >
                  <option value="Construção de Proporções e Anatomia">Proporção & Anatomia (Loomis)</option>
                  <option value="Perspectiva Espacial e Pontos de Fuga">Perspectiva & Caixas no Espaço</option>
                  <option value="Escala de Valores e Iluminação">Valores Tonais & Contraste</option>
                  <option value="Qualidade de Linha e Hachuras">Linhas e Qualidade de Traço</option>
                  <option value="Composição e Enquadramento">Composição Narrativa</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Classificação do Objeto / Sujeito
                </label>
                <select
                  value={subjectCategory}
                  onChange={(e) => setSubjectCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 bg-white font-mono-code"
                >
                  <option value="auto">Auto-detectar com IA (Coroa, Objeto, Rosto, Cenário)</option>
                  <option value="objeto_natureza_morta">Objeto / Coroa / Natureza Morta (Simetria e Elipses, sem Loomis facial)</option>
                  <option value="rosto_retrato">Retrato / Rosto Humano (Método Loomis e Três Terços)</option>
                  <option value="cenario_perspectiva">Cenário / Arquitetura / Perspectiva</option>
                  <option value="figura_humana">Figura Humana Completa (Gesto e Anatomia)</option>
                </select>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Previne falso-positivo facial: objetos inanimados e coroas recebem avaliação de simetria e elipses ao invés de anatomia humana.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!imagePreview}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-semibold rounded shadow transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Enfileirar Análise Assíncrona & Iniciar Auditoria</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
