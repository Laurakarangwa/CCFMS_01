import React, { useState } from 'react';
import { User } from './types';
import { updateUserProfile } from './mockData';

interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

export const Settings: React.FC<Props> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      setError('');

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setProfilePicture(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to upload image');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate password change if attempted
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setError('Current password is required to change password');
        return;
      }
      if (currentPassword !== user.password) {
        setError('Current password is incorrect');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
    }

    const updates: Partial<User> = { name, email, profilePicture };
    if (newPassword) {
      updates.password = newPassword;
    }

    const updatedUser = updateUserProfile(user.id, updates);
    if (updatedUser) {
        onUpdate(updatedUser);
        setMessage('Settings updated successfully!');
        // Clear password fields after successful update
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="settings-panel glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Account Settings</h2>
      {message && <div className="alert success mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}
      {error && <div className="alert error mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="form-group flex flex-col gap-1">
          <label>Full Name</label>
          <input 
            type="text" 
            className="input-field p-2 border rounded"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group flex flex-col gap-1">
          <label>Email Address</label>
          <input 
            type="email" 
            className="input-field p-2 border rounded"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group flex flex-col gap-1">
          <label>Current Password</label>
          <input 
            type="password" 
            className="input-field p-2 border rounded"
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            placeholder="Enter current password to change password"
          />
        </div>

        <div className="form-group flex flex-col gap-1">
          <label>New Password</label>
          <input 
            type="password" 
            className="input-field p-2 border rounded"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            placeholder="Leave blank to keep current password"
            minLength={6}
          />
        </div>

        <div className="form-group flex flex-col gap-1">
          <label>Confirm New Password</label>
          <input 
            type="password" 
            className="input-field p-2 border rounded"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm new password"
            minLength={6}
          />
        </div>

        <div className="form-group flex flex-col gap-1">
          <label>Profile Picture</label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="profile-picture-upload"
              />
              <label
                htmlFor="profile-picture-upload"
                className={`btn secondary cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
              >
                {isUploading ? 'Uploading...' : 'Choose Image'}
              </label>
              {profilePicture && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="btn secondary text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            {profilePicture && (
              <div className="flex items-center gap-3">
                <img 
                  src={profilePicture} 
                  alt="Profile Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                />
                <div className="text-sm text-gray-400">
                  <p>Current profile picture</p>
                  <p className="text-xs">Click "Remove" to delete</p>
                </div>
              </div>
            )}
            
            {!profilePicture && (
              <div className="text-sm text-gray-400">
                <p>No profile picture uploaded</p>
                <p className="text-xs">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn primary self-start mt-2">Save Changes</button>
      </form>
    </div>
  );
};
