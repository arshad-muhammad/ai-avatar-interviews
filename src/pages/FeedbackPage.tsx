
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FeedbackPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, this would fetch from the API
    const savedInterviewResults = localStorage.getItem('interviewResults');
    
    setTimeout(() => {
      if (savedInterviewResults) {
        const interviewResults = JSON.parse(savedInterviewResults);
        
        // Generate mock feedback based on the interview results
        setFeedbackData({
          candidateName: interviewResults.candidateName,
          jobTitle: interviewResults.jobTitle,
          overallScore: 85,
          categories: {
            communication: 88,
            technicalFit: 83,
            confidence: 84
          },
          questions: interviewResults.questions,
          responses: interviewResults.responses,
          feedback: [
            "Strong communication skills demonstrated throughout the interview.",
            "Shows good technical knowledge but could elaborate more on implementation details.",
            "Demonstrates problem-solving skills through practical examples.",
            "Confident in answers, but occasionally hesitates before addressing technical questions.",
            "Good cultural fit with strong teamwork examples."
          ],
          recommendations: [
            "Consider providing more specific examples of code implementation.",
            "Further develop knowledge in state management techniques for complex applications.",
            "Continue to build confidence in technical explanations."
          ]
        });
      } else {
        // Fallback demo data
        setFeedbackData({
          candidateName: "John Smith",
          jobTitle: "Frontend Developer",
          overallScore: 85,
          categories: {
            communication: 88,
            technicalFit: 83,
            confidence: 84
          },
          questions: [
            "What experience do you have with React and other modern JavaScript frameworks?",
            "Can you describe a challenging project you worked on and how you overcame obstacles?",
            "How do you stay updated with the latest industry trends and technologies?",
            "Describe your approach to debugging a complex issue in a large codebase.",
            "How do you handle feedback and criticism of your work?"
          ],
          responses: [
            "I have over 5 years of experience with React and have also worked extensively with Vue.js and Angular. I've built multiple production applications using these frameworks and understand the core concepts of component-based architecture, state management, and modern JavaScript features.",
            "One of the most challenging projects I worked on was a real-time collaboration tool. We faced performance issues with simultaneous edits. I implemented a custom conflict resolution algorithm based on operational transformation which solved our issues and improved performance by 40%.",
            "I subscribe to several newsletters like JavaScript Weekly and follow influential developers on Twitter. I also dedicate time each week to explore new libraries and techniques, and I attend local meetups and conferences when possible.",
            "When debugging complex issues, I first isolate the problem by creating a minimal reproduction. Then I use browser dev tools, logging, and breakpoints to trace the issue. I also use tools like React DevTools for component-specific debugging.",
            "I view feedback as an opportunity to grow. I try to separate myself from my work and consider the feedback objectively. I ask clarifying questions to fully understand the concerns, then prioritize and implement improvements based on the input."
          ],
          feedback: [
            "Strong communication skills demonstrated throughout the interview.",
            "Shows good technical knowledge but could elaborate more on implementation details.",
            "Demonstrates problem-solving skills through practical examples.",
            "Confident in answers, but occasionally hesitates before addressing technical questions.",
            "Good cultural fit with strong teamwork examples."
          ],
          recommendations: [
            "Consider providing more specific examples of code implementation.",
            "Further develop knowledge in state management techniques for complex applications.",
            "Continue to build confidence in technical explanations."
          ]
        });
      }
      setIsLoading(false);
    }, 1500);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Analyzing Interview Results...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">Interview Feedback Report</h1>
              <p className="text-gray-600">
                Candidate: {feedbackData.candidateName} | Position: {feedbackData.jobTitle}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button>Download PDF</Button>
            </div>
          </div>
          
          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="font-bold text-3xl">{feedbackData.overallScore}%</div>
                  <div className={`ml-2 text-sm ${feedbackData.overallScore >= 80 ? 'text-green-500' : feedbackData.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {feedbackData.overallScore >= 80 ? 'Excellent' : feedbackData.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Category Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Communication</div>
                    <div className="text-sm font-medium">{feedbackData.categories.communication}%</div>
                  </div>
                  <Progress value={feedbackData.categories.communication} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Technical Fit</div>
                    <div className="text-sm font-medium">{feedbackData.categories.technicalFit}%</div>
                  </div>
                  <Progress value={feedbackData.categories.technicalFit} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Confidence</div>
                    <div className="text-sm font-medium">{feedbackData.categories.confidence}%</div>
                  </div>
                  <Progress value={feedbackData.categories.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Feedback Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardHeader>
                <CardTitle>Strengths & Areas of Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedbackData.feedback.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedbackData.recommendations.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Questions and Answers */}
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Questions & Answers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {feedbackData.questions.map((question: string, index: number) => (
                  <div key={index} className="p-6">
                    <h3 className="text-lg font-medium mb-2">Q{index + 1}: {question}</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700">{feedbackData.responses[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FeedbackPage;
