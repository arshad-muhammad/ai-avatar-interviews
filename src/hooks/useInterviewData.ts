
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useInterviewData = (userId: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  
  // State for interview
  const [isLoading, setIsLoading] = useState(true);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  
  // Load interview data
  useEffect(() => {
    const loadInterview = async () => {
      try {
        // Check if this is a candidate accessing the interview
        const storedCandidateId = localStorage.getItem('candidateId');
        const storedInterviewId = localStorage.getItem('interviewId');
        const storedCandidateName = localStorage.getItem('candidateName');
        
        if (storedCandidateId && storedInterviewId && storedCandidateName && storedInterviewId === id) {
          // Candidate is already identified
          setCandidateId(storedCandidateId);
          setCandidateName(storedCandidateName);
          setIsNameSubmitted(true);
        }
        
        if (!id) {
          toast({
            title: "Error",
            description: "Interview not found.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Fetch interview data
        const { data: interview, error: interviewError } = await supabase
          .from('interviews')
          .select(`
            id,
            title,
            job_id,
            jobs:job_id (
              title,
              description
            )
          `)
          .eq('id', id)
          .single();
          
        if (interviewError) {
          console.error("Error loading interview:", interviewError);
          toast({
            title: "Error",
            description: "Failed to load interview details.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        if (!interview) {
          toast({
            title: "Error",
            description: "Interview not found.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Fetch interview questions
        const { data: questionData, error: questionsError } = await supabase
          .from('interview_questions')
          .select('*')
          .eq('interview_id', id)
          .order('order_number', { ascending: true });
          
        if (questionsError) {
          console.error("Error loading questions:", questionsError);
          toast({
            title: "Error",
            description: "Failed to load interview questions.",
            variant: "destructive",
          });
          return;
        }
        
        setInterviewData({
          ...interview,
          jobTitle: interview.jobs?.title || "Job Position",
          jobDescription: interview.jobs?.description || ""
        });
        
        if (questionData && questionData.length > 0) {
          setQuestions(questionData);
          // Initialize responses array with empty strings
          setResponses(Array(questionData.length).fill(''));
        } else {
          // Fallback demo questions if none are found
          const fallbackQuestions = [
            {
              id: "q1",
              question: "What experience do you have with React and other modern JavaScript frameworks?",
              order_number: 1
            },
            {
              id: "q2",
              question: "Can you describe a challenging project you worked on and how you overcame obstacles?",
              order_number: 2
            },
            {
              id: "q3",
              question: "How do you stay updated with the latest industry trends and technologies?",
              order_number: 3
            },
            {
              id: "q4",
              question: "Describe your approach to debugging a complex issue in a large codebase.",
              order_number: 4
            },
            {
              id: "q5",
              question: "How do you handle feedback and criticism of your work?",
              order_number: 5
            }
          ];
          setQuestions(fallbackQuestions);
          // Initialize responses array with empty strings for fallback questions
          setResponses(Array(fallbackQuestions.length).fill(''));
        }
      } catch (error) {
        console.error("Error in interview setup:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInterview();
  }, [id, navigate, toast]);

  return {
    isLoading,
    interviewData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isRecording,
    setIsRecording,
    candidateName,
    setCandidateName,
    candidateId,
    setCandidateId,
    isNameSubmitted,
    setIsNameSubmitted,
    transcript,
    setTranscript,
    responses,
    setResponses,
    isCompleted,
    setIsCompleted,
    questions
  };
};
