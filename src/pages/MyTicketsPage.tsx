import React, { useState } from 'react';
import { Ticket } from '../types';
import { DigitalTicket } from '../components/DigitalTicket';
import { 
  Ticket as TicketIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Compass
} from 'lucide-react';

interface MyTicketsPageProps {
  tickets: Ticket[];
  onExplore: () => void;
}

export const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ tickets, onExplore }) => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const upcomingTickets = tickets.filter(t => t.entryStatus !== 'entered' || t.exitStatus !== 'exited');
  const pastTickets = tickets.filter(t => t.entryStatus === 'entered' && t.exitStatus === 'exited');

  const displayedTickets = tab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <div className="pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-black text-slate-900">My E-Tickets</h1>
        <p className="text-xs text-slate-500">
          Digital entrance passes with cryptographically signed QR codes
        </p>
      </div>

      {/* Tabs */}
      <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200 flex gap-1 mb-5">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            tab === 'upcoming'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Active & Upcoming</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
            {upcomingTickets.length}
          </span>
        </button>

        <button
          onClick={() => setTab('past')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            tab === 'past'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Past / Completed</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
            {pastTickets.length}
          </span>
        </button>
      </div>

      {/* Ticket List */}
      {displayedTickets.length > 0 ? (
        <div className="space-y-4">
          {displayedTickets.map((t) => {
            const isEntered = t.entryStatus === 'entered';
            const isExited = t.exitStatus === 'exited';

            return (
              <div
                key={t.ticketId}
                className="relative bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs transition hover:border-slate-300"
              >
                <div className="p-4 flex gap-3.5 items-start">
                  <img
                    src={t.eventImageUrl}
                    alt={t.eventTitle}
                    className="w-20 h-24 rounded-2xl object-cover shrink-0 bg-slate-100"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Ticket Number & Status in one clean single line */}
                    <div className="flex items-center justify-between gap-1 mb-1 pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400">TICKET ID:</span>
                        <span className="font-mono text-xs font-black text-indigo-600 whitespace-nowrap">
                          {t.ticketId}
                        </span>
                      </div>
                      {isEntered && !isExited ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CHECKED IN
                        </span>
                      ) : isExited ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          COMPLETED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          CONFIRMED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-900 truncate">
                      {t.eventTitle}
                    </h3>

                    <div className="mt-1.5 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.eventDate} • {t.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{t.eventVenue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative border-t-2 border-dashed border-slate-200 px-4 py-2.5 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>Attendee: <b className="text-slate-800">{t.userName}</b></span>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="py-1.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Pass</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400 mb-3">
            <TicketIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No {tab} tickets</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {tab === 'upcoming'
              ? 'You have not registered for any upcoming events yet. Discover exciting fests on campus!'
              : 'You have no past event history recorded yet.'}
          </p>
          <button
            onClick={onExplore}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
          >
            Browse College Events
          </button>
        </div>
      )}

      {/* Digital Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-sm my-auto">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition z-10 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <DigitalTicket
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
