
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MetricsCard from '@/components/MetricsCard';
import JobCard from '@/components/JobCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clipboard, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalInterviews: 0,
    averageScore: '0%',
    completionRate: '0%'
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (jobsError) throw jobsError;
        
        // Fetch interviews with job information
        const { data: interviewsData, error: interviewsError } = await supabase
          .from('interviews')
          .select(`
            *,
            jobs:job_id (
              title
            ),
            candidates:id (
              count
            )
          `)
          .order('created_at', { ascending: false });
          
        if (interviewsError) throw interviewsError;
        
        // Calculate metrics
        const totalInterviews = interviewsData?.length || 0;
        const completedInterviews = interviewsData?.filter(i => i.status === 'completed')?.length || 0;
        const completionRate = totalInterviews > 0 ? Math.round((completedInterviews / totalInterviews) * 100) : 0;
        
        setJobs(jobsData || []);
        setInterviews(interviewsData || []);
        setMetrics({
          totalInterviews,
          averageScore: '78%', // Mock data for now
          completionRate: `${completionRate}%`
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleCopyInterviewLink = (interviewId: string) => {
    const link = `${window.location.origin}/interview/access`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copied!',
      description: 'Share this link with candidates to access the interview',
    });
  };
  
  // If we don't have real data yet, use mock data
  const displayJobs = jobs.length > 0 ? jobs : [
    {
      id: '1',
      title: 'Frontend Developer',
      description: 'We are looking for a passionate Frontend Developer proficient in React.js, JavaScript, HTML, and CSS to join our team. The ideal candidate should have a strong understanding of modern frontend frameworks and design patterns.',
      created_at: '2025-05-01T12:00:00.000Z',
    },
    {
      id: '2',
      title: 'UX Designer',
      description: 'An experienced UX Designer with a portfolio of digital products. You should be able to demonstrate your design thinking process and have experience with user research, wireframing, and prototyping.',
      created_at: '2025-05-10T12:00:00.000Z',
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      description: 'Looking for a DevOps Engineer to help build and maintain our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines is required.',
      created_at: '2025-05-15T12:00:00.000Z',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.companyName} Dashboard</h1>
              <p className="text-gray-600">Manage your interviews and view candidate insights</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild>
                <Link to="/interview/create">Create New Interview</Link>
              </Button>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <MetricsCard
              title="Total Interviews"
              value={metrics.totalInterviews}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>}
              trend={{ direction: 'up', value: '15%' }}
            />
            
            <MetricsCard
              title="Average Score"
              value={metrics.averageScore}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>}
              trend={{ direction: 'up', value: '3%' }}
            />
            
            <MetricsCard
              title="Completion Rate"
              value={metrics.completionRate}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              trend={{ direction: 'neutral', value: '0%' }}
            />
          </div>
          
          {/* Shareable Interviews */}
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Shareable Interviews</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="bg-white rounded-lg overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {interviews.length > 0 ? (
                      interviews.map((interview) => (
                        <tr key={interview.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{interview.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{interview.jobs?.title || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{interview.access_code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{interview.password}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{interview.candidates?.[0]?.count || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              interview.status === 'active' ? 'bg-green-100 text-green-800' : 
                              interview.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleCopyInterviewLink(interview.id)}
                                className="text-gray-600 hover:text-brand-blue"
                                title="Copy interview link"
                              >
                                <Clipboard className="h-5 w-5" />
                              </button>
                              
                              <Link 
                                to={`/interview/${interview.id}`}
                                className="text-gray-600 hover:text-brand-blue"
                                title="Preview interview"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No interviews available. Create your first interview to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Job Listings */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Job Positions</h2>
              <Button variant="outline" asChild>
                <Link to="/jobs/create">Add New Job</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayJobs.map((job) => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  description={job.description}
                  interviewsCount={job.interviewsCount || 0}
                  createdAt={job.created_at}
                />
              ))}
            </div>
          </div>
          
          {/* Recent Interviews */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Interviews</h2>
              <Button variant="outline" asChild>
                <Link to="/interviews">View All</Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">John Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap">Frontend Developer</td>
                    <td className="px-6 py-4 whitespace-nowrap">May 19, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">85%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/interviews/1" className="text-brand-blue hover:underline">View</Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Sarah Johnson</td>
                    <td className="px-6 py-4 whitespace-nowrap">UX Designer</td>
                    <td className="px-6 py-4 whitespace-nowrap">May 18, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">92%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/interviews/2" className="text-brand-blue hover:underline">View</Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Michael Lee</td>
                    <td className="px-6 py-4 whitespace-nowrap">DevOps Engineer</td>
                    <td className="px-6 py-4 whitespace-nowrap">May 17, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">78%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/interviews/3" className="text-brand-blue hover:underline">View</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
