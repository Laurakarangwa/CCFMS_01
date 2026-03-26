import React, { useState, useEffect } from 'react';
import { User, Complaint } from './types';
import { getComplaints, updateComplaintStatus, getUsers } from './mockData';
import { UserCheck, Filter, Users, Plus, CheckCircle, ArrowRight, Edit } from 'lucide-react';
import { AddOfficer } from './AddOfficer';
import { ManageOfficers } from './ManageOfficers';
import { StatusUpdateModal } from './StatusUpdateModal';

interface Props {
  user: User;
}

export const DashboardAdmin: React.FC<Props> = ({ user }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-officer' | 'manage-officers'>('dashboard');
  const [statusModalOpen, setStatusModalOpen] = useState<string | null>(null);
  
  const officers = getUsers().filter(u => u.role === 'Officer');

  const loadComplaints = () => {
    setComplaints(getComplaints());
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleAssign = (complaintId: string, officerId: string) => {
    if (!officerId) return;
    updateComplaintStatus(complaintId, 'In Progress', officerId);
    loadComplaints();
  };

  const handleStatusUpdate = (complaintId: string, newStatus: Complaint['status'], notes?: string) => {
    updateComplaintStatus(complaintId, newStatus, undefined, notes);
    loadComplaints();
  };

  const getAdminStatusOptions = (currentStatus: Complaint['status']): Complaint['status'][] => {
    switch (currentStatus) {
      case 'Pending':
        return ['Received', 'In Progress', 'Resolved'];
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

  // Filtration logic
  const filteredComplaints = complaints.filter(c => {
      let matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      let matchesCategory = filterCategory === 'All' || c.category === filterCategory;
      
      let matchesDate = true;
      if (filterDate) {
          // Compare YYYY-MM-DD
          matchesDate = c.createdAt.substring(0, 10) === filterDate;
      }
      
      let matchesSearch = true;
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          matchesSearch = 
            c.title.toLowerCase().includes(q) || 
            c.description.toLowerCase().includes(q) ||
            c.location.district.toLowerCase().includes(q) ||
            c.location.sector.toLowerCase().includes(q) ||
            c.location.cell.toLowerCase().includes(q) ||
            c.location.village.toLowerCase().includes(q);
      }

      return matchesStatus && matchesCategory && matchesDate && matchesSearch;
  });

  const categories = ['All', ...Array.from(new Set(complaints.map(c => c.category)))];

  return (
    <div className="dashboard w-full">
      <header className="dashboard-header mb-8 pb-4 border-b border-gray-700">
        <div className="flex-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray subtitle">Overview of all system complaints and assignments</p>
          </div>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`btn ${currentView === 'dashboard' ? 'primary' : 'secondary'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('add-officer')}
            className={`btn ${currentView === 'add-officer' ? 'primary' : 'secondary'} flex items-center gap-2`}
          >
            <Plus size={16} />
            Add Officer
          </button>
          <button 
            onClick={() => setCurrentView('manage-officers')}
            className={`btn ${currentView === 'manage-officers' ? 'primary' : 'secondary'} flex items-center gap-2`}
          >
            <Users size={16} />
            Manage Officers
          </button>
        </div>
      </header>

      {currentView === 'dashboard' && (
        <>
          {/* Filters */}
          <div className="filters-bar glass-card mb-6 flex flex-col gap-4 p-4">
              <div className="flex flex-gap">
                <Filter size={20} className="text-gray-400 mr-2" />
                <h3 className="font-bold text-gray-200">Advanced Filters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-400">Search (Title, Location, Desc)</label>
                    <input 
                      type="text" 
                      className="input-field py-1" 
                      placeholder="Search..." 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-400">Date Submitted</label>
                    <input 
                      type="date" 
                      className="input-field py-1" 
                      value={filterDate} 
                      onChange={e => setFilterDate(e.target.value)} 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-400">Status</label>
                    <select className="select-input py-1" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                      <option value="All">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
                      <option value="Working on it">Working on it</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-400">Category</label>
                    <select className="select-input py-1" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
              </div>
          </div>

          <div className="complaint-list grid">
            {filteredComplaints.length === 0 && (
              <div className="empty-state">
                 <p>No complaints match the selected filters.</p>
              </div>
            )}
            {filteredComplaints.map(c => (
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
                  <div className="meta-item"><span className="label">Citizen ID:</span> {c.citizenId}</div>
                  <div className="meta-item"><span className="label">Lodged:</span> {new Date(c.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="assign-section mt-4 pt-4 border-t border-gray-700">
                  {c.status === 'Pending' ? (
                    <div className="flex-gap">
                      <UserCheck size={18} className="text-gray" />
                      <select 
                        className="select-input flex-1 py-2 text-sm"
                        onChange={(e) => handleAssign(c.id, e.target.value)}
                        value=""
                      >
                        <option value="" disabled>Assign to Officer</option>
                        {officers.filter(o => o.isActive !== false).map(o => (
                          <option key={o.id} value={o.id}>
                              {o.name} {o.category ? `(Spec: ${o.category})` : ''} 
                              {o.category === c.category ? ' - ⭐ Match' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : c.status !== 'Resolved' ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        <strong>Assigned Officer:</strong> {officers.find(o => o.id === c.officerId)?.name || 'Unknown'}
                      </p>
                      <button
                        className="btn primary w-full flex-gap justify-center"
                        onClick={() => setStatusModalOpen(c.id)}
                      >
                        <Edit size={16} /> Update Status
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      <strong>Assigned Officer:</strong> {officers.find(o => o.id === c.officerId)?.name || 'Unknown'}
                    </p>
                  )}
                </div>
                {c.feedback && (
                  <div className="feedback-section mt-4 text-sm">
                    <strong className="text-purple-300">Citizen Feedback:</strong> <p className="mt-1">{c.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {currentView === 'add-officer' && <AddOfficer />}
      
      {currentView === 'manage-officers' && (
        <ManageOfficers onBack={() => setCurrentView('dashboard')} />
      )}

      {statusModalOpen && (
        <StatusUpdateModal
          complaintId={statusModalOpen}
          currentStatus={complaints.find(c => c.id === statusModalOpen)?.status || 'Pending'}
          availableStatuses={getAdminStatusOptions(complaints.find(c => c.id === statusModalOpen)?.status || 'Pending')}
          onUpdate={handleStatusUpdate}
          onClose={() => setStatusModalOpen(null)}
        />
      )}
    </div>
  );
};
