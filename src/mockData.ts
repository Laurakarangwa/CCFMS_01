import { User, Complaint, ComplaintLocation } from './types';

const STORAGE_KEY_USERS = 'ccfms_users';
const STORAGE_KEY_COMPLAINTS = 'ccfms_complaints';

const MOCK_USERS_INITIAL: User[] = [
  { id: 'u1', username: 'alice', name: 'Alice Citizen', email: 'alice@ccfms.rw', password: 'password', role: 'Citizen' },
  { id: 'u2', username: 'Admin250', name: 'System Administrator', email: 'admin@ccfms.rw', password: 'Admin@12345', role: 'Admin' },
  { id: 'u3', username: 'charlie', name: 'Charlie Officer', email: 'charlie@ccfms.rw', password: 'password', role: 'Officer', category: 'Electricity', isActive: true, location: { province: 'Kigali City', district: 'Nyarugenge', sector: 'Kiyovu' } },
  { id: 'u4', username: 'diana', name: 'Diana Officer', email: 'diana@ccfms.rw', password: 'password', role: 'Officer', category: 'Sanitation', isActive: true, location: { province: 'Kigali City', district: 'Gasabo', sector: 'Kacyiru' } },
];

export const initializeData = () => {
  // Check for schema compatibility to avoid crashes from old cached data
  const existingComplaintsStr = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
  if (existingComplaintsStr) {
      try {
          const parsed = JSON.parse(existingComplaintsStr);
          if (parsed.length > 0 && !parsed[0].location) {
              // Old schema detected, clear everything.
              localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
              localStorage.removeItem(STORAGE_KEY_USERS);
              localStorage.removeItem('ccfms_user');
              window.location.href = '/'; // force reload to login
          }
      } catch (e) {
          localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
      }
  }

  const existingUsers = localStorage.getItem(STORAGE_KEY_USERS);
  if (!existingUsers) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(MOCK_USERS_INITIAL));
  }

  const existingComplaints = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
  if (!existingComplaints) {
    const initialComplaints: Complaint[] = [
      {
        id: 'c1',
        citizenId: 'u1',
        title: 'Pothole on Main Street',
        description: 'There is a huge pothole causing traffic issues near the central park.',
        category: 'Public Relations',
        location: {
          district: 'Kigali',
          sector: 'Nyarugenge',
          cell: 'Kiyovu',
          village: 'Rugenge',
          physicalLocation: 'Near Central Park entrance'
        },
        duration: '2 weeks',
        status: 'Pending',
        officerId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        feedback: null,
        notes: []
      }
    ];
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(initialComplaints));
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

export const getComplaints = (): Complaint[] => {
  const data = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
  return data ? JSON.parse(data) : [];
};

export const saveComplaints = (complaints: Complaint[]) => {
  localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
};

export const registerCitizen = (name: string, username: string, email: string, password?: string): User => {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
  }
  const newUser: User = {
    id: `u${Date.now()}`,
    name,
    username,
    email,
    password,
    role: 'Citizen',
  };
  saveUsers([...users, newUser]);
  return newUser;
};

export const registerOfficer = (name: string, username: string, email: string, category: string, password?: string, location?: { province: string; district: string; sector: string }): User => {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
  }
  const newOfficer: User = {
    id: `u${Date.now()}`,
    name,
    username,
    email,
    password,
    role: 'Officer',
    category,
    isActive: true,
    location,
  };
  saveUsers([...users, newOfficer]);
  return newOfficer;
};

export const updateUserProfile = (userId: string, updates: Partial<User>) => {
    const users = getUsers();
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    saveUsers(updatedUsers);
    
    // Also update logged-in user session if needed
    const currentUserRaw = localStorage.getItem('ccfms_user');
    if (currentUserRaw) {
        const currentUser = JSON.parse(currentUserRaw);
        if (currentUser.id === userId) {
             localStorage.setItem('ccfms_user', JSON.stringify({ ...currentUser, ...updates }));
        }
    }
    return updatedUsers.find(u => u.id === userId);
};

export const createComplaint = (
    citizenId: string, 
    title: string, 
    description: string,
    category: string,
    location: ComplaintLocation,
    duration: string
) => {
  const complaints = getComplaints();
  const newComp: Complaint = {
    id: `c${Date.now()}`,
    citizenId,
    title,
    description,
    category,
    location,
    duration,
    status: 'Pending',
    officerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedback: null,
    notes: []
  };
  saveComplaints([...complaints, newComp]);
};

export const updateComplaintStatus = (complaintId: string, status: Complaint['status'], officerId?: string | null, notes?: string) => {
  const complaints = getComplaints();
  const updated = complaints.map(c => {
    if (c.id === complaintId) {
      const updatedComplaint = {
        ...c,
        status,
        updatedAt: new Date().toISOString(),
        ...(officerId !== undefined ? { officerId } : {})
      };
      
      // Add notes if provided
      if (notes) {
        updatedComplaint.notes = [...(c.notes || []), notes];
      }
      
      return updatedComplaint;
    }
    return c;
  });
  saveComplaints(updated);
};

export const submitFeedback = (complaintId: string, feedback: string) => {
  const complaints = getComplaints();
  const updated = complaints.map(c => {
    if (c.id === complaintId) {
      return {
        ...c,
        feedback,
        updatedAt: new Date().toISOString()
      };
    }
    return c;
  });
  saveComplaints(updated);
};
