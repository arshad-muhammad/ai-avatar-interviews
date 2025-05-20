
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const CandidateAccessPage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [password, setPassword] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if the interview exists with matching access code and password
      const { data: interview, error } = await supabase
        .from('interviews')
        .select('id, status')
        .eq('access_code', accessCode)
        .eq('password', password)
        .single();

      if (error || !interview) {
        toast({
          title: "Access Denied",
          description: "Invalid access code or password. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (interview.status !== 'active') {
        toast({
          title: "Interview Unavailable",
          description: "This interview is no longer active.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create a new candidate entry
      const { data: candidate, error: candidateError } = await supabase
        .from('candidates')
        .insert({ 
          name: candidateName,
          interview_id: interview.id,
          status: 'pending'
        })
        .select('id')
        .single();

      if (candidateError) {
        toast({
          title: "Error",
          description: "Failed to register candidate. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Store candidate info in localStorage for the interview session
      localStorage.setItem('candidateId', candidate.id);
      localStorage.setItem('candidateName', candidateName);
      localStorage.setItem('interviewId', interview.id);

      // Navigate to the interview page
      navigate(`/interview/${interview.id}`);
    } catch (error) {
      console.error("Error accessing interview:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Access Interview</CardTitle>
          <CardDescription className="text-center">
            Enter the access code and password provided by the company
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Full Name
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <Input
                id="accessCode"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Start Interview"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to participate in this interview process.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CandidateAccessPage;
