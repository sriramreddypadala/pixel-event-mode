import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Clock, ArrowRight, Smartphone } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { useMachineStore } from '@/store/machineStore';



export function QRScreen() {
  const navigate = useNavigate();
  const { session } = useMachineStore();
  const [timeLeft, setTimeLeft] = useState(60); // Increased time for better UX

  const qrData = JSON.stringify({
    sessionId: session?.sessionId,
    // photos: session?.photos.map(p => p.dataUrl), // Too large for QR code
    photoCount: session?.photos.length,
    timestamp: Date.now(),
    url: `https://pixxel8.app/download/${session?.sessionId}` // Mock URL for now
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/thankyou');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/thankyou');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        overlayOpacity={0.7}
        enableVignette={true}
      />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-black text-white mb-4">
            📲 Get Your Photos!
          </h1>
          <p className="text-2xl text-pixxel-orange-light font-light">
            Scan the QR code to download your digital copies instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 w-full max-w-4xl items-center">
          {/* QR Code Section */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="relative p-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Scan Me Border Animation */}
              <div className="absolute inset-0 border-4 border-pixxel-orange rounded-3xl animate-pulse" />

              <QRCodeSVG
                value={qrData}
                size={350}
                level="H"
                includeMargin={true}
                className="rounded-xl"
              />

              {/* Center Logo/Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                <Smartphone className="w-8 h-8 text-pixxel-orange" />
              </div>
            </div>

            <motion.p
              className="mt-6 text-xl text-white font-semibold flex items-center gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 text-pixxel-orange" />
              Scan with your phone camera
            </motion.p>
          </motion.div>

          {/* Info & Actions Section */}
          <div className="space-y-8">
            <GlassPanel className="p-8 rounded-3xl" blur="heavy" glow={true}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-pixxel-orange/20 flex items-center justify-center">
                  <Download className="w-8 h-8 text-pixxel-orange" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    What's Included?
                  </h2>
                  <p className="text-gray-300">High-quality digital downloads</p>
                </div>
              </div>

              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pixxel-orange rounded-full" />
                  All original photos
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pixxel-orange rounded-full" />
                  Final collage layout
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pixxel-orange rounded-full" />
                  Instant access & sharing
                </li>
              </ul>
            </GlassPanel>

            <div className="flex flex-col gap-4">
              <GlassButton
                variant="primary"
                size="xl"
                onClick={handleContinue}
                className="w-full font-bold text-xl justify-center"
              >
                I've Downloaded Them! <ArrowRight className="ml-2 w-6 h-6" />
              </GlassButton>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>Auto-skipping in {timeLeft}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
