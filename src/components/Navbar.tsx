
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brand-blue">
          InterviewAI
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-brand-blue">
                Dashboard
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-brand-blue">
                Login
              </Link>
              <Button asChild className="bg-brand-accent hover:bg-opacity-90">
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
