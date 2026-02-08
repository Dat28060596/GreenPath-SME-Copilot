import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CopilotDrawer from './components/CopilotDrawer';
import SettingsModal from './components/SettingsModal';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import EvidencePage from './pages/Evidence';
import ReportPage from './pages/Report';
import ActionsPage from './pages/Actions';
import { Question } from './types';
import { AppProvider } from './context/AppContext';

// Wrapper to get current location for Copilot context
const ContentWrapper: React.FC<{
  children: React.ReactNode;
  setContextPage: (page: string) => void;
}> = ({ children, setContextPage }) => {
  const location = useLocation();
  React.useEffect(() => {
    // Simple mapping of path to readable name
    const pageName = location.pathname === '/' ? 'Dashboard' : 
                     location.pathname.replace('/', '');
    setContextPage(pageName);
  }, [location, setContextPage]);

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [contextPage, setContextPage] = useState('Dashboard');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const toggleCopilot = () => setIsCopilotOpen(!isCopilotOpen);
  
  const handleQuestionSelect = (q: Question) => {
      setSelectedQuestion(q);
  };

  const handleOpenCopilot = () => {
      setIsCopilotOpen(true);
  }

  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onOpenSettings={() => setIsSettingsOpen(true)}
          />
          
          <div className="flex-1 md:ml-64 flex flex-col transition-all duration-300">
            <TopBar 
              toggleCopilot={toggleCopilot} 
              isCopilotOpen={isCopilotOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            
            <main className="flex-1 mt-16 relative overflow-hidden">
               <ContentWrapper setContextPage={setContextPage}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route 
                      path="/assessment" 
                      element={
                          <Assessment 
                              onSelectQuestion={handleQuestionSelect} 
                              openCopilot={handleOpenCopilot} 
                          />
                      } 
                    />
                    <Route path="/evidence" element={<EvidencePage />} />
                    <Route path="/report" element={<ReportPage />} />
                    <Route path="/actions" element={<ActionsPage />} />
                    {/* Fallback */}
                    <Route path="*" element={<Dashboard />} />
                  </Routes>
               </ContentWrapper>
            </main>
          </div>

          <CopilotDrawer 
            isOpen={isCopilotOpen} 
            onClose={() => setIsCopilotOpen(false)} 
            contextPage={contextPage}
            selectedQuestion={selectedQuestion}
          />

          <SettingsModal 
              isOpen={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)} 
          />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;