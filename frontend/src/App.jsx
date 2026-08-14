import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AthleteManagement from './components/AthleteManagement';
import AthleteDetailModal from './components/AthleteDetailModal';
import RoleDashboard from './components/RoleDashboard';
import DatasetsExplorer from './components/DatasetsExplorer';
import ArchitectureViewer from './components/ArchitectureViewer';
import PoseEstimationStudio from './components/PoseEstimationStudio';
import BiomechanicsReportView from './components/BiomechanicsReportView';
import AthleteIntelligenceDashboard from './components/AthleteIntelligenceDashboard';
import TeamRiskOverview from './components/TeamRiskOverview';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('intelligence'); // 'intelligence', 'team_heatmap', 'athletes', 'pose_studio', 'role_dashboard', 'datasets', 'architecture'
  const [currentRole, setCurrentRole] = useState('Administrator');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [reportAnalysisId, setReportAnalysisId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setCurrentRole(data.role);
    localStorage.setItem('access_token', data.access_token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    showToast('Logged out of system session.');
  };

  const handleRefreshAthlete = async () => {
    if (!selectedAthlete) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/athletes/${selectedAthlete.id}`);
      if (res.ok) {
        const updated = await res.json();
        setSelectedAthlete(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {activeTab === 'intelligence' && (
          <AthleteIntelligenceDashboard onShowToast={showToast} />
        )}

        {activeTab === 'team_heatmap' && (
          <TeamRiskOverview
            onShowToast={showToast}
            onSelectAthlete={(ath) => {
              setSelectedAthlete(ath);
              setActiveTab('athletes');
            }}
          />
        )}

        {activeTab === 'athletes' && (
          <AthleteManagement
            onSelectAthlete={(ath) => setSelectedAthlete(ath)}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'pose_studio' && (
          <PoseEstimationStudio
            onShowToast={showToast}
            onViewReport={(id) => setReportAnalysisId(id)}
          />
        )}

        {activeTab === 'role_dashboard' && (
          <RoleDashboard currentRole={currentRole} />
        )}

        {activeTab === 'datasets' && (
          <DatasetsExplorer onShowToast={showToast} />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureViewer />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      {/* Athlete Detail Modal */}
      {selectedAthlete && (
        <AthleteDetailModal
          athlete={selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
          onRefresh={handleRefreshAthlete}
          onShowToast={showToast}
        />
      )}

      {/* Biomechanics Report View Modal */}
      {reportAnalysisId && (
        <BiomechanicsReportView
          analysisId={reportAnalysisId}
          onClose={() => setReportAnalysisId(null)}
          onShowToast={showToast}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <span>⚡</span>
          <div>{toastMessage}</div>
        </div>
      )}
    </div>
  );
}
