import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import jsQR from 'jsqr';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { ScannerScanResult, Ticket } from '../types';
import { 
  X, 
  Scan, 
  Camera, 
  Upload,
  RefreshCw,
  UserCheck,
  ShieldCheck,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Hash,
  GraduationCap,
  Users,
  Ticket as TicketIcon
} from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: () => void;
  prefilledTicket?: Ticket | null;
}

type FeedbackType = 'verified' | 'already_entered' | 'invalid' | null;

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  prefilledTicket = null,
}) => {
  const { currentUser } = useAuth();
  
  // Feedback state for the 2-second screen overlay
  const [feedbackState, setFeedbackState] = useState<FeedbackType>(null);
  const [activeScannedTicket, setActiveScannedTicket] = useState<Ticket | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Persisted Last Scanned Ticket for Preview (User Request: "and at last preview show karo")
  const [lastScannedTicket, setLastScannedTicket] = useState<Ticket | null>(null);
  const [lastScanResult, setLastScanResult] = useState<ScannerScanResult | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScanningActiveRef = useRef<boolean>(true);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sound effects using Web Audio API
  const playSound = (type: 'success' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      isScanningActiveRef.current = true;
      startCamera();

      if (prefilledTicket) {
        processToken(prefilledTicket.qrToken);
      }
    } else {
      stopCamera();
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      setFeedbackState(null);
      setManualTokenInput('');
    }

    return () => {
      stopCamera();
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [isOpen, prefilledTicket]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this device/browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        await videoRef.current.play();
        setCameraActive(true);
        isScanningActiveRef.current = true;
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera could not be accessed directly:', err);
      setCameraError(err.message || 'Camera permission not granted or unavailable.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Live video frame QR code detection loop with jsQR
  const scanFrame = () => {
    if (!videoRef.current || !streamRef.current) return;

    if (
      isScanningActiveRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
    ) {
      const video = videoRef.current;
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        try {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data && code.data.trim()) {
            // QR Code Detected! Pause scanning and process
            isScanningActiveRef.current = false;
            processToken(code.data.trim());
            return;
          }
        } catch {
          // Continue scanning next frame
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Process and verify scanned token
  const processToken = (token: string) => {
    if (!token.trim()) return;
    setIsProcessing(true);

    const hostId = currentUser?.uid || 'host-council-101';
    const result = StorageService.verifyAndProcessScan(token.trim(), hostId);
    setIsProcessing(false);

    // Record last scanned ticket for preview
    if (result.ticket) {
      setLastScannedTicket(result.ticket);
    }
    setLastScanResult(result);

    // USER REQUIREMENT LOGIC:
    // "agar scan ho chuka hai tho screen me message show karo already enter kar ke and x ka red sign do 2 second ke liye screen me
    // and new ahi tho verified kar ke crorect ka sign screen me show karo 2 second ke liye and again scan satrt hoga"
    if (result.code === 'ALREADY_ENTERED') {
      // 1. Already entered -> Show Red X sign & 'ALREADY ENTER' for 2 seconds
      playSound('error');
      setFeedbackState('already_entered');
      setActiveScannedTicket(result.ticket || null);
      setFeedbackMessage(result.message || 'Already Entered! Duplicate entry rejected.');
      isScanningActiveRef.current = false;

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedbackState(null);
        isScanningActiveRef.current = true;
        scanFrame(); // Automatically resume scanning
      }, 2000);

    } else if (result.success) {
      // 2. New & verified -> Show Green Correct sign & 'VERIFIED' for 2 seconds
      playSound('success');
      setFeedbackState('verified');
      setActiveScannedTicket(result.ticket || null);
      setFeedbackMessage('Verified! Entry Granted • Welcome to the Event.');
      isScanningActiveRef.current = false;

      if (onScanSuccess) {
        onScanSuccess();
      }

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedbackState(null);
        isScanningActiveRef.current = true;
        scanFrame(); // Automatically resume scanning
      }, 2000);

    } else {
      // Invalid ticket
      playSound('error');
      setFeedbackState('invalid');
      setActiveScannedTicket(result.ticket || null);
      setFeedbackMessage(result.message || 'Invalid Ticket QR Token.');
      isScanningActiveRef.current = false;

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedbackState(null);
        isScanningActiveRef.current = true;
        scanFrame(); // Automatically resume scanning
      }, 2000);
    }
  };

  // Image Upload Scan Handler (Convenience for testing saved QR pass screenshots)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            processToken(code.data);
          } else {
            alert('No QR code found in the uploaded image. Please ensure the QR code is clear.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Live Gate Entry Scanner</h3>
              <p className="text-[11px] text-slate-500">Auto camera verification with 2s live response</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}
        <div className="mt-4 overflow-y-auto pr-1 flex-1 space-y-4">
          
          {/* ================= CAMERA / SCANNER VIEWPORT WITH 2-SECOND FEEDBACK OVERLAY ================= */}
          <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden h-64 sm:h-72 flex flex-col items-center justify-center shadow-inner">
            
            {/* Live Camera Stream */}
            <video 
              ref={videoRef} 
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              playsInline
              muted
            />

            {/* Scanning Laser Beam & Target Frame */}
            {cameraActive && !feedbackState && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-indigo-400/80 rounded-3xl relative">
                  {/* Corner Accent Marks */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />
                  
                  {/* Animated Horizontal Laser Scan Line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-glow animate-pulse absolute top-1/2 -translate-y-1/2" />
                </div>
                
                <div className="absolute bottom-3 py-1 px-3 rounded-full bg-slate-900/90 border border-slate-700 text-white text-[11px] font-semibold tracking-wide">
                  Align QR Code inside frame
                </div>
              </div>
            )}

            {/* Camera Off / Fallback View */}
            {!cameraActive && !feedbackState && (
              <div className="text-center p-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-white">Live Camera QR Scanner</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {cameraError || 'Allow camera permission to scan attendee tickets instantly at the gate'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={startCamera}
                    className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition active:scale-95"
                  >
                    Start Live Camera
                  </button>
                  <label className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Scan QR Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* ================= USER SPECIFIED 2-SECOND FEEDBACK OVERLAYS ================= */}
            {/* 1. ALREADY ENTERED (Red X Sign for 2 seconds) */}
            {feedbackState === 'already_entered' && (
              <div className="absolute inset-0 bg-[#380b12]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-scale-in">
                {/* Large Red X Sign */}
                <div className="w-20 h-20 rounded-full bg-rose-500/20 border-4 border-rose-500 text-rose-500 flex items-center justify-center shadow-2xl mb-2 animate-bounce">
                  <span className="text-5xl font-black leading-none pb-1">✕</span>
                </div>

                {/* Big Bold Message */}
                <h2 className="text-2xl font-black text-rose-400 tracking-tight">
                  ALREADY ENTERED
                </h2>
                
                <p className="text-xs font-semibold text-rose-200 mt-0.5">
                  Ticket already checked in! Duplicate entry rejected.
                </p>

                {/* Attendee Details with Visitor Count */}
                {activeScannedTicket && (
                  <div className="mt-3 px-4 py-2.5 rounded-2xl bg-black/40 border border-rose-500/30 text-xs text-rose-100 max-w-xs w-full text-left space-y-1">
                    <div className="flex items-center justify-between pb-1 border-b border-rose-500/20">
                      <span className="font-bold flex items-center gap-1 text-rose-200">
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                        Passes / Visitors:
                      </span>
                      <span className="font-black px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800 text-[11px]">
                        {(activeScannedTicket.quantity || 1)} {(activeScannedTicket.quantity || 1) > 1 ? 'Visitors' : 'Visitor'}
                      </span>
                    </div>
                    <p className="truncate"><b>Attendee:</b> {activeScannedTicket.userName}</p>
                    <p className="font-mono text-[11px] text-rose-300"><b>ID:</b> {activeScannedTicket.ticketId}</p>
                    <p className="text-[11px] text-rose-300"><b>First Check-in:</b> {activeScannedTicket.entryTime || 'Earlier'}</p>
                  </div>
                )}

                {/* 2-Second Visual Countdown Indicator */}
                <div className="mt-4 w-40 h-1.5 bg-rose-950 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full animate-[pulse_0.4s_infinite]" style={{ width: '100%' }} />
                </div>
                <span className="text-[10px] text-rose-300 mt-1 font-medium">
                  Resuming scanner in 2 seconds...
                </span>
              </div>
            )}

            {/* 2. VERIFIED (Green Correct Checkmark for 2 seconds) */}
            {feedbackState === 'verified' && (
              <div className="absolute inset-0 bg-[#062916]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-scale-in">
                {/* Large Green Correct Sign */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-4 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-2xl mb-2 animate-bounce">
                  <span className="text-4xl font-black leading-none pb-1">✓</span>
                </div>

                {/* VISITOR COUNT BADGE AS REQUESTED */}
                {activeScannedTicket && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider mb-1.5 shadow-md">
                    <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ADMIT {(activeScannedTicket.quantity || 1)} {(activeScannedTicket.quantity || 1) > 1 ? 'VISITORS' : 'VISITOR'}</span>
                    <span className="opacity-75">({(activeScannedTicket.quantity || 1)} {(activeScannedTicket.quantity || 1) > 1 ? 'Passes' : 'Pass'})</span>
                  </div>
                )}

                {/* Big Bold Message */}
                <h2 className="text-2xl font-black text-emerald-400 tracking-tight">
                  VERIFIED & GRANTED
                </h2>

                <p className="text-xs font-semibold text-emerald-200 mt-0.5">
                  Gate clearance approved • Welcome to the Event!
                </p>

                {/* Attendee Details with Visitor count */}
                {activeScannedTicket && (
                  <div className="mt-3 px-4 py-2.5 rounded-2xl bg-black/40 border border-emerald-500/30 text-xs text-emerald-100 max-w-xs w-full text-left space-y-1">
                    <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                      <span className="font-bold flex items-center gap-1 text-emerald-300">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        Admit Visitors:
                      </span>
                      <span className="font-black px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                        {(activeScannedTicket.quantity || 1)} {(activeScannedTicket.quantity || 1) > 1 ? 'Visitors' : 'Visitor'}
                      </span>
                    </div>
                    <p className="truncate"><b>Attendee:</b> {activeScannedTicket.userName}</p>
                    <p className="font-mono text-[11px] text-emerald-300"><b>Ticket ID:</b> {activeScannedTicket.ticketId}</p>
                    <p className="text-[11px] text-emerald-300"><b>Check-in Time:</b> {activeScannedTicket.entryTime || 'Now'}</p>
                  </div>
                )}

                {/* 2-Second Visual Countdown Indicator */}
                <div className="mt-4 w-40 h-1.5 bg-emerald-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full animate-[pulse_0.4s_infinite]" style={{ width: '100%' }} />
                </div>
                <span className="text-[10px] text-emerald-300 mt-1 font-medium">
                  Next scan starting in 2 seconds...
                </span>
              </div>
            )}

            {/* 3. INVALID TOKEN (Red X for 2 seconds) */}
            {feedbackState === 'invalid' && (
              <div className="absolute inset-0 bg-[#380b12]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-rose-500/20 border-4 border-rose-500 text-rose-500 flex items-center justify-center shadow-2xl mb-3">
                  <span className="text-5xl font-black leading-none pb-1">✕</span>
                </div>

                <h2 className="text-2xl font-black text-rose-400 tracking-tight">
                  INVALID PASS
                </h2>
                <p className="text-xs text-rose-200 mt-1 max-w-xs">
                  {feedbackMessage}
                </p>

                <div className="mt-4 w-40 h-1.5 bg-rose-950 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
                <span className="text-[10px] text-rose-300 mt-1 font-medium">
                  Resuming scanner in 2 seconds...
                </span>
              </div>
            )}
          </div>

          {/* ================= USER SPECIFIED: "and at last preview show karo" ================= */}
          {/* DEDICATED LAST SCANNED TICKET PREVIEW CARD */}
          {lastScannedTicket && (
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5" />
                  Last Scanned Pass Preview
                </span>
                
                {lastScannedTicket.entryStatus === 'entered' ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    ✓ Checked In ({lastScannedTicket.entryTime})
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    Not Entered
                  </span>
                )}
              </div>

              {/* Ticket details body */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                {/* Single-line Ticket Number as requested */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">Ticket Number:</span>
                  <span className="font-mono font-black text-indigo-600 text-xs tracking-wider">
                    {lastScannedTicket.ticketId}
                  </span>
                </div>

                {/* Passes and Visitor Count Display (User Request) */}
                <div className="p-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-2xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-700 font-bold uppercase block tracking-wider">
                        Admitted Visitors / Passes
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {(lastScannedTicket.quantity || 1)} {(lastScannedTicket.quantity || 1) > 1 ? 'Visitors' : 'Visitor'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
                    {(lastScannedTicket.quantity || 1)} {(lastScannedTicket.quantity || 1) > 1 ? 'Passes' : 'Pass'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Attendee Name</span>
                    <span className="font-bold text-slate-900 text-sm truncate block">
                      {lastScannedTicket.userName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Student Roll No</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {lastScannedTicket.rollNo || 'CS23B041'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">College / University</span>
                    <span className="text-slate-700 font-medium truncate block">
                      {lastScannedTicket.college || 'IIT Delhi'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Event</span>
                    <span className="text-slate-700 font-medium truncate block">
                      {lastScannedTicket.eventTitle}
                    </span>
                  </div>
                </div>

                {/* Organizer Helpline on Pass */}
                {lastScannedTicket.hostPhone && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-amber-600" />
                      Organizer Helpline:
                    </span>
                    <a 
                      href={`tel:${lastScannedTicket.hostPhone}`}
                      className="font-bold text-amber-700 hover:underline"
                    >
                      {lastScannedTicket.hostPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= MANUAL TOKEN / ID VERIFICATION ================= */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Verify by Ticket ID or Token:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. TKT-2026-90412 or paste QR string..."
                value={manualTokenInput}
                onChange={(e) => setManualTokenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') processToken(manualTokenInput);
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
              <button
                type="button"
                onClick={() => processToken(manualTokenInput)}
                disabled={isProcessing || !manualTokenInput.trim()}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs disabled:opacity-50 transition shadow-xs"
              >
                Verify
              </button>
            </div>
          </div>
        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            2s automatic gate turnaround loop
          </span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="py-1.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
