
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuestionSectionProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  candidateName: string;
  currentQuestion: string;
  transcript: string;
  isRecording: boolean;
  startRecording: () => void;
  submitAnswer: () => void;
  isLastQuestion: boolean;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  currentQuestionIndex,
  totalQuestions,
  candidateName,
  currentQuestion,
  transcript,
  isRecording,
  startRecording,
  submitAnswer,
  isLastQuestion
}) => {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <p className="text-sm font-medium text-gray-500">
            Candidate: {candidateName}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-blue h-2 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-2">
          {currentQuestion || "Loading question..."}
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
          {isLastQuestion ? "Finish Interview" : "Next Question"}
        </Button>
      </div>
    </>
  );
};

export default QuestionSection;
