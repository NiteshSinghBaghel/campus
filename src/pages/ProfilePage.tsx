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

interface ProfilePageProps {
  onSwitchToHostView?: () => void;
  onSwitchToUserView?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onSwitchToHostView,
  onSwitchToUserView,
}) => {
  const { currentUser, role, switchRole, logout, updateProfile } = useAuth();

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
        <h1 className="text-2xl font-black text-slate-900">Student & Host Profile</h1>
        <p className="text-xs text-slate-500">
          Manage identity, college credentials, and platform role permissions
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

        {/* Role Toggle Switch Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Active Account Role</span>
            <p className="text-[11px] text-slate-500">
              {role === 'host'
                ? 'Switch back to Student to browse and purchase passes'
                : 'Switch to Host mode to publish events & scan QR gate passes'}
            </p>
          </div>

          <button
            onClick={() => {
              const nextRole = role === 'user' ? 'host' : 'user';
              switchRole(nextRole);
              if (nextRole === 'host' && onSwitchToHostView) onSwitchToHostView();
              if (nextRole === 'user' && onSwitchToUserView) onSwitchToUserView();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition ${
              role === 'host'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
            }`}
          >
            {role === 'host' ? 'Switch to Student' : 'Switch to Host'}
          </button>
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
          • All tickets issued contain SHA-256 cryptographic signatures verified server-side.
          <br />
          • UPI payments use zero frontend trusting policy with atomic ticket inventory transactions.
          <br />
          • Double-entry gate scanning is strictly enforced by the backend ledger.
        </p>

        <button
          onClick={() => {
            if (confirm('Reset demo storage to factory state?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="mt-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Reset Demo Events & Tickets Data
        </button>
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
