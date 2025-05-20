
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [customQuestions, setCustomQuestions] = useState(['']);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddCustomQuestion = () => {
    setCustomQuestions([...customQuestions, '']);
  };
  
  const handleCustomQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...customQuestions];
    updatedQuestions[index] = value;
    setCustomQuestions(updatedQuestions);
  };
  
  const handleRemoveCustomQuestion = (index: number) => {
    const updatedQuestions = [...customQuestions];
    updatedQuestions.splice(index, 1);
    setCustomQuestions(updatedQuestions);
  };
  
  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    
    try {
      // Mock API call to generate questions
      setTimeout(() => {
        const mockGeneratedQuestions = [
          "What experience do you have with modern JavaScript frameworks like React?",
          "Can you describe a challenging project you worked on and how you overcame obstacles?",
          "How do you stay updated with the latest industry trends and technologies?",
          "Describe your approach to debugging a complex issue in a large codebase.",
          "How do you handle feedback and criticism of your work?",
          "Tell me about a time when you had to learn a new technology quickly for a project."
        ];
        
        setGeneratedQuestions(mockGeneratedQuestions);
        setCurrentStep(3);
        setIsLoading(false);
        
        toast({
          title: "Questions generated",
          description: "AI has generated interview questions based on the job description.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleCreateInterview = () => {
    // Combine custom and generated questions
    const allQuestions = [...customQuestions.filter(q => q.trim() !== ''), ...generatedQuestions];
    
    // Save to localStorage for demo purposes
    localStorage.setItem('interviewSetup', JSON.stringify({
      jobTitle,
      jobDescription,
      questions: allQuestions
    }));
    
    toast({
      title: "Interview created",
      description: "Your AI interview has been created successfully.",
    });
    
    navigate('/interview/1234');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-10 text-center">Create AI Interview</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-brand-blue' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-brand-blue' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              {/* Step 1: Job Description */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Job Details</h2>
                    <p className="text-gray-600 mb-6">
                      Enter job details to help our AI generate relevant interview questions.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input 
                        id="job-title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Frontend Developer"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="job-description">Job Description</Label>
                      <Textarea 
                        id="job-description"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentStep(2)}>
                      Next: Add Custom Questions
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Custom Questions */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Custom Questions (Optional)</h2>
                    <p className="text-gray-600 mb-6">
                      Add your own custom interview questions or skip to generate AI questions.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {customQuestions.map((question, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Textarea
                          value={question}
                          onChange={(e) => handleCustomQuestionChange(index, e.target.value)}
                          placeholder="Enter your question here..."
                          className="flex-grow"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveCustomQuestion(index)}
                          className="mt-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      onClick={handleAddCustomQuestion}
                      className="w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Another Question
                    </Button>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button onClick={handleGenerateQuestions} disabled={isLoading}>
                      {isLoading ? "Generating..." : "Generate AI Questions"}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Preview */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Review Interview Questions</h2>
                    <p className="text-gray-600 mb-6">
                      Review all questions that will be used in this interview.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">AI Generated Questions:</h3>
                    <ul className="space-y-2 ml-5">
                      {generatedQuestions.map((question, index) => (
                        <li key={`ai-${index}`} className="list-disc text-gray-700">{question}</li>
                      ))}
                    </ul>
                    
                    {customQuestions.filter(q => q.trim() !== '').length > 0 && (
                      <>
                        <h3 className="font-semibold text-gray-700 mt-6">Your Custom Questions:</h3>
                        <ul className="space-y-2 ml-5">
                          {customQuestions
                            .filter(q => q.trim() !== '')
                            .map((question, index) => (
                              <li key={`custom-${index}`} className="list-disc text-gray-700">{question}</li>
                            ))
                          }
                        </ul>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleCreateInterview}>
                      Create Interview
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterviewSetupPage;
