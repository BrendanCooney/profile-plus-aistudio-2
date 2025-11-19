
import React, { useState } from 'react';
import type { CandidateProfile } from '../types';
import { ContactForm } from '../components/ContactForm';
import { MapPinIcon, DocumentArrowDownIcon } from '../components/icons';

interface PublicProfilePageProps {
  profile: CandidateProfile | null;
  isPreview?: boolean;
}

const ProfileHeader: React.FC<{ name: string, role: string, location: string }> = ({ name, role, location }) => (
    <div className="bg-white p-8 rounded-t-lg shadow-lg border-b border-slate-200 text-center">
        <div className="w-32 h-32 rounded-full mx-auto bg-slate-200 mb-4 flex items-center justify-center">
            <span className="text-5xl text-slate-500 font-bold">{name.charAt(0)}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">{name}</h1>
        <p className="text-xl text-primary-600 font-medium mt-1">{role}</p>
        <div className="mt-4 flex justify-center items-center space-x-2 text-slate-500">
            <MapPinIcon className="w-5 h-5" />
            <span>{location}</span>
        </div>
    </div>
);

const ProfileSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
        <div className="text-slate-600 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

export const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ profile, isPreview = false }) => {
  const [nameRevealed, setNameRevealed] = useState(false);

  if (!profile) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile Not Found</h1>
          <p className="text-slate-600 mt-2">The requested profile could not be found.</p>
          <a href="#/" className="mt-6 inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700">Go Home</a>
        </div>
      </div>
    );
  }

  const handleContactSuccess = () => {
    setNameRevealed(true);
  };
  
  const handleDownloadCv = () => {
    if (isPreview) {
        alert("The CV will be available for download on the public profile after you save your changes.");
        return;
    }
    if (profile.cvFile) {
        const url = URL.createObjectURL(profile.cvFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV-${profile.name.replace(/\s/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else if (profile.hasCvFile) {
        alert("File storage is not connected in this demo mode. In a real deployment, the PDF would download here.");
    } else {
        alert("No CV has been uploaded by the candidate.");
    }
  };

  const displayName = nameRevealed ? profile.name : `Candidate #${profile.id.substring(0, 4)}`;
  const cvIsAvailable = !!profile.cvFile || profile.hasCvFile;

  return (
    <div className="flex-grow bg-slate-100 py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            {isPreview && (
                <div className="bg-primary-100 border-l-4 border-primary-500 text-primary-800 p-4 rounded-md mb-6 shadow-md" role="status">
                    <p className="font-bold text-lg">Preview Mode</p>
                    <p>You are viewing a preview of your unsaved changes. This page is not public. Return to the dashboard to save your profile.</p>
                </div>
            )}
            {nameRevealed && (
                 <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
                    <p className="font-bold">Contact successful!</p>
                    <p>The candidate's name has been revealed. They have been notified of your interest.</p>
                </div>
            )}
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ProfileHeader name={displayName} role={profile.role} location={profile.location} />
            
            <div className="divide-y divide-slate-200">
                <ProfileSection title="About Me">
                    <p>{profile.aboutMe}</p>
                </ProfileSection>

                <ProfileSection title="Skills">
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                        <span key={index} className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                            {skill}
                        </span>
                        ))}
                    </div>
                </ProfileSection>

                <ProfileSection title="Experience Summary">
                    <p>{profile.experienceSummary}</p>
                </ProfileSection>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ContactForm candidateId={profile.id} candidateName={profile.name} onSuccess={handleContactSuccess} />
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200 flex flex-col items-center justify-center text-center h-full">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Download CV</h3>
                <p className="text-slate-600 mb-6">Get the candidate's full resume for your records.</p>
                <button
                    onClick={handleDownloadCv}
                    disabled={!cvIsAvailable}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    Download PDF
                </button>
                 {!cvIsAvailable && <p className="text-xs text-slate-500 mt-2">CV not available for download.</p>}
                 {isPreview && cvIsAvailable && <p className="text-xs text-slate-500 mt-2">Download available on public profile after saving.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
