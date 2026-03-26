export type Role = 'Citizen' | 'Admin' | 'Officer';

export interface User {
  id: string;
  username: string; // New field for login
  name: string;
  email: string; // Email field for users
  password?: string; // Simulated password
  role: Role;
  profilePicture?: string; // Base64 or URL
  category?: string; // For officers: e.g., 'Electricity', 'Sanitation'
  isActive?: boolean; // For officers: active/inactive status
  location?: {
    province: string;
    district: string;
    sector: string;
  }; // For officers: work location
}

export type ComplaintStatus = 'Pending' | 'Received' | 'Working on it' | 'In Progress' | 'Resolved';

export interface ComplaintLocation {
  district: string;
  sector: string;
  cell: string;
  village: string;
  physicalLocation: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  category: string;
  location: ComplaintLocation;
  duration: string;
  status: ComplaintStatus;
  officerId: string | null;
  createdAt: string;
  updatedAt: string;
  feedback: string | null;
  notes: string[]; // Array of notes from officers/admins when updating status
}
