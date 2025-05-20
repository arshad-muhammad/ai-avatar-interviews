
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CandidateNameFormProps {
  candidateName: string;
  setCandidateName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  jobTitle?: string;
}

const CandidateNameForm: React.FC<CandidateNameFormProps> = ({
  candidateName,
  setCandidateName,
  onSubmit,
  jobTitle
}) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateName.trim() === '') {
      toast({
        title: "Name required",
        description: "Please enter your name to begin the interview.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to your Interview</h1>
        {jobTitle && (
          <p className="mb-6 text-gray-600 text-center">
            For the position of <span className="font-semibold">{jobTitle}</span>
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
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
  );
};

export default CandidateNameForm;
