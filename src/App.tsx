import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';
import { useMachineStore } from '@/store/machineStore';
import { useBoothStore } from '@/store/boothStore';

import { BoothIdentityScreen } from '@/pages/machine/BoothIdentityScreen';
import { IdleScreen } from '@/pages/machine/IdleScreen';
import { SetupScreen } from '@/pages/machine/SetupScreen';
import { CaptureScreen } from '@/pages/machine/CaptureScreen';
import { PreviewScreen } from '@/pages/machine/PreviewScreen';
import { PaymentScreen } from '@/pages/machine/PaymentScreen';
import { PrintingScreen } from '@/pages/machine/PrintingScreen';
import { QRScreen } from '@/pages/machine/QRScreen';
import { ThankYouScreen } from '@/pages/machine/ThankYouScreen';
import { TouchInteractive } from '@/components/effects/TouchRippleEffect';

// Marketing Video Source
import attractVideoSrc from '@/assets/zididigitals_logo.mp4';

enum DisplayState {
  ATTRACT,   // attract video playing behind everything
  INTERACT   // attract video paused, UI active
}

const INACTIVITY_TIMEOUT = 30000; // 30 seconds

// Screens that should NEVER trigger sleep
const PASSIVE_SCREENS = [
  '/capture',
  '/preview',
  '/printing',
  '/qr',
  '/thankyou'
];

/**
 * ATTRACT VIDEO LAYER (Layer -1)
 * Always mounted, independent of UI layers.
 */
const AttractVideoLayer = forwardRef<any, { isPlaying: boolean }>(({ isPlaying }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync playback with isPlaying prop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      if (video.paused) {
        video.play().catch(err => console.warn('Attract video play interrupted:', err));
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [isPlaying]);

  const handleLoadedData = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
    console.error('Marketing video failed to load');
  };

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
      {!hasError && (
        <video
          ref={videoRef}
          src={attractVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleLoadedData}
          onError={handleError}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            transform: 'scale(0.9)', // Slight zoom out to improve quality perception
          }}
        />
      )}

      {/* Failsafe UI (Layer -1 Fallback) */}
      <AnimatePresence>
        {(hasError || !isLoaded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900"
          >
            <motion.div
              className="flex flex-col items-center gap-8"
              animate={{
                filter: [
                  'drop-shadow(0 4px 12px rgba(255, 140, 26, 0.4))',
                  'drop-shadow(0 6px 20px rgba(255, 140, 26, 0.6))',
                  'drop-shadow(0 4px 12px rgba(255, 140, 26, 0.4))',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-6">
                <Camera className="w-24 h-24 text-pixxel-orange" />
                <div className="h-24 w-1 bg-white/20 rounded-full" />
                <Sparkles className="w-24 h-24 text-pixxel-orange" />
              </div>
              <div className="text-center space-y-4">
                <h1 className="text-6xl font-black text-white tracking-tighter">
                  PIXXEL<span className="text-pixxel-orange">8</span>
                </h1>
                <p className="text-2xl text-white/50 font-medium tracking-[0.2em]">
                  ZIDI DIGITALS
                </p>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-24"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="px-12 py-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
                <p className="text-3xl font-black text-white/80 tracking-widest">
                  TAP TO START
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AttractVideoLayer.displayName = 'AttractVideoLayer';

function DisplayController({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DisplayState>(DisplayState.ATTRACT);
  const location = useLocation();
  const timeoutRef = useRef<any>(null);
  const prevPathRef = useRef<string>(location.pathname);

  const isPassiveScreen = PASSIVE_SCREENS.includes(location.pathname);

  const wakeUp = useCallback(() => {
    if (state === DisplayState.ATTRACT) {
      setState(DisplayState.INTERACT);
    }
    resetInactivityTimer();
  }, [state]);

  const goToSleep = useCallback(() => {
    if (!isPassiveScreen) {
      setState(DisplayState.ATTRACT);
    }
  }, [isPassiveScreen]);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isPassiveScreen) {
      timeoutRef.current = setTimeout(goToSleep, INACTIVITY_TIMEOUT);
    }
  }, [isPassiveScreen, goToSleep]);

  // Global interaction listener
  useEffect(() => {
    const handleInteraction = () => wakeUp();

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [wakeUp]);

  // Sync timers when screen changes
  useEffect(() => {
    // Session end behavior: immediate return to ATTRACT if coming from completion screens
    const isReturningToIdle = location.pathname === '/' && (prevPathRef.current === '/thankyou' || prevPathRef.current === '/qr');

    if (isReturningToIdle) {
      setState(DisplayState.ATTRACT);
    }

    prevPathRef.current = location.pathname;
    resetInactivityTimer();
  }, [location.pathname, resetInactivityTimer]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Layer -1: Attract Video Layer */}
      <AttractVideoLayer isPlaying={state === DisplayState.ATTRACT} />

      {/* Layer 0 & 1: Existing Pixxel8 UI & Backgrounds */}
      <AnimatePresence>
        {state === DisplayState.INTERACT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: state === DisplayState.INTERACT ? "easeOut" : "easeIn"
            }}
            className="relative z-10 w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global tap-to-wake overlay when in ATTRACT mode */}
      {state === DisplayState.ATTRACT && (
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onClick={wakeUp}
        />
      )}
    </div>
  );
}

export function App() {
  const { loadConfig } = useMachineStore();
  const { hasIdentity } = useBoothStore();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Show booth identity screen if not configured
  if (!hasIdentity()) {
    return <BoothIdentityScreen />;
  }

  return (
    <BrowserRouter>
      <DisplayController>
        <TouchInteractive>
          <Routes>
            <Route path="/" element={<IdleScreen />} />
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/capture" element={<CaptureScreen />} />
            <Route path="/preview" element={<PreviewScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/printing" element={<PrintingScreen />} />
            <Route path="/qr" element={<QRScreen />} />
            <Route path="/thankyou" element={<ThankYouScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TouchInteractive>
      </DisplayController>
    </BrowserRouter>
  );
}
