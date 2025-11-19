
import React, { useState, useEffect, useRef } from 'react';
import type { CandidateProfile, User } from '../types';
import { Tier } from '../types';
import { analyzeCvText } from '../services/geminiService';
import { Spinner } from '../components/Spinner';
import { SparklesIcon, CloudArrowUpIcon } from '../components/icons';

// Mock function to simulate PDF text extraction.
// In a real application, you would use a library like 'pdfjs-dist'.
const extractTextFromPdf = async (file: File): Promise<string> => {
  console.log(`Simulating text extraction for ${file.name}`);
  return new Promise(resolve => setTimeout(() => resolve(`
    --- MOCK PDF CONTENT ---
    Johnathan Doe
    Senior Software Engineer | San Francisco, CA
    
    Professional Summary:
    A highly skilled and motivated software engineer with 10+ years of experience in designing, developing, and deploying scalable web applications. Proven ability to lead projects and mentor junior developers.
    
    Skills:
    - JavaScript, TypeScript, Python
    - React, Angular, Vue.js
    - Node.js, Express
    - AWS, Docker, Kubernetes
    - SQL, MongoDB
    --- END MOCK PDF CONTENT ---
  `), 1000));
};

interface DashboardPageProps {
  user: User | null;
  profile: CandidateProfile | null;
  onSaveProfile: (profile: CandidateProfile) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<CandidateProfile>(
    profile || {
      id: user?.profileId || `user-${Date.now()}`,
      name: '', role: '', location: '', aboutMe: '', experienceSummary: '',
      skills: [], tier: Tier.FREE,
    }
  );
  const [cvText, setCvText] = useState('');
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleGenerateFromCv = async () => {
    let textToAnalyze = cvText;
    const uploadedCvFile = formData.cvFile;

    if (!textToAnalyze && !uploadedCvFile) {
      setError('Please paste your CV text or upload a PDF file.');
      setGenerationStatus('error');
      return;
    }
    setGenerationStatus('generating');
    setError('');
    setSuccess('');
    try {
      if (uploadedCvFile && !textToAnalyze) {
        textToAnalyze = await extractTextFromPdf(uploadedCvFile);
      }
      const analysis = await analyzeCvText(textToAnalyze);
      setFormData(prev => ({
        ...prev,
        name: analysis.name || prev.name,
        role: analysis.role || prev.role,
        aboutMe: analysis.aboutMe || prev.aboutMe,
        skills: analysis.skills || prev.skills,
      }));
      setSuccess('Profile details generated! Please review and save.');
      setGenerationStatus('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setGenerationStatus('error');
    }
  };

  // Helper to get the robust base URL (stripping hash) to prevent environment-specific URL errors
  const getBaseUrl = () => {
    return window.location.href.split('#')[0];
  };

  const handlePreview = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cvFile, ...rest } = formData;
    const previewData = {
      ...rest,
      // Let the preview page know if a CV is associated
      hasCvFile: !!cvFile,
    };
    // Use localStorage instead of sessionStorage to be robust across tabs in all browsers
    localStorage.setItem('profileplus_preview', JSON.stringify(previewData));
    
    const previewUrl = `${getBaseUrl()}#/u/${formData.id}?preview=true`;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const resetAIAssistant = () => {
    setCvText('');
    setFormData(prev => ({...prev, cvFile: undefined}));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setGenerationStatus('idle');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, skills: e.target.value.split(',').map(skill => skill.trim()) });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, cvFile: e.target.files[0] });
      setCvText(''); // Clear text area to avoid confusion
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSuccess('Profile saved successfully! Open the public link to see changes.');
    setTimeout(() => setSuccess(''), 4000);
  };
  
  const publicProfileUrl = `${getBaseUrl()}#/u/${formData.id}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Dashboard</h1>
      <p className="text-slate-600 mb-8">Manage your public profile and settings.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input" required />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role / Title</label>
                <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full input" placeholder="e.g., Senior Software Engineer" required />
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full input" placeholder="e.g., San Francisco, CA" required />
            </div>
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-slate-700">About Me</label>
              <textarea name="aboutMe" id="aboutMe" rows={4} value={formData.aboutMe} onChange={handleChange} className="mt-1 block w-full input" placeholder="A short, professional bio." required></textarea>
            </div>
            <div>
              <label htmlFor="experienceSummary" className="block text-sm font-medium text-slate-700">Experience Summary</label>
              <textarea name="experienceSummary" id="experienceSummary" rows={6} value={formData.experienceSummary} onChange={handleChange} className="mt-1 block w-full input" placeholder="Summarize your key experiences and achievements." required></textarea>
            </div>
            <div>
                <label htmlFor="skills" className="block text-sm font-medium text-slate-700">Skills (comma-separated)</label>
                <input type="text" name="skills" id="skills" value={formData.skills.join(', ')} onChange={handleSkillsChange} className="mt-1 block w-full input" placeholder="e.g., React, TypeScript, Project Management" required />
            </div>
            <div>
                <label htmlFor="cvFile" className="block text-sm font-medium text-slate-700">Upload CV (PDF)</label>
                <input type="file" name="cvFile" id="cvFile" accept=".pdf" onChange={handleFileChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                {formData.cvFile && <p className="text-sm text-slate-500 mt-1">Current file: {formData.cvFile.name}</p>}
            </div>
            <div>
              <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Save Profile
              </button>
            </div>
             {success && <p className="text-green-600 mt-4">{success}</p>}
          </form>
        </div>

        {/* AI Assistant & Profile Preview */}
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-primary-500" />
                    AI Assistant
                </h2>
                {generationStatus === 'idle' && (
                    <>
                        <p className="text-slate-600 mb-4">Paste your CV text or upload a PDF to auto-fill your profile with AI.</p>
                        <textarea
                            rows={8}
                            className="w-full input mb-4"
                            placeholder="Paste your CV text here..."
                            value={cvText}
                            onChange={(e) => {
                                setCvText(e.target.value);
                                if (e.target.value) {
                                    setFormData(prev => ({...prev, cvFile: undefined}));
                                }
                            }}
                            disabled={!!formData.cvFile}
                        ></textarea>

                        <div className="relative mb-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-slate-500">OR</span>
                            </div>
                        </div>

                        <div className="flex justify-center mb-6">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                <CloudArrowUpIcon className="-ml-1 mr-2 h-5 w-5 text-primary-500" aria-hidden="true" />
                                Upload CV (PDF)
                            </button>
                        </div>

                        {!!formData.cvFile && <p className="text-sm text-center text-slate-600 mb-4">Generating from: <strong>{formData.cvFile.name}</strong></p>}
                        <button
                            onClick={handleGenerateFromCv}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 transition-colors"
                            disabled={!cvText && !formData.cvFile}
                        >
                            Generate with AI
                        </button>
                    </>
                )}
                {generationStatus === 'generating' && (
                    <div className="flex flex-col items-center justify-center h-48">
                        <Spinner />
                        <p className="mt-4 text-slate-600">Analyzing your CV...</p>
                    </div>
                )}
                {generationStatus === 'success' && (
                     <div className="text-center">
                        <p className="text-lg font-semibold text-green-700 mb-2">✅ Success!</p>
                        <p className="text-slate-600 mb-4">We've drafted your profile. Review the details on the left, then preview or save.</p>
                        <div className="space-y-3">
                            <button
                                onClick={handlePreview}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            >
                                Preview Profile
                            </button>
                            <button
                                onClick={resetAIAssistant}
                                className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
                 {generationStatus === 'error' && (
                     <div className="text-center">
                        <p className="text-lg font-semibold text-red-700 mb-2">❌ Oops!</p>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={resetAIAssistant}
                            className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Public Profile</h3>
                <p className="text-slate-600 mb-4">Share this link with recruiters:</p>
                <div className="bg-slate-100 p-3 rounded-md text-sm break-all">
                    <a href={publicProfileUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{publicProfileUrl}</a>
                </div>
                 <p className="text-xs text-slate-500 mt-2">Note: Updates are saved to your browser's local storage for this demo. Opening this link in a new tab will show your saved changes.</p>
            </div>
        </div>

      </div>
       <style>{`.input { border-radius: 0.375rem; border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; width: 100%; } .input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #0ea5e9; box-shadow: 0 0 0 2px #0ea5e9; } .input:disabled { background-color: #f1f5f9; cursor: not-allowed; }`}</style>
    </div>
  );
};
