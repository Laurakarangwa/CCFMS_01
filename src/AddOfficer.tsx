import React, { useState } from 'react';
import { registerOfficer } from './mockData';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = ['Electricity', 'Sanitation', 'Public Relations', 'Water', 'Roads', 'Other'];

const RWANDA_PROVINCES = [
  'Kigali City',
  'Northern Province',
  'Southern Province', 
  'Eastern Province',
  'Western Province'
];

export const AddOfficer: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [province, setProvince] = useState(RWANDA_PROVINCES[0]);
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const location = {
        province,
        district,
        sector
      };
      registerOfficer(name, username, email, category, password, location);
      setMessage(`Officer ${name} registered successfully for ${category}.`);
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setCategory(CATEGORIES[0]);
      setProvince(RWANDA_PROVINCES[0]);
      setDistrict('');
      setSector('');
    } catch (err: any) {
      setError(err.message || 'Error creating officer account');
    }
  };

  return (
    <div className="dashboard w-full max-w-2xl">
      <header className="dashboard-header mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold flex flex-gap"><UserPlus /> Add New Officer</h1>
        <p className="text-gray subtitle">Register a new officer and assign their specialty category.</p>
      </header>

      <div className="glass-card p-6">
        {message && <div className="alert bg-green-500/20 text-green-400 border border-green-500 rounded p-3 mb-4">{message}</div>}
        {error && <div className="alert bg-red-500/20 text-red-400 border border-red-500 rounded p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
           <div className="form-group mb-0">
             <label>Full Name</label>
             <input required value={name} onChange={e => setName(e.target.value)} />
           </div>

           <div className="form-group mb-0">
             <label>Username (Login ID)</label>
             <input required value={username} onChange={e => setUsername(e.target.value)} />
           </div>

           <div className="form-group mb-0">
             <label>Email Address</label>
             <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
           </div>

           <div className="form-group mb-0">
             <label>Password</label>
             <div className="relative">
               <input 
                 required 
                 type={showPassword ? 'text' : 'password'} 
                 value={password} 
                 onChange={e => setPassword(e.target.value)} 
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
               >
                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
             </div>
           </div>

           <div className="form-group mb-0">
             <label>Province</label>
             <select className="select-input" value={province} onChange={e => setProvince(e.target.value)}>
                {RWANDA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
             </select>
           </div>

           <div className="form-group mb-0">
             <label>District</label>
             <input required value={district} onChange={e => setDistrict(e.target.value)} placeholder="Enter district" />
           </div>

           <div className="form-group mb-0">
             <label>Sector</label>
             <input required value={sector} onChange={e => setSector(e.target.value)} placeholder="Enter sector" />
             <p className="text-xs text-gray-500 mt-1">This officer will handle complaints from this location.</p>
           </div>

           <div className="form-group mb-0">
             <label>Specialty Category</label>
             <select className="select-input" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
             <p className="text-xs text-gray-500 mt-1">This officer will be best suited to handle complaints in this category.</p>
           </div>

           <button type="submit" className="btn primary self-start mt-2 px-8">Register Officer</button>
        </form>
      </div>
    </div>
  );
};
