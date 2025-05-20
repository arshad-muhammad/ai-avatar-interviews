
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AvatarCanvas from '@/components/AvatarCanvas';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const InterviewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
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
          
        if (interviewError || !interview) {
          console.error("Error loading interview:", interviewError);
          toast({
            title: "Error",
            description: "Failed to load interview details.",
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
          jobTitle: interview.jobs.title,
          jobDescription: interview.jobs.description
        });
        
        if (questionData && questionData.length > 0) {
          setQuestions(questionData);
        } else {
          // Fallback demo questions if none are found
          setQuestions([
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
          ]);
        }
        
        // Initialize responses array with empty strings
        setResponses(Array(questionData?.length || 5).fill(''));
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
      
      toast({
        title: "Interview completed",
        description: "Thank you for completing the interview!",
      });
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscript('');
    }
  };
  
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
  
  const finishInterview = () => {
    // For candidates, clear the session data
    if (candidateId) {
      localStorage.removeItem('candidateId');
      localStorage.removeItem('candidateName');
      localStorage.removeItem('interviewId');
    }
    
    navigate(candidateId ? '/' : `/feedback/${id}`);
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
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome to your Interview</h1>
            <p className="mb-6 text-gray-600 text-center">
              For the position of <span className="font-semibold">{interviewData?.jobTitle}</span>
            </p>
            
            <form onSubmit={handleNameSubmit}>
              <div className="mb-6">
                <label htmlFor="candidate-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Please enter your name to begin
                </label>
                <input
                  type="text"
                  id="candidate-name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Your Full Name"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Start Interview
              </Button>
            </form>
          </div>
        </div>
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
              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Interview Completed!</h2>
                  <p className="text-gray-600 mb-8">
                    Thank you, {candidateName}, for completing the interview. Your responses have been recorded.
                  </p>
                  
                  <Button onClick={finishInterview} size="lg">
                    {candidateId ? "Return to Home" : "View Results"}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-500">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      Candidate: {candidateName}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-brand-blue h-2 rounded-full" 
                      style={{ width: `${((currentQuestionIndex + 1) / (questions.length || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    {questions[currentQuestionIndex]?.question || "Loading question..."}
                  </h3>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow mb-6 flex-grow">
                  <div className="mb-4 flex items-center">
                    <h4 className="font-medium">Your Answer</h4>
                    {isRecording && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 animate-pulse">
                        Recording...
                      </span>
                    )}
                  </div>
                  
                  {transcript ? (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md min-h-[100px]">
                      {transcript}
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md min-h-[100px] text-gray-400 flex items-center justify-center">
                      {isRecording ? "Listening..." : "Click Record to answer the question"}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={startRecording} 
                    disabled={isRecording} 
                    variant={isRecording ? "outline" : "default"}
                    className="flex-1"
                  >
                    {isRecording ? "Recording..." : "Record Answer"}
                  </Button>
                  <Button 
                    onClick={submitAnswer} 
                    disabled={isRecording || !transcript}
                    className="flex-1"
                  >
                    {currentQuestionIndex === (questions.length || 0) - 1 ? "Finish Interview" : "Next Question"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
