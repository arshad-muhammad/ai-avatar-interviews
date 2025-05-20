
import React from 'react';
import AvatarCanvas from '@/components/AvatarCanvas';
import { useAuth } from '@/contexts/AuthContext';
import CandidateNameForm from '@/components/interview/CandidateNameForm';
import InterviewCompleted from '@/components/interview/InterviewCompleted';
import QuestionSection from '@/components/interview/QuestionSection';
import { useInterviewData } from '@/hooks/useInterviewData';
import { useInterviewActions } from '@/hooks/useInterviewActions';
import { useToast } from '@/hooks/use-toast';

const InterviewPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    isLoading,
    interviewData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    candidateName,
    setCandidateName,
    candidateId,
    isNameSubmitted,
    setIsNameSubmitted,
    transcript,
    setTranscript,
    responses,
    setResponses,
    isCompleted,
    setIsCompleted,
    questions
  } = useInterviewData(user?.id || null);

  const {
    isRecording,
    startRecording,
    submitAnswer,
    finishInterview
  } = useInterviewActions({
    candidateId,
    id: interviewData?.id,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    transcript,
    setTranscript,
    responses,
    setResponses,
    setIsCompleted,
    candidateName,
    interviewData
  });

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateName.trim() === '') {
      toast({
        title: "Name required",
        description: "Please enter your name to begin the interview.",
        variant: "destructive",
      });
      return;
    }
    setIsNameSubmitted(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading Interview Session...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isNameSubmitted ? (
        <CandidateNameForm 
          candidateName={candidateName}
          setCandidateName={setCandidateName}
          onSubmit={handleNameSubmit}
          jobTitle={interviewData?.jobTitle}
        />
      ) : (
        <div className="flex-grow flex flex-col md:flex-row bg-gray-50">
          {/* Avatar Section */}
          <div className="md:w-1/2 bg-gray-900 flex flex-col">
            <div className="h-full flex items-center justify-center p-6">
              <div className="avatar-container w-full max-w-lg bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <AvatarCanvas />
              </div>
            </div>
          </div>
          
          {/* Interview Content */}
          <div className="md:w-1/2 flex flex-col p-6">
            {isCompleted ? (
              <InterviewCompleted 
                candidateName={candidateName}
                onFinish={finishInterview}
                isCandidateView={!!candidateId}
              />
            ) : (
              <QuestionSection 
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length || 0}
                candidateName={candidateName}
                currentQuestion={questions[currentQuestionIndex]?.question || ''}
                transcript={transcript}
                isRecording={isRecording}
                startRecording={startRecording}
                submitAnswer={submitAnswer}
                isLastQuestion={currentQuestionIndex === (questions.length || 0) - 1}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
