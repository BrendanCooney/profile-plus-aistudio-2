
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { LoginModal } from './components/LoginModal';
import type { User, CandidateProfile } from './types';
import { Tier } from './types';

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
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Record<string, CandidateProfile>>({[MOCK_PROFILE.id]: MOCK_PROFILE});
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
    setProfiles(prev => ({ ...prev, [profile.id]: profile }));
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
          const previewDataString = sessionStorage.getItem('profile_preview');
          if (previewDataString) {
            const previewProfile: CandidateProfile = JSON.parse(previewDataString);
            if (previewProfile.id === profileId) {
                profileToRender = previewProfile;
            }
          }
        } catch (e) {
            console.error("Failed to parse preview profile from sessionStorage", e);
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
