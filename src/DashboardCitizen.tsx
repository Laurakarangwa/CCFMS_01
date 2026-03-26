import React, { useState, useEffect } from 'react';
import { User, Complaint, ComplaintLocation } from './types';
import { getComplaints, createComplaint, submitFeedback } from './mockData';
import { PlusCircle, MessageSquare } from 'lucide-react';

interface Props {
  user: User;
}

const CATEGORIES = ['Electricity', 'Sanitation', 'Public Relations', 'Water', 'Roads', 'Other'];

export const DashboardCitizen: React.FC<Props> = ({ user }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLodgeOpen, setIsLodgeOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [duration, setDuration] = useState('');
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [cell, setCell] = useState('');
  const [village, setVillage] = useState('');
  const [physicalLocation, setPhysicalLocation] = useState('');

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackComplaintId, setFeedbackComplaintId] = useState<string | null>(null);

  const loadComplaints = () => {
    const all = getComplaints();
    setComplaints(all.filter(c => c.citizenId === user.id));
  };

  useEffect(() => {
    loadComplaints();
  }, [user.id]);

  const handleLodge = (e: React.FormEvent) => {
    e.preventDefault();
    const loc: ComplaintLocation = { district, sector, cell, village, physicalLocation };
    createComplaint(user.id, title, description, category, loc, duration);
    
    // Reset form
    setTitle(''); setDescription(''); setCategory(CATEGORIES[0]); setDuration('');
    setDistrict(''); setSector(''); setCell(''); setVillage(''); setPhysicalLocation('');
    setIsLodgeOpen(false);
    loadComplaints();
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackComplaintId) {
      submitFeedback(feedbackComplaintId, feedbackText);
      setFeedbackComplaintId(null);
      setFeedbackText('');
      loadComplaints();
    }
  };

  return (
    <div className="dashboard w-full">
      <header className="dashboard-header flex-between mb-8 pb-4 border-b border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <p className="text-gray subtitle">Track your issues and provide feedback</p>
        </div>
        <button className="btn primary flex-gap" onClick={() => setIsLodgeOpen(true)}>
          <PlusCircle size={18} /> Lodge Complaint
        </button>
      </header>

      {isLodgeOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{maxHeight: '90vh', overflowY: 'auto', width: '600px', maxWidth: '95%'}}>
            <h2>Lodge a New Complaint</h2>
            <form onSubmit={handleLodge} className="flex flex-col gap-4">
              <div className="form-group mb-0">
                <label>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Short summary" />
              </div>
              <div className="form-group mb-0 flex gap-4">
                  <div className="flex-1">
                    <label>Category</label>
                    <select className="select-input" value={category} onChange={e => setCategory(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label>Duration</label>
                    <input required value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 2 weeks" />
                  </div>
              </div>

              <h3 className="text-lg font-bold mt-4 border-b border-gray-700 pb-2">Location Details</h3>
              <div className="form-group mb-0 flex gap-4">
                  <div className="flex-1"><label>District</label><input required value={district} onChange={e => setDistrict(e.target.value)} /></div>
                  <div className="flex-1"><label>Sector</label><input required value={sector} onChange={e => setSector(e.target.value)} /></div>
              </div>
              <div className="form-group mb-0 flex gap-4">
                  <div className="flex-1"><label>Cell</label><input required value={cell} onChange={e => setCell(e.target.value)} /></div>
                  <div className="flex-1"><label>Village</label><input required value={village} onChange={e => setVillage(e.target.value)} /></div>
              </div>
              <div className="form-group mb-0">
                  <label>Physical Location / Landmark</label>
                  <input required value={physicalLocation} onChange={e => setPhysicalLocation(e.target.value)} placeholder="e.g. Near the market" />
              </div>

              <h3 className="text-lg font-bold mt-4 border-b border-gray-700 pb-2">Full Description</h3>
              <div className="form-group mb-0">
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide full details..." />
              </div>
              
              <div className="modal-actions pt-4 border-t border-gray-700 mt-2">
                <button type="button" className="btn secondary" onClick={() => setIsLodgeOpen(false)}>Cancel</button>
                <button type="submit" className="btn primary">Submit Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedbackComplaintId && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Provide Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label>Your Feedback</label>
                <textarea required rows={3} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setFeedbackComplaintId(null)}>Cancel</button>
                <button type="submit" className="btn primary">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="complaint-list grid">
        {complaints.length === 0 && (
          <div className="empty-state">
            <p>No complaints lodged yet. Click the button above to get started.</p>
          </div>
        )}
        {complaints.map(c => (
          <div key={c.id} className="complaint-card glass-card">
            <div className="card-header flex-between mb-2">
              <h3 className="card-title font-bold text-lg">{c.title}</h3>
              <span className={`badge ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span>
            </div>
            <div className="badge secondary mb-4 inline-block text-xs" style={{background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px'}}>{c.category}</div>
            
            <p className="desc mb-4">{c.description}</p>
            
            <div className="bg-black/20 p-3 rounded-lg mb-4 text-sm text-gray-300">
                <div className="font-semibold text-white mb-1">📍 Location</div>
                <div>{c.location.district}, {c.location.sector}, {c.location.cell}, {c.location.village}</div>
                <div className="italic text-xs mt-1 text-gray-400">"{c.location.physicalLocation}"</div>
            </div>

            <div className="meta flex-between text-xs text-gray-400">
              <span>Duration: {c.duration}</span>
              <span>Lodged: {new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            
            {c.status === 'Resolved' && !c.feedback && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button className="btn action flex-gap w-full justify-center" onClick={() => setFeedbackComplaintId(c.id)}>
                  <MessageSquare size={14} /> Provide Feedback
                </button>
              </div>
            )}
            {c.feedback && (
              <div className="feedback-section mt-4 text-sm">
                <strong className="text-purple-300">Your Feedback:</strong> <p className="mt-1">{c.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
