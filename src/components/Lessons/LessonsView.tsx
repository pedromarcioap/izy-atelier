import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Award, 
  BookOpen, 
  ExternalLink, 
  X, 
  CheckCircle, 
  Target, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Lesson } from '../../types';
import { CURATED_LESSONS } from '../../data/mockData';

interface LessonsViewProps {
  onPracticeLesson: (lesson: Lesson) => void;
  selectedLessonId?: string | null;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  onPracticeLesson,
  selectedLessonId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeLessonModal, setActiveLessonModal] = useState<Lesson | null>(() => {
    if (selectedLessonId) {
      return CURATED_LESSONS.find((l) => l.id === selectedLessonId) || null;
    }
    return null;
  });

  const categories = ['Todos', 'Fundamentos', 'Perspectiva', 'Anatomia', 'Luz e Valores'];

  const filteredLessons = selectedCategory === 'Todos'
    ? CURATED_LESSONS
    : CURATED_LESSONS.filter((l) => l.category === selectedCategory);

  return (
    <div id="lessons-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
            Trilhas Pedagógicas & Curadoria de Mestres
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Aulas & Fundamentos do Desenho
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mt-1 leading-relaxed">
            Aulas curadas de grandes mestres da arte fundamental (Stan Prokopenko, Marco Bucci, Moderndayjames). Cada vídeo possui um exercício prático integrado com análise de visão computacional no Ateliê.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            id={`lesson-card-${lesson.id}`}
            className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col hover:border-neutral-400 hover:shadow-md transition-all group"
          >
            {/* Thumbnail Box */}
            <div 
              onClick={() => setActiveLessonModal(lesson)}
              className="relative aspect-video bg-neutral-900 overflow-hidden cursor-pointer"
            >
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/95 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-neutral-950 ml-0.5" />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono-code text-white">
                <span className="px-2 py-0.5 bg-neutral-900/80 backdrop-blur-sm rounded">
                  {lesson.category}
                </span>
                <span className="px-2 py-0.5 bg-neutral-900/80 backdrop-blur-sm rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.durationMinutes} min
                </span>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-mono-code text-neutral-500 mb-1">
                  <span>{lesson.instructor}</span>
                  <span>•</span>
                  <span>Nível {lesson.level}</span>
                </div>
                <h3 
                  onClick={() => setActiveLessonModal(lesson)}
                  className="font-display font-semibold text-sm text-neutral-900 line-clamp-2 hover:text-neutral-600 cursor-pointer"
                >
                  {lesson.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              {/* Practical Drill Callout */}
              <div className="pt-3 border-t border-neutral-100">
                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <span className="text-[10px] font-mono-code text-neutral-500 uppercase tracking-wider block mb-0.5">
                    Exercício Anexo:
                  </span>
                  <p className="text-xs font-medium text-neutral-800 line-clamp-1">
                    {lesson.practicalExercise.title}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setActiveLessonModal(lesson)}
                    className="flex-1 py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold rounded text-center transition-colors"
                  >
                    Assistir Aula
                  </button>
                  <button
                    onClick={() => onPracticeLesson(lesson)}
                    className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                    title="Praticar e Enviar para o Estúdio AI"
                  >
                    <span>Praticar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Video & Study Modal */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-mono-code uppercase rounded">
                  {activeLessonModal.category}
                </span>
                <span className="font-semibold text-xs text-neutral-600 font-mono-code">
                  {activeLessonModal.instructor} ({activeLessonModal.instructorTitle})
                </span>
              </div>
              <button
                onClick={() => setActiveLessonModal(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeLessonModal.youtubeId}?autoplay=1&rel=0`}
                title={activeLessonModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Lesson Details & Exercise */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <h2 className="font-display font-bold text-lg text-neutral-900">
                  {activeLessonModal.title}
                </h2>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {activeLessonModal.summary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div>
                <span className="font-mono-code text-[11px] font-semibold text-neutral-700 uppercase tracking-wider block mb-2">
                  Pontos Fundamentais da Aula:
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-700 pl-4 list-disc">
                  {activeLessonModal.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx}>- {takeaway}</li>
                  ))}
                </ul>
              </div>

              {/* Practical Exercise Box */}
              <div className="bg-neutral-900 text-white p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="font-mono-code text-[11px] text-amber-300 font-semibold uppercase">
                      Exercício de Prancha Obrigatório
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm">
                    {activeLessonModal.practicalExercise.title}
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
                    {activeLessonModal.practicalExercise.prompt}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-mono-code text-neutral-400">
                    <span>Tempo: {activeLessonModal.practicalExercise.recommendedTime}</span>
                    <span>•</span>
                    <span>Meta: {activeLessonModal.practicalExercise.rubricTarget}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const current = activeLessonModal;
                    setActiveLessonModal(null);
                    onPracticeLesson(current);
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-950 rounded text-xs font-bold shrink-0 transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Sparkles className="w-4 h-4 text-neutral-900" />
                  <span>Praticar no Estúdio AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
