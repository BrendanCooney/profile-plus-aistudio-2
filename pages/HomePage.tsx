import React from 'react';
import { SparklesIcon } from '../components/icons';

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  return (
    <div className="flex-grow flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          Create Your Professional Profile in <span className="text-primary-600">Seconds</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
          ProfilePlus uses AI to instantly craft a stunning online CV from your existing resume. Share one link with recruiters and land your dream job faster.
        </p>
        <div className="mt-10 flex justify-center">
          <button
            onClick={onLoginClick}
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-lg transform transition-transform hover:scale-105"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Get Started for Free
          </button>
        </div>
        <div className="mt-20">
          <div className="relative">
             <img src="https://picsum.photos/seed/jobprofile/1024/400" alt="Professional Profile Example" className="rounded-lg shadow-2xl mx-auto" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
