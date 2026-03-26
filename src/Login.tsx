import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, registerCitizen } from './mockData';
import { User } from './types';
import { KeyRound, User as UserIcon, Eye, EyeOff } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const users = getUsers();
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (user) {
      onLogin(user);
      navigate(`/${user.role.toLowerCase()}`);
    } else {
      setLoginError('Invalid username/email or password');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    try {
        const newUser = registerCitizen(regName, regUsername, regEmail, regPassword);
        onLogin(newUser);
        navigate('/citizen');
    } catch (err: any) {
        setRegError(err.message || 'Error occurred during registration');
    }
  };

  return (
    <div className="login-container w-full h-full flex items-center justify-center">
      <div className="login-card glass mx-auto mt-20" style={{maxWidth: '450px', padding: '2.5rem', borderRadius: '24px'}}>
        <h2 className="login-title mb-2 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          CCFMS
        </h2>
        <p className="login-subtitle text-center mb-6 text-gray-400">
          {isSignUp ? 'Create a new Citizen account' : 'Sign in to your account'}
        </p>

        {isSignUp ? (
           <form onSubmit={handleSignUp} className="flex flex-col gap-4 text-left">
              {regError && <div className="text-red-500 text-sm">{regError}</div>}
              <div className="form-group flex flex-col gap-1 mb-0">
                  <label>Full Name</label>
                  <input required value={regName} onChange={e => setRegName(e.target.value)} />
              </div>
              <div className="form-group flex flex-col gap-1 mb-0">
                  <label>Username</label>
                  <input required value={regUsername} onChange={e => setRegUsername(e.target.value)} />
              </div>
              <div className="form-group flex flex-col gap-1 mb-0">
                  <label>Email</label>
                  <input required type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              </div>
              <div className="form-group flex flex-col gap-1 mb-0">
                  <label>Password</label>
                  <div className="relative">
                      <input 
                          required 
                          type={showRegPassword ? 'text' : 'password'} 
                          value={regPassword} 
                          onChange={e => setRegPassword(e.target.value)} 
                      />
                      <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                          {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                  </div>
              </div>
              <button type="submit" className="btn primary w-full mt-4 py-3">Sign Up</button>
              <div className="text-center mt-4">
                  <span className="text-sm text-gray-400">Already have an account? </span>
                  <button type="button" className="text-blue-400 text-sm hover:underline" onClick={() => setIsSignUp(false)}>Sign In</button>
              </div>
           </form>
        ) : (
           <form onSubmit={handleSignIn} className="flex flex-col gap-4 text-left">
              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
              <div className="form-group flex flex-col gap-1 mb-0">
                  <label>Username or Email</label>
                  <input required value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div className="form-group flex flex-col gap-1 mb-0">
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
              <button type="submit" className="btn primary w-full mt-4 py-3">Sign In</button>
              
              <div className="text-center mt-4">
                  <span className="text-sm text-gray-400">Don't have a citizen account? </span>
                  <button type="button" className="text-blue-400 text-sm hover:underline" onClick={() => setIsSignUp(true)}>Sign Up</button>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
                  
              </div>
           </form>
        )}
      </div>
    </div>
  );
};
