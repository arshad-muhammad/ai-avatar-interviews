
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UseInterviewActionsProps {
  candidateId: string | null;
  id?: string; 
  questions: any[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
  responses: string[];
  setResponses: (responses: string[]) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  candidateName: string;
  interviewData: any;
}

export const useInterviewActions = ({
  candidateId,
  id,
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
}: UseInterviewActionsProps) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  
  // Mock speech recognition
  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
    
    // Mock recording process with typing simulation
    const sampleAnswers = [
      "I have over 5 years of experience with React and have also worked extensively with Vue.js and Angular. I've built multiple production applications using these frameworks and understand the core concepts of component-based architecture, state management, and modern JavaScript features.",
      "One of the most challenging projects I worked on was a real-time collaboration tool. We faced performance issues with simultaneous edits. I implemented a custom conflict resolution algorithm based on operational transformation which solved our issues and improved performance by 40%.",
      "I subscribe to several newsletters like JavaScript Weekly and follow influential developers on Twitter. I also dedicate time each week to explore new libraries and techniques, and I attend local meetups and conferences when possible.",
      "When debugging complex issues, I first isolate the problem by creating a minimal reproduction. Then I use browser dev tools, logging, and breakpoints to trace the issue. I also use tools like React DevTools for component-specific debugging.",
      "I view feedback as an opportunity to grow. I try to separate myself from my work and consider the feedback objectively. I ask clarifying questions to fully understand the concerns, then prioritize and implement improvements based on the input."
    ];
    
    // Simulate typing of the answer over time
    const answer = sampleAnswers[currentQuestionIndex] || "Thank you for the question. I believe my skills and experience make me a good fit for this position.";
    let currentText = '';
    
    const typingInterval = setInterval(() => {
      if (currentText.length < answer.length) {
        currentText += answer[currentText.length];
        setTranscript(currentText);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIsRecording(false);
        }, 500);
      }
    }, 30);
  };
  
  const submitAnswer = async () => {
    // Save current response
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = transcript;
    setResponses(updatedResponses);
    
    // If candidate is identified, save this response to the database
    if (candidateId && questions[currentQuestionIndex]) {
      try {
        await supabase.from('candidate_responses').insert({
          candidate_id: candidateId,
          question_id: questions[currentQuestionIndex].id,
          response: transcript,
        });
      } catch (error) {
        console.error("Error saving response:", error);
      }
    }
    
    // Check if interview is complete
    if (currentQuestionIndex === (questions.length || 0) - 1) {
      setIsCompleted(true);
      
      // Update candidate status if applicable
      if (candidateId) {
        try {
          await supabase
            .from('candidates')
            .update({ status: 'completed' })
            .eq('id', candidateId);
        } catch (error) {
          console.error("Error updating candidate status:", error);
        }
      }
      
      // Save interview results
      const results = {
        candidateName,
        jobTitle: interviewData?.jobTitle,
        questions: questions.map(q => q.question),
        responses: updatedResponses
      };
      localStorage.setItem('interviewResults', JSON.stringify(results));
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscript('');
    }
  };
  
  const finishInterview = () => {
    // For candidates, clear the session data
    if (candidateId) {
      localStorage.removeItem('candidateId');
      localStorage.removeItem('candidateName');
      localStorage.removeItem('interviewId');
    }
    
    navigate(candidateId ? '/' : `/feedback/${id}`);
  };
  
  return {
    isRecording,
    startRecording,
    submitAnswer,
    finishInterview
  };
};
