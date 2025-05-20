
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface JobCardProps {
  id: string;
  title: string;
  description: string;
  interviewsCount: number;
  createdAt: string;
}

const JobCard: React.FC<JobCardProps> = ({ id, title, description, interviewsCount, createdAt }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-brand-blue">{title}</h3>
        <p className="text-gray-500 text-sm mb-4">
          Created on {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-3 line-clamp-3">{description}</p>
        <div className="mt-auto">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {interviewsCount} interviews
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" asChild>
          <Link to={`/interviews/${id}`}>View Interviews</Link>
        </Button>
        <Button asChild>
          <Link to={`/interview/create/${id}`}>New Interview</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
