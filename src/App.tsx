import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { StudioView } from './components/Studio/StudioView';
import { UploadModal } from './components/Studio/UploadModal';
import { LessonsView } from './components/Lessons/LessonsView';
import { CommunityView } from './components/Community/CommunityView';
import { ProfileView } from './components/Profile/ProfileView';
import { BadgesModal } from './components/Badges/BadgesModal';
import { 
  AnalysisJob, 
  ArtworkAnalysisResult, 
  CommunityPost, 
  ArtistProfile, 
  Lesson 
} from './types';
import { 
  SAMPLE_ARTWORKS, 
  INITIAL_COMMUNITY_POSTS, 
  CURRENT_ARTIST_PROFILE 
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'studio' | 'lessons' | 'community' | 'profile'>('studio');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);

  
  // Current active artwork job in studio (initialized with first master study)
  const [currentJob, setCurrentJob] = useState<AnalysisJob | null>(() => {
    const defaultSample = SAMPLE_ARTWORKS[0];
    return {
      id: 'job-initial-loomis',
      status: 'completed',
      progressPercent: 100,
      statusMessage: 'Análise técnica concluída',
      artworkTitle: defaultSample.title,
      medium: defaultSample.medium,
      timeSpentMinutes: defaultSample.timeSpentMinutes,
      imageUrl: defaultSample.imageUrl,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      result: defaultSample.defaultAnalysis
    };
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(CURRENT_ARTIST_PROFILE);
  const [selectedLessonForStudio, setSelectedLessonForStudio] = useState<string | null>(null);

  // Background polling ref
  const activePollingJobId = useRef<string | null>(null);

  // Poll background job when not completed
  useEffect(() => {
    if (!currentJob || currentJob.status === 'completed' || currentJob.status === 'failed') {
      activePollingJobId.current = null;
      return;
    }

    const jobId = currentJob.id;
    activePollingJobId.current = jobId;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (res.ok) {
          const updatedJob: AnalysisJob = await res.json();
          if (activePollingJobId.current === jobId) {
            setCurrentJob(updatedJob);
            if (updatedJob.status === 'completed') {
              clearInterval(interval);
              activePollingJobId.current = null;
            }
          }
        }
      } catch (err) {
        console.warn('Job polling warning:', err);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [currentJob?.id, currentJob?.status]);

  // Load initial community & profile from backend if available
  useEffect(() => {
    async function loadData() {
      try {
        const [postsRes, profileRes] = await Promise.all([
          fetch('/api/community/posts'),
          fetch('/api/profile')
        ]);
        if (postsRes.ok) {
          const posts = await postsRes.json();
          if (Array.isArray(posts) && posts.length > 0) setCommunityPosts(posts);
        }
        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile?.name) setArtistProfile(profile);
        }
      } catch (e) {
        // Fallbacks already set in state
      }
    }
    loadData();
  }, []);

  // Handle new job submission
  const handleSubmitJob = async (payload: {
    title: string;
    medium: string;
    timeSpentMinutes: number;
    imageUrl: string;
    focusArea: string;
  }) => {
    try {
      // Optimistically create queued job in client
      const tempJobId = `job-${Date.now()}`;
      const queuedJob: AnalysisJob = {
        id: tempJobId,
        status: 'queued',
        progressPercent: 10,
        statusMessage: 'Enfileirando no worker de visão computacional...',
        artworkTitle: payload.title,
        medium: payload.medium,
        timeSpentMinutes: payload.timeSpentMinutes,
        imageUrl: payload.imageUrl,
        createdAt: new Date().toISOString()
      };
      setCurrentJob(queuedJob);
      setCurrentTab('studio');

      const response = await fetch('/api/jobs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.jobId) {
          setCurrentJob((prev) => prev ? { ...prev, id: data.jobId } : null);
        }
      }
    } catch (err) {
      console.error('Submit job error:', err);
    }
  };

  // Switch to one of the preset sample artworks
  const handleSelectSampleArtwork = (sampleId: string) => {
    const sample = SAMPLE_ARTWORKS.find((s) => s.id === sampleId) || SAMPLE_ARTWORKS[0];
    const initialVersions = [
      {
        version: 1,
        label: 'v1 (Original)',
        timestamp: new Date().toISOString(),
        focusArea: 'Avaliação Inicial',
        subjectCategory: sample.defaultAnalysis.subjectCategory,
        result: sample.defaultAnalysis
      }
    ];

    const job: AnalysisJob = {
      id: `job-sample-${sample.id}`,
      status: 'completed',
      progressPercent: 100,
      statusMessage: 'Análise técnica concluída',
      artworkTitle: sample.title,
      medium: sample.medium,
      timeSpentMinutes: sample.timeSpentMinutes,
      imageUrl: sample.imageUrl,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      result: sample.defaultAnalysis,
      versions: initialVersions,
      selectedVersionIndex: 0
    };
    setCurrentJob(job);
    setCurrentTab('studio');
  };

  // Handle reanalysis submission
  const handleReanalyzeJob = async (options: {
    focusArea: string;
    subjectCategory: string;
    customInstructions?: string;
    includeUserStrokes: boolean;
    userStrokesCount: number;
    evaluationRigor: 'standard' | 'strict_master';
  }) => {
    if (!currentJob) return;

    try {
      const currentVersionNum = currentJob.reanalysisVersion || (currentJob.versions?.length || 1);
      const nextVersionNum = currentVersionNum + 1;

      // Ensure v1 is archived if versions is empty
      const existingVersions = currentJob.versions ? [...currentJob.versions] : [];
      if (existingVersions.length === 0 && currentJob.result) {
        existingVersions.push({
          version: 1,
          label: 'v1 (Original)',
          timestamp: currentJob.completedAt || currentJob.createdAt,
          focusArea: 'Avaliação Inicial',
          subjectCategory: currentJob.result.subjectCategory,
          result: currentJob.result
        });
      }

      // Optimistically set reanalyzing job
      const reanalysisJob: AnalysisJob = {
        ...currentJob,
        status: 'queued',
        progressPercent: 10,
        statusMessage: `Enfileirando reanálise técnica da IA (v${nextVersionNum})...`,
        isReanalysis: true,
        reanalysisVersion: nextVersionNum,
        reanalysisNotes: options.customInstructions,
        versions: existingVersions,
        selectedVersionIndex: existingVersions.length
      };

      setCurrentJob(reanalysisJob);

      const response = await fetch('/api/jobs/reanalyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: currentJob.id,
          imageUrl: currentJob.imageUrl,
          title: currentJob.artworkTitle,
          medium: currentJob.medium,
          focusArea: options.focusArea,
          subjectCategory: options.subjectCategory,
          customInstructions: options.customInstructions,
          includeUserStrokes: options.includeUserStrokes,
          userStrokesCount: options.userStrokesCount,
          evaluationRigor: options.evaluationRigor
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.jobId) {
          setCurrentJob((prev) => prev ? { ...prev, id: data.jobId } : null);
        }
      }
    } catch (err) {
      console.error('Reanalyze job error:', err);
    }
  };

  // Handle switching between analysis versions
  const handleSelectJobVersion = (versionIndex: number) => {
    if (!currentJob || !currentJob.versions || !currentJob.versions[versionIndex]) return;
    const selectedVersion = currentJob.versions[versionIndex];
    setCurrentJob((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        selectedVersionIndex: versionIndex,
        result: selectedVersion.result
      };
    });
  };

  // Practice drill from a lesson
  const handlePracticeLesson = (lesson: Lesson) => {
    // Preload an appropriate sample or prompt
    setSelectedLessonForStudio(lesson.id);
    setIsUploadModalOpen(true);
  };

  // Publish from studio to community feed
  const handlePublishToCommunity = async (
    analysis: ArtworkAnalysisResult,
    title: string,
    imageUrl: string,
    medium: string
  ) => {
    try {
      const payload = {
        title,
        description: `Estudo técnico submetido ao Ateliê. Diagnóstico IA: ${analysis.technicalSummary}`,
        medium,
        timeSpentMinutes: currentJob?.timeSpentMinutes || 45,
        targetGoal: analysis.actionPlan.nextStudyExercise,
        imageUrl,
        aiOverallScore: analysis.overallScore,
        tags: [analysis.artStyleDetected, medium, 'Estudo de Ateliê']
      };

      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const createdPost: CommunityPost = await res.json();
        setCommunityPosts((prev) => [createdPost, ...prev]);
        setCurrentTab('community');
      }
    } catch (err) {
      console.error('Error publishing to community:', err);
    }
  };

  // Toggle Like on community post
  const handleToggleLike = async (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: nextLiked,
            likesCount: post.likesCount + (nextLiked ? 1 : -1)
          };
        }
        return post;
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
    } catch (err) {
      console.warn('Like toggle error:', err);
    }
  };

  // Submit a peer review comment on a post
  const handleSubmitReview = async (postId: string, comment: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });

      if (res.ok) {
        const review = await res.json();
        setCommunityPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                peerReviews: [review, ...post.peerReviews]
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error('Error submitting peer review:', err);
    }
  };

  // Open artwork from Community or Profile into the Studio
  const handleOpenStudyInStudio = (imageUrl: string, title: string, medium: string) => {
    const job: AnalysisJob = {
      id: `job-inspect-${Date.now()}`,
      status: 'completed',
      progressPercent: 100,
      statusMessage: 'Obra pronta para inspeção e redlines',
      artworkTitle: title,
      medium,
      imageUrl,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      result: SAMPLE_ARTWORKS[0].defaultAnalysis // fallback or analysis
    };
    setCurrentJob(job);
    setCurrentTab('studio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        activeJob={currentJob}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        profile={artistProfile}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'studio' && (
          <StudioView
            currentJob={currentJob}
            onSelectSampleArtwork={handleSelectSampleArtwork}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onSelectClass={(classId) => {
              setSelectedLessonForStudio(classId);
              setCurrentTab('lessons');
            }}
            onPublishToCommunity={handlePublishToCommunity}
            onReanalyzeJob={handleReanalyzeJob}
            onSelectJobVersion={handleSelectJobVersion}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsView
            onPracticeLesson={handlePracticeLesson}
            selectedLessonId={selectedLessonForStudio}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView
            posts={communityPosts}
            onToggleLike={handleToggleLike}
            onSubmitReview={handleSubmitReview}
            onOpenStudyInStudio={handleOpenStudyInStudio}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={artistProfile}
            onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
            onOpenStudy={(title) => {
              const matched = SAMPLE_ARTWORKS.find((s) => s.title.includes(title));
              if (matched) {
                handleSelectSampleArtwork(matched.id);
              } else {
                setCurrentTab('studio');
              }
            }}
          />
        )}
      </main>

      {/* Badges Collection & Achievements Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        profile={artistProfile}
        onSelectTab={setCurrentTab}
      />

      {/* Upload / New Training Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmitJob={handleSubmitJob}
        onSelectSample={handleSelectSampleArtwork}
      />

    </div>
  );
}
