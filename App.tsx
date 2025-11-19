
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { LoginModal } from './components/LoginModal';
import type { User, CandidateProfile } from './types';
import { Tier } from './types';

// Storage Keys
const STORAGE_KEY = 'profileplus_db';
const PREVIEW_KEY = 'profileplus_preview';

// Mock user and profile data
const MOCK_USER: User = { id: 'user-1', email: 'test@example.com', profileId: 'dev-1234' };
const MOCK_PROFILE: CandidateProfile = {
  id: 'dev-1234',
  name: 'Jane Developer',
  role: 'Full Stack Engineer',
  location: 'Remote',
  aboutMe: 'A creative and detail-oriented Full Stack Engineer with a passion for building intuitive and performant web applications. Experienced in both front-end and back-end development, with a strong focus on user experience and code quality.',
  experienceSummary: '5+ years of experience developing, testing, and deploying web applications. Proficient in JavaScript, React, Node.js, and Python. Successfully led a project to migrate a legacy system to a modern microservices architecture, resulting in a 30% performance increase.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS', 'SQL', 'NoSQL'],
  tier: Tier.FREE,
  cvFile: undefined,
  hasCvFile: false,
};

// Helper to load from simulated DB
const getStoredProfiles = (): Record<string, CandidateProfile> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // Initialize state by merging Mock data with what's in LocalStorage
  const [profiles, setProfiles] = useState<Record<string, CandidateProfile>>(() => ({
    [MOCK_PROFILE.id]: MOCK_PROFILE,
    ...getStoredProfiles()
  }));
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleLogin = () => {
    setUser(MOCK_USER);
    closeLoginModal();
    window.location.hash = '/dashboard';
  };

  const handleLogout = () => {
    setUser(null);
    window.location.hash = '/';
  };

  const handleSaveProfile = useCallback((profile: CandidateProfile) => {
    setProfiles(prev => {
      const updatedProfiles = { ...prev, [profile.id]: profile };
      
      // Persist to LocalStorage to simulate DB (strip File objects)
      const storageVersion = Object.fromEntries(
        Object.entries(updatedProfiles).map(([id, p]) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { cvFile, ...rest } = p;
            // If a file exists in memory or was previously marked, keep flag true
            return [id, { ...rest, hasCvFile: !!p.cvFile || !!p.hasCvFile }];
        })
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageVersion));
      
      return updatedProfiles;
    });
  }, []);
  
  const renderPage = () => {
    const [hashPath, hashQuery] = currentRoute.split('?');
    const queryParams = new URLSearchParams(hashQuery);
    const isPreview = queryParams.get('preview') === 'true';

    if (hashPath.startsWith('#/u/')) {
      const profileId = hashPath.split('/u/')[1];
      let profileToRender = profiles[profileId] || null;
      
      if (isPreview) {
        try {
          // Use LocalStorage for preview to ensure it works across tabs (simulated environment)
          const previewDataString = localStorage.getItem(PREVIEW_KEY);
          if (previewDataString) {
            const previewProfile: CandidateProfile = JSON.parse(previewDataString);
            if (previewProfile.id === profileId) {
                profileToRender = previewProfile;
            }
          }
        } catch (e) {
            console.error("Failed to parse preview profile from localStorage", e);
        }
      }
      
      return <PublicProfilePage profile={profileToRender} isPreview={isPreview} />;
    }

    if (user) {
      switch (hashPath) {
        case '#/dashboard':
          return <DashboardPage user={user} profile={profiles[user.profileId]} onSaveProfile={handleSaveProfile} />;
        default:
           window.location.hash = '/dashboard';
          return <DashboardPage user={user} profile={profiles[user.profileId]} onSaveProfile={handleSaveProfile} />;
      }
    } else {
      return <HomePage onLoginClick={openLoginModal} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={!!user} onLogout={handleLogout} onLoginClick={openLoginModal} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={closeLoginModal} />}
    </div>
  );
};

export default App;
