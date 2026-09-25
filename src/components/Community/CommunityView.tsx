import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Clock, 
  Layers, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  UserCheck, 
  PenTool,
  X,
  Share2
} from 'lucide-react';
import { CommunityPost, PeerReview } from '../../types';

interface CommunityViewProps {
  posts: CommunityPost[];
  onToggleLike: (postId: string) => void;
  onSubmitReview: (postId: string, comment: string) => void;
  onOpenStudyInStudio: (imageUrl: string, title: string, medium: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  onToggleLike,
  onSubmitReview,
  onOpenStudyInStudio,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'aguardando_redline' | 'revisado_ia' | 'resolvido'>('all');
  const [activeReviewPost, setActiveReviewPost] = useState<CommunityPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const filteredPosts = filterStatus === 'all'
    ? posts
    : posts.filter((p) => p.status === filterStatus);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewPost || !newCommentText.trim()) return;

    onSubmitReview(activeReviewPost.id, newCommentText.trim());
    setNewCommentText('');
  };

  return (
    <div id="community-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
            Feed Comunitário // Peer-Review de Ateliê
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Comunidade & Troca de Redlines
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mt-1 leading-relaxed">
            O "Strava para Artistas": compartilhe seus treinos com tempo na prancheta e materiais utilizados. Receba marcações e anotações construtivas de outros desenhistas e pintores.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Todos os Treinos
          </button>
          <button
            onClick={() => setFilterStatus('aguardando_redline')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterStatus === 'aguardando_redline'
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Aguardando Redline
          </button>
          <button
            onClick={() => setFilterStatus('revisado_ia')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterStatus === 'revisado_ia'
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Auditados pela IA
          </button>
        </div>
      </div>

      {/* Feed Stream (Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            id={`post-card-${post.id}`}
            className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            {/* Author Bar */}
            <div className="p-3.5 flex items-center justify-between border-b border-neutral-100 bg-neutral-50/40">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 leading-tight">
                    {post.authorName}
                  </h4>
                  <span className="text-[10px] text-neutral-500 font-mono-code block">
                    {post.authorHandle} • {post.createdAt}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold uppercase ${
                post.status === 'aguardando_redline'
                  ? 'bg-amber-100 text-amber-800'
                  : post.status === 'revisado_ia'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {post.status === 'aguardando_redline' ? 'Pede Redline' : 'Revisado'}
              </span>
            </div>

            {/* Artwork Image Container */}
            <div 
              onClick={() => setActiveReviewPost(post)}
              className="relative aspect-square bg-neutral-950 overflow-hidden cursor-pointer group"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Strava Workout Metric Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="px-2 py-1 bg-neutral-900/85 backdrop-blur-sm text-white font-mono-code text-[11px] rounded flex items-center gap-1.5 shadow">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {post.timeSpentMinutes} min na prancheta
                </span>
              </div>

              {post.aiOverallScore && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-neutral-900/85 backdrop-blur-sm text-white font-mono-code text-[11px] rounded font-bold shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Score IA: {post.aiOverallScore}
                  </span>
                </div>
              )}

              {/* Hover Overlay CTA */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 bg-white text-neutral-900 rounded text-xs font-semibold shadow">
                  Ver Anotações & Redlines
                </span>
              </div>
            </div>

            {/* Post Description */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 
                  onClick={() => setActiveReviewPost(post)}
                  className="font-display font-semibold text-sm text-neutral-900 hover:text-neutral-600 cursor-pointer"
                >
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>

                {/* Medium & Goal */}
                <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-[11px] font-mono-code text-neutral-500">
                  <span>Mídia: {post.medium}</span>
                  <span>•</span>
                  <span>Meta: {post.targetGoal}</span>
                </div>
              </div>

              {/* Action Bar (Likes + Reviews) */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Kudos / Like Button */}
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      post.hasLiked ? 'text-red-600' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-red-600' : ''}`} />
                    <span className="font-mono-code">{post.likesCount}</span>
                  </button>

                  {/* Reviews Count */}
                  <button
                    onClick={() => setActiveReviewPost(post)}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono-code">{post.peerReviews.length}</span>
                  </button>
                </div>

                <button
                  onClick={() => onOpenStudyInStudio(post.imageUrl, post.title, post.medium)}
                  className="text-neutral-600 hover:text-neutral-950 text-xs font-semibold flex items-center gap-1"
                >
                  <PenTool className="w-3 h-3" />
                  <span>Inspecionar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Peer-Review Detail & Comment Drawer Modal */}
      {activeReviewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col md:flex-row">
            {/* Left Artwork Preview (50%) */}
            <div className="md:w-1/2 bg-neutral-950 p-4 flex flex-col justify-between relative">
              <div className="flex items-center justify-between text-white text-xs mb-2">
                <span className="font-mono-code text-[11px] text-neutral-400">
                  {activeReviewPost.authorName} • {activeReviewPost.timeSpentMinutes} min
                </span>
                <span className="px-2 py-0.5 bg-neutral-800 rounded font-mono-code text-[10px]">
                  {activeReviewPost.medium}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <img
                  src={activeReviewPost.imageUrl}
                  alt={activeReviewPost.title}
                  className="max-h-[460px] max-w-full object-contain rounded shadow"
                />
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    const post = activeReviewPost;
                    setActiveReviewPost(null);
                    onOpenStudyInStudio(post.imageUrl, post.title, post.medium);
                  }}
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5 text-amber-400" />
                  <span>Abrir na Prancheta do Estúdio AI para Redline</span>
                </button>
              </div>
            </div>

            {/* Right Peer-Review Threads (50%) */}
            <div className="md:w-1/2 flex flex-col max-h-[550px] md:max-h-none overflow-hidden bg-white">
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <h3 className="font-display font-bold text-sm text-neutral-900">
                    {activeReviewPost.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono-code">
                    {activeReviewPost.peerReviews.length} contribuições de peer-review
                  </p>
                </div>
                <button
                  onClick={() => setActiveReviewPost(null)}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Comments Stream */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-800 leading-relaxed">
                  <span className="font-semibold text-neutral-900 block mb-1">Nota do Autor:</span>
                  {activeReviewPost.description}
                </div>

                {activeReviewPost.peerReviews.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs">
                    Nenhum peer-review registrado ainda. Seja o primeiro a deixar uma crítica construtiva!
                  </div>
                ) : (
                  activeReviewPost.peerReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 border border-neutral-200 rounded-lg space-y-1.5 bg-white shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={review.authorAvatar}
                            alt={review.authorName}
                            className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                          />
                          <div>
                            <span className="font-semibold text-xs text-neutral-900">
                              {review.authorName}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono-code ml-1.5">
                              ({review.authorRole})
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono-code">
                          {review.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed pl-8">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* New Comment Submission Form */}
              <form onSubmit={handleSendComment} className="p-3 border-t border-neutral-200 bg-neutral-50">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Escreva uma dica técnica ou análise construtiva..."
                    className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="p-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded transition-colors"
                    title="Enviar Feedback"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
