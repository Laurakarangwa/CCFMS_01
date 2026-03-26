import React, { useState, useEffect } from 'react';
import { User, Complaint } from './types';
import { getComplaints, updateComplaintStatus } from './mockData';
import { CheckCircle, ArrowRight, Edit } from 'lucide-react';
import { StatusUpdateModal } from './StatusUpdateModal';

interface Props {
  user: User;
}

export const DashboardOfficer: React.FC<Props> = ({ user }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [statusModalOpen, setStatusModalOpen] = useState<string | null>(null);

  const loadComplaints = () => {
    const all = getComplaints();
    setComplaints(all.filter(c => c.officerId === user.id));
  };

  useEffect(() => {
    loadComplaints();
  }, [user.id]);

  const handleStatusUpdate = (complaintId: string, newStatus: Complaint['status'], notes?: string) => {
    updateComplaintStatus(complaintId, newStatus, user.id, notes);
    loadComplaints();
  };

  const getOfficerStatusOptions = (currentStatus: Complaint['status']): Complaint['status'][] => {
    switch (currentStatus) {
      case 'Pending':
        return ['In Progress', 'Resolved'];
      case 'Received':
        return ['In Progress', 'Resolved'];
      case 'Working on it':
        return ['In Progress', 'Resolved'];
      case 'In Progress':
        return ['Resolved'];
      case 'Resolved':
        return [];
      default:
        return [];
    }
  };

  return (
    <div className="dashboard w-full">
      <header className="dashboard-header mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold">Officer Dashboard</h1>
        <p className="text-gray subtitle">Manage your assigned complaints</p>
      </header>

      <div className="complaint-list grid">
        {complaints.length === 0 && (
          <div className="empty-state">
             <p>You have no assigned complaints at the moment.</p>
          </div>
        )}
        {complaints.map(c => (
          <div key={c.id} className="complaint-card glass-card">
            <div className="card-header flex-between mb-2">
              <h3 className="card-title font-bold text-lg">{c.title}</h3>
              <span className={`badge ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span>
            </div>
            <div className="badge secondary mb-4 inline-block text-xs" style={{background: 'rgba(255,255,255,0.1)'}}>{c.category}</div>
            
            <p className="desc mb-4">{c.description}</p>
            
            <div className="bg-black/20 p-3 rounded-lg mb-4 text-sm text-gray-300">
                <div className="font-semibold text-white mb-1">📍 Location</div>
                <div>{c.location.district}, {c.location.sector}, {c.location.cell}, {c.location.village}</div>
                <div className="text-xs mt-1">"{c.location.physicalLocation}"</div>
            </div>

            <div className="meta mb-4 text-xs flex flex-col gap-1 text-gray-400">
              <div className="meta-item"><span className="label">Duration:</span> {c.duration}</div>
              <div className="meta-item"><span className="label">Lodged:</span> {new Date(c.createdAt).toLocaleDateString()}</div>
            </div>

            {c.status !== 'Resolved' && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  className="btn primary w-full flex-gap justify-center"
                  onClick={() => setStatusModalOpen(c.id)}
                >
                  <Edit size={16} /> Update Status
                </button>
              </div>
            )}

            {c.feedback && (
              <div className="feedback-section mt-4 pt-4 border-t border-gray-700 text-sm">
                <strong className="text-purple-300">Citizen Feedback:</strong> <p className="mt-1">{c.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {statusModalOpen && (
        <StatusUpdateModal
          complaintId={statusModalOpen}
          currentStatus={complaints.find(c => c.id === statusModalOpen)?.status || 'Pending'}
          availableStatuses={getOfficerStatusOptions(complaints.find(c => c.id === statusModalOpen)?.status || 'Pending')}
          onUpdate={handleStatusUpdate}
          onClose={() => setStatusModalOpen(null)}
        />
      )}
    </div>
  );
};
