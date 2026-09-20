import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  School, 
  ShieldCheck, 
  LogOut, 
  RotateCcw, 
  Save, 
  Sparkles,
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { currentUser, role, logout, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [college, setCollege] = useState(currentUser?.college || 'Imperial Institute of Technology');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, college, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="pb-28 max-w-xl mx-auto px-4 pt-3">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Account Profile</h1>
        <p className="text-xs text-slate-500">
          Manage your personal details and campus credentials
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl ring-2 ring-indigo-500 overflow-hidden bg-slate-100 shrink-0">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-black text-indigo-600">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 truncate">{currentUser?.name}</h2>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                role === 'host'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {role === 'host' ? 'Event Organizer' : 'Student'}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser?.email}</p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">{currentUser?.college}</p>
          </div>
        </div>

        {/* Locked Session Role Card (Role selected at login only) */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            role === 'host' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-700'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">
                Active Role: {role === 'host' ? '⚡ Event Host / Organizer' : '🎓 Student / Attendee'}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-md bg-slate-200 text-slate-700 font-bold">
                Locked
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Your role was selected during login. To access the {role === 'host' ? 'Student' : 'Host'} portal, please log out and sign in with that role.
            </p>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">College / University</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>

          {savedSuccess && (
            <p className="text-center text-xs text-emerald-600 font-semibold">
              ✓ Profile updated successfully!
            </p>
          )}
        </form>
      </div>

      {/* Security & System Info */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 mb-6 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security & UPI Settlement Rules</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          • All tickets issued contain SHA-256 cryptographic signatures verified at entry.
          <br />
          • UPI transactions enforce zero client trust with instantaneous pass inventory verification.
          <br />
          • Ticket validation and check-ins are logged with real-time timestamps.
        </p>
      </div>

      {/* Sign out */}
      <button
        onClick={logout}
        className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition"
      >
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );
};
