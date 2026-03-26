import React, { useState, useEffect } from 'react';
import { User } from './types';
import { getUsers, updateUserProfile } from './mockData';
import { Users, Edit2, ToggleLeft, ToggleRight, Save, X, Filter } from 'lucide-react';

const CATEGORIES = ['Electricity', 'Sanitation', 'Public Relations', 'Water', 'Roads', 'Other'];

const RWANDA_PROVINCES = [
  'Kigali City',
  'Northern Province',
  'Southern Province', 
  'Eastern Province',
  'Western Province'
];

interface Props {
  onBack: () => void;
}

export const ManageOfficers: React.FC<Props> = ({ onBack }) => {
  const [officers, setOfficers] = useState<User[]>([]);
  const [editingOfficer, setEditingOfficer] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    province: 'All',
    district: '',
    sector: ''
  });

  const filteredOfficers = officers.filter(officer => {
    const matchesCategory = filters.category === 'All' || officer.category === filters.category;
    const matchesProvince = filters.province === 'All' || officer.location?.province === filters.province;
    const matchesDistrict = !filters.district || officer.location?.district.toLowerCase().includes(filters.district.toLowerCase());
    const matchesSector = !filters.sector || officer.location?.sector.toLowerCase().includes(filters.sector.toLowerCase());
    
    return matchesCategory && matchesProvince && matchesDistrict && matchesSector;
  });

  const uniqueProvinces = Array.from(new Set(officers.map(o => o.location?.province).filter(Boolean)));
  const uniqueDistricts = Array.from(new Set(officers.map(o => o.location?.district).filter(Boolean)));
  const uniqueSectors = Array.from(new Set(officers.map(o => o.location?.sector).filter(Boolean)));

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      province: 'All',
      district: '',
      sector: ''
    });
  };

  const loadOfficers = () => {
    const allUsers = getUsers();
    setOfficers(allUsers.filter(u => u.role === 'Officer'));
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  const handleToggleActive = (officerId: string) => {
    const officer = officers.find(o => o.id === officerId);
    if (officer) {
      const updatedOfficer = updateUserProfile(officerId, { 
        isActive: officer.isActive === false ? true : false 
      });
      if (updatedOfficer) {
        loadOfficers();
        setMessage(`Officer ${officer.name} ${updatedOfficer.isActive ? 'activated' : 'deactivated'} successfully`);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleEdit = (officer: User) => {
    setEditingOfficer(officer.id);
    setEditForm({
      name: officer.name,
      email: officer.email,
      category: officer.category,
      isActive: officer.isActive !== false,
      location: officer.location
    });
  };

  const handleSave = (officerId: string) => {
    try {
      const updatedOfficer = updateUserProfile(officerId, editForm);
      if (updatedOfficer) {
        loadOfficers();
        setEditingOfficer(null);
        setEditForm({});
        setMessage(`Officer updated successfully`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Error updating officer');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancel = () => {
    setEditingOfficer(null);
    setEditForm({});
    setError('');
  };

  return (
    <div className="dashboard w-full">
      <header className="dashboard-header mb-8 pb-4 border-b border-gray-700">
        <div className="flex-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users size={32} /> Manage Officers
            </h1>
            <p className="text-gray subtitle">View and manage all system officers</p>
          </div>
          <button onClick={onBack} className="btn secondary">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {message && (
        <div className="alert bg-green-500/20 text-green-400 border border-green-500 rounded p-3 mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="alert bg-red-500/20 text-red-400 border border-red-500 rounded p-3 mb-4">
          {error}
        </div>
      )}

      <div className="filters-bar glass-card mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <h3 className="font-bold text-gray-200">Filter Officers</h3>
          </div>
          <button
            onClick={clearFilters}
            className="btn secondary text-sm px-3 py-1"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-400">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="select-input py-1"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-400">Province</label>
            <select
              value={filters.province}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              className="select-input py-1"
            >
              <option value="All">All Provinces</option>
              {uniqueProvinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-400">District</label>
            <input
              type="text"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              placeholder="Search district..."
              className="input-field py-1"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-400">Sector</label>
            <input
              type="text"
              value={filters.sector}
              onChange={(e) => handleFilterChange('sector', e.target.value)}
              placeholder="Search sector..."
              className="input-field py-1"
            />
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="mb-4 text-sm text-gray-400">
          Showing {filteredOfficers.length} of {officers.length} officers
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">Officer</th>
                <th className="text-left p-4">Username</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfficers.map(officer => (
                <tr key={officer.id} className="border-b border-gray-700/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {officer.profilePicture && (
                        <img 
                          src={officer.profilePicture} 
                          alt={officer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        {editingOfficer === officer.id ? (
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="bg-gray-700 text-white px-2 py-1 rounded"
                          />
                        ) : (
                          <div className="font-semibold">{officer.name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">{officer.username}</span>
                  </td>
                  <td className="p-4">
                    {editingOfficer === officer.id ? (
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <span className="text-gray-300">{officer.email}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingOfficer === officer.id ? (
                      <select
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="bg-gray-700 text-white px-2 py-1 rounded"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="badge secondary">{officer.category || 'Not assigned'}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">
                      {officer.location ? `${officer.location.province}, ${officer.location.district}, ${officer.location.sector}` : 'No location assigned'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(officer.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        officer.isActive !== false 
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {officer.isActive !== false ? (
                        <>
                          <ToggleRight size={18} />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={18} />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {editingOfficer === officer.id ? (
                        <>
                          <button
                            onClick={() => handleSave(officer.id)}
                            className="btn primary p-2"
                            title="Save"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="btn secondary p-2"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(officer)}
                          className="btn secondary p-2"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOfficers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No officers found matching the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
