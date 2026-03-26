import React, { useState } from 'react';
import { ComplaintStatus } from './types';
import { X, MessageSquare } from 'lucide-react';

interface Props {
  complaintId: string;
  currentStatus: ComplaintStatus;
  availableStatuses: ComplaintStatus[];
  onUpdate: (complaintId: string, newStatus: ComplaintStatus, notes?: string) => void;
  onClose: () => void;
}

export const StatusUpdateModal: React.FC<Props> = ({
  complaintId,
  currentStatus,
  availableStatuses,
  onUpdate,
  onClose
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(availableStatuses[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(complaintId, selectedStatus, notes.trim() || undefined);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending': return 'Pending';
      case 'Received': return 'Received';
      case 'Working on it': return 'Working on it';
      case 'In Progress': return 'In Progress';
      case 'Resolved': return 'Resolved';
      default: return status;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Update Complaint Status</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-2">
              Current Status
            </label>
            <div className="px-3 py-2 bg-gray-700 rounded-lg text-gray-300">
              {getStatusLabel(currentStatus)}
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              required
            >
              {availableStatuses.map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">
              <MessageSquare size={16} className="inline mr-1" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information for the citizen about this status update..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-400 mt-1">
              Notes will be visible to the citizen to provide more context about the status update.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
