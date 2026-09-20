import React, { useState } from 'react';
import { CollegeEvent, Ticket } from '../types';
import { PaymentModal } from '../components/PaymentModal';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation,
  CheckCircle2, 
  Heart,
  Share2,
  Ticket as TicketIcon,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

interface EventDetailPageProps {
  event: CollegeEvent;
  onBack: () => void;
  onTicketPurchased: (ticket: Ticket) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onBack, onTicketPurchased }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const percentBooked = Math.round((event.ticketsSold / event.capacity) * 100);
  const isSoldOut = event.status === 'sold_out' || event.availableTickets <= 0;
  const isCancelled = event.status === 'cancelled';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nHost: ${event.hostName}`);
    const location = encodeURIComponent(`${event.venue}, ${event.location}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="pb-48 max-w-xl mx-auto min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header with Back Button and Clean Light Gradient */}
      <div className="relative pt-4 px-4 pb-8 bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 border-b border-slate-200/80">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center transition ${
                isLiked ? 'text-rose-500' : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Bookmark"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 transition relative"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hero Event Cover Image */}
        <div className="rounded-3xl overflow-hidden shadow-md mb-5 border border-slate-200/90 h-52 sm:h-64 relative bg-slate-900">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-indigo-700 shadow-sm">
              {event.category} Fest
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
              {event.availableTickets} Seats Left
            </span>
          </div>
        </div>

        {/* Centered Category Pill */}
        <div className="text-center">
          <div className="inline-block px-6 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-800 font-extrabold text-xs uppercase tracking-widest shadow-2xs">
            {event.category}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mt-3 tracking-tight leading-tight">
          {event.title}
        </h1>

        {/* Subtitle / Host */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium text-center mt-1.5 flex items-center justify-center gap-1.5">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>Hosted by <strong className="text-slate-900">{event.hostName}</strong></span>
        </p>
      </div>

      {/* Main Details Section */}
      <div className="px-4 space-y-4 pt-4">
        {/* 1. Key Logistics 2x2 Grid Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="grid grid-cols-2 gap-y-4 gap-x-3">
            {/* Date */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-indigo-600 p-1.5 rounded-lg bg-indigo-50">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Date</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {event.date}
                </span>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-indigo-600 p-1.5 rounded-lg bg-indigo-50">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Schedule</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {event.startTime} – {event.endTime}
                </span>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-emerald-600 p-1.5 rounded-lg bg-emerald-50">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Venue</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {event.venue}
                </span>
              </div>
            </div>

            {/* Campus */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-emerald-600 p-1.5 rounded-lg bg-emerald-50">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Campus</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action: Add to Calendar */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Never miss this date</span>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Google Calendar</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* 2. Pass Availability Box */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-black text-slate-900">Pass availability</span>
            <span className="text-xs sm:text-sm font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              {event.availableTickets} passes left
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, percentBooked)}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 font-medium mt-2 flex items-center justify-between">
            <span>{percentBooked}% booked</span>
            <span>Total capacity: {event.capacity} seats</span>
          </p>
        </div>

        {/* 3. About This Event */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <h2 className="text-base font-black text-slate-900 mb-2">About this event</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* 4. Good To Know Checklist */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Good to know</span>
          </h2>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bring a valid college student ID card</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Entry gates close 30 minutes after scheduled start</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Anti-counterfeit digital QR pass issued upon booking</span>
            </li>
            {event.rules?.filter(r => !r.toLowerCase().includes('id card') && !r.toLowerCase().includes('entry closes')).map((rule, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky Bottom Booking Section - Positioned above Home & Ticket Bottom Navigation */}
      <div className="fixed bottom-[60px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          {/* LEFT SIDE: Ticket Price and Availability */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {event.price === 0 ? 'Entry' : 'Pass Price'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                {event.price === 0 ? 'FREE' : `₹${event.price}`}
              </span>
              {event.availableTickets > 0 && !isSoldOut && !isCancelled && (
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {event.availableTickets} left
                </span>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Book Now Button to open booking form */}
          <div className="shrink-0">
            {isCancelled ? (
              <button
                disabled
                className="py-3 px-6 rounded-2xl bg-slate-200 text-slate-400 font-black text-xs cursor-not-allowed uppercase"
              >
                Event Cancelled
              </button>
            ) : isSoldOut ? (
              <button
                disabled
                className="py-3 px-6 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 font-black text-xs cursor-not-allowed uppercase"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={() => setIsPaymentOpen(true)}
                className="py-3 px-6 sm:px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <TicketIcon className="w-4 h-4" />
                <span>Book Now</span>
                <span className="text-xs text-indigo-200 font-bold ml-0.5">→</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment & Attendee Registration Modal */}
      <PaymentModal
        event={event}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={(newTicket) => {
          onTicketPurchased(newTicket);
        }}
      />
    </div>
  );
};
