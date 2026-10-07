import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewView } from './views/OverviewView';
import { ServicesView } from './views/ServicesView';
import { StaffDashboardView } from './views/StaffDashboardView';
import { AdminAnalyticsView } from './views/AdminAnalyticsView';
import { TicketModal } from './components/TicketModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AppointmentModal } from './components/AppointmentModal';
import { DigitalRequestModal } from './components/DigitalRequestModal';
import { ProblemTriageModal } from './components/ProblemTriageModal';
import { LoginModal } from './components/LoginModal';
import { campusflowService } from './services/campusflowService';

export function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('student');

  const [services, setServices] = useState([]);
  const [queues, setQueues] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [digitalRequests, setDigitalRequests] = useState([]);
  const [problems, setProblems] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [activeTicket, setActiveTicket] = useState(null);
  const [emergencyService, setEmergencyService] = useState(null);
  const [appointmentService, setAppointmentService] = useState(null);
  const [digitalService, setDigitalService] = useState(null);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const reloadAllData = () => {
    setServices(campusflowService.getServices());
    setQueues(campusflowService.getQueues());
    setEmergencyRequests(campusflowService.getEmergencyRequests());
    setAppointments(campusflowService.getAppointments());
    setDigitalRequests(campusflowService.getDigitalRequests());
    setProblems(campusflowService.getProblems());
    setStaff(campusflowService.getStaff());
    setActivityLogs(campusflowService.getActivityLogs());
  };

  useEffect(() => {
    campusflowService.refreshServices().finally(reloadAllData);
    const handleStateChange = () => reloadAllData();
    window.addEventListener('campusflow_state_changed', handleStateChange);
    return () => window.removeEventListener('campusflow_state_changed', handleStateChange);
  }, []);

  const handleJoinQueue = async (serviceId) => {
    try {
      const ticket = await campusflowService.joinQueue(serviceId, { name: "Aisha Fatima", studentId: "STU-8842" });
      setActiveTicket(ticket);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSelectQuickDemo = (demoType) => {
    const visaService = services.find(s => s.serviceId === "SRV-INT-001") || services[0];
    if (demoType === 'urgent-visa') setEmergencyService(visaService);
    else if (demoType === 'transcript') setDigitalService(services.find(s => s.serviceId === "SRV-REG-001") || services[1]);
  };

  const handleResetData = () => {
    if (confirm("Reset demo dataset to initial state?")) {
      campusflowService.resetToMockData();
    }
  };

  const adminMetrics = campusflowService.getAdminMetrics();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onSelectQuickDemo={handleSelectQuickDemo}
        activeTicketCount={queues.filter(q => q.status === 'WAITING' || q.status === 'APPROVED' || q.status === 'IN_PROGRESS').length}
      />

      <main className="app-container" style={{ flex: 1 }}>
        {activeTab === 'overview' && (
          <OverviewView
            services={services} queues={queues} activityLogs={activityLogs}
            onJoinQueue={handleJoinQueue}
            onOpenEmergencyModal={srv => setEmergencyService(srv)}
            onOpenAppointmentModal={srv => setAppointmentService(srv)}
            onOpenDigitalModal={srv => setDigitalService(srv)}
            onOpenProblemModal={() => setShowProblemModal(true)}
            onSelectQuickDemo={handleSelectQuickDemo}
          />
        )}

        {(activeTab === 'services' || activeTab === 'emergency' || activeTab === 'triage') && (
          <ServicesView
            services={services} queues={queues}
            onJoinQueue={handleJoinQueue}
            onOpenEmergencyModal={srv => setEmergencyService(srv)}
            onOpenAppointmentModal={srv => setAppointmentService(srv)}
            onOpenDigitalModal={srv => setDigitalService(srv)}
          />
        )}

        {activeTab === 'staff' && (
          <StaffDashboardView
            queues={queues} problems={problems} emergencyRequests={emergencyRequests} staff={staff}
            onUpdateState={reloadAllData}
          />
        )}

        {activeTab === 'admin' && (
          <AdminAnalyticsView metrics={adminMetrics} onResetData={handleResetData} />
        )}
      </main>

      <TicketModal ticket={activeTicket} onClose={() => setActiveTicket(null)} />
      <EmergencyModal service={emergencyService} onClose={() => setEmergencyService(null)} onSuccess={t => setActiveTicket(t)} />
      <AppointmentModal service={appointmentService} onClose={() => setAppointmentService(null)} onSuccess={() => alert("Appointment booked!")} />
      <DigitalRequestModal service={digitalService} onClose={() => setDigitalService(null)} onSuccess={() => alert("Digital request submitted!")} />
      {showProblemModal && <ProblemTriageModal services={services} onClose={() => setShowProblemModal(false)} onSuccess={() => alert("AI Triage ticket created!")} />}
      {showLoginModal && (
        <LoginModal currentRole={userRole} onClose={() => setShowLoginModal(false)} onSwitchRole={r => {
          setUserRole(r);
          if (r === 'staff') setActiveTab('staff');
          if (r === 'admin') setActiveTab('admin');
          if (r === 'student') setActiveTab('overview');
        }} />
      )}
    </div>
  );
}

export default App;
