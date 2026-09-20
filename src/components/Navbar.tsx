import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, UserCheck, Bell, Search } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, activeTab, onNavigate }) => {
  const { currentUser, role, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div 
          onClick={() => onNavigate && onNavigate(role === 'host' ? 'host-dashboard' : 'home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-sm text-white font-black text-xl tracking-tight transition-transform group-hover:scale-105">
            CP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-slate-900">
                CampusPass
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Fest '26
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {role === 'host' ? '⚡ Organizer Portal' : '🎓 Discover College Events'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Pill */}
          <button
            onClick={() => switchRole(role === 'user' ? 'host' : 'user')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              role === 'host'
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 shadow-2xs'
            }`}
            title="Click to toggle between Student & Host roles"
          >
            {role === 'host' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Host View</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Student</span>
              </>
            )}
            <span className="text-[10px] opacity-75 underline ml-0.5">Switch</span>
          </button>

          {role === 'user' && onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition"
              aria-label="Search events"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Profile Avatar */}
          <div
            onClick={() => onNavigate && onNavigate('profile')}
            className="w-9 h-9 rounded-full ring-2 ring-indigo-500/40 overflow-hidden cursor-pointer hover:ring-indigo-600 transition shadow-2xs"
            title={currentUser?.name}
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
