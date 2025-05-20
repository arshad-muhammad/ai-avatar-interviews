
import React from 'react';
import { Button } from '@/components/ui/button';

interface InterviewCompletedProps {
  candidateName: string;
  onFinish: () => void;
  isCandidateView: boolean;
}

const InterviewCompleted: React.FC<InterviewCompletedProps> = ({
  candidateName,
  onFinish,
  isCandidateView
}) => {
  return (
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
        
        <Button onClick={onFinish} size="lg">
          {isCandidateView ? "Return to Home" : "View Results"}
        </Button>
      </div>
    </div>
  );
};

export default InterviewCompleted;
