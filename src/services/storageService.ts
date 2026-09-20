import { CollegeEvent, Ticket, UserProfile, PaymentRecord, ScannerScanResult, PayoutRecord } from '../types';

const STORAGE_KEYS = {
  EVENTS: 'campuspass_events_v1',
  TICKETS: 'campuspass_tickets_v1',
  USERS: 'campuspass_users_v1',
  PAYMENTS: 'campuspass_payments_v1',
  CURRENT_USER: 'campuspass_auth_user_v1',
  BOOKMARKS: 'campuspass_bookmarks_v1',
  PAYOUTS: 'campuspass_payouts_v1',
};

// Initial realistic college events
export const INITIAL_EVENTS: CollegeEvent[] = [
  {
    eventId: 'evt-tech-summit-2025',
    hostId: 'host-council-101',
    hostName: 'Innovators Club • IIT Delhi',
    title: 'Tech Summit 2025',
    description: 'A full-day collision of builders, founders, and future-shapers. Explore AI labs, rapid demos, and conversations that turn ideas into momentum.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    date: '18 Oct',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    location: 'IIT Delhi - Hauz Khas',
    venue: 'Main Auditorium',
    price: 299,
    currency: 'INR',
    capacity: 500,
    ticketsSold: 343,
    availableTickets: 157,
    status: 'published',
    category: 'Tech',
    rules: [
      'Bring a valid college ID',
      'Entry closes 30 minutes after start'
    ],
    amenities: ['AI Labs Access', 'Rapid Demos', 'Networking Lounge', 'Event Pass Kit'],
    hostPhone: '+91 98765 43210',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-tech-fest-2026',
    hostId: 'host-council-101',
    hostName: 'Nexus Tech Club & IEEE',
    title: 'TechnoGenesis 2026: AI & Robotics Summit',
    description: 'The premier inter-college tech symposium featuring autonomous robot racing, Hackathon finals, quantum computing workshops, and tech expos with top industry mentors.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    date: '2026-09-25',
    startTime: '09:30 AM',
    endTime: '06:00 PM',
    location: 'North Campus, Tech Innovation Block',
    venue: 'Grand Central Auditorium',
    price: 199,
    currency: 'INR',
    capacity: 450,
    ticketsSold: 378,
    availableTickets: 72,
    status: 'published',
    category: 'Tech',
    rules: [
      'Valid College Student ID Card is mandatory at entrance',
      'Laptops allowed for Hackathon and Coding Track participants',
      'No entry permitted after 11:30 AM without prior coordinator approval',
      'Digital QR pass must be shown on mobile screen'
    ],
    amenities: ['High-speed Wi-Fi', 'Free Lunch & Snacks Box', 'Certificate of Participation', 'Swag Kit'],
    hostPhone: '+91 98112 34567',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-cultural-night',
    hostId: 'host-council-101',
    hostName: 'Student Cultural Committee',
    title: 'Rhythm & Glow: Annual Fest Gala & Rock Battle',
    description: 'Experience electrifying live band performances, laser dance showdowns, celebrity DJ night, and mouthwatering food truck carnival under the starlit sky.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
    date: '2026-09-28',
    startTime: '05:00 PM',
    endTime: '11:00 PM',
    location: 'Main University Grounds',
    venue: 'Open Air Amphitheatre',
    price: 299,
    currency: 'INR',
    capacity: 1200,
    ticketsSold: 1150,
    availableTickets: 50,
    status: 'published',
    category: 'Cultural',
    rules: [
      'Wristband will be issued upon scanning digital ticket',
      'Strict zero-tolerance policy towards harassment or outside alcohol',
      'Exit and re-entry requires valid Exit QR scan'
    ],
    amenities: ['DJ Soundstage', '15+ Street Food Stalls', 'First Aid Station', 'Professional Photography Photo Booth'],
    hostPhone: '+91 98223 45678',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-esports-championship',
    hostId: 'host-gaming-202',
    hostName: 'Campus Esports League',
    title: 'ByteClash: Valorant & BGMI Inter-College Finals',
    description: '16 top collegiate teams battle on 240Hz tournament rigs with live shoutcasting, spectator stadium seating, and ₹1,00,000 prize pool.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
    date: '2026-10-02',
    startTime: '11:00 AM',
    endTime: '08:00 PM',
    location: 'Student Activity Center (SAC)',
    venue: 'Arena Hall B',
    price: 99,
    currency: 'INR',
    capacity: 300,
    ticketsSold: 289,
    availableTickets: 11,
    status: 'published',
    category: 'Gaming',
    rules: [
      'Spectator seating is first-come-first-serve',
      'Recording without media pass prohibited'
    ],
    amenities: ['Ultra-wide projection screens', 'Energy Drinks', 'Tournament Merchandise'],
    hostPhone: '+91 98334 56789',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-ai-workshop',
    hostId: 'host-council-101',
    hostName: 'Google Developer Student Club',
    title: 'Hands-on Generative AI & LLM Masterclass',
    description: 'Build real-world multi-modal agents using Gemini and Python. Includes free cloud computing credits and live code mentoring.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    date: '2026-10-05',
    startTime: '02:00 PM',
    endTime: '06:00 PM',
    location: 'Computer Science Dept.',
    venue: 'Computing Lab 4 & 5',
    price: 0,
    currency: 'INR',
    capacity: 100,
    ticketsSold: 98,
    availableTickets: 2,
    status: 'published',
    category: 'Workshop',
    rules: [
      'Personal laptops with Chrome browser required',
      'Basic Python understanding recommended'
    ],
    amenities: ['Certificate of Excellence', 'Free Cloud Credits', 'Coffee & Doughnuts'],
    hostPhone: '+91 98445 67890',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    eventId: 'evt-inter-college-derby',
    hostId: 'host-sports-303',
    hostName: 'University Athletics Board',
    title: 'Champions Cup: Football & Basketball Derby',
    description: 'High stakes rivalry match! Come wear your college colors and cheer our teams in the championship finals.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80',
    date: '2026-10-10',
    startTime: '03:30 PM',
    endTime: '08:30 PM',
    location: 'Sports Complex',
    venue: 'Main Floodlit Stadium',
    price: 49,
    currency: 'INR',
    capacity: 800,
    ticketsSold: 640,
    availableTickets: 160,
    status: 'published',
    category: 'Sports',
    rules: [
      'Banners and drums allowed in designated cheer section',
      'Glass bottles prohibited inside stands'
    ],
    amenities: ['Bleacher seating', 'Floodlit arena', 'Live commentary'],
    hostPhone: '+91 98556 78901',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export class StorageService {
  static getEvents(): CollegeEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    try {
      const parsed: CollegeEvent[] = JSON.parse(raw);
      if (!parsed.some(e => e.eventId === 'evt-tech-summit-2025')) {
        parsed.unshift(INITIAL_EVENTS[0]);
        this.saveEvents(parsed);
      }
      return parsed;
    } catch {
      return INITIAL_EVENTS;
    }
  }

  static saveEvents(events: CollegeEvent[]): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  static getEventById(eventId: string): CollegeEvent | undefined {
    return this.getEvents().find(e => e.eventId === eventId);
  }

  static createEvent(eventData: Omit<CollegeEvent, 'eventId' | 'createdAt' | 'updatedAt' | 'ticketsSold' | 'availableTickets'>): CollegeEvent {
    const events = this.getEvents();
    const newEvent: CollegeEvent = {
      ...eventData,
      eventId: `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      ticketsSold: 0,
      availableTickets: eventData.capacity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    events.unshift(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  static updateEvent(eventId: string, updates: Partial<CollegeEvent>): CollegeEvent {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.eventId === eventId);
    if (idx === -1) throw new Error('Event not found');
    
    const updated = {
      ...events[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Auto sync sold out
    if (updated.availableTickets <= 0) {
      updated.status = 'sold_out';
    }
    
    events[idx] = updated;
    this.saveEvents(events);
    return updated;
  }

  static deleteEvent(eventId: string): void {
    const events = this.getEvents().filter(e => e.eventId !== eventId);
    this.saveEvents(events);
  }

  // Tickets
  static getTickets(): Ticket[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!raw) return [];
    try {
      const parsed: Ticket[] = JSON.parse(raw);
      // Ensure hostPhone is populated from events if missing
      const events = this.getEvents();
      return parsed.map(t => {
        if (!t.hostPhone) {
          const ev = events.find(e => e.eventId === t.eventId);
          t.hostPhone = ev?.hostPhone || '+91 98112 34567';
        }
        return t;
      });
    } catch {
      return [];
    }
  }

  static updateTicketAttendee(ticketId: string, updates: Partial<Ticket>): Ticket {
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.ticketId === ticketId);
    if (idx === -1) throw new Error('Ticket not found');
    tickets[idx] = { ...tickets[idx], ...updates };
    this.saveTickets(tickets);
    return tickets[idx];
  }

  static updateEventHostHelpline(eventId: string, hostPhone: string): void {
    this.updateEvent(eventId, { hostPhone });
    const tickets = this.getTickets();
    let changed = false;
    tickets.forEach(t => {
      if (t.eventId === eventId) {
        t.hostPhone = hostPhone;
        changed = true;
      }
    });
    if (changed) this.saveTickets(tickets);
  }

  static saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }

  static getUserTickets(userId: string): Ticket[] {
    return this.getTickets().filter(t => t.userId === userId);
  }

  static getEventAttendees(eventId: string): Ticket[] {
    return this.getTickets().filter(t => t.eventId === eventId);
  }

  static getHostAttendees(hostId: string): Ticket[] {
    return this.getTickets().filter(t => t.hostId === hostId);
  }

  static getTicketById(ticketId: string): Ticket | undefined {
    return this.getTickets().find(t => t.ticketId === ticketId);
  }

  static getTicketByToken(token: string): Ticket | undefined {
    return this.getTickets().find(t => t.qrToken === token || t.ticketId === token);
  }

  // Scanner Verification: Strictly Entry-Only Gate Verification
  static verifyAndProcessScan(
    qrToken: string,
    currentHostId: string,
    _legacyMode?: 'entry' | 'exit'
  ): ScannerScanResult {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(t => t.qrToken === qrToken || t.ticketId === qrToken);

    if (ticketIndex === -1) {
      return {
        success: false,
        message: 'Invalid Ticket QR. No matching ticket found in database.',
        code: 'INVALID_TOKEN'
      };
    }

    const ticket = tickets[ticketIndex];

    // Check status
    if (ticket.status === 'cancelled' || ticket.status === 'refunded') {
      return {
        success: false,
        message: `Ticket is ${ticket.status.toUpperCase()} and cannot be used.`,
        ticket,
        code: 'TICKET_CANCELLED'
      };
    }

    // Host check - gate scanner allows valid event verification
    if (ticket.hostId !== currentHostId && currentHostId && currentHostId !== 'host-council-101' && currentHostId !== 'scanner-gate') {
      // Allow verification with event notice
    }

    const nowIso = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Strictly Entry-Only: Check if already entered
    if (ticket.entryStatus === 'entered') {
      return {
        success: false,
        message: `ALREADY USED! Checked in at ${ticket.entryTime || 'earlier today'}. Duplicate entry rejected!`,
        ticket,
        code: 'ALREADY_ENTERED'
      };
    }

    // Record entry check-in
    const updatedTicket: Ticket = {
      ...ticket,
      entryStatus: 'entered',
      entryTime: nowIso,
      exitStatus: 'not_exited'
    };
    tickets[ticketIndex] = updatedTicket;
    this.saveTickets(tickets);

    return {
      success: true,
      message: `ENTRY GRANTED! Welcome ${updatedTicket.userName}. Pass verified successfully.`,
      ticket: updatedTicket,
      code: 'VALID'
    };
  }

  // Bookmarks / Wishlist
  static getBookmarks(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static toggleBookmark(eventId: string): string[] {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(eventId);
    let updated: string[];
    if (index > -1) {
      updated = bookmarks.filter(id => id !== eventId);
    } else {
      updated = [...bookmarks, eventId];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  }

  static isBookmarked(eventId: string): boolean {
    return this.getBookmarks().includes(eventId);
  }

  // Helper to seed demo tickets with real student attendees
  static seedInitialData(userId: string, userName: string, userEmail: string) {
    const studentName = (!userName || userName.includes('Council') || userName.includes('Club') || userName.includes('Host'))
      ? 'Rohan Verma'
      : userName;
    const studentEmail = (!userEmail || userEmail.includes('nexus') || userEmail.includes('host'))
      ? 'rohan.verma@campus.edu'
      : userEmail;

    const all = this.getTickets();
    const existing = all.filter(t => t.userId === userId);

    if (existing.length === 0) {
      const demoTicket: Ticket = {
        ticketId: 'TKT-88492014',
        eventId: 'evt-tech-fest-2026',
        eventTitle: 'TechnoGenesis 2026: AI & Robotics Summit',
        eventDate: '2026-09-25',
        eventTime: '09:30 AM',
        eventVenue: 'Grand Central Auditorium, North Campus',
        eventImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
        userId,
        userName: studentName,
        userEmail: studentEmail,
        phone: '+91 98765 43210',
        college: 'Imperial Institute of Technology',
        rollNo: '2024-CS-084',
        hostId: 'host-council-101',
        hostPhone: '+91 98112 34567',
        paymentId: 'pay_UPI_NEXUS982341',
        orderId: 'order_fest_89234',
        amount: 199,
        currency: 'INR',
        status: 'confirmed',
        qrToken: 'TKTOK-88492014-NEXUS-SEC-9X',
        qrHash: 'sha256_b784a92c34091e6b872',
        issuedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        entryStatus: 'not_entered',
        exitStatus: 'not_exited'
      };
      all.push(demoTicket);
    }

    // Seed distinct student attendees for the host attendee ledger if list has < 3 tickets
    if (all.length < 3) {
      const sampleAttendees: Ticket[] = [
        {
          ticketId: 'TKT-77382910',
          eventId: 'evt-tech-fest-2026',
          eventTitle: 'TechnoGenesis 2026: AI & Robotics Summit',
          eventDate: '2026-09-25',
          eventTime: '09:30 AM',
          eventVenue: 'Grand Central Auditorium, North Campus',
          eventImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
          userId: 'usr-student-201',
          userName: 'Ananya Deshmukh',
          userEmail: 'ananya.deshmukh@campus.edu',
          phone: '+91 98234 56781',
          college: 'IIT Delhi',
          rollNo: '2024-EC-102',
          hostId: 'host-council-101',
          hostPhone: '+91 98112 34567',
          paymentId: 'pay_UPI_ANAN7721',
          orderId: 'order_fest_89235',
          amount: 199,
          currency: 'INR',
          status: 'confirmed',
          qrToken: 'TKTOK-77382910-ANAN-SEC-1A',
          qrHash: 'sha256_e8910b24',
          issuedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          entryStatus: 'entered',
          entryTime: '09:42 AM',
          exitStatus: 'not_exited'
        },
        {
          ticketId: 'TKT-66291044',
          eventId: 'evt-tech-fest-2026',
          eventTitle: 'TechnoGenesis 2026: AI & Robotics Summit',
          eventDate: '2026-09-25',
          eventTime: '09:30 AM',
          eventVenue: 'Grand Central Auditorium, North Campus',
          eventImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
          userId: 'usr-student-202',
          userName: 'Sneha Patel',
          userEmail: 'sneha.patel@campus.edu',
          phone: '+91 98345 67892',
          college: 'BITS Pilani',
          rollNo: '2023-CS-055',
          hostId: 'host-council-101',
          hostPhone: '+91 98112 34567',
          paymentId: 'pay_UPI_SNEH6612',
          orderId: 'order_fest_89236',
          amount: 199,
          currency: 'INR',
          status: 'confirmed',
          qrToken: 'TKTOK-66291044-SNEH-SEC-2B',
          qrHash: 'sha256_c4912a77',
          issuedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          entryStatus: 'not_entered',
          exitStatus: 'not_exited'
        },
        {
          ticketId: 'TKT-55182903',
          eventId: 'evt-cultural-night',
          eventTitle: 'Rhythm & Glow: Annual Fest Gala & Rock Battle',
          eventDate: '2026-09-28',
          eventTime: '05:00 PM',
          eventVenue: 'Open Air Amphitheatre, Main Grounds',
          eventImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
          userId: 'usr-student-203',
          userName: 'Kabir Mehta',
          userEmail: 'kabir.mehta@campus.edu',
          phone: '+91 98456 78903',
          college: 'Delhi Technological University',
          rollNo: '2024-IT-019',
          hostId: 'host-council-101',
          hostPhone: '+91 98223 45678',
          paymentId: 'pay_UPI_KABI5501',
          orderId: 'order_fest_89237',
          amount: 299,
          currency: 'INR',
          status: 'confirmed',
          qrToken: 'TKTOK-55182903-KABI-SEC-3C',
          qrHash: 'sha256_d1829f04',
          issuedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          entryStatus: 'not_entered',
          exitStatus: 'not_exited'
        }
      ];

      sampleAttendees.forEach(sa => {
        if (!all.some(t => t.ticketId === sa.ticketId)) {
          all.push(sa);
        }
      });
    }

    this.saveTickets(all);
  }

  // ================= PAYOUTS / REVENUE TRANSFERS =================
  static getPayouts(hostId?: string): PayoutRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
    if (!raw) return [];
    try {
      const parsed: PayoutRecord[] = JSON.parse(raw);
      if (hostId) {
        return parsed.filter(p => p.hostId === hostId);
      }
      return parsed;
    } catch {
      return [];
    }
  }

  static savePayouts(payouts: PayoutRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
  }

  static createPayout(payoutData: Omit<PayoutRecord, 'payoutId' | 'status' | 'referenceId' | 'timestamp'>): PayoutRecord {
    const payouts = this.getPayouts();
    const newPayout: PayoutRecord = {
      ...payoutData,
      payoutId: `POUT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'completed',
      referenceId: `UPI-SETTLE-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      timestamp: new Date().toISOString(),
    };

    payouts.unshift(newPayout);
    this.savePayouts(payouts);
    return newPayout;
  }
}
